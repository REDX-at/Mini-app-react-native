import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchProducts } from "../store/productsSlice";
import { Product } from "../types/product";

export default function HomeScreen() {
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
    <TouchableOpacity style={{ padding: 12, borderBottomWidth: 1 }}>
      <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
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
    </View>
  );
}
