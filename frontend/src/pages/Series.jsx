import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { xtreamApi } from '../services/xtreamApi';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const Series = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [displayedSeries, setDisplayedSeries] = useState([]);

  useEffect(() => {
    loadSeries();
  }, []);

  useEffect(() => {
    filterSeries();
  }, [selectedCategory, series]);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const [seriesData, catsData] = await Promise.all([
        xtreamApi.getSeries(),
        xtreamApi.getSeriesCategories()
      ]);
      setSeries(seriesData || []);
      setCategories(catsData || []);
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSeries = () => {
    if (selectedCategory === 'all') {
      setDisplayedSeries(series);
    } else {
      setDisplayedSeries(series.filter(s => s.category_id === selectedCategory));
    }
  };

  const handleSeriesClick = (item) => {
    navigate(`/watch/series/${item.series_id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 text-white text-center">Loading series...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onSearch={(query) => navigate(`/search?q=${query}`)} />
      
      <div className="pt-24 px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">TV Series</h1>
          
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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-16">
          {displayedSeries.map((item) => (
            <div
              key={item.series_id}
              className="cursor-pointer group"
              onClick={() => handleSeriesClick(item)}
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
              <p className="text-white mt-2 text-sm line-clamp-1 group-hover:text-gray-300">
                {item.name}
              </p>
              {item.rating && (
                <p className="text-yellow-400 text-xs">★ {item.rating}</p>  
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Series;
