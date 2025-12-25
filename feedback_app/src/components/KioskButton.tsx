import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { rtlText } from "../utils/rtl";
import { useKioskStore } from "../store/kioskStore";

type KioskButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  tone?: "primary" | "ghost";
};

export const KioskButton = ({
  title,
  onPress,
  disabled,
  style,
  tone = "primary"
}: KioskButtonProps) => {
  const touch = useKioskStore((state) => state.touch);

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        touch();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        tone === "ghost" && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style
      ]}
    >
      <Text
        style={[
          styles.text,
          tone === "ghost" && styles.ghostText,
          disabled && styles.disabledText
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary
  },
  text: {
    color: "#fff",
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    ...rtlText
  },
  ghostText: {
    color: colors.primary
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  },
  disabled: {
    backgroundColor: "rgba(31, 122, 140, 0.4)",
    shadowOpacity: 0
  },
  disabledText: {
    color: "rgba(255, 255, 255, 0.8)"
  }
});
