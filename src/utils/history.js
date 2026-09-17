// Helper utility for managing local Continue Watching history

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
    const filtered = list.filter((h) => String(h.id) !== String(item.id));
    
    const record = {
      id: item.id,
      title: item.title || item.name,
      name: item.name || item.title,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie'),
      season: item.season || 1,
      episode: item.episode || 1,
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
