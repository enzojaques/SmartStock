// App.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, Button } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import AddEditProductScreen from "./screens/AddEditProductScreen";
import SalesScreen from "./screens/SalesScreen";
import ReportScreen from "./screens/ReportScreen";

import { initDB } from "./database/db";

const Stack = createNativeStackNavigator();

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
      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
          SmartStock couldn’t start
        </Text>
        <Text style={{ marginBottom: 20 }}>{dbError}</Text>
        <Text style={{ color: "#666" }}>
          Most common cause: expo-sqlite isn’t installed yet.
        </Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading SmartStock…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
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
