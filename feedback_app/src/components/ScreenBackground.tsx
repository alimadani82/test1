import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";

type ScreenBackgroundProps = {
  children: React.ReactNode;
  align?: "center" | "top";
};

export const ScreenBackground = ({
  children,
  align = "top"
}: ScreenBackgroundProps) => {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.bgStart, colors.bgEnd]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />
      <SafeAreaView
        style={[styles.content, align === "center" && styles.centered]}
      >
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgStart
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 0
  },
  blob: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255, 138, 91, 0.12)"
  },
  blobTop: {
    top: -80,
    left: -40
  },
  blobBottom: {
    bottom: -120,
    right: -60,
    backgroundColor: "rgba(31, 122, 140, 0.12)"
  }
});
