import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import DashboardTab from '../screens/Dashboard.js';
import ProfileTab from '../screens/Profilee';  // Profile ekran
import CourseScheduleTab from '../screens/CourseSchedule.js';
import AssignmentsTab from '../screens/Assignments.js';
import GradesTab from '../screens/Grades.js';
import RemindersTab from '../screens/Reminders.js';
import StudyPlannerTab from '../screens/StudyPlanner.js';
import ResourcesTab from '../screens/Resources.js';
import SettingsTab from '../screens/Settings.js';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { darkMode } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;  // Përdoruesi duhet të jetë i loguar për të parë këtë ekran
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: darkMode ? "#FFD700" : "#007AFF",
        tabBarStyle: { backgroundColor: darkMode ? "#222" : "#fff" },
      }}
    >
      {/* Profile është i pari */}
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Profili" : "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      {/* Dashboard është i dyti */}
      <Tab.Screen
        name="Dashboard"
        component={DashboardTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Dashboard" : "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      {/* Orari */}
      <Tab.Screen
        name="Orari"
        component={CourseScheduleTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Orari" : "Schedule",
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />
      {/* Detyrat */}
      <Tab.Screen
        name="Detyrat"
        component={AssignmentsTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Detyrat" : "Assignments",
          tabBarIcon: ({ color }) => <Ionicons name="clipboard" size={24} color={color} />,
        }}
      />
      {/* Notat */}
      <Tab.Screen
        name="Notat"
        component={GradesTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Notat" : "Grades",
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />
      {/* Kujtesat */}
      <Tab.Screen
        name="Kujtesat"
        component={RemindersTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Kujtesat" : "Reminders",
          tabBarIcon: ({ color }) => <Ionicons name="alarm" size={24} color={color} />,
        }}
      />
      {/* Studime */}
      <Tab.Screen
        name="Studime"
        component={StudyPlannerTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Studime" : "Study",
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
      {/* Burime */}
      <Tab.Screen
        name="Burime"
        component={ResourcesTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Burime" : "Resources",
          tabBarIcon: ({ color }) => <Ionicons name="folder" size={24} color={color} />,
        }}
      />
      {/* Cilësimet */}
      <Tab.Screen
        name="Cilesimet"
        component={SettingsTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Cilësimet" : "Settings",
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
