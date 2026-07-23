import React, { useState, useRef, useEffect } from "react";
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
import { useAuth } from "../context/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ORANGE = "#E8583A";

const OFFERS = [
  { id: "1", image: require("../assets/images/dashboard/firstpic.png") },
  { id: "2", image: require("../assets/images/dashboard/secondpic.png") },
];

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

function getSriLankaGreeting(): string {
  const now = new Date();
  const slTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
  const hour = slTime.getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const userName = user?.firstName ?? "Guest";

  const [greeting, setGreeting] = useState(getSriLankaGreeting());
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getSriLankaGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSlideScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 48));
    setActiveSlide(slideIndex);
  };

  // Navigate to the Menu page, pre-filtered to the tapped category.
  const handleCategoryPress = (categoryLabel: string) => {
    router.push({ pathname: "/menu", params: { category: categoryLabel } });
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hello Miss. {userName},</Text>
        <Text style={styles.subGreeting}>{greeting}</Text>

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
            <Image key={offer.id} source={offer.image} resizeMode="cover" style={styles.offerImage} />
          ))}
        </ScrollView>

        <View style={styles.dotsRow}>
          {OFFERS.map((offer, index) => (
            <View key={offer.id} style={[styles.dot, activeSlide === index && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category.label)}
            >
              <View style={styles.categoryIconCircle}>
                <Ionicons name={category.icon} size={26} color={ORANGE} />
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <Ionicons name="home" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/menu")}>
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
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120 },
  greeting: { fontSize: 20, fontWeight: "700", color: "#2B2B2B" },
  subGreeting: { fontSize: 14, color: "#6A6A6A", marginTop: 2, marginBottom: 20 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#2B2B2B" },
  seeAll: { fontSize: 13, color: ORANGE, textDecorationLine: "underline" },
  offersScroll: { marginBottom: 8 },
  offerImage: { width: SCREEN_WIDTH - 48, height: 180, borderRadius: 20, marginRight: 0 },
  dotsRow: { flexDirection: "row", justifyContent: "center", marginBottom: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#D8D0C8", marginHorizontal: 3 },
  dotActive: { width: 16, backgroundColor: ORANGE },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoryItem: { width: "23%", alignItems: "center", marginBottom: 20 },
  categoryIconCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1,
    borderColor: "#E8D8CC", alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  categoryLabel: { fontSize: 12, color: "#2B2B2B", textAlign: "center" },
  bottomBarWrapper: { position: "absolute", bottom: 20, left: 24, right: 24 },
  bottomBar: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    backgroundColor: "#E9E4DC", borderRadius: 30, paddingVertical: 10,
  },
  navItem: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  navItemActive: { backgroundColor: "#2B2B2B" },
});