import AWS from 'aws-sdk';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';

// Configure AWS
AWS.config.update({
  region: 'us-east-1',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  })
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: 'pitch-app-media-dev' }
});

export const uploadMedia = async (fileUri, type = 'image') => {
  try {
    // Generate unique filename
    const extension = fileUri.split('.').pop();
    const fileName = `${Date.now()}.${extension}`;
    const s3Key = `${type}s/${fileName}`;
    
    // Read file content
    const fileContent = Platform.OS === 'ios' 
      ? await RNFS.readFile(fileUri, 'base64')
      : await RNFS.readFile(fileUri, 'base64');

    const buffer = Buffer.from(fileContent, 'base64');

    // Upload to S3
    const uploadParams = {
      Bucket: 'pitch-app-media-dev',
      Key: s3Key,
      Body: buffer,
      ContentType: `image/${extension}`,
      ACL: 'public-read'
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw error;
  }
};

export const pickAndUploadImage = async () => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8
    });
    
    if (result.didCancel || !result.assets?.[0]?.uri) {
      return null;
    }
    
    return await uploadMedia(result.assets[0].uri);
  } catch (error) {
    console.error('Image picker error:', error);
    throw error;
  }
};