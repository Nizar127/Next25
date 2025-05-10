import { API, graphqlOperation } from 'aws-amplify';
import { createPitch, updatePitch, deletePitch } from '../graphql/mutations';

export const createPitch = async (input) => {
  try {
    const result = await API.graphql(
      graphqlOperation(createPitch, { input })
    );
    return result.data.createPitch;
  } catch (error) {
    console.error('Error creating pitch:', error);
    throw error;
  }
};

export const likePitch = async (id, likes) => {
  try {
    await API.graphql(
      graphqlOperation(updatePitch, {
        input: { id, likes: likes + 1 }
      })
    );
  } catch (error) {
    console.error('Error liking pitch:', error);
    throw error;
  }
};

export const deletePitchById = async (id) => {
  try {
    await API.graphql(
      graphqlOperation(deletePitch, { input: { id } })
    );
  } catch (error) {
    console.error('Error deleting pitch:', error);
    throw error;
  }
};