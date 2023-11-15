import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { styles } from "../styles";

const ShowMap = ({ setCoordinates, closeDialog }) => {
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 39.1682449,
    longitude: -86.5230073,
  });

  const handleMarkerDrag = (e) => {
    setMarkerPosition(e.nativeEvent.coordinate);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={3}
        autoFocus={true}
        returnKeyType={"search"}
        query={{ key: process.env.EXPO_PUBLIC_MAPS_API_KEY }}
        fetchDetails={true}
        onPress={(data, details = null) =>
          setMarkerPosition({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            address: details.formatted_address,
          })
        }
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log("no results")}
        debounce={300}
        listEmptyComponent={
          <View style={{ flex: 1 }}>
            <Text>No results were found</Text>
          </View>
        }
        styles={{
          container: {
            flex: 0,
          },
        }}
      />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 39.1682449,
          longitude: -86.5230073,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        region={{ ...markerPosition, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      >
        <Marker
          coordinate={markerPosition}
          title="Pin"
          description="Drag and drop to pick a place"
          draggable={true}
          onDragEnd={handleMarkerDrag}
        />
      </MapView>
      {closeDialog && (
        <Button
          title="Set"
          style={styles.rejectButton}
          onPress={() => {
            setCoordinates(markerPosition);
            closeDialog();
          }}
        />
      )}
    </View>
  );
};

export default ShowMap;
