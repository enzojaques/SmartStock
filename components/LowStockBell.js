import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function LowStockBell({ count = 0, onPress }) {
  if (count <= 0) return null;

  return (
    <Pressable onPress={onPress} style={styles.wrap} hitSlop={10}>
      <Text style={styles.icon}>🔔</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.title}>Low stock</Text>
        <Text style={styles.sub}>{count} item{count === 1 ? "" : "s"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 50
  },
  icon: { fontSize: 18 },
  badge: {
    position: "absolute",
    top: -6,
    left: 10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#b00020"
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  box: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff"
  },
  title: { fontWeight: "900", fontSize: 12 },
  sub: { color: "#666", fontSize: 12, marginTop: 1 }
});
