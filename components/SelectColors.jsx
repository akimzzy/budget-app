import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../utils/Colors";
import Sizes from "../utils/Sizes";
import { FontAwesome } from "@expo/vector-icons";

export default function SelectColors({ color, setColor }) {
  return (
    <View style={styles.colorContainer}>
      {Colors.COLOR_LIST.map((cl) => (
        <TouchableOpacity
          key={cl}
          style={[
            styles.color,
            { backgroundColor: cl },
            cl === color && { borderColor: Colors.WHITE },
          ]}
          onPress={() => setColor(cl)}
        >
          {cl === color && <FontAwesome name="check" size={20} color="white" />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  colorContainer: {
    marginTop: Sizes.LG,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Sizes.SM,
  },
  color: {
    height: Sizes.XLG,
    width: Sizes.XLG,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
});
