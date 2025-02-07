import React, { useContext, useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsTab() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [textSize, setTextSize] = useState(16);
  const [notifications, setNotifications] = useState(true);

  const showPrivacyAlert = () => {
    Alert.alert(
      language === 'shqip' ? 'Siguria dhe Privatësia' : 'Security & Privacy',
      language === 'shqip'
        ? 'Aplikacioni është i sigurt. Të dhënat tuaja ruhen me kujdes.'
        : 'This app is secure. Your data is protected.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, darkMode && styles.darkBackground]}>
      <Text style={[styles.title, darkMode && styles.darkText]}>
        {language === 'shqip' ? 'Cilësimet' : 'Settings'}
      </Text>

      {/* Ndryshimi i Temës */}
      <View style={styles.row}>
        <Ionicons name={darkMode ? 'moon' : 'sunny'} size={24} color={darkMode ? '#fff' : '#000'} />
        <Text style={[styles.text, darkMode && styles.darkText]}>
          {language === 'shqip' ? 'Ndrysho në Dark Mode' : 'Switch to Dark Mode'}
        </Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      {/* Ndryshimi i Gjuhës */}
      <View style={styles.row}>
        <Ionicons name='globe-outline' size={24} color={darkMode ? '#fff' : '#000'} />
        <Text style={[styles.text, darkMode && styles.darkText]}>
          {language === 'shqip' ? 'Ndrysho Gjuhën' : 'Change Language'}
        </Text>
        <Button title={language === 'shqip' ? '🇬🇧 Anglisht' : '🇦🇱 Shqip'} onPress={toggleLanguage} />
      </View>

      {/* Rregullimi i Madhësisë së Tekstit */}
      <View style={styles.row}>
        <Ionicons name='text-outline' size={24} color={darkMode ? '#fff' : '#000'} />
        <Text style={[styles.text, darkMode && styles.darkText]}>
          {language === 'shqip' ? 'Madhësia e Tekstit' : 'Text Size'}
        </Text>
        <TouchableOpacity onPress={() => setTextSize(textSize > 12 ? textSize - 2 : 12)}>
          <Ionicons name='remove-circle-outline' size={24} color='red' />
        </TouchableOpacity>
        <Text style={[styles.text, { fontSize: textSize }]}>{textSize}</Text>
        <TouchableOpacity onPress={() => setTextSize(textSize < 24 ? textSize + 2 : 24)}>
          <Ionicons name='add-circle-outline' size={24} color='green' />
        </TouchableOpacity>
      </View>

      {/* Njoftimet */}
      <View style={styles.row}>
        <Ionicons name='notifications-outline' size={24} color={darkMode ? '#fff' : '#000'} />
        <Text style={[styles.text, darkMode && styles.darkText]}>
          {language === 'shqip' ? 'Njoftimet' : 'Notifications'}
        </Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* Siguria dhe Privatësia */}
      <TouchableOpacity style={styles.privacyButton} onPress={showPrivacyAlert}>
        <Ionicons name='lock-closed-outline' size={24} color='#fff' />
        <Text style={styles.privacyText}>{language === 'shqip' ? 'Siguria & Privatësia' : 'Security & Privacy'}</Text>
      </TouchableOpacity>

      {/* Citimi Motivues */}
      <Text style={[styles.quote, darkMode && styles.darkText]}>
        {language === 'shqip' ? '"Dija është fuqi!"' : '"Knowledge is power!"'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(232, 240, 248)',
    padding: 20,
  },
  darkBackground: {
    backgroundColor: '#222',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#000',
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginVertical: 10,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  privacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  privacyText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
