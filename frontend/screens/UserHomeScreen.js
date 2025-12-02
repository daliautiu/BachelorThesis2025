// UserHomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { assignmentService, notificationService } from '../services/api';

const UserHomeScreen = ({ navigation }) => {
  const { userInfo, signOut } = useContext(AuthContext);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [pendingGames, setPendingGames] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch assignments
      const assignmentsResponse = await assignmentService.getGameAssignments();
      const assignments = assignmentsResponse.data;
      
      // Get current date for filtering
      const currentDate = new Date();
      
      // Filter for upcoming accepted games
      const upcoming = assignments.filter(assignment => 
        assignment.status === 'accepted' && 
        new Date(assignment.Game.gameDate) >= currentDate
      );
      
      // Sort by date (nearest first)
      upcoming.sort((a, b) => 
        new Date(a.Game.gameDate) - new Date(b.Game.gameDate)
      );
      
      // Filter for pending games
      const pending = assignments.filter(assignment => 
        assignment.status === 'pending'
      );
      
      // Get unread notification count
      const notificationsResponse = await notificationService.getNotifications();
      const unreadCount = notificationsResponse.data.filter(notif => !notif.read).length;
      
      setUpcomingGames(upcoming.slice(0, 3)); // Take top 3
      setPendingGames(pending.slice(0, 3)); // Take top 3
      setUnreadNotifications(unreadCount);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
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
  
  const navigateToGames = () => {
    navigation.navigate('Games');
  };
  
  const navigateToAvailability = () => {
    navigation.navigate('Availability');
  };
  
  const navigateToNotifications = () => {
    navigation.navigate('Notifications');
  };
  
  const navigateToGameDetails = (gameId) => {
    navigation.navigate('GameDetails', { gameId });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={['#FF9500', '#FF6B00', '#000000']}
          style={styles.backgroundGradient}
        />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }
  
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
            <Text style={styles.headerTitle}>REFEREE DASHBOARD 🏀</Text>
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
            Welcome to your referee dashboard, {userInfo?.name || 'Referee'}!
          </Text>
          
          {/* Summary Cards */}
          <View style={styles.cardsContainer}>
            <TouchableOpacity 
              style={styles.summaryCard}
              onPress={navigateToGames}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="basketball-outline" size={32} color="#FF6B00" />
              </View>
              <Text style={styles.cardTitle}>Pending Games</Text>
              <Text style={styles.cardValue}>{pendingGames.length}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.summaryCard}
              onPress={navigateToGames}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="calendar-outline" size={32} color="#FF6B00" />
              </View>
              <Text style={styles.cardTitle}>Upcoming Games</Text>
              <Text style={styles.cardValue}>{upcomingGames.length}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.summaryCard}
              onPress={navigateToNotifications}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="notifications-outline" size={32} color="#FF6B00" />
              </View>
              <Text style={styles.cardTitle}>New Notifications</Text>
              <Text style={styles.cardValue}>{unreadNotifications}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Pending Assignments Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PENDING CALLS</Text>
              <TouchableOpacity onPress={navigateToGames}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {pendingGames.length > 0 ? (
              pendingGames.map((assignment, index) => (
                <TouchableOpacity 
                  key={assignment.id.toString()} 
                  style={styles.gameItem}
                  onPress={() => navigateToGameDetails(assignment.Game.id)}
                >
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameTeams}>{assignment.Game.teams}</Text>
                    <View style={styles.gameDetails}>
                      <View style={styles.gameDetail}>
                        <Ionicons name="calendar-outline" size={14} color="#666" />
                        <Text style={styles.gameDetailText}>{formatDate(assignment.Game.gameDate)}</Text>
                      </View>
                      <View style={styles.gameDetail}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.gameDetailText}>{assignment.Game.startTime}</Text>
                      </View>
                      <View style={styles.gameDetail}>
                        <Ionicons name="location-outline" size={14} color="#666" />
                        <Text style={styles.gameDetailText}>{assignment.Game.location}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Pending</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No pending games</Text>
              </View>
            )}
          </View>
          
          {/* Upcoming Games Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>UPCOMING GAMES</Text>
              <TouchableOpacity onPress={navigateToGames}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {upcomingGames.length > 0 ? (
              upcomingGames.map((assignment, index) => (
                <TouchableOpacity 
                  key={assignment.id.toString()} 
                  style={styles.gameItem}
                  onPress={() => navigateToGameDetails(assignment.Game.id)}
                >
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameTeams}>{assignment.Game.teams}</Text>
                    <View style={styles.gameDetails}>
                      <View style={styles.gameDetail}>
                        <Ionicons name="calendar-outline" size={14} color="#666" />
                        <Text style={styles.gameDetailText}>{formatDate(assignment.Game.gameDate)}</Text>
                      </View>
                      <View style={styles.gameDetail}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.gameDetailText}>{assignment.Game.startTime}</Text>
                      </View>
                      <View style={styles.gameDetail}>
                        <Ionicons name="location-outline" size={14} color="#666" />
                        <Text style={styles.gameDetailText}>{assignment.Game.location}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.acceptedBadge}>
                    <Text style={styles.acceptedText}>Confirmed</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No upcoming games</Text>
              </View>
            )}
          </View>
          
          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
              <Text style={styles.basketballIcon}>🏀</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={navigateToAvailability}
              >
                <LinearGradient
                  colors={['#ff9500', '#ff6b00']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="calendar" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Update Availability</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={navigateToGames}
              >
                <LinearGradient
                  colors={['#ff9500', '#ff6b00']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="basketball" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>View All Games</Text>
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
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 10,
    padding: 15,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardIcon: {
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
  seeAllText: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '600',
  },
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  gameInfo: {
    flex: 1,
  },
  gameTeams: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  gameDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 3,
  },
  gameDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  pendingBadge: {
    backgroundColor: '#f39c12',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pendingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  acceptedBadge: {
    backgroundColor: '#2ecc71',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  acceptedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
  basketballIcon: {
    fontSize: 16,
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

export default UserHomeScreen;