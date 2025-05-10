import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { Box, IconButton, HStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Box, VStack, IconButton } from '@gluestack-ui/themed';
import { Volume2, VolumeX, Heart, ThumbsDown, Share2 } from 'lucide-react-native';
import PitchCard from '../components/PitchCard';
import { getPitches } from '../services/pitches';

const { height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.85; // 85% of screen height
const VIDEO_HEIGHT = CARD_HEIGHT * 0.7; // 70% of card height

const PitchFeed = ({ navigation }) => {
  const [pitches, setPitches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const flatListRef = useRef(null);
  const videoRefs = useRef({});

  const fetchPitches = async () => {
    try {
      const fetchedPitches = await getPitches();
      setPitches(fetchedPitches);
    } catch (error) {
      console.error('Error fetching pitches:', error);
    }
  };

  useEffect(() => {
    fetchPitches();
  }, []);

  const handleLike = () => {
    // Implement like logic
    goToNextPitch();
  };

  const handleDislike = () => {
    // Implement dislike logic
    goToNextPitch();
  };

  const goToNextPitch = () => {
    if (currentIndex < pitches.length - 1) {
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const goToPrevPitch = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      // Pause all other videos
      Object.keys(videoRefs.current).forEach(key => {
        if (key !== viewableItems[0].key && videoRefs.current[key]) {
          videoRefs.current[key].pauseAsync();
        }
      });
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 90,
  };

  const renderPitch = ({ item, index }) => (
    console.log('Pitch Data:', item),
    <Box height={CARD_HEIGHT} width="100%" justifyContent="center">
      <PitchCard 
        pitch={item} 
        videoHeight={VIDEO_HEIGHT}
        isActive={index === currentIndex}
        isMuted={isMuted}
        ref={ref => videoRefs.current[item.id] = ref}
        onSwipeUp={goToPrevPitch}
        onSwipeDown={goToNextPitch}
        
      />
      {/* Right side action buttons */}
      <Box position="absolute" right={4} bottom={VIDEO_HEIGHT * 0.5}>
        <VStack space={4} alignItems="center">
          <IconButton
            icon={<Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={24} color="white" />}
            onPress={() => setIsMuted(!isMuted)}
            bg="$backgroundDark500)"
            borderRadius="full"
          />
          <IconButton
            icon={<Ionicons name="heart" size={32} color="white" />}
            onPress={handleLike}
            bg="rgba(0,0,0,0.5)"
            borderRadius="full"
          />
          <IconButton
            icon={<Ionicons name="thumbs-down" size={32} color="white" />}
            onPress={handleDislike}
            bg="rgba(0,0,0,0.5)"
            borderRadius="full"
          />
          <IconButton
            icon={<Ionicons name="share-social" size={24} color="white" />}
            onPress={() => console.log('Share')}
            bg="rgba(0,0,0,0.5)"
            borderRadius="full"
          />
        </VStack>
      </Box>

{/*       <Box position="absolute" right="$4" bottom={VIDEO_HEIGHT * 0.5}>
              <VStack space="lg" alignItems="center">
                <IconButton
                  icon={isMuted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
                  onPress={() => setIsMuted(!isMuted)}
                  bg="$backgroundDark500"
                  rounded="$full"
                />
                <IconButton
                  icon={<Heart size={32} color="white" />}
                  onPress={handleLike}
                  bg="$backgroundDark500"
                  rounded="$full"
                />
                <IconButton
                  icon={<ThumbsDown size={32} color="white" />}
                  onPress={handleDislike}
                  bg="$backgroundDark500"
                  rounded="$full"
                />
                <IconButton
                  icon={<Share2 size={24} color="white" />}
                  onPress={() => console.log('Share')}
                  bg="$backgroundDark500"
                  rounded="$full"
                />
              </VStack>
            </Box> */}
          </Box>
    
  );

  return (
    <Box flex={1} bg="black">
    <FlatList
      ref={flatListRef}
      data={pitches}
      keyExtractor={(item) => item.id}
      renderItem={renderPitch}
      pagingEnabled
      snapToInterval={CARD_HEIGHT}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      initialScrollIndex={currentIndex}
      getItemLayout={(data, index) => ({
        length: CARD_HEIGHT,
        offset: CARD_HEIGHT * index,
        index,
      })}
    />
  </Box>
  );
};

export default PitchFeed;