import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../utils/Colors";
import { client } from "../../utils/KindeConfig";
import services from "../../utils/services";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function Login() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const token = await client.login();
      if (token) {
        await services.storeData("login", "true");
        router.replace("/");
      }
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <ParallaxScrollView enableScroll={false}>
      <View style={styles.container}>
        <View style={styles.imageMock}></View>
        <View style={styles.bottomView}>
          <Text style={styles.bottomViewHeading}>Personal Budget Planner</Text>
          <Text style={styles.paragraph}>
            Stay on Track, Event by Event: Your Personal Budget Planner App!
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={{ textAlign: "center", fontSize: 15 }}>
              Login/Signup
            </Text>
          </TouchableOpacity>
          <Text>
            * By login/signup you will agree to our terms and conditions.
          </Text>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: "auto",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    marginTop: 60,
    backgroundColor: Colors.WHITE,
    color: Colors.BLACK,
    padding: 15,
    borderRadius: 15,
  },
  container: {
    alignItems: "center",
    backgroundColor: "white",
  },
  bottomView: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.BLACK,
    paddingTop: 60,
    paddingBottom: 60,
    padding: 35,
    marginTop: -30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  bottomViewHeading: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.WHITE,
  },
  paragraph: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    color: Colors.GRAY,
  },
  imageMock: {
    height: 400,
    width: 200,
    borderRadius: 20,
    backgroundColor: Colors.GRAY,
    marginTop: 30,
    borderWidth: 2,
    borderColor: Colors.BLACK,
  },
});
