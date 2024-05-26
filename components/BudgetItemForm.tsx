import {
  View,
  Text,
  // TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  // TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { PropsWithChildren } from "react";
import Sizes from "@/utils/Sizes";
import Colors from "@/utils/Colors";

type Props = PropsWithChildren<{
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
}>;

export default function BudgetItemForm({
  name,
  note,
  price,
  setNote,
  setPrice,
  setUrl,
  url,
  setName,
}: Props) {
  return (
    <View style={{ gap: Sizes.MD }}>
      <View style={styles.textInputContainer}>
        <Text style={styles.inputLabel}>Name*</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Product Name"
          placeholderTextColor={Colors.GRAY}
          onChangeText={setName}
          value={name}
        />
      </View>

      <View style={styles.textInputContainer}>
        <Text style={styles.inputLabel}>Price*</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="number-pad"
          placeholder="Product Price ($)"
          placeholderTextColor={Colors.GRAY}
          onChangeText={setPrice}
          value={price}
        />
      </View>

      <View style={styles.textInputContainer}>
        <Text style={styles.inputLabel}>Url</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Item Url"
          placeholderTextColor={Colors.GRAY}
          onChangeText={setUrl}
          value={url}
        />
      </View>

      <View style={styles.textInputContainer}>
        <Text style={styles.inputLabel}>Note</Text>
        <TextInput
          style={{ ...styles.textInput }}
          placeholder="additional Note"
          placeholderTextColor={Colors.GRAY}
          // multiline={true}
          // numberOfLines={3}
          onChangeText={setNote}
          value={note}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#000000",
    padding: Sizes.SM,
    paddingHorizontal: Sizes.MD,
    fontFamily: "Jost",
    flex: 1,
  },

  textInputContainer: {
    borderWidth: 1,
    borderRadius: Sizes.MD,
    borderColor: Colors.DARK_GRAY,
    backgroundColor: Colors.WHITE,
  },

  inputLabel: {
    paddingHorizontal: Sizes.MD,
    paddingTop: Sizes.SM,
    fontFamily: "JostMedium",
    fontSize: 16,
  },
});
