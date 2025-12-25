import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { DisplayItem } from "../utils/parseItemsSnapshot";
import { rtlRow, rtlText } from "../utils/rtl";
import { StarRating } from "./StarRating";
import { ChipGroup } from "./ChipGroup";
import { strings } from "../i18n";
import { useKioskStore } from "../store/kioskStore";

type ItemCardProps = {
  item: DisplayItem;
  rating: number;
  commentText: string;
  chips: string[];
  onRate: (rating: number) => void;
  onCommentChange: (text: string) => void;
  onToggleChip: (chip: string) => void;
};

export const ItemCard = ({
  item,
  rating,
  commentText,
  chips,
  onRate,
  onCommentChange,
  onToggleChip
}: ItemCardProps) => {
  const touch = useKioskStore((state) => state.touch);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (commentText || chips.length > 0) {
      setExpanded(true);
    }
  }, [commentText, chips.length]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : null}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.qtyPill}>
            <Text style={styles.qtyText}>x{item.quantity}</Text>
          </View>
        </View>
      </View>
      <StarRating value={rating} onChange={onRate} size={32} />

      <Pressable
        onPress={() => {
          touch();
          setExpanded((prev) => !prev);
        }}
        style={styles.commentToggle}
      >
        <Text style={styles.commentToggleText}>{strings.itemCommentToggle}</Text>
      </Pressable>

      {expanded ? (
        <View style={styles.commentBox}>
          <ChipGroup
            chips={strings.itemChips}
            selected={chips}
            onToggle={onToggleChip}
          />
          <TextInput
            value={commentText}
            onChangeText={(text) => {
              touch();
              onCommentChange(text);
            }}
            onFocus={() => touch()}
            placeholder={strings.itemCommentPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            multiline
            maxLength={120}
            textAlign="right"
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  headerRow: {
    ...rtlRow,
    alignItems: "center",
    marginBottom: spacing.sm
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginLeft: spacing.md
  },
  titleBlock: {
    flex: 1,
    alignItems: "flex-end"
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.text,
    ...rtlText
  },
  qtyPill: {
    marginTop: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: "flex-end"
  },
  qtyText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: "#fff"
  },
  commentToggle: {
    alignSelf: "flex-end",
    marginTop: spacing.sm
  },
  commentToggleText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
    ...rtlText
  },
  commentBox: {
    marginTop: spacing.sm
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: spacing.sm,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.text,
    minHeight: 50,
    marginTop: spacing.sm,
    ...rtlText
  }
});
