import { View, Text } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  return (
    <View>
      <Text>Profile</Text>
      <Button
        title="Sign Out"
        onPress={async () => {
          await signOut(auth);
          await AsyncStorage.removeItem("@user");
        }}
      />
    </View>
  )
}

export default Profile