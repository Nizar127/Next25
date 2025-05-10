import { API, graphqlOperation } from 'aws-amplify';
import { createAnalyticsRecord } from '../graphql/mutations';

export const logEvent = async (eventName, metadata = {}) => {
  try {
    await API.graphql(
      graphqlOperation(createAnalyticsRecord, {
        input: {
          eventName,
          metadata: JSON.stringify(metadata),
          timestamp: new Date().toISOString()
        }
      })
    );
  } catch (error) {
    console.error('Error logging analytics:', error);
  }
};