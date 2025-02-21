import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const DashboardTab = () => {
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isExam, setIsExam] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@tasks');
      const savedExams = await AsyncStorage.getItem('@exams');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedExams) setExams(JSON.parse(savedExams));
    } catch (error) {
      console.error('Gabim në ngarkimin e të dhënave', error);
    }
  };

  const saveData = async (tasksToSave, examsToSave) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasksToSave));
      await AsyncStorage.setItem('@exams', JSON.stringify(examsToSave));
    } catch (error) {
      console.error('Gabim në ruajtjen e të dhënave', error);
    }
  };

  const addItem = () => {
    if (newTitle.trim() && newDate.trim()) {
      const newItem = { id: Date.now().toString(), titulli: newTitle, data: newDate };
      if (isExam) {
        const updatedExams = [...exams, newItem];
        setExams(updatedExams);
        saveData(tasks, updatedExams);
      } else {
        const updatedTasks = [...tasks, newItem];
        setTasks(updatedTasks);
        saveData(updatedTasks, exams);
      }
      setNewTitle('');
      setNewDate('');
      setModalVisible(false);
    }
  };

  const deleteItem = (id, isExam) => {
    if (isExam) {
      const updatedExams = exams.filter(item => item.id !== id);
      setExams(updatedExams);
      saveData(tasks, updatedExams);
    } else {
      const updatedTasks = tasks.filter(item => item.id !== id);
      setTasks(updatedTasks);
      saveData(updatedTasks, exams);
    }
  };

  return (
    <View style={styles.konteneri}>
      <Text style={styles.titulli}>📚 Paneli Kryesor</Text>

      {/* Butoni për të shtuar detyra/provime */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={60} color="#1ABC9C" />
      </TouchableOpacity>

      {/* Detyrat e ardhshme */}
      <Text style={styles.nentitulli}>📝 Detyrat e ardhshme</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.kartela}>
            <View style={styles.kartelaRow}>
              <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
              <Text style={styles.teksti}>{item.titulli}</Text>
            </View>
            <Text style={styles.data}>{item.data}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id, false)}>
              <Ionicons name="trash" size={24} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Provimet e ardhshme */}
      <Text style={styles.nentitulli}>📅 Provimet e ardhshme</Text>
      <FlatList
        data={exams}
        renderItem={({ item }) => (
          <View style={styles.kartelaExam}>
            <View style={styles.kartelaRow}>
              <MaterialIcons name="event" size={24} color="#F39C12" />
              <Text style={styles.teksti}>{item.titulli}</Text>
            </View>
            <Text style={styles.data}>{item.data}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id, true)}>
              <Ionicons name="trash" size={24} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Modal për shtim */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>➕ Shto Një Element</Text>
          <TextInput style={styles.input} placeholder="Titulli" value={newTitle} onChangeText={setNewTitle} />
          <TextInput style={styles.input} placeholder="Data" value={newDate} onChangeText={setNewDate} />
          <TouchableOpacity onPress={() => setIsExam(!isExam)}>
            <Text style={styles.switchText}>{isExam ? '📖 Shto si Provim' : '📝 Shto si Detyrë'}</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Button title="Anulo" onPress={() => setModalVisible(false)} color="#999" />
            <Button title="Shto" onPress={addItem} color="#1ABC9C" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  konteneri: { flex: 1, padding: 20, backgroundColor: 'rgb(232, 240, 248)' },
  titulli: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2C3E50' },
  nentitulli: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#2980B9' },
  kartela: { backgroundColor: 'rgb(232, 240, 248)', padding: 15, borderRadius: 12, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#3498DB' },
  kartelaExam: { backgroundColor: '#FFEFD5', padding: 15, borderRadius: 12, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#E67E22' },
  teksti: { fontSize: 18, fontWeight: '600', color: '#2C3E50' },
  data: { fontSize: 16, color: '#7F8C8D', marginTop: 5 },
  addButton: { alignItems: 'center', marginBottom: 20 },
  modalContent: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  switchText: { textAlign: 'center', fontSize: 16, marginVertical: 10, color: '#2980B9' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  deleteButton: { marginTop: 10, alignItems: 'center' },
});

export default DashboardTab;
