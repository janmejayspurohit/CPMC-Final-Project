import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../store/user";

const Profile = () => {
  const { user, setUser } = useUserStore();

  const handleSignOut = async () => {
    console.log("Signing out");
    await signOut(auth);
    await AsyncStorage.removeItem("@user");
    setUser({});
  };

  return (
    user.email && (
      <View style={styles.container}>
        <Image source={user?.photoURL ? { uri: user.photoURL } : require("../assets/icon.png")} style={styles.profileImage} />
        <Text style={styles.text}>ID: {user.uid}</Text>
        <Text style={styles.text}>Name: {user.displayName}</Text>
        <Text style={styles.text}>Email: {user.email}</Text>
        {user?.lastLoginAt && <Text style={styles.text}>Last login at: {new Date(parseInt(user.lastLoginAt)).toLocaleString()}</Text>}
        <View
          style={{
            borderBottomColor: "lightgray",
            borderWidth: 0.5,
            marginVertical: 10,
            width: "100%",
          }}
        />
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 8,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "semibold",
  },
});

export default Profile;
