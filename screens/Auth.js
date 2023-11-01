import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Auth = ({ promptAsync }) => {
  // cpmcpro
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{
          backgroundColor: "#4285F4",
          padding: 10,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 80,
          marginBottom: 150,
        }}
        onPress={() => promptAsync()}
      >
        <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}>Sign In with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Auth;
