import React from "react";
import { 
  StyleSheet, 
  SafeAreaView, 
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <Text style={styles.title}>Attendance</Text>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.label}>Last name</Text>
            <TextInput style={styles.input} placeholder="Enter last name" />

            <Text style={styles.label}>First name</Text>
            <TextInput style={styles.input} placeholder="Enter first name" />

            <Text style={styles.label}>Year and Section</Text>
            <TextInput style={styles.input} placeholder="Enter year & section" />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.presentBtn]}>
                <Text style={styles.buttonText}>Present</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.absentBtn]}>
                <Text style={styles.buttonText}>Absent</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Table Section */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Lastname</Text>
              <Text style={styles.tableHeaderText}>Firstname</Text>
              <Text style={styles.tableHeaderText}>Section</Text>
              <Text style={styles.tableHeaderText}>Status</Text>
            </View>

            {/* Example row */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Perez</Text>
              <Text style={styles.tableCell}>Kevin</Text>
              <Text style={styles.tableCell}>BSIT-2A</Text>
              <Text style={[styles.tableCell, styles.presentStatus]}>Present</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#34495e",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    backgroundColor: "#fdfdfd",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  presentBtn: {
    backgroundColor: "#27ae60",
  },
  absentBtn: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    color: "#34495e",
  },
  presentStatus: {
    color: "#27ae60",
    fontWeight: "bold",
  },
});
