import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ViewProps,
} from "react-native";
import React, { useRef, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Svg, { Path } from "react-native-svg";
import { decode } from "base64-arraybuffer";
import Toast from "react-native-root-toast";
import { RootSiblingParent } from "react-native-root-siblings";

import Sizes from "../utils/Sizes";
import Colors from "../utils/Colors";
import BudgetItemForm from "../components/BudgetItemForm";
import { supabase } from "../utils/superbaseConfig";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

type ImageType = {
  base64: string | null | undefined;
  type: string | undefined;
};

export default function AddCategoryItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState<ImageType>();
  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState("");

  const local = useLocalSearchParams();
  const router = useRouter();

  async function uploadImage({
    base64,
  }: ImageType): Promise<string | undefined> {
    const fileName = String(Date.now());
    const { data, error } = await supabase.storage
      .from("BudgetItems")
      .upload(fileName, decode(String(base64)), {
        contentType: "image/png",
      });

    if (error) {
      Toast.show("Failed to upload image", {
        duration: Toast.durations.SHORT,
      });
      return;
    }
    return `https://awmsyamftplqmtyhczwr.supabase.co/storage/v1/object/public/BudgetItems/${fileName}`;
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      const uriArr = result.assets[0].uri.split(".");
      setImage({
        base64: result.assets[0].base64,
        type: uriArr[uriArr.length - 1],
      });
      setImagePreview(result.assets[0].uri);
    } else {
      Toast.show("Failed to load image, try again", {
        duration: Toast.durations.SHORT,
      });
    }
  };

  async function handleAddItem() {
    let imageUrl: string | undefined;
    if (!name.trim().length || !price.trim().length) {
      return;
    }

    setLoading(true);

    if (image) {
      imageUrl = await uploadImage(image);
    }

    if (!imageUrl && image) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("category_item")
      .insert([
        {
          name,
          url,
          cost: Number(price),
          note,
          category_id: Number(local.categoryId),
          icon: imageUrl,
        },
      ])
      .select();

    if (error) {
      setLoading(false);
      Toast.show(error.message, { duration: Toast.durations.SHORT });
      return;
    }

    router.replace({
      pathname: "/BudgetDeatails",
      params: {
        categoryId: local.categoryId,
      },
    });
  }

  const ref = useRef<View | null>(null);
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };

  return (
    <RootSiblingParent>
      <KeyboardAvoidingView
        keyboardVerticalOffset={100}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ padding: Sizes.MD }}
      >
        <ScrollView>
          <View style={styles.main}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              {imagePreview ? (
                <Image
                  source={{ uri: imagePreview }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <>
                  <Svg
                    width={40}
                    height={40}
                    fill={Colors.DARK_GRAY}
                    viewBox="0 0 24 24"
                  >
                    <Path d="M19.5 3h-15a3.003 3.003 0 0 0-3 3v12a3.003 3.003 0 0 0 3 3h15a3.004 3.004 0 0 0 3-3V6a3.003 3.003 0 0 0-3-3Zm-3.75 3a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5ZM4.5 19.5A1.5 1.5 0 0 1 3 18v-3.17l4.446-3.952a2.253 2.253 0 0 1 3.084.09l3.045 3.037L8.08 19.5H4.5ZM21 18a1.5 1.5 0 0 1-1.5 1.5h-9.299l5.692-5.692a2.237 2.237 0 0 1 2.89-.007L21 15.649V18Z" />
                  </Svg>
                  <Text
                    style={{
                      fontFamily: "JostMedium",
                      fontSize: 16,
                    }}
                  >
                    + Image
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <BudgetItemForm
              price={price}
              setPrice={setPrice}
              url={url}
              setUrl={setUrl}
              name={name}
              setName={setName}
              note={note}
              setNote={setNote}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          disabled={!price.trim() || !name.trim() || loading}
          style={{ ...styles.button, backgroundColor: String(local.color) }}
          onPress={handleAddItem}
        >
          <Text style={styles.buttonText}>Add</Text>
          {loading && <ActivityIndicator color={"white"} size={"small"} />}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "JostMedium",
    fontSize: 16,
  },
  button: {
    padding: Sizes.MD,
    marginBottom: Sizes.SM,
    borderRadius: Sizes.MD,
    overflow: "hidden",
    marginTop: Sizes.MD,
    flexDirection: "row",
    justifyContent: "center",
    gap: Sizes.MD,
  },
  imageContainer: {
    height: 120,
    width: 120,
    borderRadius: Sizes.MD,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.DARK_GRAY,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    gap: Sizes.MD,
    justifyContent: "center",
    marginBottom: Sizes.MD,
  },
});
