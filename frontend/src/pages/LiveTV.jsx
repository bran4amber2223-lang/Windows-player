import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { xtreamApi } from '../services/xtreamApi';
import { Filter, Radio } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const LiveTV = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [displayedStreams, setDisplayedStreams] = useState([]);

  useEffect(() => {
    loadStreams();
  }, []);

  useEffect(() => {
    filterStreams();
  }, [selectedCategory, streams]);

  const loadStreams = async () => {
    try {
      setLoading(true);
      const [streamsData, catsData] = await Promise.all([
        xtreamApi.getLiveStreams(),
        xtreamApi.getLiveCategories()
      ]);
      setStreams(streamsData || []);
      setCategories(catsData || []);
    } catch (error) {
      console.error('Error loading live streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStreams = () => {
    if (selectedCategory === 'all') {
      setDisplayedStreams(streams);
    } else {
      setDisplayedStreams(streams.filter(s => s.category_id === selectedCategory));
    }
  };

  const handleStreamClick = (stream) => {
    // For live TV, we could open in a modal or new page
    const streamUrl = xtreamApi.getStreamUrl(stream.stream_id, 'm3u8', 'live');
    window.open(streamUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 text-white text-center">Loading channels...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onSearch={(query) => navigate(`/search?q=${query}`)} />
      
      <div className="pt-24 px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Live TV</h1>
          
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-white" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-16">
          {displayedStreams.map((stream) => (
            <div
              key={stream.stream_id}
              className="cursor-pointer group"
              onClick={() => handleStreamClick(stream)}
            >
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105 shadow-lg relative">
                {stream.stream_icon ? (
                  <img
                    src={stream.stream_icon}
                    alt={stream.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x170/1a1a1a/ffffff?text=Live+TV';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <Radio className="w-12 h-12 text-red-600" />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span>LIVE</span>
                </div>
              </div>
              <p className="text-white mt-2 text-sm line-clamp-1 group-hover:text-gray-300">
                {stream.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTV;
