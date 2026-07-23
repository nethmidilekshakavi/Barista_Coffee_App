import React, { useMemo, useState } from "react";
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
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const logoImage = require("../assets/images/logo/orange.png");
const LOGO_ASPECT_RATIO = 808 / 483; // width / height of the source asset

const TITLE_OPTIONS = ["Mr", "Mrs", "Ms", "Miss", "Dr"];

// 👉 replace with your PC's local IP (not localhost) when testing on phone/emulator
const API_URL = "http://192.168.1.3:5000/api/signup";

export default function SignUpScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [titleModalVisible, setTitleModalVisible] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agreed, setAgreed] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const allPasswordRulesMet = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;

  const isPasswordMissing = touchedPassword && password.length === 0;
  const isConfirmMismatch =
    touchedConfirm && confirmPassword.length > 0 && !passwordsMatch;

  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    mobile.trim().length > 0 &&
    allPasswordRulesMet &&
    passwordsMatch &&
    agreed;

  const [submitting, setSubmitting] = useState(false);

  const handleCreateAccount = async () => {
    if (!canSubmit) {
      setTouchedPassword(true);
      setTouchedConfirm(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          firstName,
          lastName,
          email,
          mobile: `+94${mobile}`,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // e.g. email/mobile already registered
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Account created successfully!");
      router.push("/login");
    } catch (err) {
      console.error("Signup request failed:", err);
      alert("Could not connect to server. Please try again.");
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#2B2B2B" />
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <Image source={logoImage} resizeMode="contain" style={styles.logo} />
        </View>

        <Text style={styles.heading}>Sign Up to Get Started</Text>
        <Text style={styles.subheading}>
          Enjoy fresh brews, fast pick-ups, and more.
        </Text>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TouchableOpacity
          style={styles.selectInput}
          onPress={() => setTitleModalVisible(true)}
        >
          <Text style={title ? styles.selectValue : styles.selectPlaceholder}>
            {title || "Select your title"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#9A9A9A" />
        </TouchableOpacity>

        {/* First Name */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#9A9A9A"
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* Last Name */}
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          placeholderTextColor="#9A9A9A"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#9A9A9A"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Mobile Number */}
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.mobileRow}>
          <View style={styles.mobilePrefix}>
            <Text style={styles.mobilePrefixText}>+94</Text>
          </View>
          <View style={styles.mobileDivider} />
          <TextInput
            style={styles.mobileInput}
            placeholder="Enter your mobile number"
            placeholderTextColor="#9A9A9A"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={9}
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.passwordRow,
            isPasswordMissing && styles.inputError,
          ]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor="#9A9A9A"
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouchedPassword(true)}
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
        {isPasswordMissing && (
          <Text style={styles.errorText}>Password is required.</Text>
        )}

        {/* Confirm Password */}
        <Text style={[styles.label, styles.confirmLabel]}>
          Confirm Password
        </Text>
        <View
          style={[
            styles.passwordRow,
            isConfirmMismatch && styles.inputError,
          ]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password again"
            placeholderTextColor="#9A9A9A"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => setTouchedConfirm(true)}
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
        {isConfirmMismatch && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}

        {/* Password rules */}
        <View style={styles.rulesBox}>
          <Text style={styles.rulesTitle}>
            Password at least 8 characters and meet all conditions
            following:
          </Text>

          <RuleRow
            met={passwordChecks.length}
            text="At least 8 characters"
          />
          <RuleRow
            met={passwordChecks.lowercase}
            text="Lowercase (small) letters a-z. Examples: a, e, r"
          />
          <RuleRow
            met={passwordChecks.uppercase}
            text="Uppercase (capital) letters A-Z. Examples: A, E, R"
          />
          <RuleRow
            met={passwordChecks.number}
            text="Numbers 0-9. Examples: 2, 6, 7"
          />
          <RuleRow
            met={passwordChecks.special}
            text="Non-alphanumeric characters (special characters)"
          />
        </View>

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreed((v) => !v)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.termsText}>I agree to the Terms and Conditions</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.createButton,
            (!canSubmit || submitting) && styles.createButtonDisabled,
          ]}
          onPress={handleCreateAccount}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <Text style={styles.createButtonText}>
            {submitting ? "Creating Account..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <View style={styles.signInRow}>
          <Text style={styles.signInPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Title picker modal */}
      <Modal
        visible={titleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTitleModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTitleModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeading}>Select your title</Text>
            <FlatList
              data={TITLE_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setTitle(item);
                    setTitleModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                  {title === item && (
                    <Ionicons name="checkmark" size={18} color={ORANGE} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function RuleRow({ met, text }) {
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

const ORANGE = "#E8583A";
const DARK_MAROON = "#6B1A1A";

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
  },
  logoWrapper: {
    marginBottom: -40,
  },
  logo: {
    width: 250,
    height: 250 / LOGO_ASPECT_RATIO,
  },
  heading: {
    textAlign: "center",
    color: ORANGE,
    fontWeight: "700",
    fontSize: 20,
    marginTop: 6,
    marginBottom: 4,
  },
  subheading: {
    textAlign: "center",
    color: "#5A5A5A",
    fontSize: 14,
    marginBottom: 22,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 8,
    marginTop: 4,
  },
  confirmLabel: {
    marginTop: 8,
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
  selectInput: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D8D0C8",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 18,
  },
  selectPlaceholder: {
    fontSize: 15,
    color: "#9A9A9A",
  },
  selectValue: {
    fontSize: 15,
    color: "#2B2B2B",
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
    marginBottom: 18,
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
  inputError: {
    borderColor: "#E23F3F",
  },
  errorText: {
    alignSelf: "flex-start",
    color: "#E23F3F",
    fontSize: 13,
    marginBottom: 10,
  },
  rulesBox: {
    width: "100%",
    backgroundColor: "#F3E9DF",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
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
  termsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#B8B0A8",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  termsText: {
    color: "#2B2B2B",
    fontSize: 14,
  },
  createButton: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 22,
  },
  createButtonDisabled: {
    backgroundColor: "#B8B0A8",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  signInPrompt: {
    color: "#5A5A5A",
  },
  signInLink: {
    color: ORANGE,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: "50%",
  },
  modalHeading: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2B2B2B",
    marginBottom: 10,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EAE3",
  },
  modalOptionText: {
    fontSize: 15,
    color: "#2B2B2B",
  },
});