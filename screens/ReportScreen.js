import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { getSummary, getProfitByProduct } from "../database/db";

export default function ReportScreen() {
  const isFocused = useIsFocused();
  const [summary, setSummary] = useState({
    saleCount: 0,
    totalSales: 0,
    totalProfit: 0
  });
  const [products, setProducts] = useState([]);

  async function loadData() {
    try {
      const [summaryData, productData] = await Promise.all([
        getSummary(),
        getProfitByProduct()
      ]);
      setSummary(summaryData);
      setProducts(productData);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused]);

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      ListHeaderComponent={
        <>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Business reports</Text>
            <Text style={styles.heroSub}>
              Review your sales performance, profit, and top products.
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{summary.saleCount}</Text>
              <Text style={styles.summaryLabel}>Sales</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>${Number(summary.totalSales).toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Revenue</Text>
            </View>
          </View>

          <View style={styles.profitCard}>
            <Text style={styles.profitLabel}>Total Profit</Text>
            <Text style={styles.profitValue}>${Number(summary.totalProfit).toFixed(2)}</Text>
          </View>

          <Text style={styles.sectionTitle}>Profit by Product</Text>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <View style={styles.productTopRow}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productProfit}>${Number(item.totalProfit).toFixed(2)}</Text>
          </View>

          <Text style={styles.productMeta}>
            Units sold: {item.unitsSold} • Sales: ${Number(item.totalSales).toFixed(2)}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No report data yet</Text>
          <Text style={styles.emptyText}>Record sales to generate reports.</Text>
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
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7ECF3"
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#101828",
    marginBottom: 6
  },
  summaryLabel: {
    color: "#667085",
    fontWeight: "700"
  },
  profitCard: {
    backgroundColor: "#ECFDF3",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D1FADF",
    marginBottom: 18
  },
  profitLabel: {
    color: "#027A48",
    fontWeight: "800",
    marginBottom: 8
  },
  profitValue: {
    color: "#05603A",
    fontSize: 30,
    fontWeight: "900"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#101828",
    marginBottom: 12
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7ECF3",
    marginBottom: 12
  },
  productTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 8
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#101828"
  },
  productProfit: {
    color: "#027A48",
    fontWeight: "900"
  },
  productMeta: {
    color: "#667085",
    fontWeight: "600"
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