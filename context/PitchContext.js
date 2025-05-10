import React, { createContext, useState, useContext } from 'react';
import { usePitches } from '../hooks/usePitches';

const PitchContext = createContext();

export const PitchProvider = ({ children }) => {
  const pitchState = usePitches();
  const [selectedPitch, setSelectedPitch] = useState(null);

  return (
    <PitchContext.Provider value={{ ...pitchState, selectedPitch, setSelectedPitch }}>
      {children}
    </PitchContext.Provider>
  );
};

export const usePitchContext = () => useContext(PitchContext);