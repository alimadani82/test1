import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenBackground } from "../components/ScreenBackground";
import { Snackbar } from "../components/Snackbar";
import { strings } from "../i18n";
import { useKioskStore } from "../store/kioskStore";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { rtlText } from "../utils/rtl";
import type { RootStackParamList } from "../navigation/types";

export const IdleScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const deviceStatus = useKioskStore((state) => state.deviceStatus);
  const activeOrderId = useKioskStore((state) => state.activeOrderId);
  const sessionLocked = useKioskStore((state) => state.sessionLocked);
  const connectionOk = useKioskStore((state) => state.connectionOk);
  const snackbarMessage = useKioskStore((state) => state.snackbarMessage);
  const clearSnackbar = useKioskStore((state) => state.clearSnackbar);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.05, { duration: 1200 }), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.95
  }));

  useEffect(() => {
    if (sessionLocked) {
      return;
    }
    if (deviceStatus === "active" && activeOrderId) {
      navigation.navigate("StartGate");
    }
  }, [deviceStatus, activeOrderId, navigation, sessionLocked]);

  return (
    <ScreenBackground align="center">
      <Animated.View style={[styles.hero, pulseStyle]}>
        <Text style={styles.title}>{strings.idleTitle}</Text>
        <Text style={styles.subtitle}>{strings.idleSubtitle}</Text>
      </Animated.View>
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>{strings.idleWaiting}</Text>
        {!connectionOk ? (
          <Text style={styles.connection}>{strings.connectionLost}</Text>
        ) : null}
      </View>
      <Snackbar message={snackbarMessage} onDismiss={clearSnackbar} />
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  hero: {
    alignItems: "center"
  },
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xxl,
    color: colors.text,
    textAlign: "center",
    ...rtlText
  },
  subtitle: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    ...rtlText
  },
  statusRow: {
    marginTop: spacing.xl,
    alignItems: "center"
  },
  statusText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.textMuted,
    ...rtlText
  },
  connection: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.danger,
    ...rtlText
  }
});
