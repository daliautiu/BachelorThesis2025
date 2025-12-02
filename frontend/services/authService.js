// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './api';

export const login = async (email, password) => {
  try {
    const response = await authService.login(email, password);
    const { token, id, name, email: userEmail, role } = response.data;
    
    // Store auth data in AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', id.toString());
    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('userEmail', userEmail);
    await AsyncStorage.setItem('userRole', role);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed. Please check your credentials.'
    };
  }
};

export const logout = async () => {
  try {
    // Remove auth data from AsyncStorage
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userRole');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'Failed to logout properly' };
  }
};