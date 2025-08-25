import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAppDispatch, useAppSelector } from "../store";
import { closeModal } from "../store/uiSlice";
import api from "../services/api";
import { fetchProducts, updateProduct } from "../store/productsSlice";

export default function GlobalModal() {
  const dispatch = useAppDispatch();
  const { visible, type, payload } = useAppSelector((s) => s.ui);

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (type === "editProductTitle" && payload) {
      setTitle(payload.title);
    }
  }, [type, payload]);

  if (!visible) return null;

  const handleSave = async () => {
    try {
      await api.patch(`/products/${payload.id}`, { title });
      dispatch(updateProduct({ id: payload.id, title }));
      dispatch(closeModal());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.label}>Edit Title:</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={() => dispatch(closeModal())} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  label: { fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 8,
    borderRadius: 6,
  },
});
