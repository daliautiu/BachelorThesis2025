// 12. Context/AuthContext.js - Now let's create the AuthContext to manage authentication state
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      const userData = response.data;
      setUserInfo(userData);
      setUserToken(userData.token);
      
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      await AsyncStorage.setItem('token', userData.token);
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      console.log('Login error:', error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };
  
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      const newUserData = response.data;
      setUserInfo(newUserData);
      setUserToken(newUserData.token);
      
      await AsyncStorage.setItem('userInfo', JSON.stringify(newUserData));
      await AsyncStorage.setItem('token', newUserData.token);
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      console.log('Registration error:', error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };
  
  const signOut = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('token');
      setUserToken(null);
      setUserInfo(null);
      setIsLoading(false);
    } catch (error) {
      console.log('Logout error:', error);
      setIsLoading(false);
    }
  };
  
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      let token = await AsyncStorage.getItem('token');
      
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
        setUserToken(token);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.log('isLoggedIn error:', error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    isLoggedIn();
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        login,
        register,
        signOut
      }}>
      {children}
    </AuthContext.Provider>
  );
};
