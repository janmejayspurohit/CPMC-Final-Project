import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { getAllRecords } from "../data/dataProvider";
import { useUserStore } from "../store/user";

const Home = () => {
  const [rides, setRides] = useState([]);
  const { user } = useUserStore();

  const fetchData = async () => {
    const data = await getAllRecords("rides");
    setRides(data.filter((ride) => ride.createdBy !== user.email));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {rides.length === 0 && (
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
      {rides.map((ride) => (
        <Text key={ride.id}>{ride.name}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});

export default Home;
