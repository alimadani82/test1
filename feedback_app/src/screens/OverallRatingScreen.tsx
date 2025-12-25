import React from "react";
import { StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenBackground } from "../components/ScreenBackground";
import { EmojiRatingRow } from "../components/EmojiRatingRow";
import { strings } from "../i18n";
import { useKioskStore } from "../store/kioskStore";
import { colors, fontFamily, fontSize, spacing } from "../theme";
import { rtlText } from "../utils/rtl";
import type { RootStackParamList } from "../navigation/types";

export const OverallRatingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const overallRating = useKioskStore((state) => state.overallRating);
  const setOverallRating = useKioskStore((state) => state.setOverallRating);

  return (
    <ScreenBackground>
      <Text style={styles.title}>{strings.overallTitle}</Text>
      <EmojiRatingRow
        value={overallRating}
        onChange={(value) => {
          setOverallRating(value);
          navigation.navigate("ItemRatings");
        }}
      />
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
    marginTop: spacing.xl,
    ...rtlText
  }
});
