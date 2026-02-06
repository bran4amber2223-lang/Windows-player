import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { xtreamApi } from '../services/xtreamApi';
import { Play, ArrowLeft, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useFavorites } from '../contexts/FavoritesContext';
import { toast } from '../hooks/use-toast';

const Watch = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [muted, setMuted] = useState(false);
  const { addFavorite, removeFavorite, isFavorite, addToHistory } = useFavorites();

  useEffect(() => {
    loadContent();
  }, [type, id]);

  const loadContent = async () => {
    try {
      setLoading(true);
      let data;
      
      if (type === 'movie') {
        data = await xtreamApi.getVodInfo(id);
      } else if (type === 'series') {
        data = await xtreamApi.getSeriesInfo(id);
        // Select first episode by default
        if (data.episodes) {
          const firstSeason = Object.keys(data.episodes)[0];
          if (firstSeason && data.episodes[firstSeason].length > 0) {
            setSelectedEpisode(data.episodes[firstSeason][0]);
          }
        }
      }
      
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    setPlaying(true);
    const itemData = {
      id: type === 'movie' ? content.info?.movie_data?.stream_id : content.info?.id,
      name: type === 'movie' ? content.info?.movie_data?.name : content.info?.name,
      cover: type === 'movie' ? content.info?.movie_data?.stream_icon : content.info?.cover,
      type: type,
      rating: type === 'movie' ? content.info?.movie_data?.rating : content.info?.rating
    };
    addToHistory(itemData);
  };

  const toggleFavorite = () => {
    if (!content) return;
    
    const itemData = {
      id: type === 'movie' ? content.info?.movie_data?.stream_id : content.info?.id,
      name: type === 'movie' ? content.info?.movie_data?.name : content.info?.name,
      cover: type === 'movie' ? content.info?.movie_data?.stream_icon : content.info?.cover,
      type: type,
      rating: type === 'movie' ? content.info?.movie_data?.rating : content.info?.rating
    };

    if (isFavorite(itemData.id)) {
      removeFavorite(itemData.id);
      toast({ title: 'Removed from My List' });
    } else {
      addFavorite(itemData);
      toast({ title: 'Added to My List' });
    }
  };

  const getStreamUrl = () => {
    if (type === 'movie' && content?.info?.movie_data) {
      return xtreamApi.getStreamUrl(content.info.movie_data.stream_id, content.info.movie_data.container_extension || 'mp4', 'movie');
    } else if (type === 'series' && selectedEpisode) {
      return xtreamApi.getStreamUrl(selectedEpisode.id, selectedEpisode.container_extension || 'mp4', 'series');
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Content not found</div>
      </div>
    );
  }

  const info = type === 'movie' ? content.info?.movie_data : content.info;
  const streamUrl = getStreamUrl();

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative w-full h-screen bg-black">
        {playing && streamUrl ? (
          <div className="w-full h-full relative">
            <video
              className="w-full h-full object-contain"
              controls
              autoPlay
              muted={muted}
              src={streamUrl}
              onError={(e) => {
                console.error('Video playback error:', e);
                toast({
                  title: 'Playback Error',
                  description: 'Unable to play this content. The stream may not be available.',
                  variant: 'destructive'
                });
              }}
            />
            <button
              onClick={() => navigate(-1)}
              className="absolute top-8 left-8 bg-black/70 hover:bg-black text-white p-3 rounded-full transition-colors z-50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <>
            {/* Backdrop */}
            <div className="absolute inset-0">
              <img
                src={info?.stream_icon || info?.cover}
                alt={info?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1548095115-45697e222a58?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHdhdGNoaW5nfGVufDB8fHx8MTc3MDQxMjQxN3ww&ixlib=rb-4.1.0&q=85';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>

            {/* Content Info */}
            <div className="relative h-full flex flex-col justify-end p-16">
              <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 bg-black/70 hover:bg-black text-white p-3 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <div className="max-w-3xl space-y-6">
                <h1 className="text-6xl font-bold text-white">
                  {info?.name}
                </h1>

                <div className="flex items-center space-x-4 text-lg">
                  {info?.rating && (
                    <span className="text-yellow-400 font-semibold">★ {info.rating}</span>
                  )}
                  {info?.releasedate && (
                    <span className="text-gray-300">{info.releasedate.split('-')[0]}</span>
                  )}
                  {info?.duration && (
                    <span className="text-gray-300">{info.duration}</span>
                  )}
                </div>

                {info?.plot && (
                  <p className="text-lg text-gray-200 max-w-2xl">
                    {info.plot}
                  </p>
                )}

                {info?.director && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Director:</span> {info.director}
                  </p>
                )}

                {info?.cast && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Cast:</span> {info.cast}
                  </p>
                )}

                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    onClick={handlePlay}
                    className="bg-white text-black hover:bg-gray-200 text-xl px-10 py-7 rounded-md"
                  >
                    <Play className="w-7 h-7 mr-3 fill-current" />
                    Play
                  </Button>

                  <Button
                    onClick={toggleFavorite}
                    variant="outline"
                    className="border-2 border-white/70 text-white hover:bg-white/20 text-xl px-8 py-7 rounded-md"
                  >
                    {isFavorite(info?.stream_id || info?.id) ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      <Plus className="w-7 h-7" />
                    )}
                  </Button>

                  <Button
                    onClick={() => setMuted(!muted)}
                    variant="outline"
                    className="border-2 border-white/70 text-white hover:bg-white/20 text-xl px-8 py-7 rounded-md"
                  >
                    {muted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Series Episodes */}
      {!playing && type === 'series' && content.episodes && (
        <div className="px-16 py-12 bg-gradient-to-b from-black to-gray-900">
          <h2 className="text-3xl font-bold text-white mb-8">Episodes</h2>
          {Object.entries(content.episodes).map(([season, episodes]) => (
            <div key={season} className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Season {season}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedEpisode(episode);
                      handlePlay();
                    }}
                  >
                    <div className="aspect-video bg-gray-900 relative">
                      {episode.info?.movie_image && (
                        <img
                          src={episode.info.movie_image}
                          alt={episode.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold">{episode.episode_num}. {episode.title}</h4>
                        {episode.info?.duration && (
                          <span className="text-gray-400 text-sm">{episode.info.duration}</span>
                        )}
                      </div>
                      {episode.info?.plot && (
                        <p className="text-gray-400 text-sm line-clamp-2">{episode.info.plot}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watch;
