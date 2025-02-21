import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Button, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';

// Konfigurimi i njoftimeve
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentReminder, setCurrentReminder] = useState({
    id: '',
    title: '',
    body: '',
    date: new Date(),
  });

  // Kërko leje për njoftimet dhe ngarko kujtesat
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Leje e nevojshme', 'Ju lutem aktivizoni njoftimet për kujtesat.');
      }
    })();
    loadReminders();
  }, []);

  // Ngarko kujtesat nga AsyncStorage
  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('@reminders');
      if (savedReminders) {
        const parsedReminders = JSON.parse(savedReminders);
        setReminders(parsedReminders);
      }
    } catch (e) {
      console.error('Gabim në ngarkimin e kujtesave', e);
    }
  };

  // Ruaj kujtesat në AsyncStorage
  const saveReminders = async (remindersToSave) => {
    try {
      await AsyncStorage.setItem('@reminders', JSON.stringify(remindersToSave));
    } catch (e) {
      console.error('Gabim në ruajtjen e kujtesave', e);
    }
  };

  // Planifiko njoftimin për një kujtesë
  const scheduleNotification = async (reminder) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body || 'Mos harro kujtesën tënde!',
          sound: true,
        },
        trigger: { date: reminder.date },
      });

      return notificationId;
    } catch (e) {
      console.error('Gabim në planifikimin e njoftimit:', e);
      return null;
    }
  };

  // Ruaj ose përditëso një kujtesë
  const onSaveReminder = async () => {
    if (!currentReminder.title) {
      Alert.alert('Gabim', 'Titulli është i nevojshëm!');
      return;
    }

    const newReminder = {
      ...currentReminder,
      id: Date.now().toString(),
    };

    // Planifiko njoftimin
    const notificationId = await scheduleNotification(newReminder);
    if (notificationId) {
      newReminder.notificationId = notificationId;
    }

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
    setModalVisible(false);
    setCurrentReminder({ id: '', title: '', body: '', date: new Date() });
  };

  // Fshi kujtesën dhe anulo njoftimin
  const onDeleteReminder = async (id, notificationId) => {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    const updatedReminders = reminders.filter((r) => r.id !== id);
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
  };

  return (
    <LinearGradient
      colors={['rgb(232,240,248)', 'rgb(232,240,248)']}
      style={styles.container}
    >
      {/* Butoni për shtimin e kujtesave */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>
                <Ionicons name="alarm-outline" size={18} color="#333" /> {item.title}
              </Text>
              <Text style={styles.reminderDate}>
                <Ionicons name="time-outline" size={16} color="#666" /> {new Date(item.date).toLocaleString()}
              </Text>
              {item.body ? <Text style={styles.reminderBody}>{item.body}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => onDeleteReminder(item.id, item.notificationId)}>
              <Ionicons name="trash" size={25} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal për shtimin e kujtesave */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons 
                name="create-outline" 
                size={28} 
                color="#2196F3" 
                style={styles.modalIcon} 
              />
              <Text style={styles.modalTitle}>Shto Kujtesë</Text>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="bookmark-outline" size={20} color="#333" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Titulli *"
                value={currentReminder.title}
                onChangeText={(text) => setCurrentReminder({ ...currentReminder, title: text })}
              />
            </View>
            <View style={[styles.inputContainer, { height: 80, alignItems: 'flex-start' }]}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color="#333" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Përshkrimi"
                multiline
                value={currentReminder.body}
                onChangeText={(text) => setCurrentReminder({ ...currentReminder, body: text })}
              />
            </View>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color="#333" style={styles.inputIcon} />
              <Text style={styles.inputText}>
                {currentReminder.date.toLocaleString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={currentReminder.date}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setCurrentReminder({ ...currentReminder, date: selectedDate });
                  }
                }}
              />
            )}
            <View style={styles.modalButtons}>
              <Button title="Anulo" onPress={() => setModalVisible(false)} color="#999" />
              <Button title="Ruaj" onPress={onSaveReminder} color="#2196F3" />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reminderDate: {
    color: '#666',
    marginBottom: 5,
  },
  reminderBody: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  modalIcon: {
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default Reminders;
