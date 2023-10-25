import { View, Text, Button } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../store/user";

const Profile = () => {
  const { user, setUser } = useUserStore();
  return (
    <View>
      <Text>Profile</Text>
      <Text>ID: {user.uid}</Text>
      <Text>Name: {user.displayName}</Text>
      <Text>Email: {user.email}</Text>
      <Button
        title="Sign Out"
        onPress={async () => {
          console.log("signing out");
          await signOut(auth);
          await AsyncStorage.removeItem("@user");
          setUser({});
        }}
      />
    </View>
  );
};

export default Profile;
