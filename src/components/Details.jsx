import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FaPlay, 
  FaYoutube, 
  FaStar, 
  FaClock, 
  FaCalendarAlt, 
  FaServer, 
  FaRedoAlt, 
  FaUsers, 
  FaTv,
  FaLayerGroup
} from 'react-icons/fa';

const API_KEY = '52ef927bbeb21980cd91386a29403c78';

// قائمة السيرفرات المتوافقة مع أسماء مصادر المشاهدة
const SERVERS = [
  { 
    id: 'vidlink', 
    name: 'Server 1 (VidLink HD)', 
    movieUrl: (id) => `https://vidlink.pro/movie/${id}?autoplay=false&primaryColor=ea580c`,
    tvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=false&primaryColor=ea580c`
  },
  { 
    id: 'filemoon', 
    name: 'Filemoon', 
    movieUrl: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
  },
  { 
    id: 'upnshare', 
    name: 'Upnshare', 
    movieUrl: (id) => `https://player.smashy.stream/movie/${id}`,
    tvUrl: (id, s, e) => `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}`
  },
  { 
    id: 'forafile', 
    name: 'Forafile', 
    movieUrl: (id) => `https://vidsrc.xyz/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`
  },
  { 
    id: 'uqload', 
    name: 'Uqload', 
    movieUrl: (id) => `https://vidsrc.rip/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.rip/embed/tv/${id}/${s}/${e}`
  },
  { 
    id: 'vk', 
    name: 'VK', 
    movieUrl: (id) => `https://vidsrc.in/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.in/embed/tv/${id}/${s}/${e}`
  },
  { 
    id: 'ok', 
    name: 'OK', 
    movieUrl: (id) => `https://vidsrc.pm/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`
  },
  { 
    id: 'savefiles', 
    name: 'Save Files', 
    movieUrl: (id) => `https://www.2embed.skin/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://www.2embed.skin/embed/tv/${id}/${s}/${e}`
  },
];

const Details = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isExplicitTv = searchParams.get('type') === 'tv';

  const [itemData, setItemData] = useState(null);
  const [isTv, setIsTv] = useState(isExplicitTv);
  const [trailerKey, setTrailerKey] = useState(null);
  const [credits, setCredits] = useState([]);
  const [similarItems, setSimilarItems] = useState([]);
  
  // Franchise / Collection parts (e.g. The Godfather 1, 2, 3)
  const [collection, setCollection] = useState(null);
  
  // TV Show Season & Episode states with local progress memory
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const [activeTab, setActiveTab] = useState('stream'); // 'stream' | 'trailer'
  
  // Persisted preferred server
  const [selectedServer, setSelectedServer] = useState(() => {
    try {
      const savedServer = localStorage.getItem('apex_preferred_server');
      if (savedServer && SERVERS.some((s) => s.id === savedServer)) {
        return savedServer;
      }
    } catch (e) {}
    return SERVERS[0].id;
  });

  const [playerKey, setPlayerKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Save selected server preference
  const handleServerChange = (serverId) => {
    setSelectedServer(serverId);
    try {
      localStorage.setItem('apex_preferred_server', serverId);
    } catch (e) {}
    setPlayerKey((k) => k + 1);
  };

  // Save season progress
  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
    try {
      localStorage.setItem(`apex_progress_${id}`, JSON.stringify({ season: seasonNumber, episode: 1 }));
    } catch (e) {}
    setPlayerKey((k) => k + 1);
  };

  // Save episode progress
  const handleEpisodeChange = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
    try {
      localStorage.setItem(`apex_progress_${id}`, JSON.stringify({ season: selectedSeason, episode: episodeNumber }));
    } catch (e) {}
    setPlayerKey((k) => k + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setCollection(null);
      setSeasons([]);
      setEpisodes([]);

      try {
        let isTvShow = isExplicitTv;
        let data = null;

        // Try movie first unless explicitly marked as TV
        if (!isTvShow) {
          try {
            const movieRes = await axios.get(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en`
            );
            data = movieRes.data;
            isTvShow = false;
          } catch (e) {
            // Fallback to TV show endpoint if movie failed
            const tvRes = await axios.get(
              `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en`
            );
            data = tvRes.data;
            isTvShow = true;
          }
        } else {
          const tvRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en`
          );
          data = tvRes.data;
          isTvShow = true;
        }

        setIsTv(isTvShow);
        setItemData(data);

        const mediaTypeStr = isTvShow ? 'tv' : 'movie';

        // 1. Check Movie Franchise / Collection (e.g. Godfather, Harry Potter, etc.)
        if (!isTvShow && data.belongs_to_collection) {
          try {
            const colRes = await axios.get(
              `https://api.themoviedb.org/3/collection/${data.belongs_to_collection.id}?api_key=${API_KEY}&language=en`
            );
            if (colRes.data && colRes.data.parts) {
              const sortedParts = colRes.data.parts.sort(
                (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0)
              );
              setCollection({ ...colRes.data, parts: sortedParts });
            }
          } catch (e) {
            console.error('Error loading collection:', e);
          }
        }

        // 2. If TV Show, restore saved season and episode progress
        if (isTvShow && data.seasons) {
          const validSeasons = data.seasons.filter((s) => s.season_number > 0);
          const availableSeasons = validSeasons.length > 0 ? validSeasons : data.seasons;
          setSeasons(availableSeasons);

          let initialSeason = availableSeasons.length > 0 ? availableSeasons[0].season_number : 1;
          let initialEpisode = 1;

          try {
            const savedProgress = JSON.parse(localStorage.getItem(`apex_progress_${id}`));
            if (savedProgress && savedProgress.season) {
              if (availableSeasons.some((s) => s.season_number === savedProgress.season)) {
                initialSeason = savedProgress.season;
                initialEpisode = savedProgress.episode || 1;
              }
            }
          } catch (e) {}

          setSelectedSeason(initialSeason);
          setSelectedEpisode(initialEpisode);
        }

        // 3. Videos / Trailers
        try {
          const vidRes = await axios.get(
            `https://api.themoviedb.org/3/${mediaTypeStr}/${id}/videos?api_key=${API_KEY}&language=en`
          );
          const results = vidRes.data.results || [];
          const trailer = results.find(
            (vid) => (vid.type === 'Trailer' || vid.type === 'Teaser') && vid.site === 'YouTube'
          );
          if (trailer) {
            setTrailerKey(trailer.key);
          } else if (results.length > 0 && results[0].site === 'YouTube') {
            setTrailerKey(results[0].key);
          } else {
            setTrailerKey(null);
          }
        } catch (e) {
          setTrailerKey(null);
        }

        // 4. Credits
        try {
          const creditsRes = await axios.get(
            `https://api.themoviedb.org/3/${mediaTypeStr}/${id}/credits?api_key=${API_KEY}&language=en`
          );
          setCredits(creditsRes.data.cast ? creditsRes.data.cast.slice(0, 10) : []);
        } catch (e) {
          setCredits([]);
        }

        // 5. Similar
        try {
          const simRes = await axios.get(
            `https://api.themoviedb.org/3/${mediaTypeStr}/${id}/similar?api_key=${API_KEY}&language=en&page=1`
          );
          setSimilarItems(simRes.data.results ? simRes.data.results.slice(0, 12) : []);
        } catch (e) {
          setSimilarItems([]);
        }

      } catch (err) {
        console.error('Error loading details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setPlayerKey((prev) => prev + 1);
    setActiveTab('stream');
  }, [id, isExplicitTv]);

  // Fetch episodes when selectedSeason changes for TV shows
  useEffect(() => {
    if (isTv && selectedSeason) {
      const fetchSeasonEpisodes = async () => {
        try {
          const res = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=en`
          );
          setEpisodes(res.data.episodes || []);
        } catch (e) {
          setEpisodes([]);
        }
      };
      fetchSeasonEpisodes();
    }
  }, [isTv, id, selectedSeason]);

  const handleReloadPlayer = () => {
    setPlayerKey((prev) => prev + 1);
  };

  const handleFranchisePartChange = (targetMovieId) => {
    if (targetMovieId && targetMovieId !== id) {
      navigate(`/details/${targetMovieId}`);
    }
  };

  const currentServerObj = SERVERS.find((s) => s.id === selectedServer) || SERVERS[0];
  const streamUrl = isTv
    ? currentServerObj.tvUrl(id, selectedSeason, selectedEpisode)
    : currentServerObj.movieUrl(id);

  const formatRuntime = (mins) => {
    if (!mins) return 'N/A';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${remainingMins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white bg-[#0a0c11]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-300 font-medium text-base">Loading stream & details...</p>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white bg-[#0a0c11]">
        <h2 className="text-2xl font-bold mb-4">Movie or Series not found</h2>
        <Link to="/" className="px-5 py-2.5 bg-orange-600 rounded-xl text-white font-semibold hover:bg-orange-700">
          Back to Home
        </Link>
      </div>
    );
  }

  const title = itemData.title || itemData.name;
  const releaseDate = itemData.release_date || itemData.first_air_date;
  const backdropUrl = itemData.backdrop_path
    ? `https://image.tmdb.org/t/p/original/${itemData.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500/${itemData.poster_path}`;

  return (
    <div className="text-white bg-[#0a0c11] min-h-screen">
      {/* Backdrop Hero Background */}
      <div className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-md opacity-20 scale-105"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c11]/80 via-[#0a0c11]/95 to-[#0a0c11]" />

        <div className="relative max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6">
          
          {/* Main Video Player Container */}
          <div className="bg-[#12141c]/90 border border-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-3 sm:p-6 mb-8">
            
            {/* Player Mode Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-gray-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('stream')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md ${
                    activeTab === 'stream'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-orange-600/30 ring-1 ring-orange-500/50'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <FaPlay className="text-xs" />
                  <span>{isTv ? `Watch S${selectedSeason} E${selectedEpisode}` : 'Watch'}</span>
                </button>

                {trailerKey && (
                  <button
                    onClick={() => setActiveTab('trailer')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      activeTab === 'trailer'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-500/50'
                        : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <FaYoutube className="text-sm text-red-400" />
                    <span>Trailer</span>
                  </button>
                )}
              </div>

              {/* Player Reload Action */}
              <div className="flex items-center gap-2">
                {activeTab === 'stream' && (
                  <button
                    onClick={handleReloadPlayer}
                    title="Reload Player Stream"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-medium transition-colors border border-gray-700/50"
                  >
                    <FaRedoAlt className="text-[11px]" />
                    <span>Reload</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. Franchise / Sequel Collection Selector */}
            {collection && collection.parts && collection.parts.length > 1 && (
              <div className="mb-4 p-3 sm:p-4 bg-[#0f121a] rounded-2xl border border-orange-500/30 flex flex-col sm:flex-row sm:items-center gap-3 shadow-lg">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-orange-400 font-bold flex-shrink-0">
                  <FaLayerGroup className="text-orange-400 text-base" />
                  <span>{collection.name} ({collection.parts.length} Parts):</span>
                </div>
                
                {/* Horizontal scrollable custom pills for Franchise parts */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar flex-1">
                  {collection.parts.map((part, index) => {
                    const isCurrent = String(part.id) === String(id);
                    return (
                      <button
                        key={part.id}
                        onClick={() => handleFranchisePartChange(part.id)}
                        className={`flex items-center gap-2 px-5 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                          isCurrent
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400/60 font-bold'
                            : 'bg-[#181b24] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/60'
                        }`}
                      >
                        <span className="text-[10px] font-black opacity-75">#{index + 1}</span>
                        <span>{part.title}</span>
                        <span className="text-[10px] text-gray-400">({part.release_date ? part.release_date.slice(0, 4) : 'N/A'})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. TV Series Season & Episode Custom Selector */}
            {isTv && seasons.length > 0 && (
              <div className="mb-4 p-3 sm:p-4 bg-[#0f121a] rounded-2xl border border-blue-500/30 flex flex-col gap-3 shadow-lg">
                {/* Seasons Pills */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-gray-800/80 pb-2.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 font-bold flex-shrink-0">
                    <FaTv className="text-base" />
                    <span>Seasons:</span>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar flex-1">
                    {seasons.map((season) => {
                      const isCurrentSeason = selectedSeason === season.season_number;
                      return (
                        <button
                          key={season.id}
                          onClick={() => handleSeasonChange(season.season_number)}
                          className={`px-5 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            isCurrentSeason
                              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                              : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/40'
                          }`}
                        >
                          {season.name || `Season ${season.season_number}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Episodes Pills */}
                {episodes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>Episodes in Season {selectedSeason}:</span>
                      <span className="text-blue-400 font-semibold">Playing Episode {selectedEpisode}</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
                      {episodes.map((ep) => {
                        const isCurrentEp = selectedEpisode === ep.episode_number;
                        return (
                          <button
                            key={ep.id}
                            onClick={() => handleEpisodeChange(ep.episode_number)}
                            className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                              isCurrentEp
                                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                                : 'bg-[#151923] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800'
                            }`}
                            title={ep.name}
                          >
                            <span>Ep {ep.episode_number}</span>
                            {ep.name && <span className="text-[10px] text-gray-400 max-w-[140px] truncate hidden sm:inline">- {ep.name}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Server Selector Bar matching Seasons & Episodes layout */}
            {activeTab === 'stream' && (
              <div className="mb-4 p-3 sm:p-4 bg-[#0f121a] rounded-2xl border border-orange-500/30 flex flex-col sm:flex-row sm:items-center gap-3 shadow-lg">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-orange-400 font-bold flex-shrink-0">
                  <FaServer className="text-base text-orange-400" />
                  <span>Streaming Server:</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar flex-1">
                  {SERVERS.map((server) => {
                    const isCurrentServer = selectedServer === server.id;
                    return (
                      <button
                        key={server.id}
                        onClick={() => handleServerChange(server.id)}
                        className={`px-5 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          isCurrentServer
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold shadow-md shadow-orange-600/30 ring-1 ring-orange-400/50'
                            : 'bg-[#181b24] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/60'
                        }`}
                      >
                        {server.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Video Player Display */}
            <div className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[16/9] max-h-[620px] rounded-xl overflow-hidden bg-black shadow-inner border border-gray-800/90">
              {activeTab === 'stream' && (
                <iframe
                  key={`stream-${selectedServer}-${playerKey}-${id}-${selectedSeason}-${selectedEpisode}`}
                  src={streamUrl}
                  title={`${title} - Video Player`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="origin"
                />
              )}

              {activeTab === 'trailer' && (
                trailerKey ? (
                  <iframe
                    key={`trailer-${trailerKey}`}
                    src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
                    title={`${title} - Official Trailer`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <p>No official trailer available.</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Details Info Card */}
          <div className="bg-[#12141c] rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-gray-800 grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Poster Column */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 w-full max-w-[240px]">
                <img
                  src={
                    itemData.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${itemData.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Poster'
                  }
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Info Column */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide">
                    {title}
                  </h1>
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                    <FaStar className="text-yellow-400" />
                    <span>{itemData.vote_average ? itemData.vote_average.toFixed(1) : 'N/A'}</span>
                    <span className="text-xs text-gray-400 font-normal">({itemData.vote_count} votes)</span>
                  </div>
                </div>

                {itemData.tagline && (
                  <p className="text-orange-400 italic text-xs sm:text-sm mb-4">"{itemData.tagline}"</p>
                )}

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mb-5">
                  <div className="flex items-center gap-1.5 bg-gray-800/80 px-2.5 py-1.5 rounded-md">
                    <FaCalendarAlt className="text-orange-400" />
                    <span>{releaseDate || 'N/A'}</span>
                  </div>
                  {itemData.runtime ? (
                    <div className="flex items-center gap-1.5 bg-gray-800/80 px-2.5 py-1.5 rounded-md">
                      <FaClock className="text-orange-400" />
                      <span>{formatRuntime(itemData.runtime)}</span>
                    </div>
                  ) : null}
                  {itemData.number_of_seasons ? (
                    <div className="flex items-center gap-1.5 bg-blue-600/30 text-blue-300 px-2.5 py-1.5 rounded-md border border-blue-500/40 font-semibold">
                      <FaTv />
                      <span>{itemData.number_of_seasons} Seasons</span>
                    </div>
                  ) : null}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {itemData.genres &&
                    itemData.genres.map((g) => (
                      <span
                        key={g.id}
                        className="px-3 py-1 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-semibold"
                      >
                        {g.name}
                      </span>
                    ))}
                </div>

                {/* Overview */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-sm sm:text-base font-semibold text-white">Storyline</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {itemData.overview || 'No description available.'}
                  </p>
                </div>
              </div>

              {/* Cast Members */}
              {credits.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <h3 className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white mb-3">
                    <FaUsers className="text-orange-400" />
                    <span>Top Cast</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {credits.map((actor) => (
                      <Link
                        key={actor.id}
                        to={`/?actor=${actor.id}&name=${encodeURIComponent(actor.name)}`}
                        className="flex items-center gap-2 bg-gray-900/60 hover:bg-orange-600/20 hover:border-orange-500/50 p-1.5 sm:p-2 rounded-lg border border-gray-800 transition-all cursor-pointer group"
                        title={`View movies with ${actor.name}`}
                      >
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}`
                              : 'https://via.placeholder.com/100x100?text=Actor'
                          }
                          alt={actor.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-700 flex-shrink-0 group-hover:border-orange-500 transition-colors"
                        />
                        <div className="overflow-hidden">
                          <p className="text-[11px] sm:text-xs font-medium text-white truncate group-hover:text-orange-400 transition-colors">{actor.name}</p>
                          <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">{actor.character}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Items Section */}
          {similarItems.length > 0 && (
            <div className="pt-4 space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-600 rounded-full inline-block"></span>
                <span>You May Also Like</span>
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-7 sm:gap-y-10 md:gap-y-12">
                {similarItems.map((sim) => {
                  const simTitle = sim.title || sim.name;
                  const simDate = sim.release_date || sim.first_air_date;
                  return (
                    <Link
                      to={`/details/${sim.id}${isTv ? '?type=tv' : ''}`}
                      key={sim.id}
                      className="group bg-[#141721] rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-orange-500/50 flex flex-col"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
                        <img
                          src={
                            sim.poster_path
                              ? `https://image.tmdb.org/t/p/w400/${sim.poster_path}`
                              : 'https://via.placeholder.com/400x600?text=No+Poster'
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={simTitle}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg">
                            <FaPlay className="ml-0.5 text-xs" />
                          </div>
                        </div>
                        <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-semibold text-yellow-400 flex items-center gap-1">
                          <FaStar className="text-[9px]" />
                          {sim.vote_average ? sim.vote_average.toFixed(1) : 'N/A'}
                        </div>
                      </div>
                      <div className="p-1.5 sm:p-2.5 flex flex-col justify-between flex-1">
                        <h4 className="text-white text-[11px] sm:text-xs font-semibold truncate group-hover:text-orange-400 transition-colors">
                          {simTitle}
                        </h4>
                        <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-400 mt-1 sm:mt-2">
                          <span>{simDate ? simDate.slice(0, 4) : 'N/A'}</span>
                          <span className="text-orange-500 font-medium">Watch</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;