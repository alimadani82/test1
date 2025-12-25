import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { useKioskStore } from "../store/kioskStore";

const emojis = ["??", "??", "??", "??", "??"];

type EmojiRatingRowProps = {
  value: number | null;
  onChange: (value: number) => void;
};

export const EmojiRatingRow = ({ value, onChange }: EmojiRatingRowProps) => {
  const touch = useKioskStore((state) => state.touch);

  return (
    <View style={styles.row}>
      {emojis.map((emoji, index) => {
        const rating = index + 1;
        const selected = value === rating;
        return (
          <Pressable
            key={emoji}
            onPress={() => {
              touch();
              onChange(rating);
            }}
            style={[styles.item, selected && styles.selected]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {rating}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.75)"
  },
  selected: {
    backgroundColor: colors.accent,
    transform: [{ scale: 1.02 }]
  },
  emoji: {
    fontSize: 32
  },
  label: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.text
  },
  labelSelected: {
    color: "#fff"
  }
});
