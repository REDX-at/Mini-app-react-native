import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
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
  const productId = route.params.id;
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

  if (!product)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#E74C3C", fontSize: 16 }}>
          Product not found
        </Text>
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#123456",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      {/* Product Image */}
      <Image
        source={{ uri: productImage }}
        style={{ width: "100%", height: 280 }}
        resizeMode="cover"
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          marginTop: -24,
          padding: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -2 },
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#333333" }}>
          {product.title}
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: "#777777",
            marginTop: 12,
            lineHeight: 20,
          }}
        >
          {product.description}
        </Text>

        {/* Edit Button */}
        <TouchableOpacity
          onPress={() =>
            dispatch(openModal({ type: "editProductTitle", payload: product }))
          }
          style={{
            backgroundColor: "#4A90E2",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            Edit Title
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
