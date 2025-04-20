import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { GluestackUIProvider, Text, Box } from '@gluestack-ui/themed';
import { config } from '../config/theme';

import { ref, onValue, off } from 'firebase/database';
import { db } from '../config/firebase';
import PostCard from '../components/PostCard';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    
    const fetchPosts = () => {
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const postsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).sort((a, b) => b.createdAt - a.createdAt);
          setPosts(postsArray);
        }
      });
    };

    fetchPosts();

    return () => {
      off(postsRef);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you might trigger a re-fetch here
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <GluestackUIProvider config={config}>
      <Box flex={1} bg="$white">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={
            <Box alignItems="center" mt="$10">
              <Text>No posts yet. Be the first to share!</Text>
            </Box>
          }
        />
      </Box>
    </GluestackUIProvider>
  );
}