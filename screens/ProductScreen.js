// screens/ProductScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import ProductItem from "../components/ProductItem";
import { getAllProducts, deleteProduct } from "../database/db";

export default function ProductScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not load products.");
    }
  }

  useEffect(() => {
    if (isFocused) loadProducts();
  }, [isFocused]);

  function confirmDelete(id) {
    Alert.alert("Delete product?", "This will also delete its sales history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            loadProducts();
          } catch (e) {
            console.log(e);
            Alert.alert("Error", "Could not delete product.");
          }
        }
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("AddEditProduct", { mode: "add" })}
      >
        <Text style={styles.addButtonText}>+ Add Product</Text>
      </Pressable>

      {products.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No products yet</Text>
          <Text style={styles.emptyText}>Tap “Add Product” to create your first item.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductItem
              item={item}
              onPress={() => navigation.navigate("AddEditProduct", { mode: "edit", id: item.id })}
              onDelete={() => confirmDelete(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12
  },
  addButtonText: { fontSize: 16, fontWeight: "700" },
  empty: { marginTop: 30, padding: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  emptyText: { color: "#666" }
});
