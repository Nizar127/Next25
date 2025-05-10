import React, { forwardRef, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { GluestackUIProvider,Box, Image,IconButton, VStack, Text } from '@gluestack-ui/themed';
import { Video } from 'expo-av';
import ThreeDotMenu from './ThreeDotMenu/ThreeDotMenu';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MoreVertical, Volume2, VolumeX, Heart, ThumbsDown, Share2 } from 'lucide-react-native';

const PitchCard = forwardRef(({ pitch, videoHeight, isActive, isMuted }, ref) => {
  const videoRef = React.useRef(null);

    // Expose video methods to parent

  useEffect(() => {
    if (ref) {
      ref.current = {
        playAsync: () => videoRef.current?.playAsync(),
        pauseAsync: () => videoRef.current?.pauseAsync(),
      };
    }
  }, [ref]);

  
  useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isActive]);

  return (
// Wrap your main Box component with this:
<GestureDetector gesture={Gesture.Exclusive(
  Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      // Single tap to toggle mute
      onToggleMute();
    }),
  Gesture.Pan()
    .onEnd((e) => {
      if (e.translationY < -50) {
        // Swipe up - next pitch
        onSwipeUp();
      } else if (e.translationY > 50) {
        // Swipe down - previous pitch
        onSwipeDown();
      }
    })
)}>

    <Box flex={1} justifyContent="center" alignItems="center">
      {/* Video Player */}
      <Video
        ref={videoRef}
        source={{ uri: pitch.videoUrl }}
        style={[styles.video, { height: videoHeight }]}
        resizeMode="cover"
        shouldPlay={isActive}
        isLooping
        isMuted={isMuted}
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        {/* User Info */}
        <HStack justifyContent="space-between" alignItems="center" px={4} pt={4}>
          <HStack space={2} alignItems="center">
            <Image
              source={{ uri: pitch.user.avatar }}
              style={styles.profilePic}
            />
            <Text style={styles.username}>{pitch.user.name}</Text>
          </HStack>
          <ThreeDotMenu pitchId={pitch.id} />
        </HStack>

        {/* Pitch Info (Bottom) */}
        <VStack position="absolute" bottom={8} left={4} right={4}>
          <Text style={styles.title}>{pitch.title}</Text>
          <Text style={styles.category}>{pitch.category}</Text>
        </VStack>
      </View>
    </Box>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  video: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  category: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default PitchCard;