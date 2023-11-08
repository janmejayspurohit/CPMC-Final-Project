import { View, Text, StyleSheet, FlatList, Button, Alert } from "react-native";
import React, { useState } from "react";
import { getAllRecords, updateRecord } from "../data/dataProvider";
import { useUserStore } from "../store/user";
import { useFocusEffect } from "@react-navigation/native";

const Home = () => {
  const [rides, setRides] = useState([]);
  const { user } = useUserStore();

  const fetchData = async () => {
    const data = await getAllRecords("rides");
    setRides(data.filter((ride) => !ride.participants?.includes(user.email)));
  };

  useFocusEffect(() => {
    fetchData();
  });

  return (
    <View style={styles.container}>
      {rides.length > 0 ? (
        <FlatList
          data={rides}
          keyExtractor={(r) => r.id}
          renderItem={({ item: ride }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{ride.name}</Text>
              <Text style={styles.description}>Description: {ride.description}</Text>
              <Text style={styles.detail}>
                Date: {new Date(ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000).toLocaleString()}
              </Text>
              <Text style={styles.detail}>Created by: {ride.createdBy}</Text>
              <Text style={styles.detail}>Origin: {ride.origin.address}</Text>
              <Text style={styles.detail}>Destination: {ride.destination.address}</Text>
              <Text style={styles.detail}>Distance: {Math.round((ride.distance / 1609) * 100) / 100} miles</Text>
              <Text style={styles.detail}>
                Number of Guests: {ride.participants.length} out of {ride.numberOfGuests}
              </Text>
              <Text style={styles.detail}>Is Flexible: {ride.isFlexible ? "Yes" : "No"}</Text>
              {ride.participants.length === ride.numberOfGuests ? (
                <Button disabled title="Full" />
              ) : (
                <Button
                  title="Join Ride"
                  onPress={() => {
                    return Alert.alert(
                      "Confirm join?",
                      `Are you sure you want to join this ride to ${ride.destination.address} on ${new Date(
                        ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000
                      ).toLocaleString()}?`,
                      [
                        {
                          text: "Okay",
                          onPress: () => {
                            updateRecord("rides", ride.id, {
                              participants: [...ride.participants, user.email],
                            });
                          },
                        },
                        {
                          text: "Cancel",
                          onPress: () => {},
                        },
                      ]
                    );
                  }}
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
          No new rides found
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
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

export default Home;
