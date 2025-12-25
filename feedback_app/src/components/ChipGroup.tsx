import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { rtlRow, rtlText } from "../utils/rtl";
import { useKioskStore } from "../store/kioskStore";

type ChipGroupProps = {
  chips: string[];
  selected: string[];
  onToggle: (chip: string) => void;
};

export const ChipGroup = ({ chips, selected, onToggle }: ChipGroupProps) => {
  const touch = useKioskStore((state) => state.touch);

  return (
    <View style={styles.container}>
      {chips.map((chip) => {
        const active = selected.includes(chip);
        return (
          <Pressable
            key={chip}
            onPress={() => {
              touch();
              onToggle(chip);
            }}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {chip}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    ...rtlRow
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(31, 122, 140, 0.25)",
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.text,
    ...rtlText
  },
  textActive: {
    color: "#fff"
  }
});
