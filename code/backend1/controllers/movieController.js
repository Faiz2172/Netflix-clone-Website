import Movie from "../models/Movie.js";

export const getMovies = async (req, res, next) => {
  try {
    // Query parameters: ?q=searchTerm&genre=GenreName
    const { q = "", genre } = req.query;
    const filters = {};
    if (genre) {
      // case-insensitive exact match for genre
      filters.genre = new RegExp(`^${genre}$`, "i");
    }

    if (q) {
      // text search if we have text index; fallback to regex search on title
      const movies = await Movie.find({ ...filters, $text: { $search: q } }).sort({ createdAt: -1 });
      // If text search returned results, return them; otherwise fallback to regex
      if (movies.length) return res.json(movies);
      // fallback:
      filters.title = new RegExp(q, "i");
      const fallback = await Movie.find(filters).sort({ createdAt: -1 });
      return res.json(fallback);
    } else {
      const movies = await Movie.find(filters).sort({ createdAt: -1 });
      return res.json(movies);
    }
  } catch (err) {
    next(err);
  }
};