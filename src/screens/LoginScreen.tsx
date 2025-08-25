import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "../store";
import { loginThunk } from "../store/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(loginThunk({ username, password }));
  };
  return (
    <SafeAreaView style={{ padding: 20 }}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button
        title={status === "loading" ? "Logging in..." : "Login"}
        onPress={handleLogin}
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </SafeAreaView>
  );
}
