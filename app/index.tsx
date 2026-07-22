import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import BaristaLogo from "../components/BaristaLogo";

const LOAD_DURATION_MS = 2200;

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E8583A" />
      <View style={styles.center}>
        <BaristaLogo variant="white" size="large" />
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8583A",
    justifyContent: "space-between",
    paddingVertical: 80,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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