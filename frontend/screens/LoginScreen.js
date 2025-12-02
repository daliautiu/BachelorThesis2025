// 1. LoginScreen.js
import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { testApi } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await testApi();
      if (result.success) {
        Alert.alert('Connection Successful', result.message || 'Backend is reachable');
      } else {
        Alert.alert('Connection Failed', result.error || 'Could not connect to backend');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setTesting(false);
    }
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // Call login from AuthContext
      const result = await login(email, password);
      
      if (!result.success) {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9500', '#FF6B00', '#000000']}
        style={styles.backgroundGradient}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://scontent.fclj2-1.fna.fbcdn.net/v/t39.30808-6/273667374_4802222356558884_4149234771085627033_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pZpaqoAUrBQQ7kNvwE_vkG1&_nc_oc=Adk649FvQu7GKHYX8jhp0iXDnXjBNCPNrm7pc6P4DwkWUKh6iD8Ol2HMM3JJ0FHFphw&_nc_zt=23&_nc_ht=scontent.fclj2-1.fna&_nc_gid=MYszYHsyAHBEi_9cZ12Cow&oh=00_AfE_V3hDznWhmjj7Sd25fZyEInh5oxQUK04sl59Bpvj1Zw&oe=6802CD85' }}
              style={styles.logoImage}
            />
          </View>
          
          <Text style={styles.title}>Referee LOGIN 🏀</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
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
                <Text style={styles.buttonText}>Go! 🏀</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.linkText}>Forgot Password? 🔑</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>New Referee? Sign Up 🏆</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.basketballLines}>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
        </View>
        <TouchableOpacity 
          onPress={testConnection}
          disabled={testing}
          style={styles.testButton}
        >
          {testing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.testButtonText}>Test Backend Connection</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
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
  },
  logoContainer: {
    height: 100,
    width: 350,
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    letterSpacing: 1.5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    paddingLeft: 2,
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
  },
  button: {
    width: '100%',
    height: 55,
    borderRadius: 28,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
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
  linksContainer: {
    width: '100%',
    alignItems: 'center',
  },
  linkText: {
    color: '#FF6B00',
    marginTop: 10,
    fontWeight: '600',
    fontSize: 15,
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
  },
  testButton: {
    marginTop: 20,
    padding: 10,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
  }
});

export default LoginScreen;