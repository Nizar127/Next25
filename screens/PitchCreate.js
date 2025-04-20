import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { GluestackUIProvider, Button, Text, Box } from '@gluestack-ui/themed';
import { config } from '../config/theme';
import * as ImagePicker from 'expo-image-picker';
import { ref, push, set } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';
import { db, firestore } from '../config/firebase';

export default function PitchCreate({ navigation }) {
  const [visible, setVisible] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0].uri);
    }
  };

  const uploadPost = async () => {
    try {
      // Upload to Realtime DB (stateful data)
      const postRef = push(ref(db, 'posts'));
      await set(postRef, {
        mediaUrl: selectedMedia,
        createdAt: Date.now(),
        likes: 0,
        comments: 0,
      });

      // Log to Firestore (stateless data)
      await setDoc(doc(firestore, 'activityLogs', Date.now().toString()), {
        type: 'post_upload',
        timestamp: Date.now(),
        status: 'success'
      });

      setVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Upload error:", error);
      await setDoc(doc(firestore, 'errorLogs', Date.now().toString()), {
        error: error.message,
        timestamp: Date.now(),
        screen: 'PitchCreate'
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        navigation.goBack();
      }}
    >
      <Pressable 
        style={styles.overlay} 
        onPress={() => {
          setVisible(false);
          navigation.goBack();
        }}
      />
      
      <View style={styles.modalContainer}>
        <GluestackUIProvider config={config}>
          <Box p="$4" bg="$white" borderRadius="$xl">
            <Text fontSize="$xl" fontWeight="$bold" mb="$4">Create New Post</Text>
            
            {selectedMedia ? (
              <Box alignItems="center">
                {/* Media preview would go here */}
                <Text mb="$4">Media selected</Text>
                <Button onPress={uploadPost}>
                  <Text color="$white">Upload Post</Text>
                </Button>
              </Box>
            ) : (
              <Button onPress={pickMedia}>
                <Text color="$white">Select Media</Text>
              </Button>
            )}
          </Box>
        </GluestackUIProvider>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
});