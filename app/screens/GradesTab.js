// src/screens/GradeCalculator.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Button 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GradeCalculator = () => {
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [componentModalVisible, setComponentModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    name: '',
    components: []
  });
  const [currentComponent, setCurrentComponent] = useState({
    name: '',
    weight: '',
    score: ''
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const savedCourses = await AsyncStorage.getItem('@gradeCourses');
      if (savedCourses) setCourses(JSON.parse(savedCourses));
    } catch (e) {
      console.error('Failed to load courses', e);
    }
  };

  const saveCourses = async (coursesToSave) => {
    try {
      await AsyncStorage.setItem('@gradeCourses', JSON.stringify(coursesToSave));
    } catch (e) {
      console.error('Failed to save courses', e);
    }
  };

  const calculateGrade = (components) => {
    let totalWeight = 0;
    let weightedSum = 0;
    
    components.forEach(component => {
      const weight = parseFloat(component.weight) || 0;
      const score = parseFloat(component.score) || 0;
      totalWeight += weight;
      weightedSum += (weight * score) / 100;
    });
    if (totalWeight === 0) return 0;
    return (weightedSum / totalWeight) * 100;
  };

  const handleAddCourse = () => {
    setCurrentCourse({ id: null, name: '', components: [] });
    setModalVisible(true);
  };

  const handleSaveCourse = () => {
    if (!currentCourse.name) return;
    const newCourse = {
      ...currentCourse,
      id: currentCourse.id || Date.now().toString()
    };
    const updatedCourses = currentCourse.id
      ? courses.map(c => c.id === currentCourse.id ? newCourse : c)
      : [...courses, newCourse];
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    setModalVisible(false);
  };

  const handleAddComponent = (course) => {
    setCurrentCourse(course);
    setCurrentComponent({ name: '', weight: '', score: '' });
    setComponentModalVisible(true);
  };

  const handleSaveComponent = () => {
    if (!currentComponent.name || !currentComponent.weight) return;
    const updatedCourse = {
      ...currentCourse,
      components: [
        ...currentCourse.components, 
        { ...currentComponent, id: Date.now().toString() }
      ]
    };
    const updatedCourses = courses.map(c => 
      c.id === currentCourse.id ? updatedCourse : c
    );
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    setComponentModalVisible(false);
  };

  const handleDeleteCourse = (courseId) => {
    const updatedCourses = courses.filter(c => c.id !== courseId);
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Ionicons name="calculate-outline" size={28} color="#2196F3" /> Grade Calculator
      </Text>
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.courseName}>
                <Ionicons name="school-outline" size={20} color="#333" /> {item.name}
              </Text>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => handleAddComponent(item)}>
                  <Ionicons name="add-circle" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteCourse(item.id)}>
                  <Ionicons name="trash" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.componentsContainer}>
              {item.components.length > 0 ? (
                item.components.map(component => (
                  <View key={component.id} style={styles.componentItem}>
                    <Text style={styles.componentName}>
                      <Ionicons name="document-text-outline" size={16} color="#333" /> {component.name}
                    </Text>
                    <Text style={styles.componentText}>
                      <Ionicons name="stats-chart-outline" size={16} color="#333" /> {component.weight}%
                    </Text>
                    <Text style={styles.componentText}>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" /> {component.score || '0'}%
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noComponentText}>No grade components added.</Text>
              )}
            </View>
            <View style={styles.gradeSummary}>
              <Text style={styles.gradeText}>
                Current Grade: {calculateGrade(item.components).toFixed(1)}%
              </Text>
            </View>
          </View>
        )}
      />

      {/* Add Course Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Course Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons 
              name={currentCourse.id ? "create-outline" : "add-circle-outline"} 
              size={28} 
              color="#2196F3" 
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>
              {currentCourse.id ? 'Edit Course' : 'Add Course'}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="school-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Course Name *"
              value={currentCourse.name}
              onChangeText={(text) => setCurrentCourse({ ...currentCourse, name: text })}
            />
          </View>
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
            <Button title="Save" onPress={handleSaveCourse} color="#2196F3" />
          </View>
        </View>
      </Modal>

      {/* Component Modal */}
      <Modal visible={componentModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons name="list-outline" size={28} color="#2196F3" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Add Grade Component</Text>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Component Name *"
              value={currentComponent.name}
              onChangeText={(text) => setCurrentComponent({ ...currentComponent, name: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="stats-chart-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Weight (%) *"
              keyboardType="numeric"
              value={currentComponent.weight}
              onChangeText={(text) => setCurrentComponent({ ...currentComponent, weight: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Score (%)"
              keyboardType="numeric"
              value={currentComponent.score}
              onChangeText={(text) => setCurrentComponent({ ...currentComponent, score: text })}
            />
          </View>
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setComponentModalVisible(false)} color="#999" />
            <Button title="Save" onPress={handleSaveComponent} color="#2196F3" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GradeCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232, 240, 248)',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  componentsContainer: {
    marginVertical: 10,
  },
  componentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  componentName: {
    flex: 2,
    fontSize: 16,
  },
  componentText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  noComponentText: {
    fontStyle: 'italic',
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 10,
  },
  gradeSummary: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    textAlign: 'center',
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
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
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
    color: '#2196F3',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
