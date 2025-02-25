import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(`${process.env.SUPABASE_URL}`, `${process.env.SUPABASE_API_KEY}`);

// Get all of user's history
export async function getLatestReadingHistory(userID) {
  const { data, error } = await supabase.rpc('get_latest_reading_history', { user_id_input: userID });

  if (error) {
    console.error("Error getting user's reading history: ", error);
  } else {
    return data
  }
}

// Get the latest history of current Manga from current user, no duplicates
export async function getMangaLatestHistory(userID, mangaID) {
  /*
  const { data, error } = await supabase
    .from('reading_history')
    .select('*')
    .match({ user_id: userID, manga_id: mangaID })
    .order('read_at', { ascending: false })
    .limit(1);
  */
  const { data, error } = await supabase.rpc('get_current_manga_history', { user_id_input: userID, manga_id_input: mangaID}) 

    if (error) {
      console.error(`Error getting ${mangaID} reading history: `, error);
    } else {
      return data;
    }
}

// Add new row to user's reading history
export async function updateUserReadingHistory(userID, mangaID, chapterID, chapter, page) {
  const { data, error } = await supabase.from('reading_history').insert({ user_id: userID, manga_id: mangaID, chapter_id: chapterID, chapter: chapter, page: page });

  if (error) {
    console.error("Error inserting user's reading history: ", error);
  }
}

// Get all of user's favorited Manga
export async function getUserFavoriteMangas(userID) {
  const { data, error } = await supabase.rpc('get_user_favorites', { user_id_input: userID });

  if (error) {
    console.error("Error getting user's favorited mangas: ", error);
  } else {
    return data
  }
}

// Check if a user has already favorited this manga
export async function checkIfUserFavorited(userID, mangaID) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .match({user_id: userID, manga_id: mangaID})
  
  if (error) {
    console.error(`Error checking if user favorited Manga with the id of ${mangaID}`, error);
    return false;
  }

  return data && data.length > 0;

}

// Add new row to the list of user's favorite manga
export async function addMangaToFavorite(userID, mangaID, mangaName) {
  const { data, error } = await supabase.from('favorites').insert({ user_id: userID, manga_id: mangaID, manga_name: mangaName });

  if (error) {
    console.error("Error getting user's favorited mangas: ", error);
  }
}

// Delete a row based on MangaID
export async function removeFavorited(userID, mangaID) {
  const { data, error } = await supabase.from('favorites').delete().match({ user_id: userID, manga_id: mangaID });

  if (error) {
    console.error(`Error deleting manga with the id of ${mangaID}`, error);
  }
}


