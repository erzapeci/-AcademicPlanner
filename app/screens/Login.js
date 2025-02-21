import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Importo ikonat
import { useAuth } from '../context/AuthContext';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (username === 'Erza Peci' && password === 'erza123') {
      login(username, password);
      setAuthenticated(true);  // Kjo do të aktivizojë navigimin te dashboard
    } else {
      setErrorMessage('Emri i përdoruesit ose fjalëkalimi janë të pasakta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hyr në aplikacion</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="#007AFF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Emri i Përdoruesit"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Fjalëkalimi"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Hyni</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E6F7FF',  // Background i kalter i qete
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '80%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    height: 40,
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Login;
