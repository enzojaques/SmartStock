// screens/SalesScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  TextInput,
  Modal,
  Alert
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import SaleItem from "../components/SaleItem";
import { getAllProducts, getAllSales, recordSale } from "../database/db";

export default function SalesScreen() {
  const isFocused = useIsFocused();

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qtySold, setQtySold] = useState("");

  const [pickerOpen, setPickerOpen] = useState(false);

  async function loadData() {
    try {
      const p = await getAllProducts();
      const s = await getAllSales();
      setProducts(p);
      setSales(s);

      // If selected product was deleted, clear it
      if (selectedProduct) {
        const stillExists = p.find((x) => x.id === selectedProduct.id);
        if (!stillExists) setSelectedProduct(null);
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not load sales data.");
    }
  }

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused]);

  function validate() {
    if (!selectedProduct) return "Select a product first.";
    const qty = parseInt(qtySold, 10);
    if (!Number.isFinite(qty) || qty <= 0) return "Quantity must be greater than 0.";
    return "";
  }

  async function handleRecordSale() {
    const err = validate();
    if (err) {
      Alert.alert("Fix this", err);
      return;
    }

    try {
      await recordSale({
        productId: selectedProduct.id,
        qtySold: parseInt(qtySold, 10)
      });

      setQtySold("");
      await loadData();
      Alert.alert("Saved", "Sale recorded and stock updated.");
    } catch (e) {
      console.log(e);
      Alert.alert("Could not record sale", e?.message || "Try again.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Record Sale</Text>

      <Text style={styles.label}>Product</Text>
      <Pressable style={styles.selectBtn} onPress={() => setPickerOpen(true)}>
        <Text style={styles.selectText}>
          {selectedProduct ? selectedProduct.name : "Tap to select a product"}
        </Text>
      </Pressable>

      {selectedProduct ? (
        <Text style={styles.smallMeta}>
          Stock: {selectedProduct.stockQty} • Sell: $
          {Number(selectedProduct.sellingPrice).toFixed(2)}
        </Text>
      ) : null}

      <Text style={styles.label}>Quantity Sold</Text>
      <TextInput
        value={qtySold}
        onChangeText={setQtySold}
        placeholder="0"
        style={styles.input}
        keyboardType="number-pad"
      />

      <Pressable style={styles.saveBtn} onPress={handleRecordSale}>
        <Text style={styles.saveBtnText}>Save Sale</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Recent Sales</Text>

      {sales.length === 0 ? (
        <Text style={styles.empty}>No sales yet.</Text>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <SaleItem item={item} />}
        />
      )}

      {/* Simple Product Picker Modal (no extra libraries) */}
      <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a product</Text>

          {products.length === 0 ? (
            <View style={{ padding: 16 }}>
              <Text style={{ fontWeight: "700", marginBottom: 6 }}>No products found</Text>
              <Text style={{ color: "#666" }}>
                Add products first in the Products screen.
              </Text>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedProduct(item);
                    setPickerOpen(false);
                  }}
                >
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.modalItemMeta}>Stock: {item.stockQty}</Text>
                </Pressable>
              )}
            />
          )}

          <Pressable style={styles.modalCloseBtn} onPress={() => setPickerOpen(false)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 16 },

  label: { fontWeight: "700", marginTop: 12, marginBottom: 6 },
  selectBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  selectText: { fontWeight: "700" },
  smallMeta: { marginTop: 8, color: "#666" },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },

  saveBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center"
  },
  saveBtnText: { fontSize: 16, fontWeight: "800" },

  sectionTitle: { marginTop: 22, marginBottom: 10, fontSize: 18, fontWeight: "800" },
  empty: { color: "#666" },

  modalContainer: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  modalTitle: { fontSize: 20, fontWeight: "900", marginBottom: 12 },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  modalItemName: { fontSize: 16, fontWeight: "800" },
  modalItemMeta: { color: "#666", marginTop: 4 },

  modalCloseBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    marginBottom: 20
  },
  modalCloseText: { fontWeight: "800" }
});
