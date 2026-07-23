import React, { useState } from "react";
import {
  View,
  Text,
  Image,
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

const logoImage = require("../assets/images/logo/orange.png");
const LOGO_ASPECT_RATIO = 808 / 483; // width / height of the source asset

// 👉 replace with your PC's local IP (not localhost) when testing on phone/emulator
const API_URL = "http://192.168.1.3:5000/api/login";

export default function LoginScreen() {
  const router = useRouter();
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!emailOrMobile.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please enter your email/mobile and password.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrMobile: emailOrMobile.trim(),
          password,
        }),
      });

      // Read the body once as text, then try to parse it as JSON.
      const text = await response.text();
      console.log("Status:", response.status);
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("Server did not return JSON:", text.slice(0, 200));
        Alert.alert(
          "Server error",
          "Unexpected response from server. Check the server logs."
        );
        return;
      }

      if (!response.ok) {
        Alert.alert("Login failed", data.message || "Invalid credentials");
        return;
      }

      // login success -> go to dashboard
      // TODO: if you want to keep the user logged in, save data.user
      // (e.g. with AsyncStorage or a context/store) before navigating.
      router.replace("/dashboard");
    } catch (err) {
      console.error("Login request failed:", err);
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
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrapper}>
          <Image source={logoImage} resizeMode="contain" style={styles.logo} />
        </View>

        <Text style={styles.heading}>LOGIN{"\n"}TO START ORDERING</Text>

        <Text style={styles.label}>Email or Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or mobile number"
          placeholderTextColor="#9A9A9A"
          value={emailOrMobile}
          onChangeText={setEmailOrMobile}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor="#9A9A9A"
            value={password}
            onChangeText={setPassword}
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

        <TouchableOpacity style={styles.forgotWrapper}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signInButton, submitting && styles.signInButtonDisabled]}
          onPress={handleSignIn}
          disabled={submitting}
        >
          <Text style={styles.signInText}>
            {submitting ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleG}>G</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>

        <View style={styles.signUpRow}>
          <Text style={styles.signUpPrompt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ORANGE = "#E8583A";
const DARK_MAROON = "#6B1A1A";

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#FBF1EA" },
  container: {
    flexGrow: 1,

    paddingHorizontal: 28,
    paddingBottom: 32,
    alignItems: "center",
  },
  logoWrapper: {
    marginBottom: 10,
  },
  logo: {
    width: 400,
    height: 400 / LOGO_ASPECT_RATIO,
    marginBottom: -70,
  },
  heading: {
    textAlign: "center",
    color: ORANGE,
    fontWeight: "800",
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 28,
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
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2B2B2B",
  },
  forgotWrapper: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: ORANGE,
    fontWeight: "600",
  },
  signInButton: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 26,
  },
  signInButtonDisabled: {
    backgroundColor: "#B8B0A8",
  },
  signInText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D8D0C8",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#8A8A8A",
    fontSize: 13,
  },
  googleButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#D8D0C8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  googleG: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2B2B2B",
  },
  guestText: {
    color: ORANGE,
    fontWeight: "700",
    marginBottom: 24,
  },
  signUpRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  signUpPrompt: {
    color: "#5A5A5A",
  },
  signUpLink: {
    color: ORANGE,
    fontWeight: "700",
  },
});