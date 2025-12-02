// 4. AdminHomeScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { gameService, assignmentService } from '../services/api';

const AdminHomeScreen = ({ navigation }) => {
  const { userInfo, signOut } = useContext(AuthContext);
  const [stats, setStats] = useState({
    players: 0,
    games: 0,
    trainings: 0,
    tournaments: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get games count
      const gamesResponse = await gameService.getGames();
      const games = gamesResponse.data.length;
      
      // Get pending assignments count
      const assignmentsResponse = await assignmentService.getGameAssignments();
      const pendingAssignments = assignmentsResponse.data.filter(
        a => a.status === 'pending'
      ).length;
      
      setStats({
        players: 24, // Mock data
        games: games,
        trainings: 8, // Mock data
        tournaments: 3 // Mock data
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };
  
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
  const navigateToGameManagement = () => {
    navigation.navigate('GameManagement');
  };
  
  const navigateToRefereeAvailability = () => {
    navigation.navigate('RefereeAvailability');
  };
  
  const navigateToAnalytics = () => {
    // Future feature
    Alert.alert('Coming Soon', 'This feature is under development');
  };
  
  return (
    <View style={styles.container}>
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
            <Text style={styles.headerTitle}>COACH DASHBOARD 🏀</Text>
            <View style={styles.logoSmall}>
              <Image 
                source={{ uri: 'https://scontent.fclj2-1.fna.fbcdn.net/v/t39.30808-6/273667374_4802222356558884_4149234771085627033_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pZpaqoAUrBQQ7kNvwE_vkG1&_nc_oc=Adk649FvQu7GKHYX8jhp0iXDnXjBNCPNrm7pc6P4DwkWUKh6iD8Ol2HMM3JJ0FHFphw&_nc_zt=23&_nc_ht=scontent.fclj2-1.fna&_nc_gid=MYszYHsyAHBEi_9cZ12Cow&oh=00_AfE_V3hDznWhmjj7Sd25fZyEInh5oxQUK04sl59Bpvj1Zw&oe=6802CD85' }}
                style={styles.logoImage}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>
            Welcome to your admin dashboard, {userInfo?.name || 'Coach'}!
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B00" />
              <Text style={styles.loadingText}>Loading stats...</Text>
            </View>
          ) : (
            <View style={styles.statSection}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>TEAM STATS</Text>
                <Text style={styles.basketballIcon}>🏀</Text>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Ionicons name="people-outline" size={32} color="#FF6B00" />
                  <Text style={styles.statValue}>{stats.players}</Text>
                  <Text style={styles.statLabel}>Players</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="calendar-outline" size={32} color="#FF6B00" />
                  <Text style={styles.statValue}>{stats.games}</Text>
                  <Text style={styles.statLabel}>Games</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={32} color="#FF6B00" />
                  <Text style={styles.statValue}>{stats.trainings}</Text>
                  <Text style={styles.statLabel}>Training Sessions</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="trophy-outline" size={32} color="#FF6B00" />
                  <Text style={styles.statValue}>{stats.tournaments}</Text>
                  <Text style={styles.statLabel}>Tournaments</Text>
                </View>
              </View>
              
              <View style={styles.basketballLines}>
                <View style={styles.line}></View>
                <View style={styles.line}></View>
              </View>
            </View>
          )}
          
          <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
              <Text style={styles.basketballIcon}>🏀</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={navigateToGameManagement}
              >
                <LinearGradient
                  colors={['#ff9500', '#ff6b00']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="people" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Manage Games</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={navigateToRefereeAvailability}
              >
                <LinearGradient
                  colors={['#ff9500', '#ff6b00']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="calendar" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Referee Availability</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={navigateToAnalytics}
              >
                <LinearGradient
                  colors={['#ff9500', '#ff6b00']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="stats-chart" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>View Analytics</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
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
            
            <View style={styles.basketballLines}>
              <View style={styles.line}></View>
              <View style={styles.line}></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  logoSmall: {
    height: 40,
    width: 40,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  statSection: {
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
    paddingBottom: 10,
    marginBottom: 15,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  basketballIcon: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  quickActionsSection: {
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
    paddingBottom: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButtons: {
    width: '100%',
  },
  actionButton: {
    borderRadius: 28,
    marginBottom: 10,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  logoutButtonText: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 14,
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

export default AdminHomeScreen;