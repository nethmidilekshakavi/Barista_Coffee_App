import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 👉 replace with your PC's local IP (not localhost) when testing on phone/emulator
const API_URL = "http://192.168.1.3:5000/api/forgot-password/verify-code";

const ORANGE = "#E8583A";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { mobile } = useLocalSearchParams<{ mobile: string }>();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = async () => {
    if (code.trim().length !== 6) {
      Alert.alert("Invalid code", "Please enter the 6-digit code.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, code: code.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Verification failed", data.message || "Invalid code");
        return;
      }

      router.push({
        pathname: "/reset_password",
        params: { mobile, code: code.trim() },
      });
    } catch (err) {
      console.error("Verify code request failed:", err);
      Alert.alert("Connection error", "Could not connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2B2B2B" />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Ionicons name="chatbox-ellipses-outline" size={36} color={ORANGE} />
        </View>

        <Text style={styles.heading}>Enter Verification Code</Text>
        <Text style={styles.subheading}>Code sent to {mobile}</Text>

        <TextInput
          style={styles.otpInput}
          placeholder="XXXXXX"
          placeholderTextColor="#9A9A9A"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.verifyButton, submitting && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={submitting}
        >
          <Text style={styles.verifyButtonText}>
            {submitting ? "Verifying..." : "Verify Code"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#FBF1EA" },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 32,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginTop: 30,
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FBE0D6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  heading: {
    fontWeight: "700",
    fontSize: 22,
    color: "#2B2B2B",
    marginBottom: 8,
    textAlign: "center",
  },
  subheading: {
    color: "#8A8A8A",
    fontSize: 13,
    marginBottom: 32,
    textAlign: "center",
  },
  otpInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D8D0C8",
    borderRadius: 30,
    paddingVertical: 16,
    fontSize: 22,
    letterSpacing: 8,
    color: "#2B2B2B",
  },
  spacer: {
    flex: 1,
    minHeight: 200,
  },
  verifyButton: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  verifyButtonDisabled: {
    backgroundColor: "#B8B0A8",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});