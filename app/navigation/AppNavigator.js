import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import DashboardTab from '../screens/DashboardTab.js';
import CourseScheduleTab from '../screens/CourseScheduleTab.js';
import AssignmentsTab from '../screens/AssignmentsTab.js';
import GradesTab from '../screens/GradesTab.js';
import RemindersTab from '../screens/RemindersTab.js';
import StudyPlannerTab from '../screens/StudyPlannerTab.js';
import ResourcesTab from '../screens/ResourcesTab.js';
import SettingsTab from '../screens/SettingsTab.js';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { darkMode } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: darkMode ? "#FFD700" : "#007AFF",
        tabBarStyle: { backgroundColor: darkMode ? "#222" : "#fff" },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Dashboard" : "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Orari"
        component={CourseScheduleTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Orari" : "Schedule",
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Detyrat"
        component={AssignmentsTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Detyrat" : "Assignments",
          tabBarIcon: ({ color }) => <Ionicons name="clipboard" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notat"
        component={GradesTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Notat" : "Grades",
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Kujtesat"
        component={RemindersTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Kujtesat" : "Reminders",
          tabBarIcon: ({ color }) => <Ionicons name="alarm" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Studime"
        component={StudyPlannerTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Studime" : "Study",
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Burime"
        component={ResourcesTab}
        options={{
          tabBarLabel: language === 'shqip' ? "Burime" : "Resources",
          tabBarIcon: ({ color }) => <Ionicons name="folder" size={24} color={color} />,
        }}
      />
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
