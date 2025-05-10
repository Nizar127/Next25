// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Box, Text, HStack, VStack, Image, IconButton, Divider, Button, Tab, TabBar, Badge } from '@gluestack-ui/themed';
import { Settings, Share2, ChevronRight } from 'lucide-react-native';
import { 
  getUserProfile, 
  getUserPitches, 
  getUserFollowers,
  followUser
} from '../services/profileService';

const ProfileScreen = ({ navigation, route }) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const userId = route.params?.userId || currentUser.uid;
  const isCurrentUser = userId === currentUser.uid;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      // Extract profile data from the user object
      const userData = {
        displayName: user.displayName || 'User',
        email: user.email || '',
        photoURL: user.photoURL || 'https://via.placeholder.com/150',
        uid: user.uid,
      };
      
      setProfileData(userData);
      setLoading(false);
      
      console.log('Received user data:', userData);
      // Set the screen title to the user's name
      navigation.setOptions({
        title: userData.displayName
      });
    } else {
      setLoading(false);
    }
  }, [user, navigation]);


/*   useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, pitchData, followerData] = await Promise.all([
          getUserProfile(userId),
          getUserPitches(userId),
          getUserFollowers(userId)
        ]);
        
        setProfile(profileData);
        setPitches(pitchData);
        setFollowers(followerData);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };
    
    loadData();
  }, [userId]); 

 const handleFollow = async () => {
    try {
      await followUser(currentUser.uid, userId);
      // Refresh data
      const [followerData, profileData] = await Promise.all([
        getUserFollowers(userId),
        getUserProfile(userId)
      ]);
      setFollowers(followerData);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  }; */
  

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will happen automatically due to auth state change
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (!profile) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: profileData?.photoURL }}
            style={styles.profileImage}
            onError={() => {
              // Handle image loading error
              const updatedData = { ...profileData };
              updatedData.photoURL = 'https://via.placeholder.com/150';
              setProfileData(updatedData);
            }}
          />
        </View>
        <Text style={styles.name}>{profileData?.displayName}</Text>
        <Text style={styles.email}>{profileData?.email}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bioText}>
          This is your profile page. You can view and edit your information here.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  signOutButton: {
    margin: 20,
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProfileScreen;