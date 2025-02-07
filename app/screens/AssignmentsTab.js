import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, 
  TextInput, Button 
} from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({
    id: null,
    title: '',
    course: '',
    dueDate: new Date(),
    description: '',
    completed: false,
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const savedAssignments = await AsyncStorage.getItem('@assignments');
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
    } catch (e) {
      console.error('Failed to load assignments', e);
    }
  };

  const saveAssignments = async (assignmentsToSave) => {
    try {
      await AsyncStorage.setItem('@assignments', JSON.stringify(assignmentsToSave));
    } catch (e) {
      console.error('Failed to save assignments', e);
    }
  };

  const handleAddAssignment = () => {
    setCurrentAssignment({
      id: null,
      title: '',
      course: '',
      dueDate: new Date(),
      description: '',
      completed: false,
    });
    setModalVisible(true);
  };

  const handleSaveAssignment = () => {
    if (!currentAssignment.title || !currentAssignment.dueDate) return;

    const newAssignment = {
      ...currentAssignment,
      id: currentAssignment.id || Date.now().toString(),
      dueDate: currentAssignment.dueDate.toISOString(),
    };

    const updatedAssignments = currentAssignment.id
      ? assignments.map(a => a.id === currentAssignment.id ? newAssignment : a)
      : [...assignments, newAssignment];

    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
    setModalVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setCurrentAssignment({ ...currentAssignment, dueDate: selectedDate });
    }
  };

  const toggleCompletion = (assignmentId) => {
    const updatedAssignments = assignments.map(a =>
      a.id === assignmentId ? { ...a, completed: !a.completed } : a
    );
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
  };

  const handleDeleteAssignment = (assignmentId) => {
    const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
  };

  return (
    <LinearGradient 
      colors={['rgb(232,240,248)', 'rgb(232,240,248)']}  // Ngjyrë e vetme si sfond
      style={styles.container}
    >
      <TouchableOpacity style={styles.addButton} onPress={handleAddAssignment}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.assignmentItem, item.completed && styles.completedItem]}>
            <CheckBox
              checked={item.completed}
              onPress={() => toggleCompletion(item.id)}
              containerStyle={styles.checkbox}
            />
            <View style={styles.assignmentInfo}>
              <Text style={styles.assignmentTitle}>{item.title}</Text>
              <Text style={styles.courseName}>{item.course}</Text>
              <Text>
                <Ionicons name="calendar-outline" size={14} color="#666" /> Due: {new Date(item.dueDate).toLocaleDateString()}
              </Text>
              {item.description ? <Text>{item.description}</Text> : null}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => {
                setCurrentAssignment({ ...item, dueDate: new Date(item.dueDate) });
                setModalVisible(true);
              }}>
                <Icon name="edit" type="material" color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteAssignment(item.id)}>
                <Icon name="delete" type="material" color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons 
              name={currentAssignment.id ? "create-outline" : "add-circle-outline"} 
              size={28} 
              color="#2C3E50" 
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>
              {currentAssignment.id ? 'Edit Assignment' : 'Add Assignment'}
            </Text>
          </View>
          {/* Fusha për Titull */}
          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Assignment Title *"
              value={currentAssignment.title}
              onChangeText={(text) => setCurrentAssignment({ ...currentAssignment, title: text })}
            />
          </View>
          {/* Fusha për Emrin e Kursit */}
          <View style={styles.inputContainer}>
            <Ionicons name="book-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value={currentAssignment.course}
              onChangeText={(text) => setCurrentAssignment({ ...currentAssignment, course: text })}
            />
          </View>
          {/* Fusha për Data e Skadimit */}
          <TouchableOpacity 
            style={styles.inputContainer} 
            onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#333" style={styles.inputIcon} />
            <Text style={styles.inputText}>
              Due Date: {currentAssignment.dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={currentAssignment.dueDate}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />
          )}
          {/* Fusha për Përshkrim */}
          <View style={[styles.inputContainer, { height: 80, alignItems: 'flex-start' }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description"
              multiline
              value={currentAssignment.description}
              onChangeText={(text) => setCurrentAssignment({ ...currentAssignment, description: text })}
            />
          </View>
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
            <Button title="Save" onPress={handleSaveAssignment} color="#2196F3" />
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
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  completedItem: {
    backgroundColor: '#e8f5e9',
    opacity: 0.7,
  },
  checkbox: {
    padding: 0,
    margin: 0,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
  },
  courseName: {
    color: '#666',
    marginVertical: 3,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginLeft: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    textAlign: 'center',
    color: '#2C3E50',
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

export default Assignments;
