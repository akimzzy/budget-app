import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Sizes from "../utils/Sizes";
import Colors from "../utils/Colors";
import { Link } from "expo-router";
import { Category } from "@/types";

export default function CategoryList({
  categoryList,
}: {
  categoryList: Category[];
}) {
  return (
    <View
      style={{
        marginVertical: Sizes.MD,
        // backgroundColor: Colors.LIGHT_GRAY,
        borderRadius: Sizes.MD,
        padding: Sizes.MD,
      }}
    >
      <Text
        style={{
          fontSize: Sizes.MD * 1.5,
          fontFamily: "JostBold",
        }}
      >
        Latest Budget
      </Text>

      <View style={styles.container}>
        {categoryList.map((category) => (
          <Link
            href={{
              pathname: "/BudgetDeatails",
              params: {
                categoryId: category.id,
                categoryName: category.name,
                categoryColor: category.color,
                categoryItemCount: category.category_item.length,
                categoryItemTotal: category.assigned_budget,
              },
            }}
            key={category.id}
            asChild
          >
            <TouchableOpacity style={styles.item}>
              <View
                style={{
                  ...styles.iconBox,
                  backgroundColor: category.color || "white",
                }}
              >
                <Text style={styles.icon}>{category.icon}</Text>
              </View>
              <View style={styles.details}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      textTransform: "uppercase",
                      fontFamily: "JostMedium",
                    }}
                  >
                    {category.name}
                  </Text>

                  <Text style={{ fontFamily: "Jost" }}>
                    {category.category_item.length} Items
                  </Text>
                </View>

                <View style={{ marginRight: Sizes.SM }}>
                  <Text style={{ fontSize: 16, fontFamily: "JostBold" }}>
                    ${category.assigned_budget}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.SM,
    gap: Sizes.SM * 0.7,
  },
  item: {
    flexDirection: "row",
    gap: Sizes.SM,
    padding: Sizes.SM,
    borderRadius: Sizes.MD,
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  iconBox: {
    padding: Sizes.MD,
    backgroundColor: "green",
    borderRadius: Sizes.SM,
    height: Sizes.XLG * 1.2,
    width: Sizes.XLG * 1.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: Sizes.MD * 1.2,
    fontFamily: "JostBold",
    color: Colors.WHITE,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
});
