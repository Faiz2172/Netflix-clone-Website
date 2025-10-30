import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";

dotenv.config();

const uri = process.env.MONGO_URI;

// ✅ Expanded movie list
const data = [
  {
    title: "The Shawshank Redemption",
    genre: ["Drama"],
    year: 1994,
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
  },
  {
  title: "Inception",
  genre: ["Sci-Fi", "Action"],
  year: 2010,
  posterUrl: "https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg"
},
{
  title: "Pulp Fiction",
  genre: ["Crime", "Drama"],
  year: 1994,
  posterUrl: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg"
},
  {
    title: "Interstellar",
    genre: ["Sci-Fi", "Adventure"],
    year: 2014,
    posterUrl: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
  },
  {
    title: "The Dark Knight",
    genre: ["Action", "Crime"],
    year: 2008,
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    title: "Dune",
    genre: ["Sci-Fi", "Adventure"],
    year: 2021,
    posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
  },
  {
    title: "Fight Club",
    genre: ["Drama"],
    year: 1999,
    posterUrl: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg"
  },
  {
    title: "Forrest Gump",
    genre: ["Drama", "Romance"],
    year: 1994,
    posterUrl: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"
  },
  {
    title: "The Matrix",
    genre: ["Sci-Fi", "Action"],
    year: 1999,
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  },
  {
    title: "Gladiator",
    genre: ["Action", "Drama"],
    year: 2000,
    posterUrl: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"
  }
];

async function run() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    await Movie.deleteMany({});
    console.log("Old movies removed");

    await Movie.insertMany(data);
    console.log("✅ Movies seeded successfully!");
  } catch (e) {
    console.error("❌ Error seeding movies:", e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();