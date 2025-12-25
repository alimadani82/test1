import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useEffect } from "react";
import { I18nManager, StatusBar, View } from "react-native";
import {
  NavigationContainer,
  NavigationContainerRef,
  useNavigationContainerRef
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "@expo-google-fonts/vazirmatn";
import {
  Vazirmatn_400Regular,
  Vazirmatn_600SemiBold,
  Vazirmatn_700Bold,
  Vazirmatn_800ExtraBold
} from "@expo-google-fonts/vazirmatn";
import { useKeepAwake } from "expo-keep-awake";
import * as ScreenOrientation from "expo-screen-orientation";
import { IdleScreen } from "./src/screens/IdleScreen";
import { StartGateScreen } from "./src/screens/StartGateScreen";
import { OverallRatingScreen } from "./src/screens/OverallRatingScreen";
import { ItemRatingsScreen } from "./src/screens/ItemRatingsScreen";
import { GeneralFeedbackScreen } from "./src/screens/GeneralFeedbackScreen";
import { ThankYouScreen } from "./src/screens/ThankYouScreen";
import { env } from "./src/utils/env";
import { useKioskStore } from "./src/store/kioskStore";
import { getKioskState, kioskReset } from "./src/api/client";
import { strings } from "./src/i18n";
import type { RootStackParamList } from "./src/navigation/types";

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const useKioskPolling = (
  navigationRef: NavigationContainerRef<RootStackParamList>
) => {
  const pollingEnabled = useKioskStore((state) => state.pollingEnabled);
  const sessionLocked = useKioskStore((state) => state.sessionLocked);
  const setKioskState = useKioskStore((state) => state.setKioskState);
  const setConnectionOk = useKioskStore((state) => state.setConnectionOk);
  const resetAll = useKioskStore((state) => state.resetAll);
  const showSnackbar = useKioskStore((state) => state.showSnackbar);

  useEffect(() => {
    if (!pollingEnabled || sessionLocked) {
      return;
    }

    let isMounted = true;
    let inFlight = false;

    const poll = async () => {
      if (inFlight) {
        return;
      }
      inFlight = true;
      try {
        const response = await getKioskState(env.KIOSK_DEVICE_ID);
        if (!isMounted) {
          return;
        }
        setConnectionOk(true);
        if (response.already_completed || response.order?.has_feedback) {
          resetAll();
          showSnackbar(strings.alreadySubmitted);
          try {
            await kioskReset(env.KIOSK_DEVICE_ID);
          } catch {
            // Best-effort reset.
          }
          if (navigationRef.isReady()) {
            navigationRef.reset({ index: 0, routes: [{ name: "Idle" }] });
          }
          return;
        }
        setKioskState(response);
      } catch {
        if (!isMounted) {
          return;
        }
        setConnectionOk(false);
      } finally {
        inFlight = false;
      }
    };

    poll();
    const interval = setInterval(poll, env.POLL_INTERVAL_MS);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [
    pollingEnabled,
    sessionLocked,
    setKioskState,
    setConnectionOk,
    resetAll,
    showSnackbar,
    navigationRef
  ]);
};

const useSessionTimers = (
  navigationRef: NavigationContainerRef<RootStackParamList>
) => {
  const sessionLocked = useKioskStore((state) => state.sessionLocked);
  const sessionStartedAt = useKioskStore((state) => state.sessionStartedAt);
  const lastInteractionAt = useKioskStore((state) => state.lastInteractionAt);
  const resetAll = useKioskStore((state) => state.resetAll);
  const resetFeedback = useKioskStore((state) => state.resetFeedback);
  const touch = useKioskStore((state) => state.touch);

  useEffect(() => {
    if (!sessionLocked || !sessionStartedAt) {
      return;
    }

    const interval = setInterval(async () => {
      if (!navigationRef.isReady()) {
        return;
      }
      const now = Date.now();
      const hardElapsed = now - sessionStartedAt;
      if (hardElapsed >= env.HARD_TIMEOUT_MS) {
        try {
          await kioskReset(env.KIOSK_DEVICE_ID);
        } catch {
          // Best-effort reset.
        }
        resetAll();
        navigationRef.reset({ index: 0, routes: [{ name: "Idle" }] });
        return;
      }

      const idleElapsed = lastInteractionAt ? now - lastInteractionAt : 0;
      if (idleElapsed >= env.INACTIVITY_TIMEOUT_MS) {
        resetFeedback();
        touch();
        const current = navigationRef.getCurrentRoute()?.name;
        if (current && current !== "StartGate") {
          navigationRef.navigate("StartGate");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    sessionLocked,
    sessionStartedAt,
    lastInteractionAt,
    resetAll,
    resetFeedback,
    navigationRef,
    touch
  ]);
};

export default function App() {
  useKeepAwake();

  const [fontsLoaded] = useFonts({
    Vazirmatn_400Regular,
    Vazirmatn_600SemiBold,
    Vazirmatn_700Bold,
    Vazirmatn_800ExtraBold
  });

  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const touch = useKioskStore((state) => state.touch);
  const sessionLocked = useKioskStore((state) => state.sessionLocked);

  useKioskPolling(navigationRef);
  useSessionTimers(navigationRef);

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    ).catch(() => undefined);
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#F7F1E8" }} />;
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      onTouchStart={() => {
        if (sessionLocked) {
          touch();
        }
      }}
    >
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: "transparent" }
            }}
          >
            <Stack.Screen name="Idle" component={IdleScreen} />
            <Stack.Screen name="StartGate" component={StartGateScreen} />
            <Stack.Screen name="OverallRating" component={OverallRatingScreen} />
            <Stack.Screen name="ItemRatings" component={ItemRatingsScreen} />
            <Stack.Screen
              name="GeneralFeedback"
              component={GeneralFeedbackScreen}
            />
            <Stack.Screen name="ThankYou" component={ThankYouScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
