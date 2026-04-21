import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, FlatList, ScrollView, Switch, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LowStockBell from "../components/LowStockBell";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { 
  getLowStockProducts, 
  getSummary, 
  getProfitByProduct, 
  getAllProducts, 
  getAllSales 
} from "../database/db";

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();

  const [lowStock, setLowStock] = useState([]);
  const [topProduct, setTopProduct] = useState(null);
  const [summary, setSummary] = useState({
    saleCount: 0,
    totalSales: 0,
    totalProfit: 0
  });
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Settings state
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState(3);

  async function loadSettings() {
    try {
      const theme = await AsyncStorage.getItem("darkMode");
      const threshold = await AsyncStorage.getItem("lowStockThreshold");
      
      if (theme !== null) setIsDarkMode(JSON.parse(theme));
      if (threshold !== null) setLowStockThreshold(JSON.parse(threshold));
    } catch (e) {
      console.log("Error loading settings:", e);
    }
  }

  async function saveDarkMode(value) {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem("darkMode", JSON.stringify(value));
      Toast.show({
        type: "success",
        text1: value ? "Dark mode enabled" : "Light mode enabled",
        position: "bottom",
        duration: 2000,
      });
    } catch (e) {
      console.log("Error saving theme:", e);
    }
  }

  async function saveLowStockThreshold(value) {
    try {
      setLowStockThreshold(value);
      await AsyncStorage.setItem("lowStockThreshold", JSON.stringify(value));
      Toast.show({
        type: "success",
        text1: `Low stock threshold set to ${value}`,
        position: "bottom",
        duration: 2000,
      });
    } catch (e) {
      console.log("Error saving threshold:", e);
    }
  }

  async function exportDatabase() {
    try {
      const dbPath = FileSystem.documentDirectory + "SQLite/smartstock.db";
      const timestamp = new Date().toISOString().split('T')[0];
      const backupUri = FileSystem.documentDirectory + `SmartStock_DB_${timestamp}.db`;

      await FileSystem.copyAsync({
        from: dbPath,
        to: backupUri,
      });

      const available = await Sharing.isAvailableAsync();

      if (!available) {
        Toast.show({
          type: "error",
          text1: "Sharing not available on this device",
          position: "bottom",
        });
        return;
      }

      await Sharing.shareAsync(backupUri);
      Toast.show({
        type: "success",
        text1: "Database exported successfully",
        position: "bottom",
      });

    } catch (e) {
      console.log("REAL EXPORT ERROR:", e);
      Toast.show({
        type: "error",
        text1: "Export failed",
        text2: e.message,
        position: "bottom",
      });
    }
  }

  async function loadData() {
    try {
      const [rows, summaryData, productData] = await Promise.all([
        getLowStockProducts(lowStockThreshold),
        getSummary(),
        getProfitByProduct()
      ]);

      setLowStock(rows);
      setSummary(summaryData);

      if (productData.length > 0) {
        setTopProduct(productData[0]);
      } else {
        setTopProduct(null);
      }

    } catch (e) {
      console.log(e);
      Toast.show({
        type: "error",
        text1: "Error loading data",
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused, lowStockThreshold]);

  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <LowStockBell count={lowStock.length} onPress={() => setOpen(true)} />
        <Pressable style={styles.settingsBtn} onPress={() => setSettingsOpen(true)}>
          <Text style={styles.settingsBtnText}>⚙️</Text>
        </Pressable>
      </View>

      <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>Inventory made simple</Text>
      <Text style={[styles.title, { color: colors.text }]}>Run your business smarter with SmartStock.</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Manage products, record sales, track profit, and stay ahead of low stock.
      </Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>{summary.saleCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sales</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>${Number(summary.totalSales).toFixed(2)}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Revenue</Text>
        </View>
      </View>

      <View style={[styles.featureCard, { backgroundColor: colors.featureBg }]}>
        <Text style={[styles.featureLabel, { color: colors.featureText }]}>Total Profit</Text>
        <Text style={[styles.featureValue, { color: colors.featureValueText }]}>${Number(summary.totalProfit).toFixed(2)}</Text>
        <Text style={[styles.featureSub, { color: colors.featureSubText }]}>Based on all recorded sales.</Text>
      </View>

      <View style={[styles.topProductCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.topProductLabel, { color: colors.textSecondary }]}>Top Product</Text>

        {topProduct ? (
          <>
            <Text style={[styles.topProductName, { color: colors.text }]}>{topProduct.name}</Text>
            <Text style={[styles.topProductMeta, { color: colors.textSecondary }]}>
              Profit: ${Number(topProduct.totalProfit).toFixed(2)} • Units Sold: {topProduct.unitsSold}
            </Text>
          </>
        ) : (
          <Text style={[styles.topProductMeta, { color: colors.textSecondary }]}>No data yet</Text>
        )}
      </View>

      <Pressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate("Products")}>
        <Text style={[styles.primaryButtonText, { color: colors.buttonText }]}>Open Products</Text>
      </Pressable>

      <Pressable style={[styles.secondaryButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate("Sales")}>
        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Record a Sale</Text>
      </Pressable>

      <Pressable style={[styles.secondaryButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate("Reports")}>
        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>View Reports</Text>
      </Pressable>

      <Pressable style={[styles.secondaryButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={exportDatabase}>
        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Export Database</Text>
      </Pressable>

      {/* Low Stock Modal */}
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBg }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Low stock alerts</Text>
          <Text style={[styles.modalSub, { color: colors.textSecondary }]}>Items with {lowStockThreshold} or fewer units remaining.</Text>

          {lowStock.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No low stock items 🎉</Text>
            </View>
          ) : (
            <FlatList
              data={lowStock}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.alertRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => {
                    setOpen(false);
                    navigation.navigate("AddEditProduct", { mode: "edit", id: item.id });
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alertName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.alertMeta, { color: colors.textSecondary }]}>Stock: {item.stockQty}</Text>
                  </View>
                  <Text style={styles.alertAction}>Fix</Text>
                </Pressable>
              )}
            />
          )}

          <Pressable style={[styles.closeBtn, { backgroundColor: colors.primary }]} onPress={() => setOpen(false)}>
            <Text style={[styles.closeText, { color: colors.buttonText }]}>Close</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={settingsOpen} animationType="slide" onRequestClose={() => setSettingsOpen(false)}>
        <View style={[styles.settingsContainer, { backgroundColor: colors.modalBg }]}>
          <View style={styles.settingsHeader}>
            <Text style={[styles.settingsTitle, { color: colors.text }]}>Settings</Text>
            <Pressable onPress={() => setSettingsOpen(false)}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          {/* Dark Mode Toggle */}
          <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Use dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={saveDarkMode}
              trackColor={{ false: "#D0D5DD", true: "#475467" }}
              thumbColor={isDarkMode ? "#FFFFFF" : "#667085"}
            />
          </View>

          {/* Low Stock Threshold */}
          <View style={[styles.settingSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Low Stock Threshold</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Alert when stock reaches this level</Text>
            
            <View style={styles.thresholdButtons}>
              {[1, 2, 3, 5, 10].map((num) => (
                <Pressable
                  key={num}
                  style={[
                    styles.thresholdBtn,
                    lowStockThreshold === num && styles.thresholdBtnActive,
                    lowStockThreshold === num && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => saveLowStockThreshold(num)}
                >
                  <Text
                    style={[
                      styles.thresholdBtnText,
                      lowStockThreshold === num && { color: "#FFFFFF" },
                      lowStockThreshold !== num && { color: colors.text }
                    ]}
                  >
                    {num}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            style={[styles.closeBtn, { backgroundColor: colors.primary, marginTop: 20 }]}
            onPress={() => setSettingsOpen(false)}
          >
            <Text style={[styles.closeText, { color: colors.buttonText }]}>Done</Text>
          </Pressable>
        </View>
      </Modal>

      <Toast />
    </ScrollView>
  );
}

const darkTheme = {
  bg: "#0F1419",
  card: "#1A1F2E",
  primary: "#FFFFFF",         // White button in dark mode
  buttonText: "#000000",      // Black text for that white button
  border: "#2D3748",
  text: "#FFFFFF",
  textSecondary: "#A0AEC0",
  featureBg: "#FFFFFF",
  featureText: "#1A1F2E",
  featureValueText: "#111827",
  featureSubText: "#475467",
  modalBg: "#0F1419",
};

const lightTheme = {
  bg: "#F6F8FB",
  card: "#FFFFFF",
  primary: "#111827",         // Black button in light mode
  buttonText: "#FFFFFF",      // White text for that black button
  border: "#E7ECF3",
  text: "#101828",
  textSecondary: "#667085",
  featureBg: "#111827",
  featureText: "#D0D5DD",
  featureValueText: "#FFFFFF",
  featureSubText: "#EAECF0",
  modalBg: "#F6F8FB",
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  settingsBtnText: {
    fontSize: 24,
  },
  eyebrow: {
    fontWeight: "700",
    marginBottom: 10
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 22
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowColor: "#101828",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6
  },
  statLabel: {
    fontWeight: "700"
  },
  featureCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 18
  },
  featureLabel: {
    fontWeight: "700",
    marginBottom: 10
  },
  featureValue: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 6
  },
  featureSub: {
    marginBottom: 10
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12
  },
primaryButtonText: {
    // REMOVE: color: "#FFFFFF", 
    fontSize: 16,
    fontWeight: "800"
  },
  closeText: {
    // REMOVE: color: "#FFFFFF",
    fontWeight: "800"
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "800"
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 18
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900"
  },
  modalSub: {
    marginTop: 6,
    marginBottom: 18
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  alertName: {
    fontSize: 16,
    fontWeight: "800",
  },
  alertMeta: {
    marginTop: 4
  },
  alertAction: {
    fontWeight: "900",
    color: "#B42318"
  },
  closeBtn: {
    marginTop: 6,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20
  },

  emptyBox: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1
  },
  emptyText: {
    fontWeight: "700"
  },
  topProductCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16
  },
  topProductLabel: {
    fontWeight: "700",
    marginBottom: 6
  },
  topProductName: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4
  },
  topProductMeta: {
    fontWeight: "600"
  },
  // Settings Modal Styles
  settingsContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: "900",
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  settingSection: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
    marginBottom: 12,
  },
  thresholdButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  thresholdBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E7ECF3",
  },
  thresholdBtnActive: {
    borderColor: "#111827",
  },
  thresholdBtnText: {
    fontWeight: "800",
    fontSize: 16,
  },
});