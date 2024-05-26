import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Sizes from "../utils/Sizes";
import Colors from "../utils/Colors";
import SelectColors from "../components/SelectColors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../utils/superbaseConfig";
import { client } from "../utils/KindeConfig";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";
import { useRouter } from "expo-router";

export default function addNewCategory() {
  const [color, setColor] = useState(Colors.PRIMARY);
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleAddCategory() {
    try {
      setLoading(true);
      const user = await client.getUserDetails();
      const { data, error } = await supabase
        .from("category")
        .insert([
          {
            name,
            icon,
            color,
            assigned_budget: Number(budget),
            created_by: user.email,
          },
        ])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      Toast.show("Category added successfully", {
        duration: Toast.durations.SHORT,
      });

      router.replace({
        pathname: "/BudgetDeatails",
        params: {
          categoryId: data[0].id,
          categoryName: data[0].name,
          categoryColor: data[0].color,
          categoryItemCount: 0,
          categoryItemTotal: data[0].assigned_budget,
        },
      });
    } catch (error) {
      let errorMessage: string;

      if (typeof error === "string") {
        errorMessage = error.toUpperCase();
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Toast.show("Failed to create category", {
        duration: Toast.durations.SHORT,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TextInput
            style={[styles.input, { backgroundColor: color }]}
            maxLength={2}
            onChangeText={setIcon}
            autoFocus
          >
            {icon}
          </TextInput>
        </View>
        <SelectColors color={color} setColor={setColor} />

        <View style={{ marginTop: Sizes.LG, gap: Sizes.MD }}>
          <View style={styles.textInput}>
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={24}
              color={Colors.DARK_GRAY}
            />
            <TextInput
              style={{ width: "100%" }}
              placeholder="Category Name"
              onChangeText={setName}
              value={name}
            />
          </View>

          <View style={styles.textInput}>
            <MaterialIcons
              name="attach-money"
              size={24}
              color={Colors.DARK_GRAY}
            />

            <TextInput
              style={{ width: "100%" }}
              placeholder="Total budget"
              keyboardType="numeric"
              onChangeText={setBudget}
              value={budget}
            />
          </View>

          <TouchableOpacity
            style={{
              borderRadius: Sizes.MD,
              overflow: "hidden",
              padding: Sizes.MD,
              backgroundColor: Colors.PRIMARY,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: Sizes.MD,
            }}
            disabled={!budget.length || !name.length || loading}
            onPress={handleAddCategory}
          >
            <Text
              style={{
                color: Colors.WHITE,
                textAlign: "center",
                fontFamily: "JostMedium",
                fontSize: 16,
              }}
            >
              Create{" "}
            </Text>
            {loading && <ActivityIndicator color={"white"} size={"small"} />}
          </TouchableOpacity>
        </View>
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: Sizes.LG,
  },
  input: {
    height: Sizes.XLG * 1.5,
    width: Sizes.XLG * 1.5,
    color: Colors.WHITE,
    borderWidth: 1,
    padding: 6,
    borderRadius: 50,
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "JostBold",
    letterSpacing: 2,
    fontSize: 30,
  },
  textInput: {
    borderWidth: 1,
    padding: Sizes.MD,
    flexDirection: "row",
    gap: Sizes.MD,
    borderRadius: Sizes.MD,
    borderColor: Colors.DARK_GRAY,
    backgroundColor: Colors.WHITE,
    fontSize: 16,
  },
});
