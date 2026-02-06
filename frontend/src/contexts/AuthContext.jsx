import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const PROFILE_AVATARS = [
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwyfHx1c2VyJTIwYXZhdGFyfGVufDB8fHx8MTc3MDQxMjQyMXww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYXZhdGFyfGVufDB8fHx8MTc3MDQxMjQyMXww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwzfHxwcm9maWxlJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzcwNDEyNDI1fDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzcwNDEyNDI1fDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1539125530496-3ca408f9c2d9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHxwcm9maWxlJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzcwNDEyNDI1fDA&ixlib=rb-4.1.0&q=85'
];

export const AuthProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Load profiles from localStorage
    const savedProfiles = localStorage.getItem('streamProfiles');
    if (savedProfiles) {
      const parsed = JSON.parse(savedProfiles);
      setProfiles(parsed);
    } else {
      // Create default profiles
      const defaultProfiles = [
        { id: '1', name: 'Main Profile', avatar: PROFILE_AVATARS[0], isKids: false },
        { id: '2', name: 'Kids', avatar: PROFILE_AVATARS[2], isKids: true }
      ];
      setProfiles(defaultProfiles);
      localStorage.setItem('streamProfiles', JSON.stringify(defaultProfiles));
    }

    // Load current profile
    const savedProfile = localStorage.getItem('currentProfile');
    if (savedProfile) {
      setCurrentProfile(JSON.parse(savedProfile));
    }
  }, []);

  const selectProfile = (profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentProfile', JSON.stringify(profile));
  };

  const addProfile = (name, avatarIndex = 0, isKids = false) => {
    const newProfile = {
      id: Date.now().toString(),
      name,
      avatar: PROFILE_AVATARS[avatarIndex % PROFILE_AVATARS.length],
      isKids
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('streamProfiles', JSON.stringify(updatedProfiles));
    return newProfile;
  };

  const deleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem('streamProfiles', JSON.stringify(updatedProfiles));
    if (currentProfile?.id === profileId) {
      setCurrentProfile(null);
      localStorage.removeItem('currentProfile');
    }
  };

  const logout = () => {
    setCurrentProfile(null);
    localStorage.removeItem('currentProfile');
  };

  return (
    <AuthContext.Provider value={{
      currentProfile,
      profiles,
      selectProfile,
      addProfile,
      deleteProfile,
      logout,
      profileAvatars: PROFILE_AVATARS
    }}>
      {children}
    </AuthContext.Provider>
  );
};
