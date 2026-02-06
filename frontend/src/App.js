import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { Toaster } from "./components/ui/toaster";
import ProfileSelection from "./pages/ProfileSelection";
import Browse from "./pages/Browse";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import LiveTV from "./pages/LiveTV";
import MyList from "./pages/MyList";
import Search from "./pages/Search";
import Watch from "./pages/Watch";

const ProtectedRoute = ({ children }) => {
  const { currentProfile } = useAuth();
  
  if (!currentProfile) {
    return <Navigate to="/profiles" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { currentProfile, selectProfile } = useAuth();

  return (
    <Routes>
      <Route 
        path="/profiles" 
        element={
          currentProfile ? (
            <Navigate to="/browse" replace />
          ) : (
            <ProfileSelection onProfileSelect={selectProfile} />
          )
        } 
      />
      <Route 
        path="/browse" 
        element={
          <ProtectedRoute>
            <Browse />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/movies" 
        element={
          <ProtectedRoute>
            <Movies />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/series" 
        element={
          <ProtectedRoute>
            <Series />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/live" 
        element={
          <ProtectedRoute>
            <LiveTV />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mylist" 
        element={
          <ProtectedRoute>
            <MyList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/watch/:type/:id" 
        element={
          <ProtectedRoute>
            <Watch />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/profiles" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <AppRoutes />
            <Toaster />
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
