import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getAllRecords } from "../data/dataProvider";
import { useUserStore } from "../store/user";
import { useNavigation } from "@react-navigation/native";

const Rides = () => {
  const [rides, setRides] = useState([]);
  const { user } = useUserStore();
  const myRides = rides.filter((ride) => ride.participants?.contains(user.email));
  const navigation = useNavigation();
  console.log("🚀 -> file: Rides.js:13 -> myRides:", myRides);

  const fetchData = async () => {
    const data = await getAllRecords("rides");
    setRides(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {myRides.length > 0 ? (
        <FlatList
          data={myRides}
          keyExtractor={(r) => r.email}
          renderItem={({ item: ride }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{ride.name}</Text>
              <Text style={styles.description}>Description: {ride.description}</Text>
              <Text style={styles.detail}>
                Date: {new Date(ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000).toLocaleString()}
              </Text>
              <Text style={styles.detail}>Origin: {ride.origin.address}</Text>
              <Text style={styles.detail}>Destination: {ride.destination.address}</Text>
              <Text style={styles.detail}>Distance: {ride.distance} meters</Text>
              <Text style={styles.detail}>Number of Guests: {ride.numberOfGuests}</Text>
              <Text style={styles.detail}>Is Flexible: {ride.isFlexible ? "Yes" : "No"}</Text>
            </View>
          )}
        />
      ) : (
        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          No rides found
        </Text>
      )}
      <TouchableOpacity onPress={() => navigation.navigate("NewRide")} style={styles.addRideButton}>
        <Ionicons name="add-circle" size={64} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  addRideButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "red",
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default Rides;
