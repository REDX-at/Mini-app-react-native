import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import LoginScreen from "../screens/LoginScreen";
import AppNavigator from "./AppNavigator";
import { ActivityIndicator, View } from "react-native";
import { initAuthThunk } from "../store/authSlice";

export default function AuthGate() {
  const dispatch = useAppDispatch();
  const { initialized, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(initAuthThunk());
    }
  }, [dispatch, initialized]);

  // Show loading until initAuthThunk finishes
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If token exists → show app screens
  // If not → redirect to login stack
  return token ? <AppNavigator /> : <LoginScreen />;
}
