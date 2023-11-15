import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const SearchableInput = (props) => {
  const { placeholder = "Search Here..", value = "", onChange = (s) => {}, containerProps = {} } = props;

  const handleChange = (text) => onChange(text);

  return (
    <View style={[styles.container, containerProps.style]}>
      <View style={styles.inputGroup}>
        <FontAwesome5 name="search" size={20} color="lightgray" style={styles.icon} />
        <TextInput style={styles.input} value={value} onChangeText={handleChange} placeholder={placeholder} />
        <Pressable onPress={() => onChange("")}>
          <FontAwesome5 name="times" size={20} color="red" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputGroup: {
    backgroundColor: "white",
    margin: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
});

export default SearchableInput;
