// 11. RefereeAvailabilityScreen.js (Admin Only)
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  ActivityIndicator 
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { refereeService } from '../services/api';

const RefereeAvailabilityScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [referees, setReferees] = useState([]);
  const [filteredReferees, setFilteredReferees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'available', 'unavailable', 'tentative'
  const [availabilityData, setAvailabilityData] = useState({});
  
  // Get the first and last day of the current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const startDate = firstDay.toISOString().split('T')[0];
  const endDate = lastDay.toISOString().split('T')[0];
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get referee availability data
      const availResponse = await refereeService.getRefereeAvailability(startDate, endDate);
      
      // Process the data for easier access
      const availabilityMap = {};
      availResponse.data.forEach(item => {
        if (!availabilityMap[item.userId]) {
          availabilityMap[item.userId] = {};
        }
        availabilityMap[item.userId][item.date] = item.type;
      });
      
      setAvailabilityData(availabilityMap);
      
      // Extract unique referees from availability data
      const uniqueRefereeIds = [...new Set(availResponse.data.map(item => item.User.id))];
      const uniqueReferees = uniqueRefereeIds.map(id => {
        const refData = availResponse.data.find(item => item.User.id === id);
        return refData.User;
      });
      
      setReferees(uniqueReferees);
      setFilteredReferees(uniqueReferees);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching referee data:', error);
      setLoading(false);
    }
  };
  
  // Handle date selection
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    filterReferees(day.dateString, filterType, searchQuery);
  };
  
  // Filter referees based on search query, selected date, and availability type
  const filterReferees = (date = selectedDate, type = filterType, query = searchQuery) => {
    // First filter by search query
    let filtered = referees;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(referee => 
        referee.name.toLowerCase().includes(lowerQuery) ||
        referee.email.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Then filter by date and availability type if a date is selected
    if (date) {
      if (type !== 'all') {
        filtered = filtered.filter(referee => 
          availabilityData[referee.id] && 
          availabilityData[referee.id][date] === type
        );
      }
    }
    
    setFilteredReferees(filtered);
  };
  
  // Get marked dates for calendar
  const getMarkedDates = () => {
    const markedDates = {};
    
    Object.keys(availabilityData).forEach(userId => {
      Object.keys(availabilityData[userId]).forEach(date => {
        const availType = availabilityData[userId][date];
        
        if (!markedDates[date]) {
          markedDates[date] = { dots: [] };
        }
        
        // Only add a dot if we don't already have one for this type
        const dotColor = getColorForType(availType);
        if (!markedDates[date].dots.some(dot => dot.color === dotColor)) {
          markedDates[date].dots.push({
            key: `${userId}-${availType}`,
            color: dotColor
          });
        }
      });
    });
    
    // Add selected date marker
    if (selectedDate) {
      if (markedDates[selectedDate]) {
        markedDates[selectedDate] = {
          ...markedDates[selectedDate],
          selected: true,
          selectedColor: 'rgba(52, 152, 219, 0.3)' // Light blue
        };
      } else {
        markedDates[selectedDate] = {
          selected: true,
          selectedColor: 'rgba(52, 152, 219, 0.3)'
        };
      }
    }
    
    return markedDates;
  };
  
  // Get color for availability type
  const getColorForType = (type) => {
    switch(type) {
      case 'AVAILABLE':
        return '#2ecc71'; // green
      case 'UNAVAILABLE':
        return '#e74c3c'; // red
      case 'TENTATIVE':
        return '#f39c12'; // orange
      default:
        return '#bdc3c7'; // gray
    }
  };
  
  // Handle filter type change
  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    filterReferees(selectedDate, type, searchQuery);
  };
  
  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    filterReferees(selectedDate, filterType, text);
  };
  
  // Render referee item
  const renderRefereeItem = ({ item }) => {
    // Get availability for selected date
    let availabilityStatus = 'Not Set';
    let statusColor = '#bdc3c7'; // gray
    
    if (selectedDate && 
        availabilityData[item.id] && 
        availabilityData[item.id][selectedDate]) {
      const availType = availabilityData[item.id][selectedDate];
      availabilityStatus = availType.charAt(0) + availType.slice(1).toLowerCase();
      statusColor = getColorForType(availType);
    }
    
    return (
      <TouchableOpacity 
        style={styles.refereeItem}
        onPress={() => {
          // In a real app, navigate to referee detail or handle action
          // For now just show an alert
          Alert.alert(`Referee Details`, `View ${item.name}'s full availability`);
        }}
      >
        <View style={styles.refereeInfo}>
          <Text style={styles.refereeName}>{item.name}</Text>
          <Text style={styles.refereeEmail}>{item.email}</Text>
          <Text style={styles.refereePhone}>{item.phone || 'No phone provided'}</Text>
        </View>
        
        {selectedDate && (
          <View style={[styles.availabilityStatus, { backgroundColor: statusColor }]}>
            <Text style={styles.availabilityText}>{availabilityStatus}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading referee availability...</Text>
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
        <Text style={styles.title}>Referee Availability</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.calendarContainer}>
        <Calendar
          markingType={'multi-dot'}
          markedDates={getMarkedDates()}
          onDayPress={handleDayPress}
          theme={{
            calendarBackground: '#f4f4f4',
            textSectionTitleColor: '#000',
            todayTextColor: '#FF6B00',
            dayTextColor: '#333',
            textDisabledColor: '#d9e1e8',
            dotColor: '#FF6B00',
            selectedDotColor: '#fff',
            arrowColor: '#FF6B00',
            monthTextColor: '#000',
            textMonthFontWeight: 'bold',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
        />
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2ecc71' }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.legendText}>Unavailable</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f39c12' }]} />
          <Text style={styles.legendText}>Maybe</Text>
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search referees..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        
        {selectedDate && (
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
              onPress={() => handleFilterTypeChange('all')}
            >
              <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'AVAILABLE' && styles.activeFilter, styles.availableFilter]}
              onPress={() => handleFilterTypeChange('AVAILABLE')}
            >
              <Text style={[styles.filterText, filterType === 'AVAILABLE' && styles.activeFilterText]}>Available</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'TENTATIVE' && styles.activeFilter, styles.tentativeFilter]}
              onPress={() => handleFilterTypeChange('TENTATIVE')}
            >
              <Text style={[styles.filterText, filterType === 'TENTATIVE' && styles.activeFilterText]}>Maybe</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'UNAVAILABLE' && styles.activeFilter, styles.unavailableFilter]}
              onPress={() => handleFilterTypeChange('UNAVAILABLE')}
            >
              <Text style={[styles.filterText, filterType === 'UNAVAILABLE' && styles.activeFilterText]}>Unavailable</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>
          {selectedDate ? `Referees for ${selectedDate}` : 'All Referees'}
        </Text>
        <Text style={styles.refereeCount}>{filteredReferees.length} referees</Text>
      </View>
      
      <FlatList
        data={filteredReferees}
        renderItem={renderRefereeItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No referees match the current filters</Text>
          </View>
        }
      />
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  filterContainer: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#3498db',
  },
  availableFilter: {
    borderBottomColor: '#2ecc71',
    borderBottomWidth: 3,
  },
  tentativeFilter: {
    borderBottomColor: '#f39c12',
    borderBottomWidth: 3,
  },
  unavailableFilter: {
    borderBottomColor: '#e74c3c',
    borderBottomWidth: 3,
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  refereeCount: {
    fontSize: 14,
    color: '#888',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  refereeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  refereeInfo: {
    flex: 1,
  },
  refereeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  refereeEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  refereePhone: {
    fontSize: 14,
    color: '#666',
  },
  availabilityStatus: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  availabilityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyList: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    marginTop: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default RefereeAvailabilityScreen;