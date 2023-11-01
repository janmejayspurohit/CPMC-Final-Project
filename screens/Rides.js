import { View, Text } from "react-native";
import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";

const Rides = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Rides</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -34.603738,
          longitude: -58.38157,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="Marker Title"
          description="Marker Description"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default Rides;
