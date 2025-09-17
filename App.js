import React from "react";
import { 
  StyleSheet, 
  SafeAreaView, 
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated
} from "react-native";


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      lastname: '',
      firstname: '',
      section: '',
      notifications: [],
      showNotifications: false,
      bellAnimation: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    fetch("https://bsit-4a-classmanagement-server.vercel.app/users")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ users: data });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  handleInputChange = (field, value) => {
    this.setState({ [field]: value });
  };

  animateBell = () => {
    Animated.sequence([
      Animated.timing(this.state.bellAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(this.state.bellAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  handleAttendance = (status) => {
    const { lastname, firstname, section } = this.state;
    if (!lastname || !firstname || !section) {
      alert('Please fill out all fields.');
      return;
    }
    fetch("https://bsit-4a-classmanagement-server.vercel.app/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lastName: lastname, firstName: firstname, section, status }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save attendance');
        return response.json();
      })
      .then(() => {
        // Add notification
        const newNotification = {
          id: Date.now(),
          message: `${lastname} marked as ${status}`,
          timestamp: new Date().toLocaleTimeString()
        };
        this.setState(prevState => ({
          lastname: '',
          firstname: '',
          section: '',
          notifications: [newNotification, ...prevState.notifications].slice(0, 10) // Keep last 10 notifications
        }));
        this.animateBell();
        this.fetchUsers();
      })
      .catch((error) => {
        alert('Error saving attendance');
        console.error(error);
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Attendance</Text>
            <TouchableOpacity 
              style={styles.bellContainer} 
              onPress={() => this.setState(prev => ({ showNotifications: !prev.showNotifications }))}
            >
              <Animated.Text 
                style={[
                  styles.bell,
                  {
                    transform: [{
                      rotate: this.state.bellAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '30deg']
                      })
                    }]
                  }
                ]}
              >
                🔔
              </Animated.Text>
              {this.state.notifications.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{this.state.notifications.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Notifications Modal */}
          <Modal
            visible={this.state.showNotifications}
            transparent={true}
            animationType="slide"
            onRequestClose={() => this.setState({ showNotifications: false })}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Recent Updates</Text>
                  <TouchableOpacity onPress={() => this.setState({ showNotifications: false })}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {this.state.notifications.map(notification => (
                    <View key={notification.id} style={styles.notificationItem}>
                      <Text style={styles.notificationText}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                    </View>
                  ))}
                  {this.state.notifications.length === 0 && (
                    <Text style={styles.noNotifications}>No recent updates</Text>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              value={this.state.lastname}
              onChangeText={(text) => this.handleInputChange('lastname', text)}
            />

            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={this.state.firstname}
              onChangeText={(text) => this.handleInputChange('firstname', text)}
            />

            <Text style={styles.label}>Year and Section</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter year & section"
              value={this.state.section}
              onChangeText={(text) => this.handleInputChange('section', text)}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.presentBtn]}
                onPress={() => this.handleAttendance('Present')}
              >
                <Text style={styles.buttonText}>Present</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.absentBtn]}
                onPress={() => this.handleAttendance('Absent')}
              >
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

            {/* Render fetched users */}
            {this.state.users && this.state.users.length > 0 ? (
              this.state.users.map((user, idx) => (
                <View style={styles.tableRow} key={idx}>
                  <Text style={styles.tableCell}>{user.lastName || user.lastname}</Text>
                  <Text style={styles.tableCell}>{user.firstName || user.firstname}</Text>
                  <Text style={styles.tableCell}>{user.section}</Text>
                  <Text style={[styles.tableCell, (user.status || '').toLowerCase() === "present" ? styles.presentStatus : styles.absentBtn]}>
                    {user.status || 'N/A'}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.tableCell}>No users found.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  bellContainer: {
    padding: 10,
  },
  bell: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    padding: 5,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationText: {
    fontSize: 16,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  noNotifications: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
  },
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
