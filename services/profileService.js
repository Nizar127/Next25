import { db, firestore, auth, storage } from './firebase';
import { ref, get, set, push, child } from 'firebase/database';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export const getUserProfile = async (userId) => {
  try {
    // Get stateless profile data from Firestore
    const profileDoc = await getDoc(doc(firestore, 'users', userId));
    
    // Get stateful data from Realtime DB
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    
    return {
      ...profileDoc.data(),
      ...snapshot.val(),
      id: userId
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    // Split updates between Firestore and Realtime DB
    const firestoreUpdates = {
      displayName: updates.displayName,
      bio: updates.bio,
      location: updates.location,
      website: updates.website,
      skills: updates.skills,
      updatedAt: new Date().toISOString()
    };
    
    const realtimeUpdates = {
      username: updates.username,
      stats: {
        pitchCount: updates.pitchCount,
        supporterCount: updates.supporterCount,
        supportingCount: updates.supportingCount
      }
    };
    
    // Update Firestore
    await setDoc(doc(firestore, 'users', userId), firestoreUpdates, { merge: true });
    
    // Update Realtime DB
    await set(ref(db, `users/${userId}`), realtimeUpdates);
    
    // Update Auth profile
    await updateProfile(auth.currentUser, {
      displayName: updates.displayName,
      photoURL: updates.photoURL
    });
    
    // Log the update
    await addDoc(collection(firestore, 'profileLogs'), {
      userId,
      action: 'update',
      timestamp: new Date().toISOString(),
      updatedFields: Object.keys(updates)
    });
    
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const uploadProfilePicture = async (userId, uri) => {
  try {
    // Convert local URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Upload to Firebase Storage
    const fileRef = storageRef(storage, `profile_pictures/${userId}/${Date.now()}`);
    await uploadBytes(fileRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    // Update profile with new photo
    await updateUserProfile(userId, { photoURL: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

export const getUserPitches = async (userId) => {
  try {
    const pitchesRef = ref(db, `user_pitches/${userId}`);
    const snapshot = await get(pitchesRef);
    return snapshot.val() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error("Error fetching user pitches:", error);
    throw error;
  }
};

export const getUserFollowers = async (userId) => {
  try {
    // Get from Realtime DB (stateful relationships)
    const followersRef = ref(db, `user_followers/${userId}`);
    const snapshot = await get(followersRef);
    const followerIds = snapshot.val() ? Object.keys(snapshot.val()) : [];
    
    // Get profile data from Firestore
    const profiles = await Promise.all(
      followerIds.map(id => getDoc(doc(firestore, 'users', id)))
    );
    
    return profiles.map(profile => ({
      id: profile.id,
      ...profile.data()
    }));
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
};

export const followUser = async (followerId, userIdToFollow) => {
  try {
    // Stateful relationship in Realtime DB
    await set(ref(db, `user_followers/${userIdToFollow}/${followerId}`), true);
    await set(ref(db, `user_following/${followerId}/${userIdToFollow}`), true);
    
    // Stateless log in Firestore
    await addDoc(collection(firestore, 'relationshipLogs'), {
      followerId,
      followingId: userIdToFollow,
      action: 'follow',
      timestamp: new Date().toISOString()
    });
    
    // Update counts
    await updateCounts(followerId, userIdToFollow, 1);
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

const updateCounts = async (followerId, followingId, delta) => {
  const updates = {};
  updates[`users/${followerId}/stats/followingCount`] = increment(delta);
  updates[`users/${followingId}/stats/followerCount`] = increment(delta);
  await update(ref(db), updates);
};

// Helper for Firebase increment
const increment = (delta) => {
  return {
    '.sv': {
      'increment': delta
    }
  };
};