import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  Image, 
  TouchableOpacity, 
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from './utiliti/config';

const FriendsScreen = () => {
  const navigation = useNavigation();

  // State variables
  const [friends, setFriends] = useState([]);
  const [addFriends, setAddFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  // --- Data Fetching Logic ---
  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.warn('No authentication token found.');
        setLoading(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Fetch friends
      try {
        const friendsResponse = await fetch(`${API_URL}/api/friends`, { method: 'GET', headers });
        
        if (friendsResponse.ok) {
          const friendsData = await friendsResponse.json();
          setFriends(friendsData.friends || []);
        } else if (friendsResponse.status === 404) {
          console.log('Friends endpoint not found (404)');
          // Set empty friends array and continue
          setFriends([]);
        } else {
          console.error('Failed to fetch friends:', friendsResponse.status);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        setApiError(true);
      }
      
      // Fetch friend suggestions
      try {
        const suggestionsResponse = await fetch(`${API_URL}/api/friends/suggestions`, { method: 'GET', headers });
        
        if (suggestionsResponse.ok) {
          const suggestionsData = await suggestionsResponse.json();
          setAddFriends(suggestionsData.suggestions || []);
        } else if (suggestionsResponse.status === 404) {
          console.log('Friend suggestions endpoint not found (404)');
          // Set empty suggestions array and continue
          setAddFriends([]);
        } else {
          console.error('Failed to fetch suggestions:', suggestionsResponse.status);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setApiError(true);
      }

    } catch (error) {
      console.error('Error fetching friends data:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Action Handlers ---
  const handleNearbyFriendsPress = () => {
    navigation.navigate('NearbyFriends');
  };

  const handleAddFriend = async (user) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Not authenticated.');
        return;
      }
      const response = await fetch(`${API_URL}/api/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUserId: user.id,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', `Friend request sent to ${user.name}`);
        setAddFriends(addFriends.filter(friend => friend.id !== user.id));
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleChat = (user) => {
    navigation.navigate('Chat' as never, { userId: user.id, userName: user.name });
  };

  // --- Render Functions ---
  const renderFriend = ({ item }) => (
    <View style={styles.friendItem}>
      <Image source={{ uri: item.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.friendAvatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>{item.status}</Text>
      </View>
      <TouchableOpacity 
        style={styles.friendChatBtn}
        onPress={() => item.status && item.status.includes('mutual') ? handleAddFriend(item) : handleChat(item)}
      >
        <Text style={styles.friendChatBtnText}>
          {item.status && item.status.includes('mutual') ? 'Add' : 'Chat'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // --- Loading State UI ---
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.accentColor} />
            <Text style={styles.loadingText}>Loading friends...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // --- Main Render UI ---
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <View style={styles.containerInner}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="people" size={22} color={theme.accentColor} />
              <Text style={styles.logo}>REELS2CHAT</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Search')}>
                <Icon name="search" size={18} color={theme.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Notifications')}>
                <Icon name="mail" size={18} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              {/* API Error Message */}
              {apiError && (
                <View style={styles.errorContainer}>
                  <Icon name="error-outline" size={24} color="#ff6b6b" />
                  <Text style={styles.errorText}>Some features may not be available due to server issues.</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={fetchFriendsData}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Friends Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitle}>
                    <Icon name="people" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
                    <Text style={styles.sectionTitleText}>Friends</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={friends}
                  renderItem={renderFriend}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  style={styles.friendsList}
                  ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>
                      {apiError ? "Unable to load friends" : "No friends yet."}
                    </Text>
                  )}
                />
              </View>

              {/* Add Friend Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitle}>
                    <Icon name="person-add" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
                    <Text style={styles.sectionTitleText}>Add Friend</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={addFriends}
                  renderItem={renderFriend}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  style={styles.friendsList}
                  ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>
                      {apiError ? "Unable to load suggestions" : "No suggestions right now."}
                    </Text>
                  )}
                />
              </View>

              {/* Nearby Friends Button */}
              <View style={styles.nearbyButtonContainer}>
                <TouchableOpacity 
                  style={styles.nearbyButton}
                  onPress={handleNearbyFriendsPress}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.nearbyButtonGradient}
                  >
                    <Icon name="location-on" size={20} color="#fff" style={styles.nearbyButtonIcon} />
                    <Text style={styles.nearbyButtonText}>NEARBY FRIENDS</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                {/* VIP Feature Description */}
                <View style={styles.vipDescription}>
                  <Icon name="star" size={16} color="#FFD700" style={styles.vipIcon} />
                  <Text style={styles.vipText}>VIP Exclusive Feature - Unlock nearby connections</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  errorContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  containerInner: {
    maxWidth: 480,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(18, 24, 38, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    // fontFamily: 'Poppins', // Keep if Poppins is installed
    color: theme.textPrimary,
    marginLeft: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sectionContainer: {
    backgroundColor: 'rgba(30, 40, 50, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleIcon: {
    marginRight: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    // fontFamily: 'Poppins', // Keep if Poppins is installed
  },
  seeAllText: {
    color: theme.accentColor,
    fontSize: 13,
    fontWeight: '600',
    // fontFamily: 'Poppins', // Keep if Poppins is installed
  },
  friendsList: {
    marginBottom: 10,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontWeight: '600',
    fontSize: 16,
    color: theme.textPrimary,
    // fontFamily: 'Poppins', // Keep if Poppins is installed
  },
  friendStatus: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 3,
    // fontFamily: 'Poppins', // Keep if Poppins is installed
  },
  friendChatBtn: {
    backgroundColor: theme.accentColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  friendChatBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    // fontFamily: 'Poppins', // Keep if Poppins is installed
  },
  nearbyButtonContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  nearbyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
  },
  nearbyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  nearbyButtonIcon: {
    marginRight: 10,
  },
  nearbyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    // fontFamily: 'Poppins', // Keep if Poppins is installed
    letterSpacing: 0.5,
  },
  vipDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  vipIcon: {
    marginRight: 8,
  },
  vipText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
    // fontFamily: 'Poppins', // Keep if Poppins is installed
    textAlign: 'center',
  },
  // --- New styles for Loading state ---
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.textPrimary,
    marginTop: 10,
    fontSize: 16,
  },
  emptyListText: {
    color: theme.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  }
});

export default FriendsScreen;



// import React from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   StatusBar, 
//   Image, 
//   TouchableOpacity, 
//   FlatList,
//   ScrollView 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { theme } from '../styles/theme';
// import { useNavigation } from '@react-navigation/native';


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import API_URL from './utiliti/config';


// const friends = [
//   { id: '1', name: 'Sarah Miller', status: 'Active now', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
//   { id: '2', name: 'Mike Johnson', status: 'Active 5m ago', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
//   { id: '3', name: 'Emily Davis', status: 'Active 1h ago', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
//   { id: '4', name: 'James Wilson', status: 'Active 3h ago', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
//   { id: '5', name: 'Olivia Brown', status: 'Active yesterday', avatar: 'https://randomuser.me/api/portraits/women/18.jpg' },
// ];

// const addFriends = [
//   { id: '6', name: 'Sophia Garcia', status: '15 mutual friends', avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
//   { id: '7', name: 'William Taylor', status: '8 mutual friends', avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
//   { id: '8', name: 'Emma Wilson', status: '12 mutual friends', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
//   { id: '9', name: 'Daniel Lee', status: '6 mutual friends', avatar: 'https://randomuser.me/api/portraits/men/68.jpg' },
//   { id: '10', name: 'Sophie Martin', status: '9 mutual friends', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
// ];

// const FriendsScreen = () => {
//   const navigation = useNavigation();

//   const handleNearbyFriendsPress = () => {
//     navigation.navigate('NearbyFriends' as never);
//   };

//   const renderFriend = ({ item }) => (
//     <View style={styles.friendItem}>
//       <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
//       <View style={styles.friendInfo}>
//         <Text style={styles.friendName}>{item.name}</Text>
//         <Text style={styles.friendStatus}>{item.status}</Text>
//       </View>
//       <TouchableOpacity style={styles.friendChatBtn}>
//         <Text style={styles.friendChatBtnText}>{item.status.includes('mutual') ? 'Add' : 'Chat'}</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
//       <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
//         <View style={styles.containerInner}>
//           <View style={styles.header}>
//             <View style={styles.logoContainer}>
//               <Icon name="people" size={22} color={theme.accentColor} />
//               <Text style={styles.logo}>REELS2CHAT</Text>
//             </View>
//             <View style={styles.headerIcons}>
//               <TouchableOpacity style={styles.headerIcon}>
//                 <Icon name="search" size={18} color={theme.textPrimary} />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.headerIcon}>
//                 <Icon name="mail" size={18} color={theme.textPrimary} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.content}>
//             <ScrollView 
//               style={styles.scrollView}
//               contentContainerStyle={styles.scrollViewContent}
//               showsVerticalScrollIndicator={false}
//             >
//               <View style={styles.sectionContainer}>
//                 <View style={styles.sectionHeader}>
//                   <View style={styles.sectionTitle}>
//                     <Icon name="people" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
//                     <Text style={styles.sectionTitleText}>Friends</Text>
//                   </View>
//                   <TouchableOpacity>
//                     <Text style={styles.seeAllText}>See All</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <FlatList
//                   data={friends}
//                   renderItem={renderFriend}
//                   keyExtractor={(item) => item.id}
//                   scrollEnabled={false}
//                   style={styles.friendsList}
//                 />
//               </View>

//               <View style={styles.sectionContainer}>
//                 <View style={styles.sectionHeader}>
//                   <View style={styles.sectionTitle}>
//                     <Icon name="person-add" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
//                     <Text style={styles.sectionTitleText}>Add Friend</Text>
//                   </View>
//                   <TouchableOpacity>
//                     <Text style={styles.seeAllText}>See All</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <FlatList
//                   data={addFriends}
//                   renderItem={renderFriend}
//                   keyExtractor={(item) => item.id}
//                   scrollEnabled={false}
//                   style={styles.friendsList}
//                 />
//               </View>

//               {/* Nearby Friends Button - Inside ScrollView at the bottom */}
//               <View style={styles.nearbyButtonContainer}>
//                 <TouchableOpacity 
//                   style={styles.nearbyButton}
//                   onPress={handleNearbyFriendsPress}
//                 >
//                   <LinearGradient
//                     colors={['#667eea', '#764ba2']}
//                     style={styles.nearbyButtonGradient}
//                   >
//                     <Icon name="location-on" size={20} color="#fff" style={styles.nearbyButtonIcon} />
//                     <Text style={styles.nearbyButtonText}>NEARBY FRIENDS</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
                
//                 {/* VIP Feature Description */}
//                 <View style={styles.vipDescription}>
//                   <Icon name="star" size={16} color="#FFD700" style={styles.vipIcon} />
//                   <Text style={styles.vipText}>VIP Exclusive Feature - Unlock nearby connections</Text>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.background,
//   },
//   containerInner: {
//     maxWidth: 480,
//     width: '100%',
//     flex: 1,
//     alignSelf: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(18, 24, 38, 0.95)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.08)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logo: {
//     fontSize: 22,
//     fontWeight: '700',
//     fontFamily: 'Poppins',
//     color: theme.textPrimary,
//     marginLeft: 8,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   headerIcon: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   sectionContainer: {
//     backgroundColor: 'rgba(30, 40, 50, 0.7)',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sectionTitleIcon: {
//     marginRight: 8,
//   },
//   sectionTitleText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//   },
//   seeAllText: {
//     color: theme.accentColor,
//     fontSize: 13,
//     fontWeight: '600',
//     fontFamily: 'Poppins',
//   },
//   friendsList: {
//     marginBottom: 10,
//   },
//   friendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.06)',
//   },
//   friendAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   friendInfo: {
//     flex: 1,
//   },
//   friendName: {
//     fontWeight: '600',
//     fontSize: 16,
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//   },
//   friendStatus: {
//     fontSize: 13,
//     color: theme.textSecondary,
//     marginTop: 3,
//     fontFamily: 'Poppins',
//   },
//   friendChatBtn: {
//     backgroundColor: theme.accentColor,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//   },
//   friendChatBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//     fontFamily: 'Poppins',
//   },
//   nearbyButtonContainer: {
//     marginTop: 10,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   nearbyButton: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//     width: '100%',
//   },
//   nearbyButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//   },
//   nearbyButtonIcon: {
//     marginRight: 10,
//   },
//   nearbyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//     fontFamily: 'Poppins',
//     letterSpacing: 0.5,
//   },
//   vipDescription: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 12,
//     padding: 12,
//     backgroundColor: 'rgba(255, 215, 0, 0.1)',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 215, 0, 0.3)',
//   },
//   vipIcon: {
//     marginRight: 8,
//   },
//   vipText: {
//     color: '#FFD700',
//     fontSize: 12,
//     fontWeight: '500',
//     fontFamily: 'Poppins',
//     textAlign: 'center',
//   },
// });

// export default FriendsScreen;