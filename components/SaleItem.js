// components/SaleItem.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SaleItem({ item }) {
  const date = item.createdAt ? new Date(item.createdAt) : null;

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.productName || "Unknown product"}</Text>
        <Text style={styles.meta}>
          Qty: {item.qtySold} • Total: ${Number(item.total).toFixed(2)} • Profit: $
          {Number(item.profit).toFixed(2)}
        </Text>
        <Text style={styles.time}>
          {date ? date.toLocaleString() : item.createdAt}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 10
  },
  name: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  meta: { color: "#333", marginBottom: 6 },
  time: { color: "#666", fontSize: 12 }
});
