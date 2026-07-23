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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // TODO: wire this up to your auth logic
    console.log("Sign in with", emailOrMobile, password);
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
          <BaristaLogo variant="orange" size="medium" />
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

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
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
    backgroundColor: "#FBF1EA",
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: "center",
  },
  logoWrapper: {
    marginBottom: 12,
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