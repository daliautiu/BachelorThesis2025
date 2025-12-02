// 8. NotificationsScreen.js
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
import { notificationService } from '../services/api';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
      Alert.alert(
        'Error',
        'Failed to load notifications. Please try again later.'
      );
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };
  
  // Format date and time
  const formatDateTime = (createdAt) => {
    if (!createdAt) return '';
    
    const date = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return full date
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === id 
            ? { ...notif, read: true } 
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };
  
  // Handle notification press
  const handleNotificationPress = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.type === 'ASSIGNMENT' || notification.type === 'REMINDER' || notification.type === 'CHANGE') {
      if (notification.gameId) {
        navigation.navigate('GameDetails', { gameId: notification.gameId });
      }
    } else if (notification.type === 'PAYMENT') {
      Alert.alert('Payment Details 💰', notification.message);
    } else {
      // For system notifications, just display the message
      Alert.alert('Court Announcement 🏀', notification.message);
    }
  };
  
  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      Alert.alert('All Clear! 🏀', 'All notifications have been marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };
  
  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notif => notif.id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ASSIGNMENT':
        return { name: 'basketball-outline', color: '#FF6B00' };
      case 'REMINDER':
        return { name: 'alarm-outline', color: '#f39c12' };
      case 'CHANGE':
        return { name: 'calendar-outline', color: '#9b59b6' };
      case 'PAYMENT':
        return { name: 'cash-outline', color: '#2ecc71' };
      case 'SYSTEM':
      default:
        return { name: 'information-circle-outline', color: '#e74c3c' };
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  // Render notification item
  const renderNotificationItem = ({ item }) => {
    const icon = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity 
        style={[styles.notificationItem, item.read && styles.notificationRead]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            {!item.read && (
              <LinearGradient
                colors={['#FF9500', '#FF6B00']}
                style={styles.unreadBadge}
              >
                <Text style={styles.unreadText}>NEW</Text>
              </LinearGradient>
            )}
          </View>
          
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          
          <Text style={styles.notificationTime}>
            {formatDateTime(item.createdAt)}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Delete Notification',
              'Are you sure you want to remove this notification?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: () => deleteNotification(item.id),
                  style: 'destructive',
                },
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
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
            <Text style={styles.headerTitle}>NOTIFICATIONS 🏀</Text>
            <View style={styles.logoSmall}>
              <Image 
                source={{ uri: 'https://scontent.fclj2-1.fna.fbcdn.net/v/t39.30808-6/273667374_4802222356558884_4149234771085627033_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pZpaqoAUrBQQ7kNvwE_vkG1&_nc_oc=Adk649FvQu7GKHYX8jhp0iXDnXjBNCPNrm7pc6P4DwkWUKh6iD8Ol2HMM3JJ0FHFphw&_nc_zt=23&_nc_ht=scontent.fclj2-1.fna&_nc_gid=MYszYHsyAHBEi_9cZ12Cow&oh=00_AfE_V3hDznWhmjj7Sd25fZyEInh5oxQUK04sl59Bpvj1Zw&oe=6802CD85' }}
                style={styles.logoImage}
              />
            </View>
          </View>
          
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.markAllGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark-done-outline" size={16} color="#fff" />
                <Text style={styles.markAllButtonText}>Clear All Notifications</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="basketball-outline" size={60} color="rgba(255, 107, 0, 0.5)" />
              <Text style={styles.emptyText}>No Notifications</Text>
              <Text style={styles.emptySubtext}>You're all caught up on the court!</Text>
            </View>
          }
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
    height: 140, // Increased height to include mark all button
    zIndex: 1,
  },
  headerGradient: {
    flex: 1,
    paddingBottom: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
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
  markAllButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  markAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  markAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  listContent: {
    padding: 15,
    paddingTop: 10,
    minHeight: '100%',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(244, 244, 244, 0.9)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  notificationRead: {
    backgroundColor: 'rgba(244, 244, 244, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  unreadBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    margin: 20,
    borderRadius: 15,
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  }
});

export default NotificationsScreen;