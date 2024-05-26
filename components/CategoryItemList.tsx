import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Toast from "react-native-root-toast";

import Sizes from "../utils/Sizes";
import Colors from "../utils/Colors";
import { Image } from "expo-image";
import { CategoryItem } from "@/types";
import AnItem from "./AnItem";
import { supabase } from "@/utils/superbaseConfig";

type Props = {
  items: CategoryItem[] | undefined;
  getCategory: (loading?: boolean) => Promise<void>;
  loading: boolean;
};
export default function CategoryItems({ items, getCategory, loading }: Props) {
  async function handleDeleteItem(id: number) {
    try {
      const { error } = await supabase
        .from("category_item")
        .delete()
        .eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      getCategory(false);
      Toast.show("Item deleted successfully", {
        duration: Toast.durations.SHORT,
      });
    } catch (error) {
      Toast.show("Failed to delete Item", {
        duration: Toast.durations.SHORT,
      });
    }
  }

  return (
    <View style={{ height: "100%" }}>
      <View style={styles.container}>
        <FlashList
          refreshing={loading}
          onRefresh={getCategory}
          data={items}
          renderItem={({ item, index: i }) => (
            <AnItem
              item={item}
              lastItem={i === (items?.length || 0) - 1}
              deleteItem={() => handleDeleteItem(item.id)}
              key={item.id}
            />
          )}
          estimatedItemSize={50}
          ListHeaderComponent={
            <Text style={{ fontSize: Sizes.MD * 1.2, fontFamily: "JostBold" }}>
              Item list
            </Text>
          }
          ListEmptyComponent={
            <Text
              style={{
                fontSize: Sizes.LG * 1.5,
                fontFamily: "JostBold",
                color: Colors.GRAY,
                textTransform: "uppercase",
              }}
            >
              No Items
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: "100%", marginVertical: Sizes.SM, gap: Sizes.SM * 0.7 },
});
