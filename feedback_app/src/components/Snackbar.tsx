import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { rtlText } from "../utils/rtl";

type SnackbarProps = {
  message: string | null;
  onDismiss: () => void;
};

export const Snackbar = ({ message, onDismiss }: SnackbarProps) => {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    setVisible(Boolean(message));
    if (!message) {
      return;
    }
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message || !visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={onDismiss} style={styles.snack}>
        <Text style={styles.text}>{message}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    alignItems: "center"
  },
  snack: {
    backgroundColor: colors.text,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  text: {
    color: "#fff",
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    ...rtlText
  }
});
