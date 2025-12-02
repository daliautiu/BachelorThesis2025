// 14. App.js - The main app entry point
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';

import { AuthProvider, AuthContext } from './context/AuthContext';

// Auth Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

// User Screens
import AdminHomeScreen from './screens/AdminHomeScreen';
import GameAssignmentsScreen from './screens/GameAssignmentsScreen';
import AvailabilityCalendarScreen from './screens/AvailabilityCalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import GameDetailsScreen from './screens/GameDetailsScreen';

// Admin Screens
import GameManagementScreen from './screens/GameManagementScreen';
import RefereeAvailabilityScreen from './screens/RefereeAvailabilityScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Loading Screen
import { ActivityIndicator, View, Text } from 'react-native';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
    <ActivityIndicator size="large" color="#FF6B00" />
    <Text style={{ marginTop: 10, fontSize: 16, color: '#666' }}>Loading...</Text>
  </View>
);

// Auth Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Games Stack for navigation to game details
const GamesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GameAssignments" component={GameAssignmentsScreen} />
      <Stack.Screen name="GameDetails" component={GameDetailsScreen} />
    </Stack.Navigator>
  );
};
// Admin Tab Navigator
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Games') {
            iconName = focused ? 'basketball' : 'basketball-outline';
          } else if (route.name === 'Availability') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={AdminHomeScreen} />
      <Tab.Screen name="Games" component={GamesStack} />
      <Tab.Screen name="Availability" component={AvailabilityCalendarScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// User Tab Navigator
const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Games') {
            iconName = focused ? 'basketball' : 'basketball-outline';
          } else if (route.name === 'Availability') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Games" component={GamesStack} />
      <Tab.Screen name="Availability" component={AvailabilityCalendarScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};



// Admin Screens Stack
const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
      <Stack.Screen name="GameManagement" component={GameManagementScreen} />
      <Stack.Screen name="RefereeAvailability" component={RefereeAvailabilityScreen} />
      <Stack.Screen name="GameDetails" component={GameDetailsScreen} />
    </Stack.Navigator>
  );
};

// App Navigation Container
const AppNavigator = () => {
  const { userToken, isLoading, userInfo } = React.useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {userToken ? (
        userInfo?.role === 'ADMIN' ? (
          <AdminTabNavigator />
        ) : (
          <UserTabNavigator />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B00" />
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;