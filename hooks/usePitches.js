import { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { listPitches } from '../graphql/queries';
import { onCreatePitch } from '../graphql/subscriptions';

export const usePitches = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPitches = async () => {
    try {
      setLoading(true);
      const result = await API.graphql(graphqlOperation(listPitches));
      const pitchesWithMedia = await Promise.all(
        result.data.listPitches.items.map(async pitch => ({
          ...pitch,
          mediaUrl: pitch.mediaKey ? await Storage.get(pitch.mediaKey) : null
        }))
      );
      setPitches(pitchesWithMedia);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPitches();

    const subscription = API.graphql(
      graphqlOperation(onCreatePitch)
    ).subscribe({
      next: ({ value }) => {
        setPitches(prev => [value.data.onCreatePitch, ...prev]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { pitches, loading, error, refetch: fetchPitches };
};