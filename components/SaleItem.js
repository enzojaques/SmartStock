import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SaleItem({ item }) {
  const date = item.createdAt ? new Date(item.createdAt) : null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.productName || "Unknown product"}</Text>
        <View style={styles.profitBadge}>
          <Text style={styles.profitBadgeText}>+${Number(item.profit).toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.meta}>
        Qty {item.qtySold} • Total ${Number(item.total).toFixed(2)}
      </Text>

      <Text style={styles.time}>
        {date ? date.toLocaleString() : item.createdAt}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7ECF3",
    marginBottom: 12,
    shadowColor: "#101828",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 10
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#101828"
  },
  profitBadge: {
    backgroundColor: "#ECFDF3",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  profitBadgeText: {
    color: "#027A48",
    fontWeight: "800",
    fontSize: 12
  },
  meta: {
    color: "#475467",
    marginBottom: 6,
    fontWeight: "600"
  },
  time: {
    color: "#667085",
    fontSize: 12
  }
});