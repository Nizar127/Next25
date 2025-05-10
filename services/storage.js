import { Storage } from 'aws-amplify';

export const uploadMedia = async (fileUri, userId) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const key = `pitches/${userId}/${Date.now()}-${fileUri.split('/').pop()}`;
    
    await Storage.put(key, blob, {
      contentType: blob.type,
      level: 'public'
    });

    return key;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

export const getMediaUrl = async (key) => {
  try {
    return await Storage.get(key);
  } catch (error) {
    console.error('Error getting media URL:', error);
    return null;
  }
};

export const deleteMedia = async (key) => {
  try {
    await Storage.remove(key);
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
};