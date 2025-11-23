// D:\re_ap-main\re_ap-main\src\navigation\AuthNavigator.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../login';
import MainTabNavigator from './MainTabNavigator';
import { View, ActivityIndicator } from 'react-native';
import API_URL from '../utiliti/config';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const checkAuthState = async () => {
      try {
        console.log('🔐 Checking authentication state...');
        
        // Check for backend token first
        const token = await AsyncStorage.getItem('authToken');
        const userInfo = await AsyncStorage.getItem('userInfo');
        
        console.log('📱 Storage check - Token:', !!token, 'UserInfo:', !!userInfo);

        if (token && userInfo) {
          console.log('✅ Backend token found, validating...');
          try {
            const response = await fetch(`${API_URL}/api/user/profile`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              timeout: 5000,
            });

            if (response.ok) {
              const userData = await response.json();
              console.log('✅ Backend token valid, user authenticated');
              setUser(JSON.parse(userInfo));
              setLoading(false);
              return;
            } else {
              console.log('❌ Backend token invalid, clearing storage');
              await AsyncStorage.multiRemove(['authToken', 'userInfo']);
            }
          } catch (error) {
            console.log('❌ Backend token validation failed:', error.message);
            await AsyncStorage.multiRemove(['authToken', 'userInfo']);
          }
        }

        // Check Firebase auth as fallback
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          console.log('✅ Firebase user found:', firebaseUser.email);
          setUser(firebaseUser);
          setLoading(false);
          return;
        }

        console.log('❌ No valid authentication found');
        setUser(null);
        
      } catch (error) {
        console.error('🔥 Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkAuthState();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔥 Firebase auth state changed:', firebaseUser ? 'User found' : 'No user');
      if (firebaseUser) {
        setUser(firebaseUser);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#FF0050" />
      </View>
    );
  }

  console.log('🎯 Navigation decision - User:', user ? 'Authenticated' : 'Not authenticated');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;






// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LoginScreen from '../screens/LoginScreen';
// import MainTabNavigator from './MainTabNavigator';
// import { View, ActivityIndicator } from 'react-native';
// import getApiUrl from '../utiliti/config'; // Add this import

// const API_URL = getApiUrl; // Add this line
// const Stack = createNativeStackNavigator();

// const AuthNavigator = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const auth = getAuth();
//     const subscriber = onAuthStateChanged(auth, async (firebaseUser) => {
//       try {
//         if (firebaseUser) {
//           // User is signed in with Firebase
//           console.log('Firebase user found:', firebaseUser.email);
//           setUser(firebaseUser);
//         } else {
//           // Check if we have a backend token
//           const token = await AsyncStorage.getItem('authToken');
//           if (token) {
//             // Validate the token with the backend
//             try {
//               const response = await fetch(`${API_URL}/api/user/profile`, {
//                 method: 'GET',
//                 headers: {
//                   'Content-Type': 'application/json',
//                   Authorization: `Bearer ${token}`,
//                 },
//               });

//               if (response.ok) {
//                 // Token is valid, consider the user authenticated
//                 setUser({ email: 'Backend User' });
//               } else {
//                 // Token is invalid, clear it
//                 await AsyncStorage.removeItem('authToken');
//                 await AsyncStorage.removeItem('userInfo');
//                 setUser(null);
//               }
//             } catch (error) {
//               console.error('Error validating token:', error);
//               await AsyncStorage.removeItem('authToken');
//               await AsyncStorage.removeItem('userInfo');
//               setUser(null);
//             }
//           } else {
//             setUser(null);
//           }
//         }
//       } catch (error) {
//         console.error('Error checking auth state:', error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return subscriber;
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {user ? (
//           <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
//         ) : (
//           <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AuthNavigator;

