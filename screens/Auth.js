import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Auth = ({ promptAsync }) => {
  // cpmcpro
  return (
    <ImageBackground
      source={{
        uri: "https://garden.spoonflower.com/c/4266593/p/f/m/2dvpxz8hjuBV4vsqcneBcSamHW0Lf1o7BUjnJrLo60d1w7PELzoMOuSO/Retro%20Cars%20Dark%20Blue%20and%20Black.jpg",
      }}
      resizeMode="repeat"
      style={styles.image}
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20, backgroundColor: "#c3e9f1", borderRadius: 10, padding: 5 }}>
            Ride Share
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 20, backgroundColor: "#c3e9f1", borderRadius: 10, padding: 5 }}>
            Welcome to the ride share app!
          </Text>
          <Text
            style={{
              fontSize: 18,
              marginBottom: 20,
              marginTop: -10,
              backgroundColor: "#c3e9f1",
              borderRadius: 10,
              padding: 5,
            }}
          >
            You can hitch a ride or create one!
          </Text>
          <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: "bold", backgroundColor: "#c3e9f1", borderRadius: 10, padding: 5 }}>
            Sign in to continue
          </Text>
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
              width: 200,
            }}
            onPress={() => promptAsync()}
          >
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}>Sign In with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    alignItems: "center",
    margin: 10,
    padding: 10,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default Auth;
