import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { xtreamApi } from '../services/xtreamApi';
import { Search as SearchIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [allSeries, setAllSeries] = useState([]);

  useEffect(() => {
    loadAllContent();
  }, []);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, allMovies, allSeries]);

  const loadAllContent = async () => {
    try {
      const [moviesData, seriesData] = await Promise.all([
        xtreamApi.getVodStreams(),
        xtreamApi.getSeries()
      ]);
      setAllMovies(moviesData || []);
      setAllSeries(seriesData || []);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const performSearch = () => {
    setLoading(true);
    const searchTerm = query.toLowerCase();
    
    const filteredMovies = allMovies.filter(m => 
      m.name.toLowerCase().includes(searchTerm)
    );
    
    const filteredSeries = allSeries.filter(s => 
      s.name.toLowerCase().includes(searchTerm)
    );
    
    setMovies(filteredMovies);
    setSeries(filteredSeries);
    setLoading(false);
  };

  const handleItemClick = (item, type) => {
    const id = type === 'movie' ? item.stream_id : item.series_id;
    navigate(`/watch/${type}/${id}`);
  };

  const totalResults = movies.length + series.length;

  return (
    <div className="min-h-screen bg-black">
      <Navbar onSearch={(q) => navigate(`/search?q=${q}`)} />
      
      <div className="pt-24 px-8 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search Results</h1>
          {query && (
            <p className="text-gray-400 text-lg">
              {loading ? 'Searching...' : `${totalResults} results for "${query}"`}
            </p>
          )}
        </div>

        {!query ? (
          <div className="flex flex-col items-center justify-center py-24">
            <SearchIcon className="w-24 h-24 text-gray-700 mb-4" />
            <p className="text-gray-400 text-xl">Search for movies, series, and more</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <SearchIcon className="w-24 h-24 text-gray-700 mb-4" />
            <p className="text-gray-400 text-xl">No results found for "{query}"</p>
            <p className="text-gray-500 mt-2">Try different keywords</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-gray-900 border-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-red-600">All ({totalResults})</TabsTrigger>
              <TabsTrigger value="movies" className="data-[state=active]:bg-red-600">Movies ({movies.length})</TabsTrigger>
              <TabsTrigger value="series" className="data-[state=active]:bg-red-600">Series ({series.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="space-y-12">
                {movies.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Movies</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {movies.slice(0, 12).map((movie) => (
                        <div
                          key={movie.stream_id}
                          className="cursor-pointer group"
                          onClick={() => handleItemClick(movie, 'movie')}
                        >
                          <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                            <img
                              src={movie.stream_icon}
                              alt={movie.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image';
                              }}
                            />
                          </div>
                          <p className="text-white mt-2 text-sm line-clamp-1">{movie.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {series.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Series</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {series.slice(0, 12).map((item) => (
                        <div
                          key={item.series_id}
                          className="cursor-pointer group"
                          onClick={() => handleItemClick(item, 'series')}
                        >
                          <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                            <img
                              src={item.cover}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image';
                              }}
                            />
                          </div>
                          <p className="text-white mt-2 text-sm line-clamp-1">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="movies" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <div
                    key={movie.stream_id}
                    className="cursor-pointer group"
                    onClick={() => handleItemClick(movie, 'movie')}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                      <img
                        src={movie.stream_icon}
                        alt={movie.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image';
                        }}
                      />
                    </div>
                    <p className="text-white mt-2 text-sm line-clamp-1">{movie.name}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="series" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {series.map((item) => (
                  <div
                    key={item.series_id}
                    className="cursor-pointer group"
                    onClick={() => handleItemClick(item, 'series')}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                      <img
                        src={item.cover}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image';
                        }}
                      />
                    </div>
                    <p className="text-white mt-2 text-sm line-clamp-1">{item.name}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Search;
