import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, StatusBar, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const LOAD_DURATION_MS = 2200;
const bgPattern = require("../assets/images/coffee-pattern-bg.png");
const logoImage = require("../assets/images/barista-logo-white.png");
const LOGO_ASPECT_RATIO = 808 / 483; // width / height of the source asset

export default function LoadingScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: LOAD_DURATION_MS,
      useNativeDriver: false, // width animation can't use the native driver
    }).start();

    const timer = setTimeout(() => {
      router.replace("/login");
    }, LOAD_DURATION_MS + 200);

    return () => clearTimeout(timer);
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <ImageBackground source={bgPattern} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="light-content" backgroundColor="#E8583A" />
      <View style={styles.center}>
        <Image source={logoImage} resizeMode="contain" style={styles.logo} />
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: barWidth }]} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8583A", // fallback color while the image loads
    justifyContent: "space-between",
    paddingVertical: 80,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 400,
    height: 400 / LOGO_ASPECT_RATIO,
    tintColor: "#FFFFFF",
  },
  progressTrack: {
    marginHorizontal: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
});