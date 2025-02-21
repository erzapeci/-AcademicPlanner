import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window'); // Përdorimi i dimensoneve të ekranit

export default function Profile() {
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('erza.peci@example.com');
  const [subjects, setSubjects] = useState('Big Data, Machine Learning');
  const [goals, setGoals] = useState('Të përfundoj projektin tim akademik');

  const handleLogin = () => {
    if (username === 'erza' && password === 'erza123') {
      login(username, password);
    } else {
      alert('Kredencialet janë të pasakta!');
    }
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Kërkohet Logimi</Text>
          <TextInput
            style={styles.input}
            placeholder="Emri i Përdoruesit"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Fjalëkalimi"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Hyr" onPress={handleLogin} />
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <Image
            source={require('./profile/student.png')}
            style={styles.profileImage}
          />
          <Text style={styles.title}>Profili i Përdoruesit</Text>
          {isEditing ? (
            <>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} />
              <TextInput style={styles.input} value={subjects} onChangeText={setSubjects} />
              <TextInput style={styles.input} value={goals} onChangeText={setGoals} />
              <Button title="Ruaj Ndryshimet" onPress={() => setIsEditing(false)} />
            </>
          ) : (
            <>
              <View style={styles.infoCard}>
                <Ionicons name="person" size={22} color="#3498db" />
                <Text style={styles.profileInfo}>Emri: Erza Peci</Text>
              </View>
              <View style={styles.infoCard}>
                <Ionicons name="mail" size={22} color="#3498db" />
                <Text style={styles.profileInfo}>Email: {email}</Text>
              </View>
              <View style={styles.infoCard}>
                <Ionicons name="book" size={22} color="#3498db" />
                <Text style={styles.profileInfo}>Lëndët: {subjects}</Text>
              </View>
              <View style={styles.infoCard}>
                <Ionicons name="flag" size={22} color="#3498db" />
                <Text style={styles.profileInfo}>Qëllimet: {goals}</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Edito Profilin</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F0F8',
    alignItems: 'center',
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#2C3E50',
  },
  profileImage: {
    width: width * 0.3, // Përdorimi i përqindjes së gjerë të ekranit
    height: width * 0.3, // E njëjta për lartësinë
    borderRadius: 50,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    width: '90%',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#B0BEC5',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(232, 240, 248)',
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
    width: '90%',
    borderLeftWidth: 6,
    borderLeftColor: '#3498db',
  },
  profileInfo: {
    fontSize: 18,
    marginLeft: 10,
    flexWrap: 'wrap', // Siguron që teksti të bjerë në linja të reja nëse është shumë i gjatë
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '90%', // Siguron që butoni të jetë i gjerë dhe i lehtë për klikim
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
