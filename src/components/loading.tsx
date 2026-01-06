import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const THEME_COLOR = "#047857";
const BACKGROUND_COLOR = "#ECFDF5";

export default function Loading() {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <ActivityIndicator size={48} color={THEME_COLOR} style={styles.spinner} />
        <Text style={styles.titleText}>Mate Map</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    alignItems: "center",
    padding: 30,
  },
  spinner: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "800",
    color: THEME_COLOR,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});