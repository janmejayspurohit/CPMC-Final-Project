import { View, Text, Modal, TextInput, Button, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import ShowMap from "../components/ShowMap";
import NumericInput from "react-native-numeric-input";
import getDistance from "geolib/es/getDistance";
import { addRecords } from "../data/dataProvider";
import { useUserStore } from "../store/user";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const NewRide = () => {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [isOriginVisible, setOriginVisible] = useState(false);
  const [isDestinationVisible, setDestinationVisible] = useState(false);
  const [distance, setDistance] = useState(null);
  const { user } = useUserStore();
  const navigator = useNavigation();

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(0);
  const [isFlexible, setFlexible] = useState(false);
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});

  const onChange = (event, selectedDate) => {
    setShow(false);
    setStartDate(selectedDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const toggleOriginModal = () => {
    setOriginVisible(!isOriginVisible);
  };

  const toggleDestinationModal = () => {
    setDestinationVisible(!isDestinationVisible);
  };

  const handleSubmit = async () => {
    if (!name || !description || !startDate || !numberOfGuests || !origin.latitude || !destination.latitude) {
      Alert.alert("Missing data!", "Please fill all mandatory fields");
      return;
    }
    try {
      await addRecords("rides", [
        {
          name,
          description,
          startDate,
          numberOfGuests,
          isFlexible,
          origin,
          destination,
          createdBy: user.email,
          distance,
          participants: [user.email],
        },
      ]);
    } catch (error) {
      console.error("Error adding data to firestore:", error);
    } finally {
      setName("");
      setDescription("");
      setStartDate(new Date());
      setNumberOfGuests(0);
      setFlexible(false);
      setOrigin({});
      setDestination({});
      setDistance(null);
      Alert.alert("Success!", "Ride created successfully", [
        {
          text: "Okay",
          onPress: () =>
            navigator.navigate("rides", {
              screen: "Rides",
            }),
        },
      ]);
    }
  };

  const OriginMapPicker = () => {
    return (
      <View style={styles.modalContent}>
        <ShowMap setCoordinates={setOrigin} closeDialog={toggleOriginModal} />
      </View>
    );
  };

  const DestinationMapPicker = () => {
    return (
      <View style={styles.modalContent}>
        <ShowMap setCoordinates={setDestination} closeDialog={toggleDestinationModal} />
      </View>
    );
  };

  useEffect(() => {
    if (Object.keys(origin).length > 0 && Object.keys(destination).length > 0) {
      const dist = getDistance(origin, destination);
      setDistance(dist);
    }
  }, [origin, destination]);

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Trip name" value={name} onChangeText={(text) => setName(text)} />
      <TextInput style={styles.input} placeholder="Trip description" value={description} onChangeText={(text) => setDescription(text)} />
      <View style={styles.section}>
        <Button onPress={showDatepicker} title="Select date" />
        <Button onPress={showTimepicker} title="Select time" />
      </View>
      <View style={styles.section}>
        <Text>Selected Time: {startDate.toLocaleString()}</Text>
      </View>
      {show && <DateTimePicker testID="dateTimePicker" value={startDate} mode={mode} onChange={onChange} />}
      <View style={styles.section}>
        <View style={styles.section}>
          <Text>No. of guests</Text>
          <NumericInput
            value={numberOfGuests}
            totalWidth={100}
            iconStyle={{ color: "white" }}
            rightButtonBackgroundColor="green"
            leftButtonBackgroundColor="red"
            totalHeight={30}
            onChange={(value) => setNumberOfGuests(value)}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.paragraph}>Is flexible?</Text>
          <Checkbox style={styles.checkbox} value={isFlexible} onValueChange={setFlexible} />
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.section}>
          <Button title="Set Origin" onPress={toggleOriginModal} />
          {origin?.latitude && <FontAwesome5 name="check-circle" size={24} color="green" />}
        </View>
        <View style={styles.section}>
          <Button title="Set Destination" onPress={toggleDestinationModal} />
          {destination?.latitude && <FontAwesome5 name="check-circle" size={24} color="green" />}
        </View>
      </View>
      {distance && (
        <View style={styles.verticalSection}>
          {origin?.address && <Text>Origin: {origin.address}</Text>}
          {destination?.address && <Text>Destination: {destination.address}</Text>}
          <Text>Distance: {Math.round((distance / 1609) * 100) / 100} miles</Text>
          <Button
            title="Clear"
            onPress={() => {
              setOrigin({});
              setDestination({});
              setDistance(null);
            }}
          />
        </View>
      )}
      <Modal visible={isOriginVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <OriginMapPicker />
        </View>
      </Modal>
      <Modal visible={isDestinationVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <DestinationMapPicker />
        </View>
      </Modal>
      <View
        style={{
          marginVertical: 16,
        }}
      >
        <Button title="Create" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 8,
    justifyContent: "space-evenly",
  },
  verticalSection: {
    alignItems: "center",
    gap: 8,
    marginVertical: 8,
    justifyContent: "space-evenly",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    minWidth: "80%",
    minHeight: "80%",
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default NewRide;
