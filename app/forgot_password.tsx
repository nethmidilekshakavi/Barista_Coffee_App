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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.1.3:5000/api/forgot-password/send-code";

const ORANGE = "#E8583A";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSendCode = async () => {
    if (mobile.trim().length < 9) {
      Alert.alert("Invalid number", "Please enter a valid mobile number.");
      return;
    }

    const fullMobile = `+94${mobile.trim()}`;

    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: fullMobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Could not send code");
        return;
      }

      // navigate to OTP verification screen, passing the mobile number
      router.push({
        pathname: "/reset_password",
        params: { mobile: fullMobile },
      });
    } catch (err) {
      console.error("Send code request failed:", err);
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

        <Text style={styles.heading}>Reset Your Password</Text>

        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.mobileRow}>
          <View style={styles.mobilePrefix}>
            <Text style={styles.mobilePrefixText}>+94</Text>
          </View>
          <View style={styles.mobileDivider} />
          <TextInput
            style={styles.mobileInput}
            placeholder="7XXXXXXXX"
            placeholderTextColor="#9A9A9A"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={9}
          />
        </View>

        <Text style={styles.helperText}>
          We'll send you a verification code to reset your password.
        </Text>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.sendButton, submitting && styles.sendButtonDisabled]}
          onPress={handleSendCode}
          disabled={submitting}
        >
          <Text style={styles.sendButtonText}>
            {submitting ? "Sending..." : "Send Code"}
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
    marginBottom: 32,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 8,
  },
  mobileRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8D0C8",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 20,
  },
  mobilePrefix: {
    paddingVertical: 10,
  },
  mobilePrefixText: {
    fontSize: 15,
    color: "#2B2B2B",
    fontWeight: "600",
  },
  mobileDivider: {
    width: 1,
    height: 22,
    backgroundColor: "#D8D0C8",
    marginHorizontal: 12,
  },
  mobileInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2B2B2B",
  },
  helperText: {
    textAlign: "center",
    color: "#8A8A8A",
    fontSize: 13,
    lineHeight: 18,
  },
  spacer: {
    flex: 1,
    minHeight: 200,
  },
  sendButton: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#B8B0A8",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});