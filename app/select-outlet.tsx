import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ORANGE = "#E8583A";
const CARD_WIDTH = SCREEN_WIDTH - 96;
const CARD_SPACING = 12;

type Outlet = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image: any;
};

// Full island-wide Barista Sri Lanka outlet list, sourced from barista.lk/locations.
// NOTE: coordinates are approximate area/town-centre values, not exact building
// pins — barista.lk only exposes Google Maps short links (maps.app.goo.gl/...)
// rather than raw lat/lng, so exact geocoding wasn't possible from that page.
// Swap in precise coordinates later if pinpoint accuracy matters (e.g. by
// resolving each "View Location" link through the Google Maps Geocoding API).
const img = require("../assets/images/outlets/images (1).jpg");

const OUTLETS: Outlet[] = [
  { id: "1", name: "Barista Ahangama", address: "Infront of police, Ahangama 80650", latitude: 5.9730, longitude: 80.3600, image: img },
  { id: "2", name: "Barista Anuradhapura", address: "519/G 23 Jayanthi Mawatha, Anuradhapura 50000", latitude: 8.3114, longitude: 80.4037, image: img },
  { id: "3", name: "Barista Athurugiriya – Express", address: "311, Borella Road, Athurugiriya", latitude: 6.8747, longitude: 79.9553, image: img },
  { id: "4", name: "Barista Bambalapitiya", address: "7/2, Station Road, Colombo 04", latitude: 6.8905, longitude: 79.8565, image: img },
  { id: "5", name: "Barista Bandaranaike International Airport", address: "Shop 66/D, Bandaranaike International Airport, Katunayake", latitude: 7.1808, longitude: 79.8841, image: img },
  { id: "6", name: "Barista Bandarawela – Express", address: "7 CargillsSquare Welimada Rd, Bandarawela 90000", latitude: 6.8333, longitude: 80.9833, image: img },
  { id: "7", name: "Barista Battaramulla", address: "16/2A Main St, Battaramulla 10120", latitude: 6.8992, longitude: 79.9184, image: img },
  { id: "8", name: "Barista BIA-Kiosk", address: "Transit Area, BIA, Katunayake 11450", latitude: 7.1808, longitude: 79.8841, image: img },
  { id: "9", name: "Barista Biyagama", address: "No. 542, 10/D Kandy Road, 11650", latitude: 6.9500, longitude: 79.9333, image: img },
  { id: "10", name: "Barista Boralesgamuwa", address: "129/2 90, Katuwawala Road, Boralesgamuwa", latitude: 6.8385, longitude: 79.9010, image: img },
  { id: "11", name: "Café Mocha by Barista", address: "28, Stafford Avenue, Colombo 06", latitude: 6.8880, longitude: 79.8560, image: img },
  { id: "12", name: "Barista Castle Street", address: "151/3 Castle St, Colombo 08", latitude: 6.9186, longitude: 79.8783, image: img },
  { id: "13", name: "Barista Cool Planet Narahenpita", address: "No.193, Kirula Road, Colombo 05", latitude: 6.8890, longitude: 79.8790, image: img },
  { id: "14", name: "Barista Dambulla", address: "No. 589 Sandalankawatte, Ibbankatuwa, Dambulla 21100", latitude: 7.8570, longitude: 80.6500, image: img },
  { id: "15", name: "Barista Kurunegala (Dambulla Road)", address: "Yaggapitiya, Kurunegala – Dambulla Rd, Kurunegala", latitude: 7.4867, longitude: 80.3650, image: img },
  { id: "16", name: "Barista Dehiwala", address: "35, Hill Street, Dehiwala", latitude: 6.8508, longitude: 79.8654, image: img },
  { id: "17", name: "Barista Delkanda", address: "No 601, Delkanda, Nugegoda 10250", latitude: 6.8686, longitude: 79.8930, image: img },
  { id: "18", name: "Barista Double XL", address: "No 108, Reid Avenue, Colombo 07", latitude: 6.9060, longitude: 79.8660, image: img },
  { id: "19", name: "Barista Ella", address: "No.01, Ella Junction, Ella", latitude: 6.8667, longitude: 81.0466, image: img },
  { id: "20", name: "Barista Ethul Kotte", address: "932/A Kotte Rd, Sri Jayawardenepura, Kotte", latitude: 6.8905, longitude: 79.9026, image: img },
  { id: "21", name: "Barista Galle Fort", address: "No. 53, Pedler's Street, Galle Fort", latitude: 6.0300, longitude: 80.2170, image: img },
  { id: "22", name: "Barista Galle (Matara Rd)", address: "111 Old Matara Rd, Galle 80000", latitude: 6.0250, longitude: 80.2200, image: img },
  { id: "23", name: "Barista Horana", address: "No. 249/A/A, LOT 4A, Ground Floor, Ratnapura", latitude: 6.7147, longitude: 80.0630, image: img },
  { id: "24", name: "Barista Horton Place", address: "75 Alexandra Pl, Colombo 07", latitude: 6.9080, longitude: 79.8650, image: img },
  { id: "25", name: "Barista Independence Arcade", address: "Arcade - Independence Square, Colombo 07", latitude: 6.9020, longitude: 79.8610, image: img },
  { id: "26", name: "Barista Ja-Ela", address: "118 Negombo Rd, Ja-Ela", latitude: 7.0744, longitude: 79.8917, image: img },
  { id: "27", name: "Barista Jaffna Express", address: "No 420, Hospital Road, Jaffna", latitude: 9.6615, longitude: 80.0255, image: img },
  { id: "28", name: "Barista Kadawatha", address: "469B Kandy Rd, Kadawatha 11850", latitude: 7.0008, longitude: 79.9508, image: img },
  { id: "29", name: "Barista Kandy", address: "No 498, Peradeniya Road, Kandy", latitude: 7.2833, longitude: 80.6167, image: img },
  { id: "30", name: "Barista Kandy City", address: "05 E L Senanayake Veediya, Kandy 20000", latitude: 7.2906, longitude: 80.6337, image: img },
  { id: "31", name: "Barista Katubedda", address: "239 Galle Rd, Moratuwa", latitude: 6.7963, longitude: 79.8994, image: img },
  { id: "32", name: "Barista Kelly Felder – Wattala", address: "811 Negombo Rd, Wattala", latitude: 6.9890, longitude: 79.8920, image: img },
  { id: "33", name: "Barista Kiribathgoda", address: "No 91, Ground Floor, Kandy Road, Kiribathgoda", latitude: 6.9776, longitude: 79.9294, image: img },
  { id: "34", name: "Barista Kochchikade", address: "No 63, Chilaw road, Kochchikade", latitude: 7.2667, longitude: 79.8667, image: img },
  { id: "35", name: "Barista Kohuwala", address: "129/2 Dutugemunu St, Colombo 10250", latitude: 6.8649, longitude: 79.8785, image: img },
  { id: "36", name: "Barista Kollupitiya", address: "No. 213 Galle Rd, Colombo 03", latitude: 6.9101, longitude: 79.8500, image: img },
  { id: "37", name: "Barista Kottawa", address: "292, 1 High Level Rd, Pannipitiya", latitude: 6.8402, longitude: 79.9622, image: img },
  { id: "38", name: "Barista Kurunegala", address: "First floor, 61, Baudhaloka Mawatha, Kurunegala", latitude: 7.4867, longitude: 80.3647, image: img },
  { id: "39", name: "Barista Lady J", address: "993 Maradana Rd, Colombo 01", latitude: 6.9280, longitude: 79.8650, image: img },
  { id: "40", name: "Barista Maharagama", address: "No.280, Siri Vajiragnana Mavatha, Lake Rd, Maharagama", latitude: 6.8500, longitude: 79.9167, image: img },
  { id: "41", name: "Barista Maharagama – Express", address: "No. 171, Colombo Road, Maharagama", latitude: 6.8500, longitude: 79.9167, image: img },
  { id: "42", name: "Barista Malabe", address: "390, Kaduwela Road, Malabe", latitude: 6.9066, longitude: 79.9723, image: img },
  { id: "43", name: "Barista Matara", address: "No.7B, Beach Road, Matara", latitude: 5.9485, longitude: 80.5353, image: img },
  { id: "44", name: "Barista Mattala", address: "22 Junction, Padawgama, Lunugamwehera - Airport Rd, Thissamaharama", latitude: 6.2833, longitude: 81.1236, image: img },
  { id: "45", name: "Barista Mirihana", address: "266 Old Kottawa Rd, Nugegoda 10250", latitude: 6.8721, longitude: 79.8890, image: img },
  { id: "46", name: "Barista Mirissa", address: "Sri Ramya, Galle Road, Mirissa", latitude: 5.9483, longitude: 80.4589, image: img },
  { id: "47", name: "Barista MOB", address: "28, Vajira Road, R. A. De Mel Mawatha, Colombo 04", latitude: 6.9089, longitude: 79.8560, image: img },
  { id: "48", name: "Barista Moratuwa", address: "11 Galle Rd New Deviation, Moratuwa 10400", latitude: 6.7730, longitude: 79.8816, image: img },
  { id: "49", name: "Barista Mount Lavinia", address: "198, Galle Road, Mount Lavinia", latitude: 6.8389, longitude: 79.8653, image: img },
  { id: "50", name: "Barista Mulleriyawa", address: "No 313, 10 Avissawella Rd, Mulleriyawa New Town", latitude: 6.9350, longitude: 79.9350, image: img },
  { id: "51", name: "Barista Narahenpita", address: "No 570/1, Elvitigala Mawatha, Narahenpita", latitude: 6.8890, longitude: 79.8790, image: img },
  { id: "52", name: "Barista Nawala", address: "446 Nawala Rd, Sri Jayewardenepura Kotte", latitude: 6.8925, longitude: 79.8890, image: img },
  { id: "53", name: "Barista Nawam Mawatha", address: "48, IBM Building, Nawam Mawatha, Colombo 02", latitude: 6.9280, longitude: 79.8460, image: img },
  { id: "54", name: "Barista Negombo", address: "631, Colombo Road, Negombo", latitude: 7.2083, longitude: 79.8358, image: img },
  { id: "55", name: "Barista Nugegoda", address: "No. 117, Pagoda road, Nugegoda", latitude: 6.8721, longitude: 79.8890, image: img },
  { id: "56", name: "Barista Nugegoda – Express", address: "27, S De S Jayasinghe Mawatha, Nugegoda", latitude: 6.8721, longitude: 79.8890, image: img },
  { id: "57", name: "Barista Nuwara Eliya", address: "Greenways, Badulla Road, Nuwara Eliya", latitude: 6.9497, longitude: 80.7891, image: img },
  { id: "58", name: "Barista Orion City", address: "No.752 Dr Danister De Silva Mawatha, Colombo 09", latitude: 6.9130, longitude: 79.8730, image: img },
  { id: "59", name: "Barista Pallekele", address: "New 81/1, Balagolla, Kengalla 20186", latitude: 7.2833, longitude: 80.7000, image: img },
  { id: "60", name: "Barista Panadura", address: "455 A2, Panadura", latitude: 6.7130, longitude: 79.9020, image: img },
  { id: "61", name: "Barista Pannipitiya", address: "155 High Level Rd, Pannipitiya 10230", latitude: 6.8480, longitude: 79.9420, image: img },
  { id: "62", name: "Barista Pasyala", address: "No. 136/B, Kandy Road, Kalalpitiya, Pasyala", latitude: 7.1167, longitude: 80.1000, image: img },
  { id: "63", name: "Barista Pepiliyana", address: "Colombo road, Pepiliyana – Dehiwela Rd", latitude: 6.8560, longitude: 79.8830, image: img },
  { id: "64", name: "Barista Perahera Mawatha", address: "181, Sir James Peiris Mawatha, Colombo 02", latitude: 6.9200, longitude: 79.8450, image: img },
  { id: "65", name: "Barista Piliyandala", address: "No 188, Colombo Road, Mampe", latitude: 6.8017, longitude: 79.9227, image: img },
  { id: "66", name: "Barista Polonnaruwa", address: "No. 13 Hospital Junction, Polonnaruwa 51000", latitude: 7.9403, longitude: 81.0188, image: img },
  { id: "67", name: "Barista Port City", address: "Shop 04, No. 1, Port City Colombo 02", latitude: 6.9370, longitude: 79.8420, image: img },
  { id: "68", name: "Barista Rajagiriya", address: "No 55A, Buthgamuwa Road, Rajagiriya", latitude: 6.9091, longitude: 79.8945, image: img },
  { id: "69", name: "Barista Seeduwa", address: "No. 444, Seeduwa village, Colombo road, Seeduwa", latitude: 7.1333, longitude: 79.8833, image: img },
  { id: "70", name: "Barista Shanthipura", address: "Eagle's View Point, Nuwara Eliya 22200", latitude: 6.9497, longitude: 80.7891, image: img },
  { id: "71", name: "Barista Sigiriya", address: "121/A, Main Road, Sigiriya", latitude: 7.9570, longitude: 80.7603, image: img },
  { id: "72", name: "Barista Southern Highway A", address: "Service Area A, Southern Expressway", latitude: 6.3500, longitude: 80.2000, image: img },
  { id: "73", name: "Barista Southern Highway B", address: "Service Area B, Welipenna, Southern Expressway", latitude: 6.2833, longitude: 80.2000, image: img },
  { id: "74", name: "Barista Staple Street Lakarcade", address: "33 Staple St, Colombo 02", latitude: 6.9330, longitude: 79.8460, image: img },
  { id: "75", name: "Barista Sujatha Colleague", address: "369 High Level Rd, Nugegoda", latitude: 6.8721, longitude: 79.8890, image: img },
  { id: "76", name: "Barista Thalawathugoda", address: "No.1136/B/5, Pannipitiya Road, Thalawathugoda", latitude: 6.8770, longitude: 79.9440, image: img },
  { id: "77", name: "Barista Thimbirigasyaya – Express", address: "No 61, Isipathana Mawatha, Colombo 05", latitude: 6.9020, longitude: 79.8710, image: img },
  { id: "78", name: "Barista Thummulla, Laksala", address: "Laksala Building, Reid Mawatha, Cinnamon Gardens", latitude: 6.9060, longitude: 79.8600, image: img },
  { id: "79", name: "Barista Trillium", address: "Trillium Hotel, 210 Torrington Ave, Colombo 07", latitude: 6.9040, longitude: 79.8650, image: img },
  { id: "80", name: "Barista Udawalawa", address: "C.P.D De Silva Rd, B427, Udawalawa 70190", latitude: 6.4392, longitude: 80.8925, image: img },
  { id: "81", name: "Barista Unawatuna", address: "184, Welledewala Junction, Galle-Matara Rd", latitude: 6.0108, longitude: 80.2492, image: img },
  { id: "82", name: "Barista Wattala", address: "No.542 A, Negombo road, Wattala", latitude: 6.9890, longitude: 79.8920, image: img },
  { id: "83", name: "Barista Wattala 2", address: "811 Negombo Rd, Wattala", latitude: 6.9890, longitude: 79.8920, image: img },
  { id: "84", name: "Barista Wellawatte", address: "No 519 Galle Rd, Colombo 06", latitude: 6.8756, longitude: 79.8590, image: img },
  { id: "85", name: "Barista Wennappuwa", address: "No 5 Main Street, Wennappuwa 61170", latitude: 7.3500, longitude: 79.8333, image: img },
  { id: "86", name: "Barista World Trade Center", address: "Level 3, World Trade Centre, Colombo 01", latitude: 6.9346, longitude: 79.8428, image: img },
  { id: "87", name: "Barista WSO2", address: "No 105 Bauddhaloka Road, Colombo 04", latitude: 6.8940, longitude: 79.8620, image: img },
  { id: "88", name: "Barista Yakkala", address: "264, Henpitimulla Kandy Rd, Yakkala", latitude: 7.0833, longitude: 80.0333, image: img },
];

function toRad(v: number) {
  return (v * Math.PI) / 180;
}

// Haversine distance in km between two coordinates.
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function SelectOutletScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList<Outlet>>(null);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setUserLocation(coords);
      mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.08, longitudeDelta: 0.08 }, 500);
    })();
  }, []);

  // Every Barista outlet, narrowed down to whatever the person typed.
  const filteredOutlets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return OUTLETS;
    return OUTLETS.filter(
      (o) => o.name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q)
    );
  }, [search]);

  // Closest outlets first, once we know where the person is.
  const sortedOutlets = useMemo(() => {
    if (!userLocation) return filteredOutlets;
    return [...filteredOutlets].sort(
      (a, b) =>
        distanceKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude) -
        distanceKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
    );
  }, [filteredOutlets, userLocation]);

  const visibleOutlets = showAll ? sortedOutlets : sortedOutlets.slice(0, 5);

  const getDistanceLabel = (outlet: Outlet) => {
    if (!userLocation) return "--";
    return `${distanceKm(userLocation.latitude, userLocation.longitude, outlet.latitude, outlet.longitude).toFixed(1)} km`;
  };

  const getTimeLabel = (outlet: Outlet) => {
    if (!userLocation) return "--";
    const km = distanceKm(userLocation.latitude, userLocation.longitude, outlet.latitude, outlet.longitude);
    const mins = Math.max(1, Math.round((km / 30) * 60)); // rough estimate at 30km/h
    return `${mins} mins`;
  };

  const focusOutlet = (outlet: Outlet, index: number) => {
    setSelectedId(outlet.id);
    mapRef.current?.animateToRegion(
      { latitude: outlet.latitude, longitude: outlet.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      400
    );
    // Guard against scrolling to an index that isn't in the currently visible slice.
    const visibleIndex = visibleOutlets.findIndex((o) => o.id === outlet.id);
    if (visibleIndex >= 0) {
      listRef.current?.scrollToIndex({ index: visibleIndex, animated: true });
    }
  };

  const recenterToUser = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion({ ...userLocation, latitudeDelta: 0.08, longitudeDelta: 0.08 }, 500);
  };

  const initialRegion: Region = {
    latitude: userLocation?.latitude ?? 6.9271,
    longitude: userLocation?.longitude ?? 79.8612,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.flex}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color="#2B2B2B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Outlet</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Search + dropdown results */}
      <View style={styles.searchZone}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color="#9B9B9B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for cities, addresses..."
            placeholderTextColor="#9B9B9B"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setShowDropdown(text.trim().length > 0);
            }}
            onFocus={() => setShowDropdown(search.trim().length > 0)}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                setShowDropdown(false);
              }}
            >
              <Ionicons name="close-circle" size={18} color="#9B9B9B" />
            </TouchableOpacity>
          )}
        </View>

        {showDropdown && (
          <View style={styles.dropdown}>
            {filteredOutlets.length === 0 ? (
              <Text style={styles.dropdownEmpty}>No outlets found</Text>
            ) : (
              <FlatList
                data={filteredOutlets}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                style={{ maxHeight: 220 }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setShowAll(true);
                      focusOutlet(item, index);
                      setSearch(item.name);
                      setShowDropdown(false);
                    }}
                  >
                    <Ionicons name="location-outline" size={16} color={ORANGE} style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.dropdownItemTitle}>{item.name}</Text>
                      <Text style={styles.dropdownItemSubtitle}>{item.address}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {sortedOutlets.map((outlet, index) => (
            <Marker
              key={outlet.id}
              coordinate={{ latitude: outlet.latitude, longitude: outlet.longitude }}
              // Anchor the tip of the pointer triangle to the real coordinate.
              // Without this the pin's bounding-box centre (icon + triangle)
              // gets centred on the coordinate instead, which is what was
              // making pins look shifted / bunched together on screen.
              anchor={{ x: 0.5, y: 1 }}
              // Stops Android from constantly re-measuring custom-view markers,
              // which is what causes the flicker/overlap you saw when the map moved.
              tracksViewChanges={false}
              onPress={() => focusOutlet(outlet, index)}
            >
              <View style={styles.markerWrap}>
                <View style={[styles.markerPin, selectedId === outlet.id && styles.markerPinActive]}>
                  <Ionicons name="cafe" size={16} color="#FFFFFF" />
                </View>
                <View style={styles.markerPointer} />
              </View>
            </Marker>
          ))}
        </MapView>

        <TouchableOpacity style={styles.locateButton} onPress={recenterToUser}>
          <Ionicons name="locate" size={20} color="#2B2B2B" />
        </TouchableOpacity>

        {/* Nearby outlets — floats over the bottom of the map like a slider */}
        <View style={styles.nearbySection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Nearby Outlets</Text>
            <TouchableOpacity onPress={() => setShowAll((prev) => !prev)}>
              <Text style={styles.seeAll}>{showAll ? "Show less" : "View All"}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={listRef}
            data={visibleOutlets}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate="fast"
            contentContainerStyle={{ paddingRight: 24 }}
            getItemLayout={(_, index) => ({
              length: CARD_WIDTH + CARD_SPACING,
              offset: (CARD_WIDTH + CARD_SPACING) * index,
              index,
            })}
            onScrollToIndexFailed={() => {}}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.card, { width: CARD_WIDTH, marginLeft: index === 0 ? 24 : CARD_SPACING }]}
                onPress={() => focusOutlet(item, index)}
              >
                <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.cardMetaRow}>
                    <Ionicons name="location-outline" size={14} color="#6A6A6A" />
                    <Text style={styles.cardMetaText}>{getDistanceLabel(item)}</Text>
                  </View>
                  <View style={styles.cardMetaRow}>
                    <Ionicons name="time-outline" size={14} color="#6A6A6A" />
                    <Text style={styles.cardMetaText}>{getTimeLabel(item)}</Text>
                  </View>
                  <View style={styles.cardDivider} />
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity style={styles.directionCircle}>
                      <Ionicons name="navigate-outline" size={18} color={ORANGE} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreInfoButton}>
                      <Text style={styles.moreInfoText}>More Info</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Bottom nav bar, consistent with the dashboard */}
      <View style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard")}>
            <Ionicons name="home-outline" size={22} color="#6A6A6A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/menu")}>
            <Ionicons name="cafe-outline" size={22} color="#6A6A6A" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <Ionicons name="location" size={22} color="#FFFFFF" />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerButton: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#2B2B2B" },
  searchZone: { zIndex: 10 },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 46,
    borderRadius: 23,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#2B2B2B" },
  dropdown: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -12,
    marginBottom: 12,
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  dropdownEmpty: {
    padding: 16,
    fontSize: 13,
    color: "#9B9B9B",
    textAlign: "center",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F0EA",
  },
  dropdownItemTitle: { fontSize: 13, fontWeight: "600", color: "#2B2B2B" },
  dropdownItemSubtitle: { fontSize: 11, color: "#6A6A6A", marginTop: 1 },
  mapContainer: { flex: 1, position: "relative" },
  locateButton: {
    position: "absolute",
    top: 12,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 5,
  },
  markerWrap: { alignItems: "center" },
  markerPin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  markerPinActive: { backgroundColor: "#2B2B2B" },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: ORANGE,
    marginTop: -2,
  },
  nearbySection: { position: "absolute", left: 0, right: 0, bottom: 96 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#2B2B2B" },
  seeAll: { fontSize: 12, color: ORANGE, fontWeight: "600" },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardImage: { width: 96, height: undefined, aspectRatio: 0.8 },
  cardBody: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#2B2B2B", marginBottom: 6 },
  cardMetaRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  cardMetaText: { fontSize: 12, color: "#6A6A6A", marginLeft: 4 },
  cardDivider: { height: 1, backgroundColor: "#F0E9E2", marginVertical: 8 },
  cardActionsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  directionCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E8D8CC",
    alignItems: "center",
    justifyContent: "center",
  },
  moreInfoButton: {
    borderWidth: 1,
    borderColor: "#E8D8CC",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  moreInfoText: { fontSize: 12, fontWeight: "600", color: "#2B2B2B" },
  bottomBarWrapper: { position: "absolute", bottom: 20, left: 24, right: 24 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#E9E4DC",
    borderRadius: 30,
    paddingVertical: 10,
  },
  navItem: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  navItemActive: { backgroundColor: "#2B2B2B" },
});