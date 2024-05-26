import Colors from "@/utils/Colors";
import Sizes from "@/utils/Sizes";
import React, { useCallback, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
import { ExternalLink } from "./ExternalLink";

const SwipeableRow = ({
  children,
  lastItem,
  deleteItem,
  link,
}: {
  children: React.ReactNode;
  lastItem: boolean;
  deleteItem: () => Promise<void>;
  link?: string | null;
}) => {
  const height = new Animated.Value(81);

  const animatedDelete = () => {
    Animated.timing(height, {
      toValue: 0,
      duration: 350,
      useNativeDriver: false,
    }).start(() => deleteItem());
  };

  const swipableRef = useRef<Swipeable>(null);

  const renderLeftActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const transX = dragX.interpolate({
        inputRange: [0, link ? 190 : 95],
        outputRange: [-51.5, -150],
      });

      return (
        <Animated.View
          style={[
            {
              flexDirection: "row",
              gap: Sizes.SM * 0.5,
              alignItems: "center",
            },
            { transform: [{ translateX: transX }] },
          ]}
        >
          {link && (
            <ExternalLink
              style={[
                {
                  ...styles.leftAction,
                  backgroundColor: "#dffcde",
                  overflow: "hidden",
                },
              ]}
              href={link}
            >
              <Ionicons name="link" size={20} color="green" />
            </ExternalLink>
          )}

          <RectButton
            onPress={() => {
              animatedDelete();
            }}
          >
            <Animated.View
              style={[{ ...styles.leftAction, backgroundColor: "#fcdedf" }]}
            >
              <Ionicons name="trash-sharp" size={20} color="red" />
            </Animated.View>
          </RectButton>
        </Animated.View>
      );
    },
    []
  );

  return (
    <Swipeable
      rightThreshold={-200}
      containerStyle={{
        marginBottom: lastItem ? 100 : 0,
        height,
      }}
      renderRightActions={renderLeftActions}
      ref={swipableRef}
    >
      <Pressable onPress={() => swipableRef.current?.openRight?.()}>
        {children}
      </Pressable>
    </Swipeable>
  );
};

export default SwipeableRow;

const styles = StyleSheet.create({
  leftAction: {
    // width: 100,
    padding: Sizes.MD,
    justifyContent: "center",
    borderRadius: Sizes.SM * 1.5,
    // height: "100%",
  },
});
