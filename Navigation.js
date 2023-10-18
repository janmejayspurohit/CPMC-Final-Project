import * as React from "react";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import Home from "./screens/Home";
import Rides from "./screens/Rides";
import Profile from "./screens/Profile";

// Tabs
const Tab = createBottomTabNavigator();

function TabsGroup({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "settings" : "ios-settings-sharp";
          } else if (route.name === "rides") {
            iconName = focused ? "ios-notifications" : "notifications-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1DA1F2",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          headerLeft: () => (
            <Pressable
              onPress={() => {
                // navigation.openDrawer()
              }}
            >
              <Image
                source={require("./assets/icon.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  marginLeft: 15,
                }}
              />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen name="rides" component={Rides} />
      <Tab.Screen name="profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const theme = useColorScheme();
  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <TabsGroup />
    </NavigationContainer>
  );
}
