# StreamFlix - Xtream Codes Windows Desktop App

A Netflix-inspired desktop streaming application built with React, FastAPI, and Electron, featuring Xtream Codes API integration for Movies, Series, and Live TV.

## 🎯 Features

- **Profile Management**: Multiple user profiles with custom avatars
- **Movies & VOD**: Browse and stream movies with categories
- **TV Series**: Watch series with seasons and episodes
- **Live TV**: Access live television channels
- **My List**: Add favorites and track watch history
- **Search**: Find content across all categories
- **Video Player**: Built-in player with playback controls
- **Netflix-Inspired UI**: Modern, sleek design with smooth animations

## 🏗️ Tech Stack

- **Frontend**: React 19, TailwindCSS, shadcn/ui components
- **Backend**: FastAPI, MongoDB (for user data)
- **Desktop**: Electron for Windows packaging
- **Streaming**: Xtream Codes API integration

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and Yarn
- Python 3.8+
- MongoDB

### Development Setup

1. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   yarn install
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start Backend**:
   ```bash
   sudo supervisorctl start backend
   ```

4. **Start Frontend**:
   ```bash
   sudo supervisorctl start frontend
   ```

5. **Access the Web App**:
   Open http://localhost:3000

### Electron Desktop App

1. **Install Electron Dependencies** (from /app directory):
   ```bash
   # Copy electron-package.json to package.json in root
   cp electron-package.json package.json
   npm install
   ```

2. **Run in Development**:
   ```bash
   npm run electron-dev
   ```
   This will start both the React dev server and Electron window.

3. **Build Windows Executable**:
   ```bash
   npm run electron-build
   ```
   The built .exe file will be in the `dist` folder.

## 🔧 Configuration

### Xtream Codes Credentials

The app is pre-configured with Xtream Codes API credentials in:
```
/app/frontend/src/services/xtreamApi.js
```

Current configuration:
- Host: http://forestmedia.online:8880
- Username: Bdog97
- Password: h1dze2U

To change credentials, update the `XTREAM_CONFIG` object in the file above.

### Environment Variables

- **Frontend** (`frontend/.env`):
  - `REACT_APP_BACKEND_URL`: Backend API URL

- **Backend** (`backend/.env`):
  - `MONGO_URL`: MongoDB connection string
  - `DB_NAME`: Database name

## 📱 App Structure

```
/app
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/         # Route pages
│   │   │   ├── ProfileSelection.jsx
│   │   │   ├── Browse.jsx
│   │   │   ├── Movies.jsx
│   │   │   ├── Series.jsx
│   │   │   ├── LiveTV.jsx
│   │   │   ├── MyList.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Watch.jsx
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ContentCarousel.jsx
│   │   ├── contexts/      # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── FavoritesContext.jsx
│   │   └── services/      # API services
│   │       └── xtreamApi.js
│   └── public/
├── backend/               # FastAPI server
│   └── server.py
└── electron.js           # Electron main process
```

## 🎨 Key Features Details

### Profile System
- Create up to 5 profiles
- Custom avatars for each profile
- Kids profile option with filtered content
- Profile-specific favorites and watch history

### Content Browsing
- Category-based filtering
- Horizontal carousels for content discovery
- Hover effects with content info
- Ratings and metadata display

### Video Playback
- Native HTML5 video player
- Episode selection for series
- Continue watching from history
- Progress tracking

### Data Storage
- Profiles stored in localStorage
- Favorites per profile
- Watch history with progress
- Backend for additional user data (expandable)

## 🔐 API Integration

The app uses Xtream Codes player_api.php endpoints:

- `get_vod_streams`: Movies/VOD content
- `get_vod_categories`: Movie categories
- `get_series`: TV series
- `get_series_categories`: Series categories
- `get_series_info`: Series details with episodes
- `get_live_streams`: Live TV channels
- `get_live_categories`: Live TV categories

## 🖥️ Desktop App Features

When built as Electron app:
- Native Windows executable
- Runs offline after initial load
- Desktop integration
- Auto-updates support (configurable)
- Tray icon support (configurable)

## 📦 Building for Production

1. **Build Frontend**:
   ```bash
   cd frontend
   yarn build
   ```

2. **Build Electron App**:
   ```bash
   npm run electron-build
   ```

3. **Installer Location**:
   The Windows installer will be in `/app/dist/`

## 🐛 Troubleshooting

### Xtream API Errors
- Verify credentials are correct
- Check network connectivity
- Ensure Xtream server is accessible

### Video Playback Issues
- Check stream URL format
- Verify video codec support in browser/Electron
- Try different container extensions (mp4, mkv, m3u8)

### Electron Build Issues
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify frontend build completed successfully

## 📄 License

Private - For authorized use only

## 🙏 Acknowledgments

- Xtream Codes for streaming API
- Netflix for design inspiration
- shadcn/ui for beautiful components
