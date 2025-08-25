import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api";
import { useAppDispatch } from "../store";
import { logoutThunk } from "../store/authSlice";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await api.get("/auth/me");
        const user: string | null = (me?.data?.username as string) ?? null;
        setUsername(user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <SafeAreaView style={styles.container}>
      {username === null ? (
        <ActivityIndicator size="large" color="#555" />
      ) : (
        <View style={styles.profileBox}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.username}>{username}</Text>
          <TouchableOpacity onPress={() => handleLogout()}>
            <Text
              style={{
                color: "#fff",
                marginTop: 20,
                backgroundColor: "#E74C3C",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                fontWeight: "600",
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  profileBox: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 16,
    color: "#666",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
