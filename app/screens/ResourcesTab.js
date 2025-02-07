import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ResourcesTab() {
  const [resources, setResources] = useState([
    { id: '1', title: 'Wikipedia - Matematikë', url: 'https://en.wikipedia.org/wiki/Mathematics' },
    { id: '2', title: 'Tutoriale Python', url: 'https://www.learnpython.org/' },
    { id: '3', title: 'Kursi i Përdorimit të Excel-it', url: 'https://www.excel-easy.com/' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addResource = () => {
    if (newTitle.trim() && newUrl.trim()) {
      const newResource = { id: Date.now().toString(), title: newTitle, url: newUrl };
      setResources([...resources, newResource]);
      setNewTitle('');
      setNewUrl('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Burimet e Studimit</Text>
      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
            <FontAwesome name="book" size={24} color="#3498db" style={styles.icon} />
            <Text style={styles.linkText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      
      {/* Shtimi i Burimeve të Reja */}
      <TextInput
        style={styles.input}
        placeholder="Titulli i Burimit"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="URL e Burimit"
        value={newUrl}
        onChangeText={setNewUrl}
      />
      <TouchableOpacity style={styles.button} onPress={addResource}>
        <Text style={styles.buttonText}>Shto Burim</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E8F0F8' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2C3E50' },
  card: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(232, 240, 248)', 
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
  icon: { marginRight: 10 },
  linkText: { fontSize: 18, fontWeight: '600', color: '#3498db' },
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
