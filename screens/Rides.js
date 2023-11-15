import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, Alert, RefreshControl, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { deleteRecord, getAllRecords, updateRecord } from "../data/dataProvider";
import { useUserStore } from "../store/user";
import { useNavigation } from "@react-navigation/native";
import { useDebouncedEffect } from "../hooks/useDebounceEffect";
import SearchableInput from "../components/SearchableInput";
import { FontAwesome5 } from "@expo/vector-icons";

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUserStore();
  const navigation = useNavigation();

  // DEBOUNCED SEARCH
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const fetchData = async () => {
    setRefreshing(true);
    const data = await getAllRecords("rides");
    setRides(data.filter((ride) => ride.participants?.includes(user.email)));
    setRefreshing(false);
  };

  useDebouncedEffect(
    () => {
      if (!searchTerm || searchTerm.trim().length > 3) setDebouncedSearch(searchTerm);
    },
    500,
    [searchTerm]
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    if (debouncedSearch)
      setRides((prevRides) =>
        prevRides.filter(
          (ride) =>
            ride.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            ride.createdBy.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            ride.description.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      );
    else {
      setSearchTerm("");
      fetchData();
    }
  }, [debouncedSearch]);

  return (
    <View style={styles.container}>
      {rides.length > 0 && <SearchableInput value={searchTerm} onChange={setSearchTerm} />}
      {rides.length > 0 ? (
        <FlatList
          data={rides}
          keyExtractor={(r) => r.id}
          renderItem={({ item: ride }) => {
            const cRating = ride.ratings?.find((r) => r.user === user.email);
            return (
              <View style={styles.card}>
                <Text style={styles.title}>{ride.name}</Text>
                <Text style={styles.description}>Description: {ride.description}</Text>
                <Text style={styles.detail}>
                  Date: {new Date(ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000).toLocaleString()}
                </Text>
                <Text style={(styles.detail, styles.status(ride.status))}>Status: {ride.status}</Text>
                <Text style={styles.detail}>Created by: {ride.createdBy}</Text>
                <Text style={styles.detail}>Origin: {ride.origin.address}</Text>
                <Text style={styles.detail}>Destination: {ride.destination.address}</Text>
                <Text style={styles.detail}>Distance: {Math.round((ride.distance / 1609) * 100) / 100} miles</Text>
                <Text style={styles.detail}>
                  Number of Guests: {ride.participants.length} out of {ride.numberOfGuests}
                </Text>
                <Text style={styles.detail}>Is Flexible: {ride.isFlexible ? "Yes" : "No"}</Text>
                {ride.createdBy === user.email ? (
                  <View style={styles.buttonContainer}>
                    {ride.status === "INITIATED" && (
                      <Button
                        title="Start Ride"
                        onPress={() =>
                          Alert.alert(
                            "Confirm start?",
                            `Are you sure you want to start this ride to ${ride.destination.address} on ${new Date(
                              ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000
                            ).toLocaleString()}?`,
                            [
                              {
                                text: "Okay",
                                onPress: async () => {
                                  updateRecord("rides", ride.id, {
                                    status: "ONGOING",
                                  });
                                  await fetchData();
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
                    {ride.status === "ONGOING" && (
                      <Button
                        title="End Ride"
                        onPress={() =>
                          Alert.alert(
                            "Confirm end?",
                            `Are you sure you want to end this ride to ${ride.destination.address} on ${new Date(
                              ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000
                            ).toLocaleString()}?`,
                            [
                              {
                                text: "Okay",
                                onPress: async () => {
                                  updateRecord("rides", ride.id, {
                                    status: "COMPLETED",
                                  });
                                  await fetchData();
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
                    <Button
                      title="Delete Ride"
                      disabled={ride.status !== "INITIATED"}
                      onPress={() =>
                        Alert.alert(
                          "Confirm delete?",
                          `Are you sure you want to delete this ride to ${ride.destination.address} on ${new Date(
                            ride.startDate.seconds * 1000 + ride.startDate.nanoseconds / 1000000
                          ).toLocaleString()}?`,
                          [
                            {
                              text: "Okay",
                              onPress: async () => {
                                deleteRecord("rides", ride.id);
                                await fetchData();
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
                  </View>
                ) : (
                  <View style={styles.buttonContainer}>
                    {ride.status === "COMPLETED" ? (
                      <View style={{ flexDirection: "row", gap: 8, justifyContent: "space-around", alignItems: "center" }}>
                        {cRating ? (
                          <>
                            <Text>Rated {cRating.rating}</Text>
                            <FontAwesome5
                              name={cRating.rating === "good" ? "thumbs-up" : "thumbs-down"}
                              color={cRating.rating === "good" ? "green" : "red"}
                              size={20}
                              solid
                            />
                          </>
                        ) : (
                          <>
                            <Pressable
                              onPress={async () => {
                                updateRecord("rides", ride.id, {
                                  ratings: [
                                    ...ride.ratings,
                                    {
                                      user: user.email,
                                      rating: "good",
                                    },
                                  ],
                                });
                                await fetchData();
                              }}
                            >
                              <FontAwesome5 name="thumbs-up" size={20} color="green" />
                            </Pressable>
                            <Pressable
                              onPress={async () => {
                                updateRecord("rides", ride.id, {
                                  ratings: [
                                    ...ride.ratings,
                                    {
                                      user: user.email,
                                      rating: "bad",
                                    },
                                  ],
                                });
                                await fetchData();
                              }}
                            >
                              <FontAwesome5 name="thumbs-down" size={20} color="red" solid={false} />
                            </Pressable>
                          </>
                        )}
                      </View>
                    ) : (
                      ride.status === "INITIATED" && (
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
                                  onPress: async () => {
                                    updateRecord("rides", ride.id, {
                                      participants: ride.participants.filter((r) => r !== user.email),
                                    });
                                    await fetchData();
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
                      )
                    )}
                  </View>
                )}
              </View>
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
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
  status(state) {
    return {
      fontSize: 14,
      marginBottom: 4,
      color: state == "INITIATED" ? "orange" : state == "ONGOING" ? "blue" : "green",
    };
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 8,
  },
});

export default Rides;
