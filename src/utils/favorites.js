// Helper utilities for managing local favorites list with instant event sync

export const getFavorites = () => {
  try {
    const data = localStorage.getItem('apex_favorites');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const isFavorite = (id) => {
  const list = getFavorites();
  return list.some((item) => String(item.id) === String(id));
};

export const toggleFavorite = (item) => {
  const list = getFavorites();
  const index = list.findIndex((fav) => String(fav.id) === String(item.id));
  let updated;

  if (index > -1) {
    // Remove
    updated = list.filter((fav) => String(fav.id) !== String(item.id));
  } else {
    // Add
    const favItem = {
      id: item.id,
      title: item.title || item.name,
      name: item.name || item.title,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      media_type: item.media_type || (item.first_air_date && !item.release_date ? 'tv' : 'movie')
    };
    updated = [favItem, ...list];
  }

  try {
    localStorage.setItem('apex_favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('apex_favorites_updated'));
  } catch (e) {}

  return index === -1; // returns true if now added, false if removed
};
