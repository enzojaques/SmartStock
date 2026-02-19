// screens/ReportScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { getSummary, getProfitByProduct } from "../database/db";

export default function ReportScreen() {
  const isFocused = useIsFocused();

  const [summary, setSummary] = useState({
    saleCount: 0,
    totalSales: 0,
    totalProfit: 0
  });

  const [byProduct, setByProduct] = useState([]);

  async function loadReports() {
    try {
      const s = await getSummary();
      const p = await getProfitByProduct();
      setSummary(s);
      setByProduct(p);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not load reports.");
    }
  }

  useEffect(() => {
    if (isFocused) loadReports();
  }, [isFocused]);


  ///////////////////////////////////



  async function exportDatabase() {
  try {
    const dbName = "smartstock.db";

    // expo-sqlite db lives here on device
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    const dbPath = `${sqliteDir}/${dbName}`;

    // copy to a shareable file path
    const exportPath = `${FileSystem.documentDirectory}${dbName}`;

    // Confirm the file exists
    const info = await FileSystem.getInfoAsync(dbPath);
    if (!info.exists) {
      Alert.alert(
        "Database not found",
        "I couldn’t find smartstock.db yet. Add a product first, then try again."
      );
      return;
    }

    // Copy it
    await FileSystem.copyAsync({ from: dbPath, to: exportPath });

    // Share it (keep it simple)
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert("Sharing not available", "This device can’t open the share sheet.");
      return;
    }

    await Sharing.shareAsync(exportPath);
  } catch (e) {
    console.log("EXPORT DB ERROR:", e);
    Alert.alert("Export failed", e?.message || "Could not export the database.");
  }
}




  ///////////////////////////



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Totals</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Sales count</Text>
          <Text style={styles.value}>{summary.saleCount}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total sales</Text>
          <Text style={styles.value}>${Number(summary.totalSales).toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total profit</Text>
          <Text style={[styles.value, styles.profit]}>
            ${Number(summary.totalProfit).toFixed(2)}
          </Text>
        </View>

        <Pressable style={styles.refreshBtn} onPress={loadReports}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
        
        <Pressable style={styles.refreshBtn} onPress={exportDatabase}>
          <Text style={styles.refreshText}>Export Database</Text>
        </Pressable>
        
      </View>

      <Text style={styles.sectionTitle}>Profit by product</Text>

      {byProduct.length === 0 ? (
        <Text style={styles.empty}>No products yet.</Text>
      ) : (
        <FlatList
          data={byProduct}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.productRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productMeta}>
                  Units sold: {item.unitsSold} • Sales: ${Number(item.totalSales).toFixed(2)}
                </Text>
              </View>
              <Text style={styles.productProfit}>
                ${Number(item.totalProfit).toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 16 },

  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 18
  },
  cardTitle: { fontSize: 16, fontWeight: "900", marginBottom: 10 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6
  },
  label: { color: "#666", fontWeight: "700" },
  value: { fontWeight: "900" },
  profit: { color: "#0a7a0a" },

  refreshBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center"
  },
  refreshText: { fontWeight: "800" },

  sectionTitle: { fontSize: 18, fontWeight: "900", marginBottom: 10 },
  empty: { color: "#666" },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  productName: { fontSize: 16, fontWeight: "800", marginBottom: 3 },
  productMeta: { color: "#666" },
  productProfit: { fontWeight: "900", color: "#0a7a0a" }
});
