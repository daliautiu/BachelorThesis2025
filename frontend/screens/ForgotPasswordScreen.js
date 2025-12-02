// 3. ForgotPasswordScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = () => {
    setLoading(true);
    
    // Validate email
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      setLoading(false);
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    // In a real app, this would send a password reset email
    // Simulate a network request
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
      // In a real app, you would handle the response from the server
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9500', '#FF6B00', '#000000']}
        style={styles.backgroundGradient}
      />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        
        {!resetSent ? (
          <>
            <Text style={styles.description}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#cc7a00', '#cc7a00'] : ['#ff9500', '#ff6b00']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              If an account exists with the email {email}, you will receive a password reset link shortly.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient
                colors={['#ff9500', '#ff6b00']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Back to Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        
        {!resetSent && (
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Remember your password? Login</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.basketballLines}>
          <View style={styles.line}></View>
          <View style={styles.line}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  formContainer: {
    width: '100%',
    padding: 25,
    borderRadius: 15,
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    letterSpacing: 1.5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 55,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  linkText: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 15,
  },
  successContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#27ae60',
    marginBottom: 20,
  },
  basketballLines: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  line: {
    width: '45%',
    height: 2,
    backgroundColor: '#000',
    marginHorizontal: 5,
    borderRadius: 1,
  }
});

export default ForgotPasswordScreen;
