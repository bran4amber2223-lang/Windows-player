import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';

const ProfileSelection = ({ onProfileSelect }) => {
  const { profiles, addProfile, deleteProfile, profileAvatars } = useAuth();
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isKids, setIsKids] = useState(false);

  const handleAddProfile = () => {
    if (newProfileName.trim()) {
      const profile = addProfile(newProfileName, selectedAvatar, isKids);
      setNewProfileName('');
      setIsAddingProfile(false);
      setSelectedAvatar(0);
      setIsKids(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-5xl font-bold text-white text-center mb-12">Who's watching?</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {profiles.map((profile) => (
            <div key={profile.id} className="group relative">
              <button
                onClick={() => onProfileSelect(profile)}
                className="w-full aspect-square rounded-lg overflow-hidden border-4 border-transparent hover:border-white transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </button>
              <p className="text-gray-300 text-center mt-3 text-lg group-hover:text-white transition-colors">
                {profile.name}
              </p>
              {profiles.length > 1 && (
                <button
                  onClick={() => deleteProfile(profile.id)}
                  className="absolute top-2 right-2 bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          ))}

          {profiles.length < 5 && (
            <Dialog open={isAddingProfile} onOpenChange={setIsAddingProfile}>
              <DialogTrigger asChild>
                <button className="w-full aspect-square rounded-lg border-4 border-dashed border-gray-600 hover:border-white transition-all duration-300 flex flex-col items-center justify-center group transform hover:scale-105">
                  <Plus className="w-16 h-16 text-gray-600 group-hover:text-white transition-colors" />
                  <p className="text-gray-600 group-hover:text-white mt-2 transition-colors">Add Profile</p>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Create Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Profile Name</Label>
                    <Input
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="Enter name"
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      maxLength={20}
                    />
                  </div>
                  
                  <div>
                    <Label>Choose Avatar</Label>
                    <div className="grid grid-cols-5 gap-3 mt-2">
                      {profileAvatars.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAvatar(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedAvatar === index ? 'border-white scale-110' : 'border-transparent'
                          }`}
                        >
                          <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="kids" 
                      checked={isKids}
                      onCheckedChange={setIsKids}
                    />
                    <Label htmlFor="kids" className="cursor-pointer">Kids profile (filtered content)</Label>
                  </div>

                  <Button
                    onClick={handleAddProfile}
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={!newProfileName.trim()}
                  >
                    Create Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="text-center">
          <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white hover:border-white">
            Manage Profiles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;
