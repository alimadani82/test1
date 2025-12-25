import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenBackground } from "../components/ScreenBackground";
import { strings } from "../i18n";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { rtlText } from "../utils/rtl";
import { msToSeconds } from "../utils/timers";
import type { RootStackParamList } from "../navigation/types";

export const ThankYouScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [remaining, setRemaining] = useState(5);

  useEffect(() => {
    let current = 5000;
    const interval = setInterval(() => {
      current -= 1000;
      setRemaining(msToSeconds(current));
      if (current <= 0) {
        clearInterval(interval);
        navigation.reset({ index: 0, routes: [{ name: "Idle" }] });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <ScreenBackground align="center">
      <View style={styles.card}>
        <Text style={styles.title}>{strings.thankYouTitle}</Text>
        <Text style={styles.countdown}>
          {strings.thankYouCountdown} {remaining}
        </Text>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: spacing.xl,
    borderRadius: 24,
    alignItems: "center"
  },
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
    textAlign: "center",
    ...rtlText
  },
  countdown: {
    marginTop: spacing.md,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.textMuted,
    ...rtlText
  }
});
