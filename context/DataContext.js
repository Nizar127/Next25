import React, { createContext, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listPitches } from '../graphql/queries';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPitches = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await API.graphql(graphqlOperation(listPitches, { limit: 20 }));
      setPitches(result.data.listPitches.items);
    } catch (error) {
      console.error('Error fetching pitches:', error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
        pitches,
        loading,
        refreshing,
        fetchPitches
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => React.useContext(DataContext);