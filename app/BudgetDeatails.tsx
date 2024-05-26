import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  DimensionValue,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { RootSiblingParent } from "react-native-root-siblings";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

import Colors from "../utils/Colors";
import Sizes from "../utils/Sizes";
import { supabase } from "../utils/superbaseConfig";
import { client } from "../utils/KindeConfig";
import CategoryItems from "../components/CategoryItemList";
import { Category, CategoryItem } from "@/types";

export default function BudgetDeatails() {
  const local = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<Category>();
  const [loading, setLoading] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [percentage, setPercentage] = useState<DimensionValue>();
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  async function deleteBudget() {
    try {
      setDeleting(true);

      const { error: categoryItemError } = await supabase
        .from("category_item")
        .delete()
        .eq("category_id", Number(local.categoryId));

      if (categoryItemError) {
        throw new Error(categoryItemError.message);
      }

      const { error } = await supabase
        .from("category")
        .delete()
        .eq("id", Number(local.categoryId));

      if (error) {
        throw new Error(error.message);
      }

      Toast.show("Category added successfully", {
        duration: Toast.durations.SHORT,
      });

      setShowDeletePrompt(false);
      router.replace({ pathname: "(tabs)" });
    } catch (error) {
      console.log(error);
      Toast.show("Faled to delete budget", {
        duration: Toast.durations.SHORT,
      });
    } finally {
      setDeleting(false);
    }
  }

  function calculateTotal(items: CategoryItem[] = [], totalBudget: number) {
    let total = 0;
    items.forEach((item) => (total += item.cost));
    setTotalSpent(total);
    const perc = (total / totalBudget) * 100;
    setPercentage(`${perc}%`);
    return perc;
  }

  async function getCategory(loading = true) {
    try {
      setLoading(loading);
      const user = await client.getUserDetails();
      let { data, error } = await supabase
        .from("category")
        .select("*,category_item(*)")
        .eq("created_by", user.email)
        .eq("id", Number(local.categoryId))
        .order("created_at", { ascending: false });

      if (data?.[0]) {
        const { category_item, assigned_budget } = data[0];
        setCategory(data[0]);
        calculateTotal(category_item, assigned_budget);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <RootSiblingParent>
      <View style={{ padding: Sizes.MD, height: "100%" }}>
        <View style={{ gap: Sizes.LG }}>
          <View
            style={{
              flexDirection: "row",
              gap: Sizes.MD,
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 80,
                width: 80,
                borderRadius: Sizes.MD,
                backgroundColor: category?.color || String(local.categoryColor),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: Sizes.LG,
                  fontFamily: "JostBold",
                  color: Colors.WHITE,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {category?.icon}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  textTransform: "uppercase",
                  fontFamily: "JostBold",
                }}
              >
                {category?.name || local.categoryName}
              </Text>
              <Text style={{ fontFamily: "JostMedium", fontSize: 16 }}>
                {category?.category_item?.length || local.categoryItemCount}{" "}
                item
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                // Alert.alert("Alert Title", "My Alert Msg", [
                //   {
                //     text: "Cancel",
                //     onPress: () => console.log("Cancel Pressed"),
                //     style: "cancel",
                //   },
                //   { text: "OK", onPress: () => console.log("OK Pressed") },
                // ]);
                setShowDeletePrompt(true);
              }}
            >
              <Ionicons name="trash-sharp" size={24} color="red" />
            </TouchableOpacity>
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: Sizes.SM,
              }}
            >
              <Text style={{ fontFamily: "JostBold", fontSize: 16 }}>
                ${totalSpent}
              </Text>
              <Text
                style={{
                  fontFamily: "Jost",
                  fontSize: 16,
                }}
              >
                Total budget -{" "}
                <Text
                  style={{
                    fontFamily: "JostBold",
                    fontSize: 16,
                    marginLeft: Sizes.LG,
                  }}
                >
                  ${category?.assigned_budget || local.categoryItemTotal}
                </Text>
              </Text>
            </View>
            <View
              style={{
                height: 15,
                backgroundColor: Colors.GRAY,
                borderRadius: 99,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  backgroundColor:
                    category?.color || String(local.categoryColor),
                  position: "absolute",
                  height: "100%",
                  width: percentage,
                  borderRadius: 99,
                }}
              ></View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: Sizes.LG, flex: 1 }}>
          <CategoryItems
            items={category?.category_item}
            getCategory={getCategory}
            loading={loading}
          />

          <LinearGradient
            // colors={["transparent", "transparent", "#fff"]}
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
            style={{
              position: "absolute",
              bottom: -15,
              left: -25,
              width: "110%",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: Sizes.LG,
            }}
          >
            <Link
              asChild
              href={{
                pathname: `AddCategoryItem`,
                params: {
                  color: category?.color,
                  categoryId: local.categoryId,
                },
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: String(category?.color),
                  padding: Sizes.MD,
                  paddingLeft: Sizes.LG,
                  paddingRight: Sizes.LG,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: Sizes.SM,
                  borderRadius: Sizes.LG,
                  // marginTop: 20,
                }}
              >
                <FontAwesome5 name="plus" size={18} color="white" />
                <Text
                  style={{
                    color: Colors.WHITE,
                    backgroundColor: "transparent",
                    fontSize: 16,
                    fontFamily: "JostBold",
                  }}
                >
                  Add item
                </Text>
              </TouchableOpacity>
            </Link>
          </LinearGradient>
        </View>

        <Modal
          visible={showDeletePrompt}
          animationType="fade"
          transparent={true}
          style={{}}
        >
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              justifyContent: "flex-end",
              height: "100%",
              pointerEvents: deleting ? "none" : "auto",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: Sizes.MD,
                padding: Sizes.MD,
                paddingBottom: insets.bottom * 2,
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                style={{
                  position: "absolute",
                  zIndex: 1,
                  right: 0,
                  top: 0,
                  padding: Sizes.MD,
                }}
                onPress={() => {
                  setShowDeletePrompt(false);
                }}
              >
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>

              <View
                style={{
                  padding: Sizes.MD,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Jost", fontSize: 16 }}>
                  Are you sure you want to delete Budget?
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: Sizes.MD,
                }}
              >
                <TouchableOpacity
                  onPress={deleteBudget}
                  style={{
                    padding: Sizes.SM,
                    borderRadius: Sizes.MD,
                    paddingHorizontal: Sizes.LG,
                    borderWidth: 1,
                    borderColor: "white",
                    backgroundColor: "red",
                    flexDirection: "row",
                    gap: Sizes.SM,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "JostBold",
                      fontSize: 16,
                    }}
                  >
                    {!deleting ? "Yes" : "Deleting..."}
                  </Text>
                  {deleting && (
                    <ActivityIndicator size={"small"} color={"white"} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDeletePrompt(false)}
                  style={{
                    padding: Sizes.SM,
                    borderRadius: Sizes.MD,
                    paddingHorizontal: Sizes.LG,
                    borderWidth: 1,
                    borderColor: Colors.DARKER_GRAY,
                    backgroundColor: Colors.LIGHT_GRAY,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontFamily: "JostBold",
                      fontSize: 16,
                    }}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
});
