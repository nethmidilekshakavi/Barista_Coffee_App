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
const API_URL = "http://192.168.1.3:5000/api/forgot-password/reset-password";

const ORANGE = "#E8583A";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { mobile, code } = useLocalSearchParams<{ mobile: string; code: string }>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, code, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Could not reset password");
        return;
      }

      Alert.alert("Success", "Password updated successfully. Please log in.");
      router.replace("/login");
    } catch (err) {
      console.error("Reset password request failed:", err);
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
          <Ionicons name="key-outline" size={36} color={ORANGE} />
        </View>

        <Text style={styles.heading}>Set New Password</Text>

        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter new password"
            placeholderTextColor="#9A9A9A"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#9A9A9A"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Re-enter new password"
            placeholderTextColor="#9A9A9A"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.resetButton, submitting && styles.resetButtonDisabled]}
          onPress={handleReset}
          disabled={submitting}
        >
          <Text style={styles.resetButtonText}>
            {submitting ? "Updating..." : "Update Password"}
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
    marginBottom: 28,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 8,
  },
  passwordRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8D0C8",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 18,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2B2B2B",
  },
  spacer: {
    flex: 1,
    minHeight: 100,
  },
  resetButton: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  resetButtonDisabled: {
    backgroundColor: "#B8B0A8",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});