import { Amplify, Storage } from 'aws-amplify';
import config from '../aws-exports';

Amplify.configure(config);

export const uploadMedia = async (uri, path = 'media/') => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const key = `${path}${Date.now()}`;
    await Storage.put(key, blob, {
      contentType: blob.type,
    });
    return await Storage.get(key);
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

export const getMediaUrl = async (key) => {
  return await Storage.get(key);
};

export const deleteMedia = async (key) => {
  return await Storage.remove(key);
};