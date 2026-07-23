import React, { useMemo, useState } from "react";
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
  const { mobile } = useLocalSearchParams<{ mobile: string }>();

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const passwordChecks = useMemo(() => {
    return {
      length: newPassword.length >= 8,
      lowercase: /[a-z]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    };
  }, [newPassword]);

  const allPasswordRulesMet = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === newPassword;

  const canSubmit =
    code.trim().length === 6 && allPasswordRulesMet && passwordsMatch;

  const handleReset = async () => {
    if (!canSubmit) {
      Alert.alert("Incomplete", "Please fill in all fields correctly.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          code: code.trim(),
          newPassword,
        }),
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
          <Ionicons name="lock-closed-outline" size={36} color={ORANGE} />
        </View>

        <Text style={styles.heading}>Create New Password</Text>
        <Text style={styles.subheading}>Set a new password for your account.</Text>

        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your verification code"
          placeholderTextColor="#9A9A9A"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your new password"
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
            placeholder="Confirm your new password"
            placeholderTextColor="#9A9A9A"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#9A9A9A"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rulesBox}>
          <Text style={styles.rulesTitle}>
            Password at least 8 characters and meet all conditions following:
          </Text>

          <RuleRow met={passwordChecks.length} text="At least 8 characters" />
          <RuleRow
            met={passwordChecks.lowercase}
            text="Lowercase (small) letters a-z. Examples: a, e, r"
          />
          <RuleRow
            met={passwordChecks.uppercase}
            text="Uppercase (capital) letters A-Z. Examples: A, E, R"
          />
          <RuleRow met={passwordChecks.number} text="Numbers 0-9. Examples: 2, 6, 7" />
          <RuleRow
            met={passwordChecks.special}
            text="Non-alphanumeric characters (special characters)"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.resetButton,
            (!canSubmit || submitting) && styles.resetButtonDisabled,
          ]}
          onPress={handleReset}
          disabled={!canSubmit || submitting}
        >
          <Text style={styles.resetButtonText}>
            {submitting ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RuleRow({ met, text }: { met: boolean; text: string }) {
  return (
    <View style={styles.ruleRow}>
      <Ionicons
        name={met ? "checkmark-circle" : "chevron-forward"}
        size={16}
        color={met ? "#3FA34D" : "#9A9A9A"}
        style={styles.ruleIcon}
      />
      <Text style={[styles.ruleText, met && styles.ruleTextMet]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#FBF1EA" },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginTop: 30,
    marginBottom: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FBE0D6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heading: {
    fontWeight: "700",
    fontSize: 22,
    color: "#2B2B2B",
    marginBottom: 6,
    textAlign: "center",
  },
  subheading: {
    color: "#5A5A5A",
    fontSize: 14,
    marginBottom: 26,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D8D0C8",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: "#2B2B2B",
    marginBottom: 18,
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
  rulesBox: {
    width: "100%",
    backgroundColor: "#F3E9DF",
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  rulesTitle: {
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  ruleIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  ruleText: {
    flex: 1,
    color: "#6A6A6A",
    fontSize: 13,
    lineHeight: 18,
  },
  ruleTextMet: {
    color: "#3FA34D",
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