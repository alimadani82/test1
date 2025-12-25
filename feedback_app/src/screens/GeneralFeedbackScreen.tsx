import React, { useMemo, useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenBackground } from "../components/ScreenBackground";
import { ChipGroup } from "../components/ChipGroup";
import { KioskButton } from "../components/KioskButton";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { strings } from "../i18n";
import { useKioskStore } from "../store/kioskStore";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { buildDisplayItems } from "../utils/parseItemsSnapshot";
import { buildGeneralFeedback, buildItemComment } from "../utils/feedback";
import { env } from "../utils/env";
import { rtlRow, rtlText } from "../utils/rtl";
import type { RootStackParamList } from "../navigation/types";
import { submitFeedback } from "../api/client";

export const GeneralFeedbackScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const order = useKioskStore((state) => state.order);
  const orderItems = useKioskStore((state) => state.orderItems);
  const menuItems = useKioskStore((state) => state.menuItems);
  const overallRating = useKioskStore((state) => state.overallRating);
  const itemFeedback = useKioskStore((state) => state.itemFeedback);
  const generalFeedbackText = useKioskStore(
    (state) => state.generalFeedbackText
  );
  const generalFeedbackChips = useKioskStore(
    (state) => state.generalFeedbackChips
  );
  const allowContact = useKioskStore((state) => state.allowContact);
  const sessionId = useKioskStore((state) => state.sessionId);
  const setGeneralFeedbackText = useKioskStore(
    (state) => state.setGeneralFeedbackText
  );
  const toggleGeneralFeedbackChip = useKioskStore(
    (state) => state.toggleGeneralFeedbackChip
  );
  const setAllowContact = useKioskStore((state) => state.setAllowContact);
  const submitLoading = useKioskStore((state) => state.submitLoading);
  const submitError = useKioskStore((state) => state.submitError);
  const submitFailures = useKioskStore((state) => state.submitFailures);
  const setSubmitLoading = useKioskStore((state) => state.setSubmitLoading);
  const setSubmitError = useKioskStore((state) => state.setSubmitError);
  const incrementSubmitFailures = useKioskStore(
    (state) => state.incrementSubmitFailures
  );
  const clearSubmitFailures = useKioskStore(
    (state) => state.clearSubmitFailures
  );
  const resetAll = useKioskStore((state) => state.resetAll);
  const touch = useKioskStore((state) => state.touch);

  const items = useMemo(
    () =>
      buildDisplayItems({
        itemsSnapshot: order?.items_snapshot,
        orderItems,
        menuItems
      }),
    [order?.items_snapshot, orderItems, menuItems]
  );

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);
    if (!order || !overallRating || !sessionId) {
      setLocalError(strings.submitError);
      return;
    }

    const itemRatings = items
      .map((item) => {
        const feedback = itemFeedback[item.item_id];
        if (!feedback || feedback.rating < 1) {
          return null;
        }
        return {
          item_id: item.item_id,
          item_name: item.name,
          rating: feedback.rating,
          comment: buildItemComment(feedback.chips, feedback.commentText)
        };
      })
      .filter(
        (value): value is { item_id: string; item_name: string; rating: number; comment: string } =>
          Boolean(value)
      );

    if (itemRatings.length === 0) {
      setLocalError(strings.submitError);
      return;
    }

    const payload = {
      device_id: env.KIOSK_DEVICE_ID,
      order_id: order.order_id,
      table_id: order.table_id,
      customer_id: order.customer_id ?? null,
      overall_rating: overallRating,
      general_feedback: buildGeneralFeedback(
        generalFeedbackChips,
        generalFeedbackText
      ),
      allow_contact: allowContact,
      item_ratings: itemRatings,
      session_id: sessionId,
      client_ts: new Date().toISOString()
    };

    try {
      setSubmitLoading(true);
      setSubmitError(null);
      await submitFeedback(payload);
      clearSubmitFailures();
      resetAll();
      navigation.reset({ index: 0, routes: [{ name: "ThankYou" }] });
    } catch (error) {
      incrementSubmitFailures();
      setSubmitError(strings.submitError);
    } finally {
      setSubmitLoading(false);
    }
  };

  const errorMessage = localError ?? submitError;

  return (
    <ScreenBackground>
      <Text style={styles.title}>{strings.generalFeedbackTitle}</Text>
      <ChipGroup
        chips={strings.generalChips}
        selected={generalFeedbackChips}
        onToggle={toggleGeneralFeedbackChip}
      />
      <TextInput
        value={generalFeedbackText}
        onChangeText={(text) => {
          touch();
          setGeneralFeedbackText(text);
        }}
        onFocus={() => touch()}
        placeholder={strings.generalFeedbackPlaceholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        multiline
        maxLength={200}
        textAlign="right"
      />
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{strings.allowContact}</Text>
        <Switch
          value={allowContact}
          onValueChange={(value) => {
            touch();
            setAllowContact(value);
          }}
          thumbColor={allowContact ? colors.accent : "#f4f3f4"}
          trackColor={{ false: "#cfc6bd", true: "rgba(255, 138, 91, 0.35)" }}
        />
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {submitFailures >= 3 ? (
        <Text style={styles.escalate}>{strings.submitEscalate}</Text>
      ) : null}
      <View style={styles.footer}>
        <KioskButton
          title={strings.submit}
          onPress={handleSubmit}
          disabled={submitLoading}
        />
        {errorMessage ? (
          <KioskButton
            title={strings.submitRetry}
            onPress={handleSubmit}
            tone="ghost"
            style={styles.retry}
            disabled={submitLoading}
          />
        ) : null}
      </View>
      <LoadingOverlay visible={submitLoading} />
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    ...rtlText
  },
  input: {
    marginTop: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    padding: spacing.md,
    minHeight: 90,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.text,
    ...rtlText
  },
  toggleRow: {
    marginTop: spacing.lg,
    alignItems: "center",
    justifyContent: "space-between",
    ...rtlRow
  },
  toggleLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.text,
    ...rtlText
  },
  error: {
    marginTop: spacing.md,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.danger,
    ...rtlText
  },
  escalate: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.danger,
    ...rtlText
  },
  footer: {
    marginTop: spacing.xl
  },
  retry: {
    marginTop: spacing.sm
  }
});
