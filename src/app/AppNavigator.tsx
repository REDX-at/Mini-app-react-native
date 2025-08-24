import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";

import { useAppDispatch, useAppSelector } from "../store";
import { initAuthThunk } from "../store/authSlice";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import PlaceholderScreen from "../screens/PlaceholderScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import { Ionicons } from "@expo/vector-icons"; // or 'react-native-vector-icons/Ionicons'

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Settings" component={PlaceholderScreen} />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { token, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(initAuthThunk());
  }, [dispatch]);
  if (!initialized) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <>
            <Stack.Screen
              name="AppTabs"
              component={AppTabs}
              options={{ headerShown: false }}
            />
            {/* product details pushed from Home */}

            <Stack.Screen
              name="ProductDetails"
              component={ProductDetailsScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
