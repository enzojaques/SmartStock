import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

export default function LowStockBell({ count = 0, onPress }) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>🔔</Text>
      </View>

      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "flex-end",
    marginBottom: 16
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#101828",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E7ECF3"
  },
  icon: {
    fontSize: 20
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#DC2626",
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800"
  }
});