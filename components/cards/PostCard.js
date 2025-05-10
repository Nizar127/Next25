import React from 'react';
import { Image, Pressable } from 'react-native';
import { 
  Box, 
  Text, 
  HStack, 
  Avatar, 
  Icon,
  VStack,
  Badge
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useFirebase } from '../../context/FirebaseContext';
import { useNavigation } from '@react-navigation/native';

const PostCard = ({ post }) => {
  const { db } = useFirebase();
  const navigation = useNavigation();

  const handleLike = () => {
    const postRef = ref(db, `posts/${post.id}/likes`);
    set(postRef, post.likes + 1);
  };

  return (
    <Box borderWidth={1} borderColor="$coolGray200" borderRadius="$md" mb="$4" overflow="hidden">
      <VStack space="sm" p="$3">
        <HStack justifyContent="space-between" alignItems="center">
          <HStack space="sm" alignItems="center">
            <Avatar size="sm" source={{ uri: post.userAvatar }}>
              <Avatar.FallbackText>User</Avatar.FallbackText>
            </Avatar>
            <Text fontWeight="$bold">{post.username}</Text>
          </HStack>
          <Badge variant="solid" bg="$purple500">
            <Badge.Text>{post.category}</Badge.Text>
          </Badge>
        </HStack>

        <Pressable onPress={() => navigation.navigate('PostDetail', { postId: post.id })}>
          {post.mediaUrl && (
            <Box aspectRatio={4/3} bg="$coolGray100" mb="$2" borderRadius="$md" overflow="hidden">
              <Image 
                source={{ uri: post.mediaUrl }} 
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </Box>
          )}
          <Text fontSize="$md" mb="$2">{post.title}</Text>
        </Pressable>

        <HStack justifyContent="space-between" alignItems="center">
          <HStack space="$4">
            <Pressable onPress={handleLike}>
              <HStack space="$1" alignItems="center">
                <Icon as={Ionicons} name="heart-outline" size="$xl" />
                <Text>{post.likes || 0}</Text>
              </HStack>
            </Pressable>
            <Pressable>
              <HStack space="$1" alignItems="center">
                <Icon as={Ionicons} name="chatbubble-outline" size="$xl" />
                <Text>{post.comments?.length || 0}</Text>
              </HStack>
            </Pressable>
          </HStack>
          <Icon as={Ionicons} name="bookmark-outline" size="$xl" />
        </HStack>
      </VStack>
    </Box>
  );
};

export default PostCard;