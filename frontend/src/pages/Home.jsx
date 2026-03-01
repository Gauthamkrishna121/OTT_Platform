import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { selectedProfile } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProfile) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          api.get("/videos/movies/"),
          api.get("/videos/series/")
        ]);
        setMovies(moviesRes.data);
        setSeries(seriesRes.data);
      } catch (err) {
        console.log("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProfile, navigate]);

  if (!selectedProfile) return null;

  const allContent = [...movies, ...series];
  const featured = allContent.length > 0 ? allContent[0] : null;

  if (loading) return (
    <div className="home-container">
      <Sidebar />
      <div className="loading-screen">Loading Library...</div>
    </div>
  );

  return (
    <div className="home-container">
      <Sidebar />
      <main className="main-content">
        <Hero video={featured} />
        <div className="content-rows">
          {movies.length > 0 && <MovieRow title="Blockbuster Movies" videos={movies} />}
          {series.length > 0 && <MovieRow title="Popular Series" videos={series} />}
          <MovieRow title="Recently Added" videos={allContent.slice().reverse()} />
        </div>
      </main>
    </div>
  );
}