import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ContentCarousel from '../components/ContentCarousel';
import { xtreamApi } from '../services/xtreamApi';
import { Play, Info, Plus, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useFavorites } from '../contexts/FavoritesContext';
import { toast } from '../hooks/use-toast';

const Browse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [featuredContent, setFeaturedContent] = useState(null);
  const [vodStreams, setVodStreams] = useState([]);
  const [series, setSeries] = useState([]);
  const [vodCategories, setVodCategories] = useState([]);
  const [categorizedContent, setCategorizedContent] = useState({});
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);

      // Load VOD streams and categories
      const [vodData, vodCats, seriesData] = await Promise.all([
        xtreamApi.getVodStreams(),
        xtreamApi.getVodCategories(),
        xtreamApi.getSeries()
      ]);

      setVodStreams(vodData || []);
      setSeries(seriesData || []);
      setVodCategories(vodCats || []);

      // Set featured content (first available movie)
      if (vodData && vodData.length > 0) {
        setFeaturedContent(vodData[0]);
      }

      // Organize content by category
      if (vodCats && vodData) {
        const organized = {};
        vodCats.slice(0, 6).forEach(cat => {
          const items = vodData.filter(item => item.category_id === cat.category_id);
          if (items.length > 0) {
            organized[cat.category_name] = items.slice(0, 20);
          }
        });
        setCategorizedContent(organized);
      }

    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: 'Error loading content',
        description: 'Failed to load streaming content. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    const id = item.stream_id || item.series_id;
    const type = item.stream_id ? 'movie' : 'series';
    navigate(`/watch/${type}/${id}`);
  };

  const handlePlayFeatured = () => {
    if (featuredContent) {
      handleItemClick(featuredContent);
    }
  };

  const toggleFavorite = () => {
    if (!featuredContent) return;
    
    const itemData = {
      id: featuredContent.stream_id || featuredContent.series_id,
      name: featuredContent.name,
      cover: featuredContent.stream_icon || featuredContent.cover,
      type: featuredContent.stream_id ? 'movie' : 'series',
      rating: featuredContent.rating
    };

    if (isFavorite(itemData.id)) {
      removeFavorite(itemData.id);
      toast({
        title: 'Removed from My List',
      });
    } else {
      addFavorite(itemData);
      toast({
        title: 'Added to My List',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onSearch={(query) => navigate(`/search?q=${query}`)} />

      {/* Featured Content Hero */}
      {featuredContent && (
        <div className="relative h-[80vh] mb-8">
          <div className="absolute inset-0">
            <img
              src={featuredContent.stream_icon || featuredContent.cover}
              alt={featuredContent.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1548095115-45697e222a58?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHdhdGNoaW5nfGVufDB8fHx8MTc3MDQxMjQxN3ww&ixlib=rb-4.1.0&q=85';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          <div className="relative h-full flex items-center px-8 md:px-16">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                {featuredContent.name}
              </h1>
              
              {featuredContent.plot && (
                <p className="text-lg text-gray-200 line-clamp-3">
                  {featuredContent.plot}
                </p>
              )}

              <div className="flex items-center space-x-3">
                {featuredContent.rating && (
                  <span className="text-yellow-400 font-semibold">
                    ★ {featuredContent.rating}
                  </span>
                )}
                {featuredContent.releaseDate && (
                  <span className="text-gray-300">{featuredContent.releaseDate}</span>
                )}
                {featuredContent.duration && (
                  <span className="text-gray-300">{featuredContent.duration}</span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={handlePlayFeatured}
                  className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-md"
                >
                  <Play className="w-6 h-6 mr-2 fill-current" />
                  Play
                </Button>

                <Button
                  onClick={toggleFavorite}
                  variant="outline"
                  className="border-2 border-white/70 text-white hover:bg-white/20 text-lg px-6 py-6 rounded-md"
                >
                  {isFavorite(featuredContent.stream_id || featuredContent.series_id) ? (
                    <Check className="w-6 h-6 mr-2" />
                  ) : (
                    <Plus className="w-6 h-6 mr-2" />
                  )}
                  My List
                </Button>

                <Button
                  onClick={handlePlayFeatured}
                  variant="outline"
                  className="border-2 border-white/70 text-white hover:bg-white/20 text-lg px-6 py-6 rounded-md"
                >
                  <Info className="w-6 h-6 mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Carousels */}
      <div className="pb-16 -mt-32 relative z-10">
        {/* Trending Now */}
        {vodStreams.length > 0 && (
          <ContentCarousel
            title="Trending Now"
            items={vodStreams.slice(0, 20)}
            onItemClick={handleItemClick}
            type="movie"
          />
        )}

        {/* Series */}
        {series.length > 0 && (
          <ContentCarousel
            title="Popular Series"
            items={series.slice(0, 20)}
            onItemClick={handleItemClick}
            type="series"
          />
        )}

        {/* Category-based carousels */}
        {Object.entries(categorizedContent).map(([categoryName, items]) => (
          <ContentCarousel
            key={categoryName}
            title={categoryName}
            items={items}
            onItemClick={handleItemClick}
            type="movie"
          />
        ))}
      </div>
    </div>
  );
};

export default Browse;
