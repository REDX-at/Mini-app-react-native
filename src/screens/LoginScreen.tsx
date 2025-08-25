import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
        padding: 16,
        justifyContent: "center",
      }}
    >
      {/* Logo / Illustration */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
      </View>

      {/* Form */}
      <View style={{ marginBottom: 16 }}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{
            backgroundColor: "#FFFFFF",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E0E0E0",
            color: "#333333",
          }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={{
            backgroundColor: "#FFFFFF",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E0E0E0",
            color: "#333333",
          }}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#4A90E2",
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
        disabled={status === "loading"}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>
          {status === "loading" ? "Logging in..." : "LOGIN"}
        </Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <Text style={{ color: "#E74C3C", textAlign: "center", marginTop: 8 }}>
          {error}
        </Text>
      )}
    </SafeAreaView>
  );
}
