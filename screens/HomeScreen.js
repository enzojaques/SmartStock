import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, FlatList, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import LowStockBell from "../components/LowStockBell";
import { getLowStockProducts, getSummary } from "../database/db";

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();

  const [lowStock, setLowStock] = useState([]);
  const [summary, setSummary] = useState({
    saleCount: 0,
    totalSales: 0,
    totalProfit: 0
  });
  const [open, setOpen] = useState(false);

  async function loadData() {
    try {
      const [rows, summaryData] = await Promise.all([
        getLowStockProducts(3),
        getSummary()
      ]);
      setLowStock(rows);
      setSummary(summaryData);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <LowStockBell count={lowStock.length} onPress={() => setOpen(true)} />

      <Text style={styles.eyebrow}>Inventory made simple</Text>
      <Text style={styles.title}>Run your business smarter with SmartStock.</Text>
      <Text style={styles.subtitle}>
        Manage products, record sales, track profit, and stay ahead of low stock.
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{summary.saleCount}</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>${Number(summary.totalSales).toFixed(2)}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.featureCard}>
        <Text style={styles.featureLabel}>Total Profit</Text>
        <Text style={styles.featureValue}>${Number(summary.totalProfit).toFixed(2)}</Text>
        <Text style={styles.featureSub}>Based on all recorded sales.</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("Products")}>
        <Text style={styles.primaryButtonText}>Open Products</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Sales")}>
        <Text style={styles.secondaryButtonText}>Record a Sale</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Reports")}>
        <Text style={styles.secondaryButtonText}>View Reports</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Low stock alerts</Text>
          <Text style={styles.modalSub}>Items with 3 or fewer units remaining.</Text>

          {lowStock.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No low stock items 🎉</Text>
            </View>
          ) : (
            <FlatList
              data={lowStock}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30
  },
  eyebrow: {
    color: "#667085",
    fontWeight: "700",
    marginBottom: 10
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    color: "#101828",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: "#475467",
    marginBottom: 22
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7ECF3",
    shadowColor: "#101828",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#101828",
    marginBottom: 6
  },
  statLabel: {
    color: "#667085",
    fontWeight: "700"
  },
  featureCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18
  },
  featureLabel: {
    color: "#D0D5DD",
    fontWeight: "700",
    marginBottom: 10
  },
  featureValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 6
  },
  featureSub: {
    color: "#EAECF0"
  },
  primaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E7ECF3"
  },
  secondaryButtonText: {
    color: "#101828",
    fontSize: 16,
    fontWeight: "800"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    paddingTop: 60,
    paddingHorizontal: 18
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#101828"
  },
  modalSub: {
    color: "#667085",
    marginTop: 6,
    marginBottom: 18
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E7ECF3"
  },
  alertName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828"
  },
  alertMeta: {
    color: "#667085",
    marginTop: 4
  },
  alertAction: {
    fontWeight: "900",
    color: "#B42318"
  },
  closeBtn: {
    marginTop: 6,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20
  },
  closeText: {
    color: "#FFFFFF",
    fontWeight: "800"
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7ECF3"
  },
  emptyText: {
    color: "#475467",
    fontWeight: "700"
  }
});