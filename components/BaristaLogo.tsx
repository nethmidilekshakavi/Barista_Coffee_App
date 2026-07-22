import React from "react";
import { View, Text, StyleSheet } from "react-native";

type BaristaLogoProps = {
  /** "orange" for the dark-on-cream login screen, "white" for the loading splash screen */
  variant?: "orange" | "white";
  size?: "large" | "medium";
};

/**
 * Recreates the BARISTA / TAP.GRAB.GO wordmark with styled text so it can be
 * reused on both the loading screen (white) and the login screen (orange).
 *
 * If you already have the real logo as an image asset, you can swap this
 * component's contents for:
 *   <Image source={require("../assets/images/barista-logo.png")} style={{ width: 220, height: 110 }} resizeMode="contain" />
 */
export default function BaristaLogo({ variant = "orange", size = "large" }: BaristaLogoProps) {
  const brandColor = variant === "white" ? "#FFFFFF" : "#E8583A";
  const subColor = variant === "white" ? "#FFFFFF" : "#6B1A1A";
  const fontSize = size === "large" ? 48 : 34;
  const subFontSize = size === "large" ? 20 : 15;

  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: brandColor, fontSize }]}>BAR</Text>
        <View style={styles.iContainer}>
          <Text style={[styles.title, { color: brandColor, fontSize }]}>I</Text>
          <View style={[styles.iBar, { backgroundColor: subColor }]} />
        </View>
        <Text style={[styles.title, { color: brandColor, fontSize }]}>STA</Text>
        <Text style={[styles.registered, { color: brandColor }]}>®</Text>
      </View>
      <View style={[styles.underline, { backgroundColor: subColor }]} />
      <Text style={[styles.subtitle, { color: subColor, fontSize: subFontSize }]}>
        TAP.GRAB.GO
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    fontWeight: "900",
    letterSpacing: 1,
  },
  iContainer: {
    alignItems: "center",
  },
  iBar: {
    width: 14,
    height: 4,
    marginTop: -6,
    borderRadius: 2,
  },
  registered: {
    fontSize: 12,
    marginLeft: 2,
    marginBottom: 18,
  },
  underline: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
    marginBottom: 6,
  },
  subtitle: {
    fontWeight: "800",
    letterSpacing: 2,
  },
});