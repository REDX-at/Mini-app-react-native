import React from "react";
import { useAppSelector } from "../store";
import LoginScreen from "../screens/LoginScreen";
import AppNavigator from "./AppNavigator";

export default function AuthGate() {
  const token = useAppSelector((state) => state.auth.token);

  // If token exists → show app screens
  // If not → redirect to login stack
  return token ? <AppNavigator /> : <LoginScreen />;
}
