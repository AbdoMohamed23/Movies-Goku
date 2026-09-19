// Helper utility for managing local Continue Watching history and timestamp bookmarks

export const formatSecondsToHMS = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) return '00:00';
  const sec = Math.floor(totalSeconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  } else {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
};

export const parseHMSToSeconds = (hmsStr) => {
  if (!hmsStr || typeof hmsStr !== 'string') return 0;
  const parts = hmsStr.trim().split(':').map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0] * 60; // assume minutes if single number
  }
  return 0;
};

export const getSavedTimestamp = (mediaId, season = 1, episode = 1) => {
  try {
    const key = `apex_timestamp_${mediaId}_${season}_${episode}`;
    const directVal = localStorage.getItem(key);
    if (directVal) return directVal;

    // Fallback: check general media key
    const fallbackKey = `apex_timestamp_${mediaId}`;
    const fallbackVal = localStorage.getItem(fallbackKey);
    if (fallbackVal) return fallbackVal;

    // Fallback: check watch history record
    const list = getWatchHistory();
    const item = list.find((h) => String(h.id) === String(mediaId));
    if (item && item.lastWatchedTime) return item.lastWatchedTime;

    return null;
  } catch (e) {
    return null;
  }
};

export const saveSavedTimestamp = (mediaId, season = 1, episode = 1, timeString) => {
  if (!mediaId || !timeString) return;
  try {
    const key = `apex_timestamp_${mediaId}_${season}_${episode}`;
    localStorage.setItem(key, timeString);
    localStorage.setItem(`apex_timestamp_${mediaId}`, timeString);

    // Sync with watch history item
    const list = getWatchHistory();
    const index = list.findIndex((h) => String(h.id) === String(mediaId));
    if (index !== -1) {
      list[index].lastWatchedTime = timeString;
      list[index].season = season;
      list[index].episode = episode;
      list[index].updatedAt = Date.now();
      localStorage.setItem('apex_watch_history', JSON.stringify(list));
      window.dispatchEvent(new Event('apex_history_updated'));
    }
  } catch (e) {}
};

export const getWatchHistory = () => {
  try {
    const data = localStorage.getItem('apex_watch_history');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveWatchHistoryItem = (item) => {
  try {
    const list = getWatchHistory();
    const existingIndex = list.findIndex((h) => String(h.id) === String(item.id));
    const existing = existingIndex !== -1 ? list[existingIndex] : null;
    const filtered = list.filter((h) => String(h.id) !== String(item.id));
    
    const season = item.season || 1;
    const episode = item.episode || 1;
    const savedTime = item.lastWatchedTime || getSavedTimestamp(item.id, season, episode) || (existing ? existing.lastWatchedTime : null);

    const record = {
      id: item.id,
      title: item.title || item.name,
      name: item.name || item.title,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie'),
      season: season,
      episode: episode,
      lastWatchedTime: savedTime,
      updatedAt: Date.now()
    };

    // Keep max 20 items in history
    const updated = [record, ...filtered].slice(0, 20);
    localStorage.setItem('apex_watch_history', JSON.stringify(updated));
    window.dispatchEvent(new Event('apex_history_updated'));
  } catch (e) {}
};

export const removeWatchHistoryItem = (id) => {
  try {
    const list = getWatchHistory();
    const updated = list.filter((h) => String(h.id) !== String(id));
    localStorage.setItem('apex_watch_history', JSON.stringify(updated));
    window.dispatchEvent(new Event('apex_history_updated'));
  } catch (e) {}
};

export const clearWatchHistory = () => {
  try {
    localStorage.removeItem('apex_watch_history');
    window.dispatchEvent(new Event('apex_history_updated'));
  } catch (e) {}
};
