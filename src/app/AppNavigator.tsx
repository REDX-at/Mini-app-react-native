import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "../screens/HomeScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import PlaceholderScreen from "../screens/PlaceholderScreen";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";

export type RootStackParamList = {
  Tabs: undefined;
  ProductDetails: { id: number };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // 🔴 hides the top header for ALL tabs

        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Rechercher":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Vendre":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "Notifications":
              iconName = focused ? "notifications" : "notifications-outline";
              break;
            case "Profil":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse"; // fallback
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF", // color for active tab
        tabBarInactiveTintColor: "gray", // color for inactive tab
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rechercher" component={PlaceholderScreen} />
      <Tab.Screen name="Vendre" component={PlaceholderScreen} />
      <Tab.Screen name="Notifications" component={PlaceholderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={AppTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
