import axios from 'axios';

const XTREAM_CONFIG = {
  host: 'http://forestmedia.online:8880',
  username: 'Bdog97',
  password: 'h1dze2U'
};

const baseUrl = `${XTREAM_CONFIG.host}/player_api.php`;

const createUrl = (action, params = {}) => {
  const url = new URL(baseUrl);
  url.searchParams.append('username', XTREAM_CONFIG.username);
  url.searchParams.append('password', XTREAM_CONFIG.password);
  url.searchParams.append('action', action);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
};

export const xtreamApi = {
  // Get player info and authentication
  async getPlayerInfo() {
    try {
      const url = createUrl('player_api');
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching player info:', error);
      throw error;
    }
  },

  // VOD (Movies) endpoints
  async getVodCategories() {
    try {
      const url = createUrl('get_vod_categories');
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching VOD categories:', error);
      throw error;
    }
  },

  async getVodStreams(categoryId = null) {
    try {
      const params = categoryId ? { category_id: categoryId } : {};
      const url = createUrl('get_vod_streams', params);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching VOD streams:', error);
      throw error;
    }
  },

  async getVodInfo(vodId) {
    try {
      const url = createUrl('get_vod_info', { vod_id: vodId });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching VOD info:', error);
      throw error;
    }
  },

  // Series endpoints
  async getSeriesCategories() {
    try {
      const url = createUrl('get_series_categories');
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching series categories:', error);
      throw error;
    }
  },

  async getSeries(categoryId = null) {
    try {
      const params = categoryId ? { category_id: categoryId } : {};
      const url = createUrl('get_series', params);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  },

  async getSeriesInfo(seriesId) {
    try {
      const url = createUrl('get_series_info', { series_id: seriesId });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching series info:', error);
      throw error;
    }
  },

  // Live TV endpoints
  async getLiveCategories() {
    try {
      const url = createUrl('get_live_categories');
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching live categories:', error);
      throw error;
    }
  },

  async getLiveStreams(categoryId = null) {
    try {
      const params = categoryId ? { category_id: categoryId } : {};
      const url = createUrl('get_live_streams', params);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error;
    }
  },

  // Generate stream URL for playback
  getStreamUrl(streamId, extension = 'mp4', type = 'movie') {
    if (type === 'movie') {
      return `${XTREAM_CONFIG.host}/movie/${XTREAM_CONFIG.username}/${XTREAM_CONFIG.password}/${streamId}.${extension}`;
    } else if (type === 'series') {
      return `${XTREAM_CONFIG.host}/series/${XTREAM_CONFIG.username}/${XTREAM_CONFIG.password}/${streamId}.${extension}`;
    } else if (type === 'live') {
      return `${XTREAM_CONFIG.host}/live/${XTREAM_CONFIG.username}/${XTREAM_CONFIG.password}/${streamId}.${extension}`;
    }
  },

  // Get image URL
  getImageUrl(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${XTREAM_CONFIG.host}${imagePath}`;
  }
};

export default xtreamApi;
