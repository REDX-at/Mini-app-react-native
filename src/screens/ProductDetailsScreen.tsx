import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, Button } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import api from "../services/api";
import { Product } from "../types/product";
import { RootStackParamList } from "../app/AppNavigator";
import { useAppDispatch, useAppSelector } from "../store";
import { openModal } from "../store/uiSlice";

type ProductDetailsRouteProp = RouteProp<RootStackParamList, "ProductDetails">;

export default function ProductDetailsScreen() {
  const dispatch = useAppDispatch();

  const route = useRoute<ProductDetailsRouteProp>();
  const { id } = route.params;
  const productId = route.params.id; // get product id from navigation
  const product = useAppSelector((state) =>
    state.products.items.find((p) => p.id === productId)
  );
  const [productImage, setProductImage] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        // setProduct(res.data);
        setProductImage(res.data.images[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!product) return <Text>Product not found</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{product.title}</Text>
      <Image
        source={{ uri: productImage }}
        style={{ width: "100%", height: 200, marginVertical: 16 }}
      />
      <Text>{product.description}</Text>
      <Button
        title="Edit Title"
        onPress={() =>
          dispatch(openModal({ type: "editProductTitle", payload: product }))
        }
      />
    </View>
  );
}
