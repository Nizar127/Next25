import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../../config/theme';
import PitchCreate from '../PitchCreate';
// import CreatePitch from './CreatePitch';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const CreatePitchModal = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const translateY = useSharedValue(500);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const showModal = () => {
    setVisible(true);
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 100,
    });
    opacity.value = withTiming(1, { duration: 300 });
  };

  const hideModal = () => {
    translateY.value = withTiming(500, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => setVisible(false));
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      if (e.target.includes('PitchCreate')) {
        e.preventDefault();
        showModal();
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={hideModal}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={hideModal}>
        <Animated.View style={[styles.overlay, overlayStyle]} />
      </TouchableWithoutFeedback>
      
      <Animated.View style={[styles.modalContainer, animatedStyle]}>
        <GluestackUIProvider config={config}>
        <PitchCreate
            onClose={hideModal}
            navigation={navigation}
            showModal={showModal}
        />
          {/* <CreatePitch 
            onClose={hideModal}
            navigation={navigation}
          /> */}
        </GluestackUIProvider>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '$white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
});

export default CreatePitchModal;