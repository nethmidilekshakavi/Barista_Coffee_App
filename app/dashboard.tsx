import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ORANGE = "#E8583A";

// ---------- OFFERS SLIDER IMAGES ----------
const OFFERS = [
  {
    id: "1",
    image: require("../assets/images/dashboard/firstpic.png"),
  },
  {
    id: "2",
    image: require("../assets/images/dashboard/secondpic.png"),
  },
];

// ---------- CATEGORY ICONS ----------
// 👉 Once you have real category icon images, add them like this instead:
//    { id: "1", label: "Top Picks", image: require("../assets/images/categories/top-picks.png") }
// and swap the <Ionicons> below for <Image source={category.image} resizeMode="contain" style={styles.categoryIcon} />
// Do NOT leave image: ("") — an empty string crashes the Image component.
const CATEGORIES = [
  { id: "1", label: "Top Picks", icon: "ribbon-outline" as const },
  { id: "2", label: "Coffee", icon: "cafe-outline" as const },
  { id: "3", label: "Food", icon: "fast-food-outline" as const },
  { id: "4", label: "Promotion", icon: "pricetags-outline" as const },
  { id: "5", label: "Sweet Tornados", icon: "ice-cream-outline" as const },
  { id: "6", label: "Beyond Coffee", icon: "cafe-outline" as const },
  { id: "7", label: "Merchandise", icon: "bag-outline" as const },
  { id: "8", label: "Vegan Coffee", icon: "leaf-outline" as const },
];

export default function DashboardScreen() {
  const router = useRouter();

  // 👉 Replace with the logged-in user's actual first name
  const userName = "Nethmi";

  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleSlideScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 48));
    setActiveSlide(slideIndex);
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <Text style={styles.greeting}>Hello Miss. {userName},</Text>
        <Text style={styles.subGreeting}>Good afternoon</Text>

        {/* Offers */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Offers</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSlideScroll}
          style={styles.offersScroll}
        >
          {OFFERS.map((offer) => (
            <Image
              key={offer.id}
              source={offer.image}
              resizeMode="cover"
              style={styles.offerImage}
            />
          ))}
        </ScrollView>

        <View style={styles.dotsRow}>
          {OFFERS.map((offer, index) => (
            <View
              key={offer.id}
              style={[styles.dot, activeSlide === index && styles.dotActive]}
            />
          ))}
        </View>

        {/* Categories */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryIconCircle}>
                <Ionicons name={category.icon} size={26} color={ORANGE} />
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom nav bar */}
      <View style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <Ionicons name="home" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="cafe-outline" size={22} color="#6A6A6A" />
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
  flex: { flex: 1, backgroundColor: "#FBF1EA" },
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  subGreeting: {
    fontSize: 14,
    color: "#6A6A6A",
    marginTop: 2,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  seeAll: {
    fontSize: 13,
    color: ORANGE,
    textDecorationLine: "underline",
  },
  offersScroll: {
    marginBottom: 8,
  },
  offerImage: {
    width: SCREEN_WIDTH - 48,
    height: 180,
    borderRadius: 20,
    marginRight: 0,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D8D0C8",
    marginHorizontal: 3,
  },
  dotActive: {
    width: 16,
    backgroundColor: ORANGE,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "23%",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#E8D8CC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },
  categoryLabel: {
    fontSize: 12,
    color: "#2B2B2B",
    textAlign: "center",
  },
  bottomBarWrapper: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#E9E4DC",
    borderRadius: 30,
    paddingVertical: 10,
  },
  navItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  navItemActive: {
    backgroundColor: "#2B2B2B",
  },
});