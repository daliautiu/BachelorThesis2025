// 5. GameAssignmentsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { assignmentService } from '../services/api';

// Format date
const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const GameAssignmentsScreen = ({ navigation }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending, upcoming, past
  
  // Fetch assignments when component mounts or when activeTab changes
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await assignmentService.getGameAssignments();
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      Alert.alert('Error', 'Failed to load assignments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAssignments();
    setRefreshing(false);
  };
  
  // Handle accepting an assignment
  const handleAccept = (id) => {
    Alert.alert(
      'Jump into the Game?',
      'Are you ready to accept this assignment and join the game?',
      [
        {
          text: 'Not Now',
          style: 'cancel',
        },
        {
          text: 'I\'m In! 🏀',
          onPress: async () => {
            try {
              setLoading(true);
              await assignmentService.acceptAssignment(id);
              
              // Update the assignment status locally
              const updatedAssignments = assignments.map(assignment => 
                assignment.id === id ? { ...assignment, status: 'accepted' } : assignment
              );
              setAssignments(updatedAssignments);
              
              Alert.alert('Success! 🏀', 'You have joined the game!');
              setLoading(false);
            } catch (error) {
              console.error('Error accepting assignment:', error);
              Alert.alert('Error', 'Failed to accept assignment. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  // Handle declining an assignment
  const handleDecline = (id) => {
    Alert.alert(
      'Sit This One Out?',
      'Are you sure you want to decline this game assignment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline Game',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await assignmentService.declineAssignment(id);
              
              // Update the assignment status locally
              const updatedAssignments = assignments.map(assignment => 
                assignment.id === id ? { ...assignment, status: 'declined' } : assignment
              );
              setAssignments(updatedAssignments);
              
              Alert.alert('Noted', 'You\'ve been removed from this game.');
              setLoading(false);
            } catch (error) {
              console.error('Error declining assignment:', error);
              Alert.alert('Error', 'Failed to decline assignment. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  // Filter assignments based on active tab
  const getFilteredAssignments = () => {
    const currentDate = new Date();
    
    switch (activeTab) {
      case 'pending':
        return assignments.filter(assignment => assignment.status === 'pending');
      case 'upcoming':
        return assignments.filter(assignment => 
          assignment.status === 'accepted' && new Date(assignment.Game.gameDate) >= currentDate
        );
      case 'past':
        return assignments.filter(assignment => 
          (assignment.status === 'accepted' && new Date(assignment.Game.gameDate) < currentDate) ||
          assignment.status === 'declined'
        );
      default:
        return assignments;
    }
  };
  
  // View game details
  const viewGameDetails = (gameId) => {
    // Navigate to game details screen
    navigation.navigate('GameDetails', { gameId });
  };
  
  // Render assignment item
  const renderAssignmentItem = ({ item }) => {
    const isPending = item.status === 'pending';
    const isAccepted = item.status === 'accepted';
    const isDeclined = item.status === 'declined';
    
    let statusLabel = isPending ? 'Waiting for Call' : (isAccepted ? 'Game On!' : 'Game Off!');
    let statusColors = isPending 
      ? ['#f39c12', '#e67e22'] 
      : (isAccepted ? ['#2ecc71', '#27ae60'] : ['#e74c3c', '#c0392b']);
    
    const game = item.Game;
    
    return (
      <TouchableOpacity 
        style={styles.assignmentCard}
        onPress={() => viewGameDetails(game.id)}
      >
        <View style={styles.assignmentHeader}>
          <Text style={styles.teamText}>{game.teams}</Text>
          <LinearGradient
            colors={statusColors}
            style={styles.statusBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.statusText}>{statusLabel}</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.assignmentInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="calendar-outline" size={16} color="#FF6B00" />
            </View>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{formatDate(game.gameDate)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="time-outline" size={16} color="#FF6B00" />
            </View>
            <Text style={styles.infoLabel}>Time:</Text>
            <Text style={styles.infoValue}>{game.startTime} - {game.endTime}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="location-outline" size={16} color="#FF6B00" />
            </View>
            <Text style={styles.infoLabel}>Court:</Text>
            <Text style={styles.infoValue}>{game.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="person-outline" size={16} color="#FF6B00" />
            </View>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{item.role}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="cash-outline" size={16} color="#FF6B00" />
            </View>
            <Text style={styles.infoLabel}>Fee:</Text>
            <Text style={styles.infoValue}>{item.fee || game.fee}</Text>
          </View>
        </View>
        
        {isPending && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleAccept(item.id)}
            >
              <LinearGradient
                colors={['#2ecc71', '#27ae60']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionButtonText}>JOIN GAME 🏀</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDecline(item.id)}
            >
              <LinearGradient
                colors={['#e74c3c', '#c0392b']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionButtonText}>SIT OUT</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.basketballLines}>
          <View style={styles.line}></View>
          <View style={styles.line}></View>
        </View>
      </TouchableOpacity>
    );
  };
  
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
            <Text style={styles.headerTitle}>GAME ASSIGNMENTS 🏀</Text>
            <View style={styles.logoSmall}>
              <Image 
                source={{ uri: 'https://scontent.fclj2-1.fna.fbcdn.net/v/t39.30808-6/273667374_4802222356558884_4149234771085627033_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pZpaqoAUrBQQ7kNvwE_vkG1&_nc_oc=Adk649FvQu7GKHYX8jhp0iXDnXjBNCPNrm7pc6P4DwkWUKh6iD8Ol2HMM3JJ0FHFphw&_nc_zt=23&_nc_ht=scontent.fclj2-1.fna&_nc_gid=MYszYHsyAHBEi_9cZ12Cow&oh=00_AfE_V3hDznWhmjj7Sd25fZyEInh5oxQUK04sl59Bpvj1Zw&oe=6802CD85' }}
                style={styles.logoImage}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            PENDING CALLS
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            UPCOMING GAMES
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            GAME HISTORY
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading assignments...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredAssignments()}
          renderItem={renderAssignmentItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>
                No {activeTab} games found
              </Text>
              <Text style={styles.emptySubtext}>
                Check back later for new assignments
              </Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF6B00',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  assignmentCard: {
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  assignmentInfo: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 8,
    borderRadius: 8,
  },infoIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 5,
  },
  infoLabel: {
    width: 50,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 15,
  },
  actionButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  actionGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyList: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    color: '#555',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#777',
    fontSize: 14,
    textAlign: 'center',
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
export default GameAssignmentsScreen;