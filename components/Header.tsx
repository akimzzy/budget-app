import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { client } from "../utils/KindeConfig";
import services from "../utils/services";
import Colors from "../utils/Colors";
import Sizes from "../utils/Sizes";

export default function Header() {
  const [user, setUser] =
    useState<Awaited<ReturnType<typeof client.getUserDetails>>>();
  const router = useRouter();

  const handleLogout = async () => {
    const loggedOut = await client.logout();

    if (loggedOut) {
      await services.storeData("login", "false");
      router.replace("/login");
    }
  };

  async function getUser() {
    const userDetails = await client.getUserDetails();
    setUser(userDetails);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.nav}>
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <View
          style={{
            height: 35,
            width: 35,
            backgroundColor: Colors.WHITE,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.3,
            borderColor: Colors.PRIMARY,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: Colors.PRIMARY,
              fontWeight: "500",
              textTransform: "uppercase",
            }}
          >
            {user?.given_name?.[0]}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 13 }}>Welcome back</Text>
          <Text
            style={{
              fontSize: 16,
              textTransform: "capitalize",
              fontFamily: "JostMedium",
            }}
          >
            {user?.given_name}
          </Text>
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          onPress={handleLogout}
        >
          <Ionicons name="exit" size={24} color="black" />
          <Text style={{ fontFamily: "JostMedium" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    paddingVertical: Sizes.SM,
    paddingHorizontal: Sizes.MD,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY,
  },
});
