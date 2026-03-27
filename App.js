import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, StatusBar } from "react-native";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import AddEditProductScreen from "./screens/AddEditProductScreen";
import SalesScreen from "./screens/SalesScreen";
import ReportScreen from "./screens/ReportScreen";

import { initDB } from "./database/db";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F6F8FB",
    card: "#FFFFFF",
    text: "#101828",
    border: "#E7ECF3",
    primary: "#111827"
  }
};

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState("");

  useEffect(() => {
    async function start() {
      try {
        await initDB();
        setDbReady(true);
      } catch (err) {
        console.log("DB init error:", err);
        setDbError(err?.message || "Database failed to initialize.");
      }
    }
    start();
  }, []);

  if (dbError) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#F6F8FB" }}>
        <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 10, color: "#101828" }}>
          SmartStock couldn’t start
        </Text>
        <Text style={{ marginBottom: 12, color: "#475467", lineHeight: 22 }}>{dbError}</Text>
        <Text style={{ color: "#667085" }}>
          Most common cause: expo-sqlite isn’t installed yet.
        </Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F6F8FB" }}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{ marginTop: 12, color: "#475467", fontWeight: "600" }}>Loading SmartStock…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { fontWeight: "800", color: "#101828" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#F6F8FB" }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "SmartStock" }} />
        <Stack.Screen name="Products" component={ProductScreen} options={{ title: "Products" }} />
        <Stack.Screen
          name="AddEditProduct"
          component={AddEditProductScreen}
          options={{ title: "Add / Edit Product" }}
        />
        <Stack.Screen name="Sales" component={SalesScreen} options={{ title: "Sales" }} />
        <Stack.Screen name="Reports" component={ReportScreen} options={{ title: "Reports" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}