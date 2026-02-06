import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { currentProfile } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    if (currentProfile) {
      loadFavorites();
      loadWatchHistory();
    }
  }, [currentProfile]);

  const loadFavorites = () => {
    const key = `favorites_${currentProfile?.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setFavorites(JSON.parse(saved));
    } else {
      setFavorites([]);
    }
  };

  const loadWatchHistory = () => {
    const key = `watchHistory_${currentProfile?.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setWatchHistory(JSON.parse(saved));
    } else {
      setWatchHistory([]);
    }
  };

  const addFavorite = (item) => {
    const key = `favorites_${currentProfile?.id}`;
    const updated = [...favorites.filter(f => f.id !== item.id), item];
    setFavorites(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const removeFavorite = (itemId) => {
    const key = `favorites_${currentProfile?.id}`;
    const updated = favorites.filter(f => f.id !== itemId);
    setFavorites(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const isFavorite = (itemId) => {
    return favorites.some(f => f.id === itemId);
  };

  const addToHistory = (item) => {
    const key = `watchHistory_${currentProfile?.id}`;
    const historyItem = {
      ...item,
      watchedAt: new Date().toISOString(),
      progress: 0
    };
    const updated = [historyItem, ...watchHistory.filter(h => h.id !== item.id)].slice(0, 50);
    setWatchHistory(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const updateProgress = (itemId, progress) => {
    const key = `watchHistory_${currentProfile?.id}`;
    const updated = watchHistory.map(h => 
      h.id === itemId ? { ...h, progress, watchedAt: new Date().toISOString() } : h
    );
    setWatchHistory(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const getProgress = (itemId) => {
    const item = watchHistory.find(h => h.id === itemId);
    return item?.progress || 0;
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      watchHistory,
      addFavorite,
      removeFavorite,
      isFavorite,
      addToHistory,
      updateProgress,
      getProgress
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
