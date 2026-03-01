import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Categories from "./pages/Categories";
import Downloads from "./pages/Downloads";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContent from "./pages/admin/AdminContent";
import AdminUpload from "./pages/admin/AdminUpload";
import VideoPlayer from "./pages/VideoPlayer";
import SeriesDetail from "./pages/SeriesDetail";
import EpisodePlayer from "./pages/EpisodePlayer";

import Landing from "./pages/Landing";
import ProfileSelection from "./pages/ProfileSelection";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/profiles" element={<ProfileSelection />} />
          <Route path="/browse" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/watch/:id" element={<VideoPlayer />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/watch-episode/:epId" element={<EpisodePlayer />} />

          {/* Admin Routes with Nested Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="upload" element={<AdminUpload />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;