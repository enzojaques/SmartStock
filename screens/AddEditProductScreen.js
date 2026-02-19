// screens/AddEditProductScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";

import { addProduct, getProductById, updateProduct } from "../database/db";

export default function AddEditProductScreen({ navigation, route }) {
  const mode = route?.params?.mode || "add"; // "add" or "edit"
  const editId = route?.params?.id;

  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockQty, setStockQty] = useState("");

  useEffect(() => {
    async function load() {
      if (mode === "edit" && editId) {
        try {
          const p = await getProductById(editId);
          if (!p) {
            Alert.alert("Not found", "This product no longer exists.");
            navigation.goBack();
            return;
          }
          setName(p.name ?? "");
          setCostPrice(String(p.costPrice ?? ""));
          setSellingPrice(String(p.sellingPrice ?? ""));
          setStockQty(String(p.stockQty ?? ""));
        } catch (e) {
          console.log(e);
          Alert.alert("Error", "Could not load product.");
        }
      }
    }
    load();
  }, [mode, editId]);

  function validate() {
    if (!name.trim()) return "Product name is required.";
    if (costPrice === "" || isNaN(Number(costPrice))) return "Cost price must be a number.";
    if (sellingPrice === "" || isNaN(Number(sellingPrice))) return "Selling price must be a number.";
    if (stockQty === "" || isNaN(Number(stockQty))) return "Stock quantity must be a number.";
    if (Number(stockQty) < 0) return "Stock quantity cannot be negative.";
    return "";
  }

  async function handleSave() {
    const err = validate();
    if (err) {
      Alert.alert("Fix this", err);
      return;
    }

    const payload = {
      name: name.trim(),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stockQty: parseInt(stockQty, 10)
    };

    try {
      if (mode === "edit" && editId) {
        await updateProduct(editId, payload);
        Alert.alert("Saved", "Product updated.");
      } else {
        await addProduct(payload);
        Alert.alert("Saved", "Product added.");
      }
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not save product.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.header}>{mode === "edit" ? "Edit Product" : "Add Product"}</Text>

        <Text style={styles.label}>Product Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Example: Coke Zero 12-pack"
          style={styles.input}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Cost Price</Text>
        <TextInput
          value={costPrice}
          onChangeText={setCostPrice}
          placeholder="0.00"
          style={styles.input}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Selling Price</Text>
        <TextInput
          value={sellingPrice}
          onChangeText={setSellingPrice}
          placeholder="0.00"
          style={styles.input}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Stock Quantity</Text>
        <TextInput
          value={stockQty}
          onChangeText={setStockQty}
          placeholder="0"
          style={styles.input}
          keyboardType="number-pad"
        />

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>

        <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 16 },
  label: { fontWeight: "700", marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  saveBtn: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center"
  },
  saveBtnText: { fontSize: 16, fontWeight: "800" },
  cancelBtn: { marginTop: 10, alignItems: "center", paddingVertical: 10 },
  cancelBtnText: { color: "#666", fontWeight: "700" }
});
