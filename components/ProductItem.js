import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";

export default function ProductItem({ item, onPress, onDelete }) {
  const lowStock = item.stockQty <= 3;
  const margin = Number(item.sellingPrice) - Number(item.costPrice);


  return (
    <Pressable style={styles.card} onPress={onPress}>


     {/* image */} 
{item.imageUri ? (
  <Image
    source={{ uri: item.imageUri }}
    style={styles.image}
    resizeMode="cover"
  />
) : (
  <View style={styles.placeholder}>
    <Text>📦</Text>
  </View>



)}

      {/* Content */}
      <View style={styles.content}>
        
        {/* Top row */}
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={[styles.status, lowStock && styles.low]}>
            {lowStock ? "Low" : "In Stock"}
          </Text>
        </View>

        {/* Prices */}
        <Text style={styles.meta}>
          ${item.costPrice} → ${item.sellingPrice}
        </Text>

        {/* Bottom row */}
        <View style={styles.rowBottom}>
          <Text style={styles.stock}>Stock {item.stockQty}</Text>
          <Text style={styles.margin}>${margin.toFixed(2)}</Text>
        </View>
      </View>

      {/* Delete */}
      <Pressable onPress={onDelete}>
        <Text style={styles.delete}>✕</Text>
      </Pressable>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee"
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
      backgroundColor: "#eee"

  },

  placeholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center"
  },

  content: {
    flex: 1
  },

  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginRight: 6
  },

  status: {
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "600"
  },

  low: {
    color: "#dc2626"
  },

  meta: {
    color: "#666",
    fontSize: 13,
    marginTop: 4
  },

  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6
  },

  stock: {
    fontWeight: "600",
    color: "#333"
  },

  margin: {
    fontWeight: "700",
    color: "#16a34a"
  },

  delete: {
    marginLeft: 10,
    fontSize: 18,
    color: "#dc2626",
    fontWeight: "700"
  }
});