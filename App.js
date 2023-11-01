import "react-native-gesture-handler";
import Navigation from "./Navigation";
import Auth from "./screens/Auth";
import { useEffect, useState } from "react";
// Firebase imports
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import { auth } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
// Store imports
import { useUserStore } from "./store/user";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  });

  const getLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUser(userData);
    } catch (e) {
      console.log(e, "Error getting local user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    getLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        console.log(JSON.stringify(user, null, 2));
        setUser(user);
      }
    });
    return () => unsub();
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );

  return user?.email ? <Navigation /> : <Auth promptAsync={promptAsync} />;
}
