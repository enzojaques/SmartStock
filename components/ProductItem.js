// components/ProductItem.js
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function ProductItem({ item, onPress, onDelete }) {
  const lowStock = item.stockQty <= 3;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          Cost: ${Number(item.costPrice).toFixed(2)} • Sell: ${Number(item.sellingPrice).toFixed(2)}
        </Text>
        <Text style={[styles.stock, lowStock && styles.lowStock]}>
          Stock: {item.stockQty}
          {lowStock ? " (LOW)" : ""}
        </Text>
      </View>

      <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={10}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 10
  },
  name: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  meta: { color: "#666", marginBottom: 6 },
  stock: { fontWeight: "700" },
  lowStock: { color: "#b00020" },
  deleteBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  deleteText: { color: "#b00020", fontWeight: "700" }
});
