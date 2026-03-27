import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { addProduct, getProductById, updateProduct } from "../database/db";

export default function AddEditProductScreen({ navigation, route }) {
  const mode = route?.params?.mode || "add";
  const editId = route?.params?.id;

  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    async function load() {
      if (mode === "edit" && editId) {
        try {
          const p = await getProductById(editId);
          if (!p) {
            Alert.alert("Not found", "This product no longer exists.");
            navigation.goBack();
            return;
          }
          setName(p.name ?? "");
          setCostPrice(String(p.costPrice ?? ""));
          setSellingPrice(String(p.sellingPrice ?? ""));
          setStockQty(String(p.stockQty ?? ""));
          setImageUri(p.imageUri ?? null);
        } catch (e) {
          console.log(e);
          Alert.alert("Error", "Could not load product.");
        }
      }
    }
    load();
  }, [mode, editId, navigation]);

  function validate() {
    if (!name.trim()) return "Product name is required.";
    if (costPrice === "" || isNaN(Number(costPrice))) return "Cost price must be a number.";
    if (sellingPrice === "" || isNaN(Number(sellingPrice))) return "Selling price must be a number.";
    if (stockQty === "" || isNaN(Number(stockQty))) return "Stock quantity must be a number.";
    if (Number(stockQty) < 0) return "Stock quantity cannot be negative.";
    return "";
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  function removeImage() {
    setImageUri(null);
  }

  async function handleSave() {
    const err = validate();
    if (err) {
      Alert.alert("Fix this", err);
      return;
    }

    const payload = {
      name: name.trim(),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stockQty: parseInt(stockQty, 10),
      imageUri
    };

    try {
      if (mode === "edit" && editId) {
        await updateProduct(editId, payload);
        Alert.alert("Saved", "Product updated.");
      } else {
        await addProduct(payload);
        Alert.alert("Saved", "Product added.");
      }
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not save product.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.header}>{mode === "edit" ? "Edit Product" : "Add Product"}</Text>
          <Text style={styles.subheader}>
            Keep your inventory organized with pricing, stock, and product images.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Product Image</Text>

          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />

              <Pressable style={styles.imageBtn} onPress={pickImage}>
                <Text style={styles.imageBtnText}>Change Photo</Text>
              </Pressable>

              <Pressable style={styles.removeBtn} onPress={removeImage}>
                <Text style={styles.removeText}>Remove Photo</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.imageBtn} onPress={pickImage}>
              <Text style={styles.imageBtnText}>Add Photo</Text>
            </Pressable>
          )}

          <Text style={styles.label}>Product Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Example: Coke Zero 12-pack"
            placeholderTextColor="#98A2B3"
            style={styles.input}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Cost Price</Text>
          <TextInput
            value={costPrice}
            onChangeText={setCostPrice}
            placeholder="0.00"
            placeholderTextColor="#98A2B3"
            style={styles.input}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Selling Price</Text>
          <TextInput
            value={sellingPrice}
            onChangeText={setSellingPrice}
            placeholder="0.00"
            placeholderTextColor="#98A2B3"
            style={styles.input}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Stock Quantity</Text>
          <TextInput
            value={stockQty}
            onChangeText={setStockQty}
            placeholder="0"
            placeholderTextColor="#98A2B3"
            style={styles.input}
            keyboardType="number-pad"
          />

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Product</Text>
          </Pressable>

          <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 20,
    marginBottom: 14
  },
  header: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8
  },
  subheader: {
    color: "#EAECF0",
    lineHeight: 22
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7ECF3"
  },
  label: {
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
    color: "#101828"
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#101828"
  },
  imagePreview: {
    width: 132,
    height: 132,
    borderRadius: 18,
    marginBottom: 10
  },
  imageBtn: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginBottom: 8
  },
  imageBtnText: {
    fontWeight: "800",
    color: "#101828"
  },
  removeBtn: {
    marginBottom: 8
  },
  removeText: {
    color: "#B42318",
    fontWeight: "800"
  },
  saveBtn: {
    marginTop: 22,
    backgroundColor: "#111827",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center"
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  },
  cancelBtn: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 12
  },
  cancelBtnText: {
    color: "#667085",
    fontWeight: "800"
  }
});