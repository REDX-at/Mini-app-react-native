import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchProducts } from "../store/productsSlice";
import { Product } from "../types/product";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/AppNavigator";
import { logoutThunk } from "../store/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Tabs"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutThunk());
  };
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
      style={{ padding: 12, borderBottomWidth: 1 }}
      onPress={() => navigation.navigate("ProductDetails", { id: item.id })}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={{ width: "100%", height: 200, marginVertical: 16 }}
      />
      <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Button title="Logout" onPress={handleLogout} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </SafeAreaView>
  );
}
