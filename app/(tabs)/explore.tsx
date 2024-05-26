import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, Text } from "react-native";

import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView>
      <Text>Exlpore</Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
