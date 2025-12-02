// 7. GameDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { gameService, assignmentService } from '../services/api';

// Format date
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const GameDetailsScreen = ({ route, navigation }) => {
  const { gameId } = route.params || {};
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAssignment, setUserAssignment] = useState(null);
  
  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);
  
  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      
      if (!gameId) {
        Alert.alert('Error', 'Game ID is required');
        navigation.goBack();
        return;
      }
      
      const response = await gameService.getGameDetails(gameId);
      setGame(response.data);
      
      // Find the user's assignment for this game
      const assignmentsResponse = await assignmentService.getGameAssignments();
      const assignments = assignmentsResponse.data;
      
      const myAssignment = assignments.find(a => a.Game.id === parseInt(gameId));
      setUserAssignment(myAssignment);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching game details:', error);
      Alert.alert('Error', 'Failed to load game details');
      setLoading(false);
      navigation.goBack();
    }
  };
  
  // Get directions - in a real app, this would open maps
  const getDirections = () => {
    if (game && game.address) {
      Alert.alert('Get Directions to Court', 'This would open your maps app with directions to: ' + game.address);
    } else {
      Alert.alert('Address Not Available', 'No address provided for this game.');
    }
  };
  
  // Handle accept/decline for this specific game
  const handleAcceptGame = async () => {
    if (!userAssignment) return;
    
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
              await assignmentService.acceptAssignment(userAssignment.id);
              
              // Update the assignment status locally
              setUserAssignment({ ...userAssignment, status: 'accepted' });
              
              Alert.alert('Success! 🏀', 'You have joined the game!');
              setLoading(false);
            } catch (error) {
              console.error('Error accepting game:', error);
              Alert.alert('Error', 'Failed to accept game. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  const handleDeclineGame = async () => {
    if (!userAssignment) return;
    
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
              await assignmentService.declineAssignment(userAssignment.id);
              
              // Update the assignment status locally
              setUserAssignment({ ...userAssignment, status: 'declined' });
              
              Alert.alert('Noted', 'You\'ve been removed from this game.');
              setLoading(false);
            } catch (error) {
              console.error('Error declining game:', error);
              Alert.alert('Error', 'Failed to decline game. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#FF9500', '#FF6B00', '#000000']}
          style={styles.backgroundGradient}
        />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading game details...</Text>
      </View>
    );
  }
  
  if (!game) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FF9500', '#FF6B00', '#000000']}
          style={styles.backgroundGradient}
        />
        <Text style={styles.errorText}>Game not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={['#ff9500', '#ff6b00']}
            style={styles.buttonGradient}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#FF9500', '#FF6B00', '#000000']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView style={styles.container}>
        <TouchableOpacity 
          style={styles.backButtonTop}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.gameHeader}>
          <LinearGradient
            colors={['#FF6B00', '#000000']}
            style={styles.headerGradient}
          >
            <Text style={styles.teamText}>{game.teams}</Text>
            <Text style={styles.dateText}>{formatDate(game.gameDate)}</Text>
            <View style={styles.timeLocationContainer}>
              <View style={styles.iconTextContainer}>
                <Ionicons name="time-outline" size={20} color="#fff" />
                <Text style={styles.infoText}>{game.startTime} - {game.endTime}</Text>
              </View>
              <View style={styles.iconTextContainer}>
                <Ionicons name="location-outline" size={20} color="#fff" />
                <Text style={styles.infoText}>{game.location}</Text>
              </View>
            </View>
            <View style={styles.feeContainer}>
              <Ionicons name="cash-outline" size={20} color="#fff" />
              <Text style={styles.feeText}>Fee: {game.fee}</Text>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>GAME DETAILS</Text>
            <Text style={styles.basketballIcon}>🏀</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="basketball-outline" size={18} color="#FF6B00" />
            </View>
            <Text style={styles.detailLabel}>League:</Text>
            <Text style={styles.detailValue}>{game.league || 'Not specified'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="people-outline" size={18} color="#FF6B00" />
            </View>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{game.division || 'Not specified'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="flag-outline" size={18} color="#FF6B00" />
            </View>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>
              {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="navigate-outline" size={18} color="#FF6B00" />
            </View>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{game.address || 'Address not available'}</Text>
          </View>

          
          
          <TouchableOpacity style={styles.directionsButton} onPress={getDirections}>
            <LinearGradient
              colors={['#3498db', '#2980b9']}
              style={styles.directionsGradient}
            >
              <Ionicons name="navigate-outline" size={20} color="#fff" />
              <Text style={styles.directionsButtonText}>Get Directions to Court</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.basketballLines}>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>OFFICIAL ASSIGNMENTS</Text>
            <Text style={styles.basketballIcon}>🏀</Text>
          </View>
          
          {game.Users && game.Users.length > 0 ? (
            game.Users.map(user => {
              const assignment = user.Assignment;
              let statusLabel = assignment.status === 'pending' ? 'Waiting for Call' : 
                              (assignment.status === 'accepted' ? 'Game On!' : 'unaccepted');
              let statusColors = assignment.status === 'pending' 
                ? ['#f39c12', '#e67e22'] 
                : (assignment.status === 'accepted' ? ['#2ecc71', '#27ae60'] : ['#e74c3c', '#c0392b']);
              
              return (
                <View key={user.id} style={styles.refereeItem}>
                  <View>
                    <Text style={styles.refereeName}>{user.name}</Text>
                    <Text style={styles.refereeRole}>{assignment.role}</Text>
                  </View>
                  <LinearGradient
                    colors={statusColors}
                    style={styles.statusBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.statusText}>{statusLabel}</Text>
                  </LinearGradient>
                </View>
              );
            })
          ) : (
            <Text style={styles.noDataText}>No officials assigned yet</Text>
          )}
          
          <View style={styles.basketballLines}>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
        </View>
        
        {game.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}> NOTES</Text>
              <Text style={styles.basketballIcon}>🏀</Text>
            </View>
            
            <Text style={styles.notesText}>{game.notes}</Text>
            
            <View style={styles.basketballLines}>
              <View style={styles.line}></View>
              <View style={styles.line}></View>
            </View>
          </View>
        )}
        
        {/* Action buttons - only show for pending assignments for current user */}
        {userAssignment && userAssignment.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAcceptGame}
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
              onPress={handleDeclineGame}
            >
              <LinearGradient
                colors={['#e74c3c', '#c0392b']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionButtonText}>SIT THIS ONE OUT</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  errorText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  backButton: {
    width: 120,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButtonTop: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 10,
    padding: 5,
  },
  gameHeader: {
    paddingTop: 50,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 25,
  },
  teamText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginTop: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    opacity: 0.9,
  },
  timeLocationContainer: {
    marginTop: 5,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#fff',
    marginLeft: 8,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  feeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  section: {
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    margin: 15,
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
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
    letterSpacing: 0.5,
  },
  basketballIcon: {
    fontSize: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  detailIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 5,
  },
  detailLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  directionsButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
  },
  directionsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  directionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  refereeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 5,
  },
  refereeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  refereeRole: {
    fontSize: 14,
    color: '#666',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
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
  notesText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  noDataText: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
  actionButtons: {
    margin: 15,
    marginTop: 5,
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 10,
  },
  actionGradient: {
    padding: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
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

export default GameDetailsScreen;