import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenBackground } from "../components/ScreenBackground";
import { KioskButton } from "../components/KioskButton";
import { strings } from "../i18n";
import { useKioskStore } from "../store/kioskStore";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { rtlText } from "../utils/rtl";
import type { RootStackParamList } from "../navigation/types";
import { uuidv4 } from "../utils/uuid";

export const StartGateScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const order = useKioskStore((state) => state.order);
  const assignedTableId = useKioskStore((state) => state.assignedTableId);
  const connectionOk = useKioskStore((state) => state.connectionOk);
  const lockSession = useKioskStore((state) => state.lockSession);
  const resetFeedback = useKioskStore((state) => state.resetFeedback);

  const tableId = order?.table_id ?? assignedTableId ?? "-";
  const canStart = Boolean(order?.order_id);

  return (
    <ScreenBackground align="center">
      <View style={styles.card}>
        <Text style={styles.tableLabel}>{strings.startGateTablePrefix}</Text>
        <Text style={styles.tableValue}>{tableId}</Text>
        {!connectionOk ? (
          <Text style={styles.connection}>{strings.connectionLost}</Text>
        ) : null}
        {!canStart ? (
          <Text style={styles.waiting}>{strings.startGateWaiting}</Text>
        ) : null}
      </View>
      <KioskButton
        title={strings.startGateButton}
        disabled={!canStart}
        onPress={() => {
          resetFeedback();
          lockSession(uuidv4());
          navigation.navigate("OverallRating");
        }}
        style={styles.button}
      />
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 24,
    marginBottom: spacing.xl
  },
  tableLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    ...rtlText
  },
  tableValue: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.huge,
    color: colors.primary,
    marginTop: spacing.sm,
    ...rtlText
  },
  connection: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.danger,
    ...rtlText
  },
  waiting: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    ...rtlText
  },
  button: {
    minWidth: 240
  }
});
