import { db, firestore } from '../config/firebase';
import { ref, push, set, onValue, off } from 'firebase/database';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadVideo } from './storage';

export const getPitches = () => {
  return new Promise((resolve, reject) => {
    const pitchesRef = ref(db, 'pitches');
    onValue(pitchesRef, (snapshot) => {
      const pitchesData = snapshot.val();
      const pitches = [];
      for (let id in pitchesData) {
        pitches.push({ id, ...pitchesData[id] });
      }
      resolve(pitches);
    }, (error) => {
      reject(error);
    });
  });
};

export const uploadPitch = async (pitchData) => {
  try {
    // Upload video to storage and get URL
    const videoUrl = await uploadVideo(pitchData.videoUri, `pitches/${Date.now()}`);
    
    // Save pitch data to Realtime Database
    const pitchesRef = ref(db, 'pitches');
    const newPitchRef = push(pitchesRef);
    
    await set(newPitchRef, {
      title: pitchData.title,
      category: pitchData.category,
      description: pitchData.description || '',
      videoUrl,
      views: 0,
      likes: 0,
      dislikes: 0,
      createdAt: Date.now(),
      user: {
        id: pitchData.userId,
        name: pitchData.userName,
        avatar: pitchData.userAvatar,
      },
    });

    // Log the pitch creation in Firestore
    await addDoc(collection(firestore, 'pitchLogs'), {
      pitchId: newPitchRef.key,
      userId: pitchData.userId,
      action: 'create',
      timestamp: serverTimestamp(),
    });

    return newPitchRef.key;
  } catch (error) {
    console.error('Error uploading pitch:', error);
    throw error;
  }
};

export const likePitch = async (pitchId, userId) => {
  // Implement like functionality
};

export const dislikePitch = async (pitchId, userId) => {
  // Implement dislike functionality
};