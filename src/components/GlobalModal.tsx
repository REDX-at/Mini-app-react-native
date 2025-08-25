import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
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
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown}
      style={styles.overlay}
    >
      <View style={styles.modal}>
        <Text style={styles.title}>Edit Product Title</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Enter new title"
          placeholderTextColor="#999"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => dispatch(closeModal())}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    marginBottom: 20,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#333333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  cancelText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#4A90E2",
  },
  saveText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
