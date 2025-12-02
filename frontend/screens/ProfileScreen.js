// 9. ProfileScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { userService } from '../services/api';

const ProfileScreen = () => {
  const { signOut, userInfo } = useContext(AuthContext);
  
  // Profile data state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    experience: '',
    preferredAgeGroups: '',
    bio: ''
  });
  
  // Edit data state
  const [editData, setEditData] = useState({...profileData});
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserProfile();
      setProfileData(response.data);
      setEditData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load your profile. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle editing profile
  const handleEdit = () => {
    setEditData({...profileData});
    setIsEditing(true);
  };
  
  // Handle saving profile changes
  const handleSave = async () => {
    // Validate data
    if (!editData.name || !editData.email || !editData.phone) {
      Alert.alert('Error', 'Name, email and phone are required fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    try {
      setSavingLoading(true);
      const response = await userService.updateUserProfile(editData);
      setProfileData(response.data);
      setIsEditing(false);
      setSavingLoading(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setSavingLoading(false);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };
  
  // Handle canceling edits
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  // Handle changing password
  const handleChangePassword = () => {
    // Navigate to password change screen
    // For now just show alert
    Alert.alert('Change Password', 'This feature will be available soon!');
  };
  
  // Handle sign out
  const handleSignOut = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to leave the court?',
      [
        {
          text: 'Stay in Game',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: signOut,
        },
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <LinearGradient
          colors={['#FF9500', '#FF6B00', '#000000']}
          style={styles.backgroundGradient}
        />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#FF9500', '#FF6B00', '#000000']}
        style={styles.backgroundGradient}
      />
      
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#FF6B00', '#000000']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Referee PROFILE 🏀</Text>
            
            {!isEditing && (
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://scontent.fclj2-1.fna.fbcdn.net/v/t39.30808-6/273667374_4802222356558884_4149234771085627033_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pZpaqoAUrBQQ7kNvwE_vkG1&_nc_oc=Adk649FvQu7GKHYX8jhp0iXDnXjBNCPNrm7pc6P4DwkWUKh6iD8Ol2HMM3JJ0FHFphw&_nc_zt=23&_nc_ht=scontent.fclj2-1.fna&_nc_gid=MYszYHsyAHBEi_9cZ12Cow&oh=00_AfE_V3hDznWhmjj7Sd25fZyEInh5oxQUK04sl59Bpvj1Zw&oe=6802CD85' }}
              style={styles.profileImage}
            />
            <View style={styles.ballOverlay}>
              <Text style={styles.ballText}>🏀</Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileQualification}>{profileData.qualification || 'Referee'}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Text style={styles.basketballIcon}>🏀</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editData.name}
                onChangeText={(text) => setEditData({...editData, name: text})}
                placeholder="Enter your full name"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.name}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                value={editData.email}
                onChangeText={(text) => setEditData({...editData, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false} // Email shouldn't be editable
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.email}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editData.phone}
                onChangeText={(text) => setEditData({...editData, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.phone}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Address</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editData.address}
                onChangeText={(text) => setEditData({...editData, address: text})}
                placeholder="Enter your address"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.address || 'Not provided'}</Text>
            )}
          </View>
          
          <View style={styles.basketballLines}>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Referee Information</Text>
            <Text style={styles.basketballIcon}>🏀</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Qualification</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editData.qualification}
                onChangeText={(text) => setEditData({...editData, qualification: text})}
                placeholder="Enter your qualification"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.qualification || 'Not provided'}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Experience</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editData.experience}
                onChangeText={(text) => setEditData({...editData, experience: text})}
                placeholder="Enter your experience"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.experience || 'Not provided'}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Preferred Age Groups</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editData.preferredAgeGroups}
                onChangeText={(text) => setEditData({...editData, preferredAgeGroups: text})}
                placeholder="Enter preferred age groups"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.preferredAgeGroups || 'Not provided'}</Text>
            )}
          </View>
          
          <View style={styles.basketballLines}>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.basketballIcon}>🏀</Text>
          </View>
          
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editData.bio}
              onChangeText={(text) => setEditData({...editData, bio: text})}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.bioText}>{profileData.bio || 'No bio provided.'}</Text>
          )}
          
          <View style={styles.basketballLines}>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
        </View>
        
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={savingLoading}
            >
              <LinearGradient
                colors={['#ff9500', '#ff6b00']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {savingLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>SAVE CHANGES 🏀</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <LinearGradient
                colors={['#888888', '#333333']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.passwordButton} onPress={handleChangePassword}>
              <LinearGradient
                colors={['#ff9500', '#ff6b00']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="lock-closed-outline" size={20} color="#fff" />
                  <Text style={styles.passwordButtonText}>CHANGE PASSWORD 🔑</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleSignOut}
            >
              <LinearGradient
                colors={['#333333', '#000000']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="log-out-outline" size={20} color="#FF6B00" />
                  <Text style={styles.logoutButtonText}>LEAVE THE COURT</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerContainer: {
    height: 110, // Adjust based on your status bar height
    zIndex: 1,
  },
  headerGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    margin: 10,
    marginTop: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#FF6B00',
  },
  ballOverlay: {
    position: 'absolute',
    right: 10,
    bottom: -10,
    backgroundColor: '#FF6B00',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  ballText: {
    fontSize: 16,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: -5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 12,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  profileQualification: {
    fontSize: 14,
    color: '#666',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  section: {
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    margin: 10,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  basketballIcon: {
    fontSize: 16,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  editActions: {
    margin: 10,
    marginTop: 5,
    marginBottom: 30,
  },
  saveButton: {
    borderRadius: 28,
    marginBottom: 10,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  cancelButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  actionButtons: {
    margin: 10,
    marginTop: 5,
    marginBottom: 30,
  },
  passwordButton: {
    borderRadius: 28,
    marginBottom: 10,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 1,
  },
  logoutButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  logoutButtonText: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 1,
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

export default ProfileScreen;