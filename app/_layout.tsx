import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Jost: require("../assets/fonts/Jost-Regular.ttf"),
    JostMedium: require("../assets/fonts/Jost-Medium.ttf"),
    JostBold: require("../assets/fonts/Jost-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="addNewCategory"
          options={{
            headerTitle: "Create budget",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="BudgetDeatails"
          options={{
            headerTitle: "Budget",
            headerShown: true,
            contentStyle: { backgroundColor: "white" },
            headerLeft: () => (
              <Link href={{ pathname: "/(tabs)" }} asChild>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="AddCategoryItem"
          options={{
            headerTitle: "Add item",
            headerShown: true,
            contentStyle: { backgroundColor: "white" },
          }}
        />

        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  );
}
