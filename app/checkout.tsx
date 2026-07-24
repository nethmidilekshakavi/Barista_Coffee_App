import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

const ORANGE = "#E8583A";
const BG = "#FBF1EA";
const GREY_TEXT = "#7A7A7A";
const BORDER = "#E0D6CB";

// 👉 Same pickup location used on the Cart screen — hook this up to a real
// location picker later so both screens share one source of truth.
const PICKUP_LOCATION = "Barista Kohuwala";

const TITLE_OPTIONS = ["Mr", "Mrs", "Ms", "Dr"];

type PaymentMethod = "cash" | "card" | "online";
type OrderFor = "me" | "someone";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalItems, subtotal, packagingCharge, total } = useCart();

  // ---- UI state ----
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderFor, setOrderFor] = useState<OrderFor>("me");

  // "Order for someone else" form fields
  const [title, setTitle] = useState("");
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [agreed, setAgreed] = useState(false);

  const someoneElseValid =
    orderFor === "me" ||
    (title.trim() !== "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      phone.trim() !== "");

  const canPlaceOrder = agreed && paymentMethod !== null && someoneElseValid && items.length > 0;

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) return;
    // 👉 Hook this up to your order-submission logic / API call.
    console.log("Placing order", {
      items,
      total,
      orderFor,
      recipient: orderFor === "someone" ? { title, firstName, lastName, phone } : null,
      paymentMethod,
    });
  };

  return (
    <View style={styles.flex}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color="#2B2B2B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="restaurant-outline" size={18} color={GREY_TEXT} />
              <Text style={styles.detailLabel}>Order Type</Text>
            </View>
            <Text style={styles.detailValueBold}>Pick Up</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="time-outline" size={18} color={GREY_TEXT} />
              <Text style={styles.detailLabel}>Order Time</Text>
            </View>
            <Text style={styles.detailValueBold}>Now</Text>
          </View>

          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="location-outline" size={18} color={GREY_TEXT} />
              <Text style={styles.detailLabel}>Pickup Location</Text>
            </View>
            <Text style={styles.detailValueBold}>{PICKUP_LOCATION}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <View style={styles.summaryHeaderRow}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <TouchableOpacity
              style={styles.viewDetailsBtn}
              onPress={() => setShowOrderDetails((prev) => !prev)}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Ionicons
                name={showOrderDetails ? "chevron-up" : "chevron-down"}
                size={16}
                color="#2B2B2B"
              />
            </TouchableOpacity>
          </View>

          {items.map((item) => (
            <View key={item.id} style={styles.summaryItemRow}>
              <Text style={styles.summaryItemLine}>
                {item.quantity} x {item.name}
              </Text>
              {showOrderDetails && (
                <Text style={styles.summaryItemPrice}>
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </Text>
              )}
            </View>
          ))}

          {showOrderDetails && (
            <View style={styles.expandedBlock}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub total</Text>
                <Text style={styles.summaryValue}>Rs. {subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Packaging Charge</Text>
                <Text style={styles.summaryValue}>Rs. {packagingCharge.toFixed(2)}</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Who is this order for */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Who is this order for?</Text>

          <TouchableOpacity
            style={[styles.selectableRow, orderFor === "me" && styles.selectableRowActive]}
            onPress={() => setOrderFor("me")}
          >
            <Ionicons
              name="person-outline"
              size={22}
              color={orderFor === "me" ? ORANGE : "#2B2B2B"}
            />
            <View style={styles.selectableTextWrap}>
              <Text style={[styles.selectableTitle, orderFor === "me" && styles.selectableTitleActive]}>
                Order for me
              </Text>
              <Text style={styles.selectableSubtitle}>I will pick up the order</Text>
            </View>
            {orderFor === "me" && <Ionicons name="checkmark" size={20} color={ORANGE} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.selectableRow,
              orderFor === "someone" && styles.selectableRowActive,
              { marginBottom: 0 },
            ]}
            onPress={() => setOrderFor("someone")}
          >
            <Ionicons
              name="person-outline"
              size={22}
              color={orderFor === "someone" ? ORANGE : "#2B2B2B"}
            />
            <View style={styles.selectableTextWrap}>
              <Text
                style={[styles.selectableTitle, orderFor === "someone" && styles.selectableTitleActive]}
              >
                Order for someone else
              </Text>
              <Text style={styles.selectableSubtitle}>Let someone else pick up</Text>
            </View>
            {orderFor === "someone" && <Ionicons name="checkmark" size={20} color={ORANGE} />}
          </TouchableOpacity>
        </View>

        {/* Recipient details — only shown when "Order for someone else" is picked */}
        {orderFor === "someone" && (
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Title</Text>
            <TouchableOpacity
              style={styles.dropdownField}
              onPress={() => setShowTitleDropdown((prev) => !prev)}
            >
              <Text style={title ? styles.dropdownValue : styles.dropdownPlaceholder}>
                {title || "Select title"}
              </Text>
              <Ionicons
                name={showTitleDropdown ? "chevron-up" : "chevron-down"}
                size={18}
                color="#2B2B2B"
              />
            </TouchableOpacity>

            {showTitleDropdown && (
              <View style={styles.dropdownList}>
                {TITLE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setTitle(option);
                      setShowTitleDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.fieldLabel}>First Name</Text>
            <TextInput
              style={styles.textField}
              placeholder="Enter first name"
              placeholderTextColor="#B8ADA0"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={styles.fieldLabel}>Last Name</Text>
            <TextInput
              style={styles.textField}
              placeholder="Enter last name"
              placeholderTextColor="#B8ADA0"
              value={lastName}
              onChangeText={setLastName}
            />

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.phoneCode}>
                <Text style={styles.phoneCodeText}>+94</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter phone number"
                placeholderTextColor="#B8ADA0"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>
        )}

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[styles.paymentRow, paymentMethod === "cash" && styles.selectableRowActive]}
            onPress={() => setPaymentMethod("cash")}
          >
            <Ionicons name="cash-outline" size={22} color="#2B2B2B" />
            <View style={styles.selectableTextWrap}>
              <Text style={styles.selectableTitle}>Pay on Pickup (Cash)</Text>
              <Text style={styles.selectableSubtitle}>Pay with cash when you collect your order</Text>
            </View>
            {paymentMethod === "cash" && <Ionicons name="checkmark" size={20} color={ORANGE} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentRow, paymentMethod === "card" && styles.selectableRowActive]}
            onPress={() => setPaymentMethod("card")}
          >
            <Ionicons name="card-outline" size={22} color="#2B2B2B" />
            <View style={styles.selectableTextWrap}>
              <Text style={styles.selectableTitle}>Pay on Pickup (Card)</Text>
              <Text style={styles.selectableSubtitle}>
                Pay with credit or debit card when you collect your order
              </Text>
            </View>
            {paymentMethod === "card" && <Ionicons name="checkmark" size={20} color={ORANGE} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentRow,
              paymentMethod === "online" && styles.selectableRowActive,
              { marginBottom: 0 },
            ]}
            onPress={() => setPaymentMethod("online")}
          >
            <Ionicons name="globe-outline" size={22} color="#2B2B2B" />
            <View style={styles.selectableTextWrap}>
              <Text style={styles.selectableTitle}>Pay on Online</Text>
              <Text style={styles.selectableSubtitle}>Pay with credit or debit card now</Text>
            </View>
            {paymentMethod === "online" && <Ionicons name="checkmark" size={20} color={ORANGE} />}
          </TouchableOpacity>
        </View>

        {/* Terms checkbox */}
        <TouchableOpacity style={styles.agreeRow} onPress={() => setAgreed((prev) => !prev)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.agreeText}>
            I confirm that all the information provided is accurate and I agree to the terms and
            conditions.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Place Order button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.placeOrderBtn, !canPlaceOrder && styles.placeOrderBtnDisabled]}
          disabled={!canPlaceOrder}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order - Rs. {total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 56,
    paddingBottom: 12,
  },
  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 19, fontWeight: "700", color: "#2B2B2B" },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#2B2B2B", marginBottom: 10 },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1E9E0",
  },
  detailLabelRow: { flexDirection: "row", alignItems: "center" },
  detailLabel: { fontSize: 14, color: GREY_TEXT, marginLeft: 10 },
  detailValueBold: { fontSize: 14, fontWeight: "700", color: "#2B2B2B" },

  summaryHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  viewDetailsBtn: { flexDirection: "row", alignItems: "center" },
  viewDetailsText: { fontSize: 13, fontWeight: "600", color: "#2B2B2B", marginRight: 4 },

  summaryItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryItemLine: { fontSize: 14, color: "#2B2B2B" },
  summaryItemPrice: { fontSize: 14, fontWeight: "600", color: "#2B2B2B" },

  expandedBlock: { marginTop: 6, marginBottom: 4 },

  divider: { height: 1, backgroundColor: "#F1E9E0", marginVertical: 12 },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: GREY_TEXT },
  summaryValue: { fontSize: 14, fontWeight: "700", color: "#2B2B2B" },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#2B2B2B" },
  totalValue: { fontSize: 16, fontWeight: "700", color: ORANGE },

  selectableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  selectableRowActive: {
    borderColor: ORANGE,
    backgroundColor: "#FDECE8",
  },
  selectableTextWrap: { flex: 1, marginLeft: 12 },
  selectableTitle: { fontSize: 14.5, fontWeight: "700", color: "#2B2B2B" },
  selectableTitleActive: { color: ORANGE },
  selectableSubtitle: { fontSize: 12.5, color: GREY_TEXT, marginTop: 2 },

  fieldLabel: { fontSize: 13.5, fontWeight: "700", color: "#2B2B2B", marginTop: 12, marginBottom: 6 },
  textField: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#2B2B2B",
  },
  dropdownField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownValue: { fontSize: 14, color: "#2B2B2B" },
  dropdownPlaceholder: { fontSize: 14, color: "#B8ADA0" },
  dropdownList: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1E9E0",
  },
  dropdownOptionText: { fontSize: 14, color: "#2B2B2B" },

  phoneRow: { flexDirection: "row", alignItems: "center" },
  phoneCode: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 8,
  },
  phoneCodeText: { fontSize: 14, fontWeight: "600", color: "#2B2B2B" },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#2B2B2B",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  agreeRow: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 4, marginTop: 4 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: ORANGE, borderColor: ORANGE },
  agreeText: { flex: 1, fontSize: 13, color: "#4A4A4A", lineHeight: 18 },

  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#EFE6DD",
    backgroundColor: BG,
  },
  placeOrderBtn: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  placeOrderBtnDisabled: { backgroundColor: "#9A9A9A", opacity: 0.6 },
  placeOrderText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});