import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, Alert } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { deleteRecord, getAllRecords, updateRecord } from "../data/dataProvider";
import { useUserStore } from "../store/user";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Rides = () => {
  const [rides, setRides] = useState([]);
  const { user } = useUserStore();
  const myRides = rides.filter((ride) => ride.participants?.includes(user.email));
  const navigation = useNavigation();

  const fetchData = async () => {
    const data = await getAllRecords("rides");
    setRides(data);
  };

  useFocusEffect(() => {
    fetchData();
  });

  return (
    <View style={styles.container}>
      {myRides.length > 0 ? (
        <FlatList
          data={myRides}
          keyExtractor={(r) => r.id}
          renderItem={({ item: ride }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{ride.name}</Text>
              <Text style={styles.description}>Description: {ride.description}</Text>
              <Text style={styles.detail}>
                Date: {new Date(ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000).toLocaleString()}
              </Text>
              <Text style={styles.detail}>Origin: {ride.origin.address}</Text>
              <Text style={styles.detail}>Destination: {ride.destination.address}</Text>
              <Text style={styles.detail}>Distance: {Math.round((ride.distance / 1609) * 100) / 100} miles</Text>
              <Text style={styles.detail}>
                Number of Guests: {ride.participants.length} out of {ride.numberOfGuests}
              </Text>
              <Text style={styles.detail}>Is Flexible: {ride.isFlexible ? "Yes" : "No"}</Text>
              {ride.participants?.includes(user.email) && ride.createdBy !== user.email && (
                <Button
                  title="Leave Ride"
                  onPress={() =>
                    Alert.alert(
                      "Confirm leave?",
                      `Are you sure you want to leave this ride to ${ride.destination.address} on ${new Date(
                        ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000
                      ).toLocaleString()}?`,
                      [
                        {
                          text: "Okay",
                          onPress: () => {
                            updateRecord("rides", ride.id, {
                              participants: ride.participants.filter((r) => r !== user.email),
                            });
                          },
                        },
                        {
                          text: "Cancel",
                          onPress: () => {},
                        },
                      ]
                    )
                  }
                />
              )}
              {ride.participants?.includes(user.email) && ride.createdBy === user.email && (
                <Button
                  title="Delete Ride"
                  onPress={() =>
                    Alert.alert(
                      "Confirm delete?",
                      `Are you sure you want to delete this ride to ${ride.destination.address} on ${new Date(
                        ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000
                      ).toLocaleString()}?`,
                      [
                        {
                          text: "Okay",
                          onPress: () => {
                            deleteRecord("rides", ride.id);
                          },
                        },
                        {
                          text: "Cancel",
                          onPress: () => {},
                        },
                      ]
                    )
                  }
                />
              )}
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
        <Ionicons name="add-circle" size={64} color="#2296f3" />
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
