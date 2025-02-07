import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';

export default function StudyPlannerTab() {
  const [sessions, setSessions] = useState([
    { id: '1', subject: '📘 Matematikë', time: '18:00 - 19:30' },
    { id: '2', subject: '💻 Programim', time: '20:00 - 21:30' },
  ]);
  const [newSession, setNewSession] = useState('');
  const [newTime, setNewTime] = useState('');

  // Aktivizon animacionet për Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const addSession = () => {
    if (newSession.trim() && newTime.trim()) {
      const newEntry = { id: Date.now().toString(), subject: newSession, time: newTime };
      
      // Animacion i butë kur shtohet një element i ri
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setSessions([...sessions, newEntry]);
      setNewSession('');
      setNewTime('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Planifikuesi i Studimeve</Text>
      
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
      
      <TextInput
        style={styles.input}
        placeholder="➕ Shto një lëndë..."
        placeholderTextColor="#888"
        value={newSession}
        onChangeText={setNewSession}
      />
      
      <TextInput
        style={styles.input}
        placeholder="⏰ Shto orën (p.sh. 18:00 - 19:30)"
        placeholderTextColor="#888"
        value={newTime}
        onChangeText={setNewTime}
      />
      
      <TouchableOpacity style={styles.button} onPress={addSession}>
        <Text style={styles.buttonText}>✅ Shto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: 'rgb(232, 240, 248)' 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#2C3E50' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    elevation: 5,
    borderLeftWidth: 6,
    borderLeftColor: '#3498db'
  },
  subject: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#2C3E50' 
  },
  time: { 
    fontSize: 16, 
    color: '#7D8A95' 
  },
  input: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 12, 
    marginVertical: 6, 
    borderWidth: 1, 
    borderColor: '#B0BEC5', 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    elevation: 2 
  },
  button: { 
    backgroundColor: '#3498db', 
    padding: 12, 
    borderRadius: 10, 
    marginTop: 10, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 4 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
