import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentProfile, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/browse' },
    { name: 'Movies', path: '/movies' },
    { name: 'Series', path: '/series' },
    { name: 'Live TV', path: '/live' },
    { name: 'My List', path: '/mylist' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/browse" className="flex items-center">
            <span className="text-red-600 text-3xl font-bold tracking-tight">STREAMFLIX</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === link.path ? 'text-white' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-64 bg-black/80 border-white/20 text-white placeholder:text-gray-400 pr-10"
                autoFocus
                onBlur={() => !searchQuery && setSearchOpen(false)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          )}

          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 hover:bg-white/10 rounded px-3 py-2 transition-colors">
                <img
                  src={currentProfile?.avatar}
                  alt={currentProfile?.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/95 border-gray-800 text-white w-48">
              <DropdownMenuItem className="focus:bg-white/10">
                <User className="w-4 h-4 mr-2" />
                {currentProfile?.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem onClick={logout} className="focus:bg-white/10 text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Switch Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
