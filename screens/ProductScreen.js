import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  TextInput
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import ProductItem from "../components/ProductItem";
import { getAllProducts, deleteProduct } from "../database/db";

export default function ProductScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.heading}>Inventory</Text>
        <Text style={styles.subheading}>Manage your products, pricing, and stock in one place.</Text>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("AddEditProduct", { mode: "add" })}
        >
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </Pressable>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products"
          placeholderTextColor="#98A2B3"
          style={styles.searchInput}
        />
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptyText}>
            Add a product or try a different search.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
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
  container: {
    flex: 1,
    padding: 16
  },
  topCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E7ECF3"
  },
  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: "#101828",
    marginBottom: 6
  },
  subheading: {
    color: "#667085",
    lineHeight: 21,
    marginBottom: 14
  },
  addButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#101828"
  },
  empty: {
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E7ECF3"
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 6
  },
  emptyText: {
    color: "#667085"
  }
});