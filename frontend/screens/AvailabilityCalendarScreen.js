// 6. AvailabilityCalendarScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { refereeService } from '../services/api';

// Configure calendar locale
LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};
LocaleConfig.defaultLocale = 'en';

const AvailabilityCalendarScreen = ({ navigation }) => {
  const [selectedDates, setSelectedDates] = useState({});
  const [availabilityType, setAvailabilityType] = useState('AVAILABLE'); // 'AVAILABLE', 'UNAVAILABLE', 'TENTATIVE'
  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  
  useEffect(() => {
    fetchAvailability();
  }, []);
  
  // Function to fetch referee availability
  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await refereeService.getAvailability();
      
      // Format the availability data for the calendar
      const formattedDates = {};
      response.data.forEach(item => {
        const dateString = item.date; // assuming date is in YYYY-MM-DD format
        let dotColor = '#2ecc71'; // green for available
        
        if (item.type === 'UNAVAILABLE') {
          dotColor = '#e74c3c'; // red for unavailable
        } else if (item.type === 'TENTATIVE') {
          dotColor = '#f39c12'; // orange for tentative/maybe
        }
        
        formattedDates[dateString] = {
          selected: true,
          marked: true,
          selectedColor: dotColor,
          type: item.type
        };
      });
      
      setSelectedDates(formattedDates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching availability:', error);
      Alert.alert('Error', 'Failed to load your availability. Please try again.');
      setLoading(false);
    }
  };
  
  // Function to handle date selection on the calendar
  const handleDayPress = (day) => {
    const dateString = day.dateString;
    
    // Create a copy of selected dates
    const updatedSelectedDates = { ...selectedDates };
    
    // Check if date is already selected
    if (dateString in updatedSelectedDates) {
      // If already selected with same type, remove it
      if (updatedSelectedDates[dateString].type === availabilityType) {
        delete updatedSelectedDates[dateString];
      } else {
        // If selected with different type, update the type
        updatedSelectedDates[dateString] = {
          ...updatedSelectedDates[dateString],
          type: availabilityType,
          selectedColor: getColorForType(availabilityType)
        };
      }
    } else {
      // Not selected, add it with current availability type
      updatedSelectedDates[dateString] = {
        selected: true,
        marked: true,
        selectedColor: getColorForType(availabilityType),
        type: availabilityType
      };
    }
    
    setSelectedDates(updatedSelectedDates);
  };
  
  // Helper function to get color for availability type
  const getColorForType = (type) => {
    switch(type) {
      case 'AVAILABLE':
        return '#2ecc71'; // green
      case 'UNAVAILABLE':
        return '#e74c3c'; // red
      case 'TENTATIVE':
        return '#f39c12'; // orange
      default:
        return '#2ecc71'; // default green
    }
  };
  
  // Function to change availability type
  const changeAvailabilityType = (type) => {
    setAvailabilityType(type);
  };
  
  // Function to save availability
  const saveAvailability = async () => {
    try {
      setSavingLoading(true);
      
      // Format the data for the API
      const availabilities = {};
      Object.keys(selectedDates).forEach(date => {
        availabilities[date] = selectedDates[date].type;
      });
      
      await refereeService.updateAvailability({ availabilities });
      
      Alert.alert(
        'Success! 🏀',
        'Your game availability has been saved!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      
      setSavingLoading(false);
    } catch (error) {
      console.error('Error saving availability:', error);
      Alert.alert('Error', 'Failed to save your availability. Please try again.');
      setSavingLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <LinearGradient
          colors={['#FF9500', '#FF6B00', '#000000']}
          style={styles.backgroundGradient}
        />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading your schedule...</Text>
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
            <Text style={styles.headerTitle}>GAMES SCHEDULE 🏀</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.subheaderContainer}>
          <Text style={styles.title}>Set Your Court Time</Text>
          <Text style={styles.subtitle}>
            Select dates when you're ready to whistle 🏀
          </Text>
        </View>
        
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            markingType={'dot'}
            theme={{
              calendarBackground: '#f4f4f4',
              textSectionTitleColor: '#000',
              selectedDayBackgroundColor: '#FF6B00',
              selectedDayTextColor: '#fff',
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AVAILABILITY LEGEND</Text>
            <Text style={styles.basketballIcon}>🏀</Text>
          </View>
          
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
          
          <View style={styles.basketballLines}>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
        </View>
        
        <View style={styles.optionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SELECT YOUR STATUS</Text>
            <Text style={styles.basketballIcon}>🏀</Text>
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                availabilityType === 'AVAILABLE' && styles.selectedAvailableButton,
              ]}
              onPress={() => changeAvailabilityType('AVAILABLE')}
            >
              <LinearGradient
                colors={availabilityType === 'AVAILABLE' 
                  ? ['#2ecc71', '#27ae60'] 
                  : ['#f4f4f4', '#f4f4f4']}
                style={styles.optionGradient}
              >
                <Text style={[
                  styles.optionButtonText,
                  availabilityType === 'AVAILABLE' && styles.selectedButtonText
                ]}>
                  Available
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                availabilityType === 'UNAVAILABLE' && styles.selectedUnavailableButton,
              ]}
              onPress={() => changeAvailabilityType('UNAVAILABLE')}
            >
              <LinearGradient
                colors={availabilityType === 'UNAVAILABLE' 
                  ? ['#e74c3c', '#c0392b'] 
                  : ['#f4f4f4', '#f4f4f4']}
                style={styles.optionGradient}
              >
                <Text style={[
                  styles.optionButtonText,
                  availabilityType === 'UNAVAILABLE' && styles.selectedButtonText
                ]}>
                  Unavailable
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                availabilityType === 'TENTATIVE' && styles.selectedMaybeButton,
              ]}
              onPress={() => changeAvailabilityType('TENTATIVE')}
            >
              <LinearGradient
                colors={availabilityType === 'TENTATIVE' 
                  ? ['#f39c12', '#d35400'] 
                  : ['#f4f4f4', '#f4f4f4']}
                style={styles.optionGradient}
              >
                <Text style={[
                  styles.optionButtonText,
                  availabilityType === 'TENTATIVE' && styles.selectedButtonText
                ]}>
                  It depends
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.basketballLines}>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveAvailability}
          disabled={savingLoading}
        >
          <LinearGradient
            colors={['#ff9500', '#ff6b00']}
            style={styles.saveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {savingLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>SAVE MY SCHEDULE 🏀</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.spacer} />
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
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  subheaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  calendarContainer: {
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  legendContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
  },
  basketballIcon: {
    fontSize: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  legendDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  legendText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    borderRadius: 8,
    marginHorizontal: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAvailableButton: {
    borderColor: '#27ae60',
  },
  selectedUnavailableButton: {
    borderColor: '#c0392b',
  },
  selectedMaybeButton: {
    borderColor: '#d35400',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    margin: 20,
    borderRadius: 28,
    overflow: 'hidden',
  },
  saveGradient: {
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  spacer: {
    height: 30,
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

export default AvailabilityCalendarScreen;