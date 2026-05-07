import React, { createContext, useContext, useState, ReactNode } from 'react';

type Screen = 'title' | 'arena' | 'leaderboard';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  playerAddress: string | null;
  setPlayerAddress: (address: string | null) => void;
  rating: number;
  setRating: (rating: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  const [playerAddress, setPlayerAddress] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(1000);

  return (
    <AppContext.Provider value={{ currentScreen, setCurrentScreen, playerAddress, setPlayerAddress, rating, setRating }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
