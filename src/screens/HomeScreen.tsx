import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchProducts } from "../store/productsSlice";
import { Product } from "../types/product";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Tabs"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const { items, loading, error, hasMore } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (items.length === 0) dispatch(fetchProducts());
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) dispatch(fetchProducts());
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 16,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        overflow: "hidden",
      }}
      onPress={() => navigation.navigate("ProductDetails", { id: item.id })}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={{ width: "100%", height: 200 }}
        resizeMode="cover"
      />
      <View style={{ padding: 12 }}>
        <Text style={{ fontWeight: "600", fontSize: 16, color: "#333333" }}>
          {item.title}
        </Text>
        <Text
          style={{
            color: "#777777",
            fontSize: 14,
            marginTop: 4,
          }}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 3,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
        }}
      >
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 70, height: 70 }}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-circle-outline" size={32} />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      {error && (
        <Text style={{ color: "#E74C3C", textAlign: "center", marginTop: 16 }}>
          {error}
        </Text>
      )}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
