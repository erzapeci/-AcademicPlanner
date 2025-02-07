import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, 
  TextInput, Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseSchedule = () => {
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    name: '',
    time: '',
    days: '',
    location: ''
  });
  
  // Ngarkon kurset e ruajtura në montim
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const savedCourses = await AsyncStorage.getItem('@courses');
      if (savedCourses) setCourses(JSON.parse(savedCourses));
    } catch (e) {
      console.error('Failed to load courses', e);
    }
  };

  const saveCourses = async (coursesToSave) => {
    try {
      await AsyncStorage.setItem('@courses', JSON.stringify(coursesToSave));
    } catch (e) {
      console.error('Failed to save courses', e);
    }
  };

  const handleAddCourse = () => {
    setCurrentCourse({ id: null, name: '', time: '', days: '', location: '' });
    setModalVisible(true);
  };

  const handleSaveCourse = () => {
    if (currentCourse.id !== null) {
      // Përditëso kursin ekzistues
      const updatedCourses = courses.map(course => 
        course.id === currentCourse.id ? currentCourse : course
      );
      setCourses(updatedCourses);
      saveCourses(updatedCourses);
    } else {
      // Shto kurs të ri
      const newCourse = { ...currentCourse, id: Date.now().toString() };
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      saveCourses(updatedCourses);
    }
    setModalVisible(false);
  };

  const handleEditCourse = (course) => {
    setCurrentCourse(course);
    setModalVisible(true);
  };

  const handleDeleteCourse = (courseId) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={32} color="#2C3E50" />
        <Text style={styles.title}>Orari i Kurseve</Text>
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Ionicons name="add-circle" size={32} color="#3498db" />
      </TouchableOpacity>
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <View style={styles.courseInfo}>
              {/* Emri i kursit */}
              <View style={styles.detailRow}>
                <Ionicons name="school-outline" size={16} color="#333" style={styles.detailIcon} />
                <Text style={styles.courseName}>{item.name}</Text>
              </View>
              {/* Ditët e kursit */}
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#333" style={styles.detailIcon} />
                <Text>{item.days}</Text>
              </View>
              {/* Ora e kursit */}
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#333" style={styles.detailIcon} />
                <Text>{item.time}</Text>
              </View>
              {/* Lokacioni */}
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color="#333" style={styles.detailIcon} />
                <Text>{item.location}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEditCourse(item)}>
                <Ionicons name="pencil" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCourse(item.id)}>
                <Ionicons name="trash" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons 
              name={currentCourse.id ? "create-outline" : "add-circle-outline"} 
              size={28} 
              color="#2C3E50" 
              style={{ marginRight: 10 }} 
            />
            <Text style={styles.modalTitle}>
              {currentCourse.id ? 'Edit Course' : 'Add Course'}
            </Text>
          </View>

          {/* Input për emrin e kursit */}
          <View style={styles.inputContainer}>
            <Ionicons name="school-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value={currentCourse.name}
              onChangeText={(text) => setCurrentCourse({ ...currentCourse, name: text })}
            />
          </View>
          {/* Input për orën */}
          <View style={styles.inputContainer}>
            <Ionicons name="time-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 9:00 AM - 10:30 AM)"
              value={currentCourse.time}
              onChangeText={(text) => setCurrentCourse({ ...currentCourse, time: text })}
            />
          </View>
          {/* Input për ditët */}
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Days (e.g., Mon, Wed, Fri)"
              value={currentCourse.days}
              onChangeText={(text) => setCurrentCourse({ ...currentCourse, days: text })}
            />
          </View>
          {/* Input për lokacionin */}
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={currentCourse.location}
              onChangeText={(text) => setCurrentCourse({ ...currentCourse, location: text })}
            />
          </View>

          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
            <Button title="Save" onPress={handleSaveCourse} color="#2196F3" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(232, 240, 248)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
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
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  courseInfo: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailIcon: {
    marginRight: 5,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgb(232, 240, 248)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default CourseSchedule;
