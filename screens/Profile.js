import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Box, Text, HStack, VStack, Image, IconButton, Divider, Button, Tab, TabBar, Badge 
} from '@gluestack-ui/themed';
import { Settings, Share2, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../auth';
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

  useEffect(() => {
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
  };

  if (!profile) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <Box p="$4" bg="$white">
          <HStack justifyContent="space-between" alignItems="flex-start">
            <HStack space="lg" alignItems="center">
              <Image
                source={{ uri: profile.photoURL || 'https://via.placeholder.com/150' }}
                style={styles.profileImage}
                alt="Profile"
              />
              <VStack>
                <Text fontWeight="$bold" size="xl">{profile.displayName}</Text>
                <Text color="$textSecondary">@{profile.username}</Text>
                <Text mt="$2" size="sm">
                  {profile.bio || 'No bio yet'}
                </Text>
                {profile.location && (
                  <Text size="sm" color="$textSecondary" mt="$1">
                    {profile.location}
                  </Text>
                )}
              </VStack>
            </HStack>
            
            <HStack space="sm">
              <IconButton
                icon={<Share2 size={20} color="$primary500" />}
                onPress={() => console.log('Share profile')}
              />
              {isCurrentUser && (
                <IconButton
                  icon={<Settings size={20} color="$primary500" />}
                  onPress={() => navigation.navigate('ProfileSettings')}
                />
              )}
            </HStack>
          </HStack>
          
          {/* Follow Button for other users */}
          {!isCurrentUser && (
            <Button 
              onPress={handleFollow}
              mt="$4"
              variant={profile.isFollowing ? 'outline' : 'solid'}
            >
              <Text>{profile.isFollowing ? 'Following' : 'Follow'}</Text>
            </Button>
          )}
        </Box>
        
        {/* Stats Boxes */}
        <HStack justifyContent="space-around" p="$4" bg="$white">
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => navigation.navigate('UserPitches', { userId })}
          >
            <Text fontWeight="$bold" size="xl" textAlign="center">
              {profile.stats?.pitchCount || 0}
            </Text>
            <Text textAlign="center" size="sm">Pitches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => navigation.navigate('UserFollowers', { userId })}
          >
            <Text fontWeight="$bold" size="xl" textAlign="center">
              {profile.stats?.followerCount || 0}
            </Text>
            <Text textAlign="center" size="sm">Followers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => navigation.navigate('UserFollowing', { userId })}
          >
            <Text fontWeight="$bold" size="xl" textAlign="center">
              {profile.stats?.followingCount || 0}
            </Text>
            <Text textAlign="center" size="sm">Following</Text>
          </TouchableOpacity>
        </HStack>
        
        <Divider />
        
        {/* Tabs */}
        <TabBar 
          activeTab={activeTab} 
          onChange={setActiveTab}
          mt="$4"
          px="$4"
        >
          <Tab name="about" title="About" />
          <Tab name="pitches" title="Pitches" />
          <Tab name="followers" title="Followers" />
        </TabBar>
        
        {/* Tab Content */}
        <Box p="$4">
          {activeTab === 'about' && (
            <VStack space="md">
              <Text>{profile.about || 'No information provided yet'}</Text>
              
              {profile.skills?.length > 0 && (
                <>
                  <Text fontWeight="$bold">Skills</Text>
                  <HStack flexWrap="wrap">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} mr="$2" mb="$2" bg="$primary100">
                        <Text color="$primary600">{skill}</Text>
                      </Badge>
                    ))}
                  </HStack>
                </>
              )}
            </VStack>
          )}
          
          {activeTab === 'pitches' && (
            <VStack space="md">
              {pitches.length > 0 ? (
                pitches.map(pitch => (
                  <PitchCard 
                    key={pitch.id} 
                    pitch={pitch} 
                    onPress={() => navigation.navigate('PitchDetail', { pitchId: pitch.id })}
                  />
                ))
              ) : (
                <Text color="$textSecondary">No pitches yet</Text>
              )}
            </VStack>
          )}
          
          {activeTab === 'followers' && (
            <VStack space="md">
              {followers.length > 0 ? (
                followers.map(user => (
                  <UserCard 
                    key={user.id}
                    user={user}
                    onPress={() => navigation.navigate('Profile', { userId: user.id })}
                  />
                ))
              ) : (
                <Text color="$textSecondary">No followers yet</Text>
              )}
            </VStack>
          )}
        </Box>
      </ScrollView>
    </View>
  );
};

// Styles and exports remain the same as previous implementation