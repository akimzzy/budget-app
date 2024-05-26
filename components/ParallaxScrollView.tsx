import type { PropsWithChildren } from "react";
import { RefreshControl } from "react-native";
import Animated from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type Props = PropsWithChildren<{
  refreshing?: boolean;
  refreshControl?: (() => void) | undefined;
  enableScroll?: boolean;
}>;

export default function ParallaxScrollView({
  children,
  refreshControl,
  refreshing,
  enableScroll = true,
}: Props) {
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <StatusBar style="dark" />
      {enableScroll ? (
        <Animated.ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing || false}
              onRefresh={refreshControl}
            />
          }
          scrollEventThrottle={16}
        >
          {children}
        </Animated.ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}
