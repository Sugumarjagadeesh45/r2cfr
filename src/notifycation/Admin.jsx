// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TouchableOpacity, 
//   SafeAreaView, 
//   StatusBar, 
//   TextInput, 
//   ScrollView,
//   Dimensions,
//   Alert 
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { theme } from '../../styles/theme';

// const { width } = Dimensions.get('window');

// export default function Admin({ navigation }) {
//   const [subject, setSubject] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSend = () => {
//     if (!subject.trim() || !message.trim()) {
//       Alert.alert('Error', 'Please fill in both subject and message');
//       return;
//     }
    
//     // Here you would implement the API call to send the admin message
//     Alert.alert(
//       'Success', 
//       `Admin message sent!\n\nSubject: ${subject}\nMessage: ${message}`,
//       [{ text: 'OK', onPress: () => {
//         setSubject('');
//         setMessage('');
//       }}]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
//       <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
//         <View style={styles.containerInner}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View style={styles.headerLeft}>
//               <TouchableOpacity 
//                 style={styles.backButton}
//                 onPress={() => navigation.goBack()}
//               >
//                 <Icon name="arrow-back" size={24} color={theme.textPrimary} />
//               </TouchableOpacity>
//               <View style={styles.logoContainer}>
//                 <Icon name="admin-panel-settings" size={22} color={theme.accentColor} />
//                 <Text style={styles.logo}>REELS2CHAT</Text>
//               </View>
//             </View>
//             <TouchableOpacity 
//               style={styles.searchButton}
//               onPress={() => navigation.navigate('SearchScreen')}
//             >
//               <Icon name="search" size={20} color={theme.textPrimary} />
//             </TouchableOpacity>
//           </View>

//           {/* Tab Navigation - Medium Size & Centered */}
//           <View style={styles.tabContainer}>
//             <TouchableOpacity 
//               style={styles.tab}
//               onPress={() => navigation.navigate('NotificationScreen')}
//             >
//               <Icon name="person" size={18} color={theme.textSecondary} />
//               <Text style={styles.tabText}>MY PERSONAL</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.tab, styles.activeTab]}
//               onPress={() => {}} // Already on this screen
//             >
//               <Icon name="admin-panel-settings" size={18} color={theme.accentColor} />
//               <Text style={[styles.tabText, styles.activeTabText]}>MY ADMIN</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Admin Content */}
//           <View style={styles.content}>
//             <ScrollView 
//               style={styles.scrollView}
//               contentContainerStyle={styles.scrollViewContent}
//               showsVerticalScrollIndicator={false}
//             >
//               {/* Admin Stats Cards */}
//               <View style={styles.statsContainer}>
//                 <View style={styles.statCard}>
//                   <View style={[styles.statIcon, { backgroundColor: '#667eea' }]}>
//                     <Icon name="people" size={20} color="#fff" />
//                   </View>
//                   <Text style={styles.statNumber}>1.2K</Text>
//                   <Text style={styles.statLabel}>Total Users</Text>
//                 </View>
                
//                 <View style={styles.statCard}>
//                   <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
//                     <Icon name="notifications" size={20} color="#fff" />
//                   </View>
//                   <Text style={styles.statNumber}>48</Text>
//                   <Text style={styles.statLabel}>Active</Text>
//                 </View>
                
//                 <View style={styles.statCard}>
//                   <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
//                     <Icon name="trending-up" size={20} color="#fff" />
//                   </View>
//                   <Text style={styles.statNumber}>89%</Text>
//                   <Text style={styles.statLabel}>Engagement</Text>
//                 </View>
//               </View>

//               {/* Admin Message Section */}
//               <View style={styles.sectionContainer}>
//                 <View style={styles.sectionHeader}>
//                   <View style={styles.sectionTitle}>
//                     <Icon name="send" size={20} color={theme.accentColor} style={styles.sectionTitleIcon} />
//                     <Text style={styles.sectionTitleText}>Broadcast Message</Text>
//                   </View>
//                   <Icon name="campaign" size={20} color={theme.textSecondary} />
//                 </View>

//                 <Text style={styles.sectionDescription}>
//                   Send important announcements and updates to all users
//                 </Text>

//                 {/* Sender Info */}
//                 <View style={styles.senderCard}>
//                   <View style={styles.senderHeader}>
//                     <Icon name="verified" size={18} color="#4CAF50" />
//                     <Text style={styles.senderTitle}>Sender Information</Text>
//                   </View>
//                   <View style={styles.senderDetails}>
//                     <View style={styles.senderRow}>
//                       <Text style={styles.senderLabel}>From:</Text>
//                       <Text style={styles.senderValue}>Admin Team</Text>
//                     </View>
//                     <View style={styles.senderRow}>
//                       <Text style={styles.senderLabel}>Role:</Text>
//                       <Text style={styles.senderValue}>System Administrator</Text>
//                     </View>
//                     <View style={styles.senderRow}>
//                       <Text style={styles.senderLabel}>Priority:</Text>
//                       <View style={styles.priorityBadge}>
//                         <Text style={styles.priorityText}>High</Text>
//                       </View>
//                     </View>
//                   </View>
//                 </View>

//                 {/* Message Form */}
//                 <View style={styles.formContainer}>
//                   <View style={styles.inputGroup}>
//                     <View style={styles.inputHeader}>
//                       <Icon name="title" size={18} color={theme.textSecondary} />
//                       <Text style={styles.inputLabel}>Subject</Text>
//                       <Text style={styles.required}>*</Text>
//                     </View>
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter message subject..."
//                       placeholderTextColor={theme.textSecondary}
//                       value={subject}
//                       onChangeText={setSubject}
//                       maxLength={100}
//                     />
//                     <Text style={styles.charCount}>
//                       {subject.length}/100 characters
//                     </Text>
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <View style={styles.inputHeader}>
//                       <Icon name="message" size={18} color={theme.textSecondary} />
//                       <Text style={styles.inputLabel}>Message</Text>
//                       <Text style={styles.required}>*</Text>
//                     </View>
//                     <TextInput
//                       style={[styles.input, styles.messageInput]}
//                       placeholder="Type your broadcast message here..."
//                       placeholderTextColor={theme.textSecondary}
//                       value={message}
//                       onChangeText={setMessage}
//                       multiline
//                       numberOfLines={6}
//                       textAlignVertical="top"
//                       maxLength={500}
//                     />
//                     <Text style={styles.charCount}>
//                       {message.length}/500 characters
//                     </Text>
//                   </View>

//                   {/* Action Buttons */}
//                   <View style={styles.actionButtons}>
//                     <TouchableOpacity 
//                       style={styles.cancelButton}
//                       onPress={() => {
//                         setSubject('');
//                         setMessage('');
//                       }}
//                     >
//                       <Icon name="clear" size={18} color={theme.textPrimary} />
//                       <Text style={styles.cancelButtonText}>Clear</Text>
//                     </TouchableOpacity>
                    
//                     <TouchableOpacity 
//                       style={[
//                         styles.sendButton,
//                         (!subject.trim() || !message.trim()) && styles.sendButtonDisabled
//                       ]}
//                       onPress={handleSend}
//                       disabled={!subject.trim() || !message.trim()}
//                     >
//                       <LinearGradient
//                         colors={['#667eea', '#764ba2']}
//                         style={styles.sendButtonGradient}
//                       >
//                         <Icon name="send" size={18} color="#fff" />
//                         <Text style={styles.sendButtonText}>Send Broadcast</Text>
//                       </LinearGradient>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

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
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 12,
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
//   searchButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // Tab Navigation - Medium Size & Centered
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: 'rgba(18, 24, 38, 0.95)',
//     marginHorizontal: 20,
//     marginTop: 16,
//     borderRadius: 12,
//     padding: 6,
//     alignSelf: 'center',
//     width: width * 0.7,
//   },
//   tab: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     gap: 6,
//   },
//   activeTab: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   tabText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: theme.textSecondary,
//     fontFamily: 'Poppins',
//   },
//   activeTabText: {
//     color: theme.accentColor,
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
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: 'rgba(30, 40, 50, 0.7)',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   statIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statNumber: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: theme.textSecondary,
//     fontFamily: 'Poppins',
//     textAlign: 'center',
//   },
//   sectionContainer: {
//     backgroundColor: 'rgba(30, 40, 50, 0.7)',
//     borderRadius: 20,
//     padding: 20,
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
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sectionTitleIcon: {
//     marginRight: 8,
//   },
//   sectionTitleText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//   },
//   sectionDescription: {
//     fontSize: 14,
//     color: theme.textSecondary,
//     fontFamily: 'Poppins',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   senderCard: {
//     backgroundColor: 'rgba(40, 50, 60, 0.8)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     borderLeftWidth: 4,
//     borderLeftColor: theme.accentColor,
//   },
//   senderHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   senderTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//     marginLeft: 8,
//   },
//   senderDetails: {
//     gap: 8,
//   },
//   senderRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//   },
//   senderLabel: {
//     fontSize: 14,
//     color: theme.textSecondary,
//     fontFamily: 'Poppins',
//     fontWeight: '500',
//   },
//   senderValue: {
//     fontSize: 14,
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//     fontWeight: '600',
//   },
//   priorityBadge: {
//     backgroundColor: '#E91E63',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   priorityText: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '600',
//     fontFamily: 'Poppins',
//   },
//   formContainer: {
//     gap: 20,
//   },
//   inputGroup: {
//     marginBottom: 8,
//   },
//   inputHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     gap: 6,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//   },
//   required: {
//     color: '#E91E63',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   input: {
//     backgroundColor: 'rgba(40, 50, 60, 0.8)',
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     color: theme.textPrimary,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//     fontFamily: 'Poppins',
//   },
//   messageInput: {
//     minHeight: 120,
//     textAlignVertical: 'top',
//   },
//   charCount: {
//     fontSize: 12,
//     color: theme.textSecondary,
//     textAlign: 'right',
//     marginTop: 4,
//     fontFamily: 'Poppins',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 10,
//   },
//   cancelButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 12,
//     paddingVertical: 14,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   cancelButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//   },
//   sendButton: {
//     flex: 2,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   sendButtonDisabled: {
//     opacity: 0.6,
//   },
//   sendButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     gap: 8,
//   },
//   sendButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//     fontFamily: 'Poppins',
//   },
// });


import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../styles/theme';

export default function Admin({ navigation }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in both subject and message');
      return;
    }
    
    // Here you would implement the API call to send the admin message
    alert(`Admin message sent!\nSubject: ${subject}\nMessage: ${message}`);
    setSubject('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <View style={styles.containerInner}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="admin-panel-settings" size={22} color={theme.accentColor} />
              <Text style={styles.logo}>REELS2CHAT</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Search')}>
                <Icon name="search" size={18} color={theme.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={18} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitle}>
                    <Icon name="send" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
                    <Text style={styles.sectionTitleText}>SEND ADMIN MESSAGE</Text>
                  </View>
                </View>

                <View style={styles.senderInfo}>
                  <Text style={styles.senderLabel}>From:</Text>
                  <Text style={styles.senderValue}>Admin Team</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Subject</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter subject"
                    placeholderTextColor={theme.textSecondary}
                    value={subject}
                    onChangeText={setSubject}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Message</Text>
                  <TextInput
                    style={[styles.input, styles.messageInput]}
                    placeholder="Enter your message"
                    placeholderTextColor={theme.textSecondary}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                  <Text style={styles.sendButtonText}>Send Notification</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(30, 40, 50, 0.7)',
    borderRadius: 12,
  },
  senderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    marginRight: 8,
  },
  senderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(30, 40, 50, 0.7)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageInput: {
    minHeight: 150,
  },
  sendButton: {
    backgroundColor: theme.accentColor,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
});
