import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, fontFamily, fontSize } from "../theme";
import { rtlText } from "../utils/rtl";

type LoadingOverlayProps = {
  visible: boolean;
  text?: string;
};

export const LoadingOverlay = ({ visible, text }: LoadingOverlayProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.accent} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30, 27, 22, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },
  text: {
    marginTop: 16,
    color: "#fff",
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    ...rtlText
  }
});
