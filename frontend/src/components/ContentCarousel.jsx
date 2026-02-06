import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ContentCarousel = ({ title, items, onItemClick, type = 'movie' }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  const scroll = (direction) => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group mb-12">
      <h2 className="text-2xl font-bold text-white mb-4 px-8">{title}</h2>
      
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:from-black"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div
          id={`carousel-${title}`}
          className="flex gap-2 overflow-x-hidden px-8 scroll-smooth"
        >
          {items.map((item) => (
            <div
              key={item.stream_id || item.series_id || item.id}
              className="flex-shrink-0 w-48 cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20"
              onClick={() => onItemClick(item)}
              onMouseEnter={() => setHoveredItem(item.stream_id || item.series_id || item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                {item.stream_icon || item.cover ? (
                  <img
                    src={item.stream_icon || item.cover}
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
                
                {hoveredItem === (item.stream_id || item.series_id || item.id) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-3">
                    <div className="text-white">
                      <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                      {item.rating && (
                        <p className="text-xs text-yellow-400 mt-1">★ {item.rating}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:from-black"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ContentCarousel;
