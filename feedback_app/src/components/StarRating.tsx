import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../theme";
import { useKioskStore } from "../store/kioskStore";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  size?: number;
};

export const StarRating = ({ value, onChange, size = 34 }: StarRatingProps) => {
  const touch = useKioskStore((state) => state.touch);

  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, index) => {
        const rating = index + 1;
        const active = rating <= value;
        return (
          <Pressable
            key={rating}
            onPress={() => {
              touch();
              onChange(rating);
            }}
            style={styles.starButton}
          >
            <Ionicons
              name={active ? "star" : "star-outline"}
              size={size}
              color={active ? colors.accent : "rgba(30, 27, 22, 0.35)"}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  starButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs
  }
});
