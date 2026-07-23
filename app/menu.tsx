import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ORANGE = "#E8583A";
const BG = "#FBF1EA";

// Tabs shown at the top of the Menu page.
// These should line up with the CATEGORIES labels used on the Dashboard.
const TABS = ["Top Picks", "Coffee", "Food", "Promotion", "Sweet Tornados", "Beyond Coffee"];

type MenuItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  description: string;
  // 👉 Replace these require(...) paths with your own product images.
  image: any;
  options: string[];
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    category: "Top Picks",
    name: "Cappuccino",
    price: 496,
    originalPrice: 620,
    discountLabel: "20%",
    description: "A classic espresso with steamed milk and a thick layer of foam.",
    image: require("../assets/images/menu/cappuccino.png"),
    options: ["Short", "Medium", "Tall"],
  },
  {
    id: "2",
    category: "Top Picks",
    name: "Chicken Ham and Cheese",
    price: 790,
    description: "Chicken ham and melted cheese layered in soft bread.",
    image: require("../assets/images/menu/chicken-ham-cheese.png"),
    options: ["White Bread", "Brown Bread"],
  },
  {
    id: "3",
    category: "Top Picks",
    name: "Americano",
    price: 424,
    originalPrice: 530,
    discountLabel: "20%",
    description: "Espresso diluted with hot water for a smooth and bold coffee experience.",
    image: require("../assets/images/menu/americano.png"),
    options: ["Short", "Medium", "Tall"],
  },
];

export default function MenuScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();

  const [activeTab, setActiveTab] = useState<string>(category ?? "Top Picks");
  // Tracks the selected size/option index per product id.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  const selectOption = (itemId: string, optionIndex: number) => {
    setSelectedOptions((prev) => ({ ...prev, [itemId]: optionIndex }));
  };

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeTab);

  return (
    <View style={styles.flex}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#2B2B2B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product list */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* 👉 Product image goes here — stretches to fill the full card height, no white gaps */}
            <Image source={item.image} resizeMode="cover" style={styles.itemImage} />

            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <TouchableOpacity style={styles.addBtn}>
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.currency}>LKR</Text>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                )}
                <Text style={styles.price}>{item.price}</Text>
                {item.discountLabel && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{item.discountLabel}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.optionsRow}>
                {item.options.map((option, index) => {
                  const isSelected = (selectedOptions[item.id] ?? 0) === index;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => selectOption(item.id, index)}
                      style={[styles.optionPill, isSelected && styles.optionPillActive]}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        ))}

        {filteredItems.length === 0 && (
          <Text style={styles.emptyText}>No items in this category yet.</Text>
        )}
      </ScrollView>

      {/* Bottom nav — same style as Dashboard, "Coffee" tab active here */}
      <View style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard")}>
            <Ionicons name="home-outline" size={22} color="#6A6A6A" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <Ionicons name="cafe" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="location-outline" size={22} color="#6A6A6A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={22} color="#6A6A6A" />
          </TouchableOpacity>
        </View>
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
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#2B2B2B" },

  tabsScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: "#EFE6DD" },
  tabsContent: { paddingHorizontal: 20, alignItems: "center" },
  tabItem: { marginRight: 28, alignItems: "center", paddingBottom: 12 },
  tabLabel: { fontSize: 15, color: "#9A9A9A", fontWeight: "500" },
  tabLabelActive: { color: ORANGE, fontWeight: "700" },
  tabUnderline: { marginTop: 8, height: 3, width: "100%", borderRadius: 2, backgroundColor: ORANGE },

  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 140 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginBottom: 18,
    overflow: "hidden",
    // alignItems intentionally left as default "stretch" so the image
    // (no fixed height, alignSelf: "stretch") fills the card top-to-bottom.
  },
  itemImage: {
    width: 130,
    height:185,
  },
  cardBody: { flex: 1, padding: 14 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  itemName: { fontSize: 17, fontWeight: "700", color: "#2B2B2B", flex: 1, paddingRight: 8 },
  addBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: ORANGE,
    alignItems: "center", justifyContent: "center",
  },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  currency: { fontSize: 12, color: ORANGE, marginRight: 4 },
  originalPrice: {
    fontSize: 13, color: "#C23B2E", textDecorationLine: "line-through", marginRight: 6,
  },
  price: { fontSize: 16, fontWeight: "700", color: ORANGE, marginRight: 8 },
  discountBadge: { backgroundColor: "#3FA34D", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  discountText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  description: { fontSize: 12.5, color: "#7A7A7A", marginTop: 6, lineHeight: 17 },
  optionsRow: {
    flexDirection: "row", marginTop: 12, borderWidth: 1, borderColor: "#EFE6DD",
    borderRadius: 20, overflow: "hidden", alignSelf: "flex-start",
  },
  optionPill: { paddingHorizontal: 14, paddingVertical: 7 },
  optionPillActive: { backgroundColor: ORANGE, borderRadius: 20 },
  optionText: { fontSize: 12.5, color: "#4A4A4A", fontWeight: "500" },
  optionTextActive: { color: "#FFFFFF", fontWeight: "700" },

  emptyText: { textAlign: "center", color: "#9A9A9A", marginTop: 40 },

  bottomBarWrapper: { position: "absolute", bottom: 20, left: 24, right: 24 },
  bottomBar: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    backgroundColor: "#E9E4DC", borderRadius: 30, paddingVertical: 10,
  },
  navItem: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  navItemActive: { backgroundColor: "#2B2B2B" },
});