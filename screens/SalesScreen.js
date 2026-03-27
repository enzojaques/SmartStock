import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  FlatList,
  ScrollView
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import SaleItem from "../components/SaleItem";
import { getAllProducts, recordSale, getAllSales } from "../database/db";

export default function SalesScreen() {
  const isFocused = useIsFocused();

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [qtySold, setQtySold] = useState("");

  async function loadData() {
    try {
      const [productRows, salesRows] = await Promise.all([
        getAllProducts(),
        getAllSales()
      ]);
      setProducts(productRows);
      setSales(salesRows);

      if (!selectedProductId && productRows.length > 0) {
        setSelectedProductId(productRows[0].id);
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not load sales data.");
    }
  }

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  async function handleRecordSale() {
    if (!selectedProductId) {
      Alert.alert("Choose product", "Please select a product.");
      return;
    }

    if (!qtySold.trim()) {
      Alert.alert("Enter quantity", "Please enter the quantity sold.");
      return;
    }

    try {
      await recordSale({ productId: selectedProductId, qtySold });
      setQtySold("");
      await loadData();
      Alert.alert("Saved", "Sale recorded successfully.");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", e?.message || "Could not record sale.");
    }
  }

  return (
    <FlatList
      data={sales}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      ListHeaderComponent={
        <>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Record a sale</Text>
            <Text style={styles.heroSub}>
              Select a product, enter quantity, and SmartStock will update inventory automatically.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Select Product</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 4 }}
            >
              {products.map((item) => {
                const active = item.id === selectedProductId;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedProductId(item.id)}
                    style={[styles.productChip, active && styles.productChipActive]}
                  >
                    <Text style={[styles.productChipText, active && styles.productChipTextActive]}>
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {selectedProduct ? (
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedInfoText}>
                  Price ${Number(selectedProduct.sellingPrice).toFixed(2)} • Stock {selectedProduct.stockQty}
                </Text>
              </View>
            ) : null}

            <Text style={styles.label}>Quantity Sold</Text>
            <TextInput
              value={qtySold}
              onChangeText={setQtySold}
              placeholder="Enter quantity"
              placeholderTextColor="#98A2B3"
              keyboardType="number-pad"
              style={styles.input}
            />

            <Pressable style={styles.saveBtn} onPress={handleRecordSale}>
              <Text style={styles.saveBtnText}>Save Sale</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Recent Sales</Text>
        </>
      }
      renderItem={({ item }) => <SaleItem item={item} />}
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No sales yet</Text>
          <Text style={styles.emptyText}>Your recorded sales will appear here.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 20,
    marginBottom: 14
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8
  },
  heroSub: {
    color: "#EAECF0",
    lineHeight: 22
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7ECF3",
    marginBottom: 18
  },
  label: {
    fontWeight: "800",
    color: "#101828",
    marginBottom: 8,
    marginTop: 4
  },
  productChip: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 10
  },
  productChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827"
  },
  productChipText: {
    color: "#344054",
    fontWeight: "700"
  },
  productChipTextActive: {
    color: "#FFFFFF"
  },
  selectedInfo: {
    backgroundColor: "#F2F4F7",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    marginBottom: 8
  },
  selectedInfoText: {
    color: "#475467",
    fontWeight: "700"
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#101828"
  },
  saveBtn: {
    marginTop: 18,
    backgroundColor: "#111827",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center"
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#101828",
    marginBottom: 12
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
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