// 10. GameManagementScreen.js (Admin Only)
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Modal, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { gameService, assignmentService } from '../services/api';

// Format date
const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const GameManagementScreen = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [newGame, setNewGame] = useState({
    teams: '',
    gameDate: new Date().toISOString().split('T')[0], // Today in format YYYY-MM-DD
    startTime: '15:00',
    endTime: '17:00',
    location: '',
    address: '',
    league: '',
    division: '',
    notes: '',
    fee: '',
    refereesNeeded: 3
  });
  
  useEffect(() => {
    fetchGames();
  }, []);
  
  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await gameService.getGames();
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      Alert.alert('Error', 'Failed to load games');
      setLoading(false);
    }
  };
  
  // Get filtered games
  const getFilteredGames = () => {
    if (!searchQuery) return games;
    
    return games.filter(game => {
      const searchLower = searchQuery.toLowerCase();
      return (
        game.teams.toLowerCase().includes(searchLower) ||
        game.location.toLowerCase().includes(searchLower) ||
        (game.league && game.league.toLowerCase().includes(searchLower)) ||
        (game.division && game.division.toLowerCase().includes(searchLower))
      );
    });
  };
  
  // Add new game
  const addNewGame = async () => {
    // Validate form
    if (!newGame.teams || !newGame.location || !newGame.gameDate) {
      Alert.alert('Error', 'Teams, location, and date are required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await gameService.createGame(newGame);
      
      // Add new game to state
      setGames([...games, response.data]);
      
      // Reset form and close modal
      setNewGame({
        teams: '',
        gameDate: new Date().toISOString().split('T')[0],
        startTime: '15:00',
        endTime: '17:00',
        location: '',
        address: '',
        league: '',
        division: '',
        notes: '',
        fee: '',
        refereesNeeded: 3
      });
      setShowAddGameModal(false);
      setLoading(false);
      
      Alert.alert('Success', 'Game added successfully');
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', 'Failed to add game');
      setLoading(false);
    }
  };
  
  // Delete game
  const deleteGame = (gameId) => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await gameService.deleteGame(gameId);
              
              // Remove game from state
              setGames(games.filter(game => game.id !== gameId));
              
              setLoading(false);
              Alert.alert('Success', 'Game deleted successfully');
            } catch (error) {
              console.error('Error deleting game:', error);
              Alert.alert('Error', 'Failed to delete game');
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  // View game details
  const viewGameDetails = (gameId) => {
    navigation.navigate('GameDetails', { gameId });
  };
  
  // Assign referees
  const assignReferees = (gameId) => {
    // Navigate to a referee assignment screen (not implemented in this example)
    Alert.alert('Assign Referees', 'This feature will be available soon!');
  };
  
  // Render game item
  const renderGameItem = ({ item }) => {
    // Calculate how many referees have been assigned vs. needed
    const refereesFilled = item.Users ? item.Users.length : 0;
    const refereesNeeded = item.refereesNeeded || 3;
    
    const refereeStatus = refereesFilled === refereesNeeded 
      ? 'complete' 
      : (refereesFilled === 0 ? 'empty' : 'partial');
      
    return (
      <View style={styles.gameItem}>
        <TouchableOpacity 
          style={styles.gameContent}
          onPress={() => viewGameDetails(item.id)}
        >
          <View style={styles.gameHeader}>
            <Text style={styles.gameTeams}>{item.teams}</Text>
            <View style={[
              styles.statusBadge, 
              refereeStatus === 'complete' 
                ? styles.completeStatus 
                : (refereeStatus === 'partial' ? styles.partialStatus : styles.emptyStatus)
            ]}>
              <Text style={styles.statusText}>
                {refereesFilled}/{refereesNeeded} Refs
              </Text>
            </View>
          </View>
          
          <View style={styles.gameInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{formatDate(item.gameDate)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{item.startTime} - {item.endTime}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{item.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{item.league || 'N/A'} - {item.division || 'N/A'}</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.gameActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => assignReferees(item.id)}
          >
            <Ionicons name="person-add-outline" size={20} color="#3498db" />
            <Text style={styles.actionText}>Assign</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => viewGameDetails(item.id)}
          >
            <Ionicons name="eye-outline" size={20} color="#2ecc71" />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => deleteGame(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  if (loading && !games.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading games...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9500', '#FF6B00', '#000000']}
        style={styles.backgroundGradient}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Game Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddGameModal(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Game</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={getFilteredGames()}
        renderItem={renderGameItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No games found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Add a game to get started'}
            </Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchGames}
      />
      
      {/* Add Game Modal */}
      <Modal
        visible={showAddGameModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddGameModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Game</Text>
              <TouchableOpacity onPress={() => setShowAddGameModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <Text style={styles.formLabel}>Teams <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Team A vs Team B"
                value={newGame.teams}
                onChangeText={(text) => setNewGame({...newGame, teams: text})}
              />
              
              <Text style={styles.formLabel}>Date <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                value={newGame.gameDate}
                onChangeText={(text) => setNewGame({...newGame, gameDate: text})}
              />
              
              <View style={styles.timeInputRow}>
                <View style={styles.timeInputContainer}>
                  <Text style={styles.formLabel}>Start Time <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="HH:MM"
                    value={newGame.startTime}
                    onChangeText={(text) => setNewGame({...newGame, startTime: text})}
                  />
                </View>
                
                <View style={styles.timeInputContainer}>
                  <Text style={styles.formLabel}>End Time <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="HH:MM"
                    value={newGame.endTime}
                    onChangeText={(text) => setNewGame({...newGame, endTime: text})}
                  />
                </View>
              </View>
              
              <Text style={styles.formLabel}>Location <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter location"
                value={newGame.location}
                onChangeText={(text) => setNewGame({...newGame, location: text})}
              />
              
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter address"
                value={newGame.address}
                onChangeText={(text) => setNewGame({...newGame, address: text})}
              />
              
              <Text style={styles.formLabel}>League</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter league"
                value={newGame.league}
                onChangeText={(text) => setNewGame({...newGame, league: text})}
              />
              
              <Text style={styles.formLabel}>Division</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter division"
                value={newGame.division}
                onChangeText={(text) => setNewGame({...newGame, division: text})}
              />
              
              <Text style={styles.formLabel}>Fee</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter fee"
                value={newGame.fee}
                onChangeText={(text) => setNewGame({...newGame, fee: text})}
                keyboardType="numeric"
              />
              
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Add any notes about this game"
                value={newGame.notes}
                onChangeText={(text) => setNewGame({...newGame, notes: text})}
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.formLabel}>Number of Referees Needed</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => {
                    if (newGame.refereesNeeded > 1) {
                      setNewGame({...newGame, refereesNeeded: newGame.refereesNeeded - 1});
                    }
                  }}
                >
                  <Ionicons name="remove" size={20} color="#333" />
                </TouchableOpacity>
                
                <Text style={styles.counterValue}>{newGame.refereesNeeded}</Text>
                
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => {
                    setNewGame({...newGame, refereesNeeded: newGame.refereesNeeded + 1});
                  }}
                >
                  <Ionicons name="add" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAddGameModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={addNewGame}
                >
                  <Text style={styles.saveButtonText}>Add Game</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  gameItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  gameContent: {
    padding: 15,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameTeams: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  completeStatus: {
    backgroundColor: '#2ecc71',
  },
  partialStatus: {
    backgroundColor: '#f39c12',
  },
  emptyStatus: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  gameInfo: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  gameActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalForm: {
    padding: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  required: {
    color: '#e74c3c',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    width: '48%',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  counterValue: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default GameManagementScreen;