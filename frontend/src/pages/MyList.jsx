import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useFavorites } from '../contexts/FavoritesContext';
import { Trash2, Play } from 'lucide-react';
import { Button } from '../components/ui/button';

const MyList = () => {
  const navigate = useNavigate();
  const { favorites, watchHistory, removeFavorite } = useFavorites();

  const handleItemClick = (item) => {
    navigate(`/watch/${item.type}/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar onSearch={(query) => navigate(`/search?q=${query}`)} />
      
      <div className="pt-24 px-8 pb-16">
        {/* Favorites */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-8">My List</h1>
          
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">Your list is empty</p>
              <p className="text-gray-500 mt-2">Add movies and series to watch later</p>
              <Button
                onClick={() => navigate('/browse')}
                className="mt-6 bg-red-600 hover:bg-red-700"
              >
                Browse Content
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favorites.map((item) => (
                <div key={item.id} className="group relative">
                  <div
                    className="cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <p className="text-gray-400 text-sm text-center px-4">{item.name}</p>
                        </div>
                      )}
                    </div>
                    <p className="text-white mt-2 text-sm line-clamp-1">{item.name}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(item.id);
                    }}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Watch History */}
        {watchHistory.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Continue Watching</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchHistory.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105 shadow-lg relative">
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <p className="text-gray-400 text-sm text-center px-4">{item.name}</p>
                      </div>
                    )}
                    
                    {item.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div 
                          className="h-full bg-red-600"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <p className="text-white mt-2 text-sm line-clamp-1">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
