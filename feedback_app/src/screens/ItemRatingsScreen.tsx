import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenBackground } from "../components/ScreenBackground";
import { ItemCard } from "../components/ItemCard";
import { KioskButton } from "../components/KioskButton";
import { strings } from "../i18n";
import { useKioskStore } from "../store/kioskStore";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { buildDisplayItems } from "../utils/parseItemsSnapshot";
import { rtlText } from "../utils/rtl";
import type { RootStackParamList } from "../navigation/types";

export const ItemRatingsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const order = useKioskStore((state) => state.order);
  const orderItems = useKioskStore((state) => state.orderItems);
  const menuItems = useKioskStore((state) => state.menuItems);
  const itemFeedback = useKioskStore((state) => state.itemFeedback);
  const setItemRating = useKioskStore((state) => state.setItemRating);
  const setItemCommentText = useKioskStore((state) => state.setItemCommentText);
  const toggleItemChip = useKioskStore((state) => state.toggleItemChip);

  const items = useMemo(
    () =>
      buildDisplayItems({
        itemsSnapshot: order?.items_snapshot,
        orderItems,
        menuItems
      }),
    [order?.items_snapshot, orderItems, menuItems]
  );

  const ratedCount = useMemo(
    () =>
      Object.values(itemFeedback).filter((item) => item.rating >= 1).length,
    [itemFeedback]
  );

  const canContinue = ratedCount > 0;

  return (
    <ScreenBackground>
      <Text style={styles.title}>{strings.itemRatingsTitle}</Text>
      <Text style={styles.hint}>{strings.itemRatingsHint}</Text>
      <View style={styles.body}>
        {items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>{strings.noItems}</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.item_id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const feedback = itemFeedback[item.item_id] ?? {
                rating: 0,
                commentText: "",
                chips: []
              };
              return (
                <ItemCard
                  item={item}
                  rating={feedback.rating}
                  commentText={feedback.commentText}
                  chips={feedback.chips}
                  onRate={(value) => setItemRating(item.item_id, value)}
                  onCommentChange={(text) =>
                    setItemCommentText(item.item_id, text)
                  }
                  onToggleChip={(chip) => toggleItemChip(item.item_id, chip)}
                />
              );
            }}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        )}
        <View style={styles.footer}>
          <KioskButton
            title={strings.continue}
            disabled={!canContinue}
            onPress={() => navigation.navigate("GeneralFeedback")}
          />
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
    marginTop: spacing.lg,
    ...rtlText
  },
  hint: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    ...rtlText
  },
  body: {
    flex: 1
  },
  list: {
    flex: 1
  },
  listContent: {
    paddingVertical: spacing.lg
  },
  footer: {
    paddingBottom: spacing.lg
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center"
  },
  empty: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.textMuted,
    ...rtlText
  }
});
