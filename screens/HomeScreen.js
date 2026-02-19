// screens/HomeScreen.js
/* 
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartStock</Text>
      <Text style={styles.subtitle}>Inventory + Sales tracking</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Products")}>
        <Text style={styles.buttonText}>Products / Inventory</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Sales")}>
        <Text style={styles.buttonText}>Record a Sale</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Reports")}>
        <Text style={styles.buttonText}>Reports</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12
  },
  buttonText: { fontSize: 16, fontWeight: "600" }
});
*/



import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import LowStockBell from "../components/LowStockBell";
import { getLowStockProducts } from "../database/db";

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();

  const [lowStock, setLowStock] = useState([]);
  const [open, setOpen] = useState(false);

  async function loadLowStock() {
    try {
      const rows = await getLowStockProducts(3);
      setLowStock(rows);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isFocused) loadLowStock();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* Top-right notification box */}
      <LowStockBell
        count={lowStock.length}
        onPress={() => setOpen(true)}
      />

      <Text style={styles.title}>SmartStock</Text>
      <Text style={styles.subtitle}>Inventory + Sales tracking</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Products")}>
        <Text style={styles.buttonText}>Products / Inventory</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Sales")}>
        <Text style={styles.buttonText}>Record a Sale</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Reports")}>
        <Text style={styles.buttonText}>Reports</Text>
      </Pressable>

      {/* Modal “notification inbox” */}
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Low stock alerts</Text>
          <Text style={styles.modalSub}>
            Items at 3 or fewer units.
          </Text>

          {lowStock.length === 0 ? (
            <Text style={{ marginTop: 20, color: "#666" }}>No low stock items 🎉</Text>
          ) : (
            <FlatList
              data={lowStock}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.alertRow}
                  onPress={() => {
                    setOpen(false);
                    navigation.navigate("AddEditProduct", { mode: "edit", id: item.id });
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertName}>{item.name}</Text>
                    <Text style={styles.alertMeta}>Stock: {item.stockQty}</Text>
                  </View>
                  <Text style={styles.alertAction}>Fix</Text>
                </Pressable>
              )}
            />
          )}

          <Pressable style={styles.closeBtn} onPress={() => setOpen(false)}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12
  },
  buttonText: { fontSize: 16, fontWeight: "600" },

  modalContainer: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  modalTitle: { fontSize: 20, fontWeight: "900" },
  modalSub: { color: "#666", marginTop: 6, marginBottom: 16 },

  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  alertName: { fontSize: 16, fontWeight: "800" },
  alertMeta: { color: "#666", marginTop: 3 },
  alertAction: { fontWeight: "900", color: "#b00020" },

  closeBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    marginBottom: 20
  },
  closeText: { fontWeight: "800" }
});
