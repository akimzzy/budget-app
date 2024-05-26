import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";

import { CategoryItem } from "@/types";
import Colors from "@/utils/Colors";
import Sizes from "@/utils/Sizes";
import SwipeableRow from "./SwipeableRow";

const AnItem = ({
  item,
  lastItem,
  deleteItem,
}: {
  item: CategoryItem;
  lastItem: boolean;
  deleteItem: () => Promise<void>;
}) => {
  return (
    <SwipeableRow lastItem={lastItem} deleteItem={deleteItem} link={item.url}>
      <View
        style={{
          ...styles.item,
          borderBottomWidth: lastItem ? 0 : 1,
          borderColor: Colors.GRAY,
        }}
      >
        <View style={{ ...styles.iconBox }}>
          <Image
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "#0553",
            }}
            source={item.icon}
            contentFit="cover"
            transition={1000}
          />
        </View>
        <View style={styles.details}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 16,
                textTransform: "capitalize",
                fontFamily: "JostMedium",
              }}
            >
              {item.name}
            </Text>

            {item.note && (
              <Text
                style={{
                  fontFamily: "Jost",
                  color: Colors.DARKEST_GRAY,
                }}
              >
                {item.note}
              </Text>
            )}
          </View>

          <View style={{ marginRight: Sizes.SM }}>
            <Text style={{ fontSize: 16, fontFamily: "JostBold" }}>
              ${item.cost}
            </Text>
          </View>
        </View>
      </View>
    </SwipeableRow>
  );
};

export default AnItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: Sizes.SM,
    padding: Sizes.SM,
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: "white",
  },
  iconBox: {
    borderRadius: Sizes.SM,
    height: Sizes.XLG * 1.2,
    width: Sizes.XLG * 1.2,
    overflow: "hidden",
  },

  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Sizes.MD,
    flex: 1,
  },
});
