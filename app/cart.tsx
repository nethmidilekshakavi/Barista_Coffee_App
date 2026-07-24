import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

const ORANGE = "#E8583A";
const BG = "#FBF1EA";

// 👉 Replace with the real pickup location / hook this up to a location picker later.
const PICKUP_LOCATION = "Barista Katubedda";

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, incrementQty, decrementQty, clearCart, totalItems, subtotal, packagingCharge, total } =
    useCart();

  return (
    <View style={styles.flex}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color="#2B2B2B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart ({totalItems})</Text>
        <TouchableOpacity onPress={clearCart} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={22} color="#2B2B2B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Details */}
        <Text style={styles.sectionTitle}>Order Details</Text>

        <View style={styles.detailRow}>
          <View style={styles.detailLabelRow}>
            <Ionicons name="restaurant-outline" size={18} color="#7A7A7A" />
            <Text style={styles.detailLabel}>Order type</Text>
          </View>
          <View style={styles.detailValueRow}>
            <Text style={styles.detailValueBold}>Pick Up</Text>
            <Ionicons name="bag-outline" size={18} color={ORANGE} style={{ marginLeft: 6 }} />
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLabelRow}>
            <Ionicons name="time-outline" size={18} color="#7A7A7A" />
            <Text style={styles.detailLabel}>Order time</Text>
          </View>
          <TouchableOpacity style={styles.timePill}>
            <Text style={styles.timePillText}>Now</Text>
            <Ionicons name="chevron-down" size={16} color="#2B2B2B" />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLabelRow}>
            <Ionicons name="location-outline" size={18} color="#7A7A7A" />
            <Text style={styles.detailLabel}>Pickup location</Text>
          </View>
          <Text style={styles.detailValueBold}>{PICKUP_LOCATION}</Text>
        </View>

        <View style={styles.divider} />

        {/* Cart items */}
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} resizeMode="cover" style={styles.itemImage} />

            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="close" size={20} color="#E24A3B" />
                </TouchableOpacity>
              </View>

              <View style={styles.qtyRow}>
                <Text style={styles.itemPrice}>{item.price}</Text>

                <View style={styles.stepper}>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => decrementQty(item.id)}>
                    <Ionicons name="remove" size={16} color="#2B2B2B" />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => incrementQty(item.id)}>
                    <Ionicons name="add" size={16} color="#2B2B2B" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {items.length === 0 && <Text style={styles.emptyText}>Your cart is empty.</Text>}
      </ScrollView>

      {/* Bottom summary + checkout */}
      <View style={styles.summaryWrapper}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub total</Text>
          <Text style={styles.summaryValue}>Rs. {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Packaging Charge</Text>
          <Text style={styles.summaryValue}>Rs. {packagingCharge.toFixed(2)}</Text>
        </View>

        <View style={styles.dashedDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rs. {total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, items.length === 0 && styles.checkoutBtnDisabled]}
          disabled={items.length === 0}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout - Rs. {total.toFixed(2)}</Text>
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

  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#2B2B2B", marginBottom: 14 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFE6DD",
  },
  detailLabelRow: { flexDirection: "row", alignItems: "center" },
  detailLabel: { fontSize: 14, color: "#6A6A6A", marginLeft: 10 },
  detailValueRow: { flexDirection: "row", alignItems: "center" },
  detailValueBold: { fontSize: 14, fontWeight: "700", color: "#2B2B2B" },
  timePill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0D6CB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  timePillText: { fontSize: 13, fontWeight: "600", color: "#2B2B2B", marginRight: 4 },
  divider: { height: 20 },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  itemImage: { width: 100 , height:100},
  cardBody: { flex: 1, padding: 14, justifyContent: "center" },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  itemName: { fontSize: 15.5, fontWeight: "700", color: "#2B2B2B", flex: 1, paddingRight: 8 },
  qtyRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  itemPrice: { fontSize: 16, fontWeight: "700", color: ORANGE },
  stepper: { flexDirection: "row", alignItems: "center" },
  stepperBtn: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: "#E0D6CB",
    alignItems: "center", justifyContent: "center",
  },
  stepperValue: { fontSize: 15, fontWeight: "700", color: "#2B2B2B", marginHorizontal: 12 },

  emptyText: { textAlign: "center", color: "#9A9A9A", marginTop: 40 },

  summaryWrapper: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#EFE6DD",
    backgroundColor: BG,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: "#6A6A6A" },
  summaryValue: { fontSize: 14, fontWeight: "700", color: "#2B2B2B" },
  dashedDivider: {
    borderBottomWidth: 1, borderStyle: "dashed", borderBottomColor: "#D8CFC4", marginVertical: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#2B2B2B" },
  totalValue: { fontSize: 16, fontWeight: "700", color: ORANGE },
  checkoutBtn: {
    backgroundColor: ORANGE, borderRadius: 30, paddingVertical: 16,
    alignItems: "center", marginTop: 16,
  },
  checkoutBtnDisabled: { opacity: 0.5 },
  checkoutText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});