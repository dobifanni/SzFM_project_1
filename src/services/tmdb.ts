export interface TMDBMovie {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  original_language: string;
  overview: string;
  poster_path: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string[];
  director: string;
  rating: number;
  year: number;
  language: string;
  actors: string[];
  awards: string[];
  poster_path?: string;
}

class TMDBService {
  private readonly API_KEY = '07700d4f704bfaaa02b47a78b25a6896';
  private readonly READ_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNzcwMGQ0ZjcwNGJmYWFhMDJiNDdhNzhiMjVhNjg5NiIsIm5iZiI6MTc1ODg4OTY2Mi43MzMsInN1YiI6IjY4ZDY4NmJlYjU0ODYxNjEzY2M4MzY1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.n_uN_EHJbCzGRqT9y9Gqse9RQi0fvjenAK4VCKi5614';
  private readonly BASE_URL = 'https://api.themoviedb.org/3';

  private genreMap: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure', 
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };

  private headers = {
    'Authorization': `Bearer ${this.READ_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBMovie[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc&vote_count.gte=100`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/movie/popular?page=${page}&vote_count.gte=100`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  }

  async getMovieDetails(movieId: number): Promise<any> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/movie/${movieId}?append_to_response=credits`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }

  async searchMovies(query: string): Promise<TMDBMovie[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&vote_count.gte=50`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  convertTMDBToMovie(tmdbMovie: TMDBMovie, details?: any): Movie {
    const genres = tmdbMovie.genre_ids.map(id => this.genreMap[id]).filter(Boolean);
    const year = tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 0;
    
    let director = 'Unknown Director';
    let actors: string[] = [];
    
    if (details?.credits) {
      const directorCredit = details.credits.crew.find((person: any) => person.job === 'Director');
      if (directorCredit) {
        director = directorCredit.name;
      }
      
      actors = details.credits.cast
        .slice(0, 3)
        .map((actor: any) => actor.name);
    }

    return {
      id: tmdbMovie.id.toString(),
      title: tmdbMovie.title,
      genre: genres,
      director,
      rating: Math.round(tmdbMovie.vote_average * 10) / 10,
      year,
      language: tmdbMovie.original_language === 'en' ? 'English' : 
                tmdbMovie.original_language === 'ko' ? 'Korean' :
                tmdbMovie.original_language === 'ja' ? 'Japanese' :
                tmdbMovie.original_language === 'fr' ? 'French' :
                tmdbMovie.original_language === 'es' ? 'Spanish' :
                tmdbMovie.original_language === 'de' ? 'German' :
                tmdbMovie.original_language === 'it' ? 'Italian' :
                'Other',
      actors,
      awards: tmdbMovie.vote_average >= 8.0 ? ['High Rated'] : [],
      poster_path: tmdbMovie.poster_path
    };
  }

  getGenreId(genreName: string): number {
    const genreMapping: { [key: string]: number } = {
      'action': 28,
      'adventure': 12,
      'animation': 16,
      'comedy': 35,
      'crime': 80,
      'documentary': 99,
      'drama': 18,
      'family': 10751,
      'fantasy': 14,
      'history': 36,
      'horror': 27,
      'music': 10402,
      'mystery': 9648,
      'romance': 10749,
      'sci-fi': 878,
      'thriller': 53,
      'war': 10752,
      'western': 37
    };
    
    return genreMapping[genreName.toLowerCase()] || 18; // Default to drama
  }

  async getMoviesForTheme(theme: string, count: number = 20): Promise<Movie[]> {
    let movies: Movie[] = [];
    
    try {
      switch (theme) {
        case 'genre':
          movies = await this.getClassicMoviesByGenres();
          break;
          
        case 'director':
          movies = await this.getMoviesByFamousDirectors();
          break;
          
        case 'actors':
          movies = await this.getMoviesByFamousActors();
          break;
          
        case 'rating':
          movies = await this.getHighlyRatedClassicMovies();
          break;
          
        case 'language':
          movies = await this.getClassicMoviesByLanguages();
          break;
          
        case 'awards':
          movies = await this.getAwardWinningClassicMovies();
          break;
          
        default:
          movies = await this.getClassicMoviesByGenres();
      }
    } catch (error) {
      console.error('Error fetching movies for theme:', error);
    }
    
    return movies;
  }

  private async getClassicMoviesByGenres(): Promise<Movie[]> {
    const movies: Movie[] = [];
    const genres = [28, 35, 18, 27, 878, 53, 14, 80]; // Action, Comedy, Drama, Horror, Sci-Fi, Thriller, Fantasy, Crime
    
    for (const genreId of genres) {
      try {
        // Get classic movies (1970-2010) with high vote counts
        const response = await fetch(
          `${this.BASE_URL}/discover/movie?with_genres=${genreId}&primary_release_date.gte=1970-01-01&primary_release_date.lte=2010-12-31&sort_by=vote_count.desc&vote_count.gte=1000&page=1`,
          { headers: this.headers }
        );
        
        if (response.ok) {
          const data = await response.json();
          const tmdbMovies = data.results.slice(0, 4);
          
          for (const tmdbMovie of tmdbMovies) {
            const details = await this.getMovieDetails(tmdbMovie.id);
            movies.push(this.convertTMDBToMovie(tmdbMovie, details));
          }
        }
      } catch (error) {
        console.error(`Error fetching classic movies for genre ${genreId}:`, error);
      }
    }
    
    return movies;
  }

  private async getMoviesByFamousDirectors(): Promise<Movie[]> {
    const movies: Movie[] = [];
    const famousDirectors = [
      { name: 'Steven Spielberg', id: 488 },
      { name: 'Martin Scorsese', id: 1032 },
      { name: 'Quentin Tarantino', id: 138 },
      { name: 'Christopher Nolan', id: 525 },
      { name: 'Stanley Kubrick', id: 240 },
      { name: 'Alfred Hitchcock', id: 2636 },
      { name: 'Francis Ford Coppola', id: 1776 },
      { name: 'Ridley Scott', id: 578 }
    ];
    
    for (const director of famousDirectors) {
      try {
        const response = await fetch(
          `${this.BASE_URL}/discover/movie?with_crew=${director.id}&sort_by=vote_count.desc&vote_count.gte=500&page=1`,
          { headers: this.headers }
        );
        
        if (response.ok) {
          const data = await response.json();
          const tmdbMovies = data.results.slice(0, 3);
          
          for (const tmdbMovie of tmdbMovies) {
            const details = await this.getMovieDetails(tmdbMovie.id);
            movies.push(this.convertTMDBToMovie(tmdbMovie, details));
          }
        }
      } catch (error) {
        console.error(`Error fetching movies for director ${director.name}:`, error);
      }
    }
    
    return movies;
  }

  private async getMoviesByFamousActors(): Promise<Movie[]> {
    const movies: Movie[] = [];
    const famousActors = [
      { name: 'Tom Hanks', id: 31 },
      { name: 'Robert De Niro', id: 380 },
      { name: 'Al Pacino', id: 1158 },
      { name: 'Leonardo DiCaprio', id: 6193 },
      { name: 'Morgan Freeman', id: 192 },
      { name: 'Jack Nicholson', id: 514 },
      { name: 'Denzel Washington', id: 5292 },
      { name: 'Anthony Hopkins', id: 4173 },
      { name: 'Meryl Streep', id: 5064 },
      { name: 'Harrison Ford', id: 3 }
    ];
    
    for (const actor of famousActors) {
      try {
        const response = await fetch(
          `${this.BASE_URL}/discover/movie?with_cast=${actor.id}&sort_by=vote_count.desc&vote_count.gte=800&primary_release_date.lte=2015-12-31&page=1`,
          { headers: this.headers }
        );
        
        if (response.ok) {
          const data = await response.json();
          const tmdbMovies = data.results.slice(0, 3);
          
          for (const tmdbMovie of tmdbMovies) {
            const details = await this.getMovieDetails(tmdbMovie.id);
            movies.push(this.convertTMDBToMovie(tmdbMovie, details));
          }
        }
      } catch (error) {
        console.error(`Error fetching movies for actor ${actor.name}:`, error);
      }
    }
    
    return movies;
  }

  private async getHighlyRatedClassicMovies(): Promise<Movie[]> {
    const movies: Movie[] = [];
    
    try {
      // Get highly rated classic movies
      const response = await fetch(
        `${this.BASE_URL}/discover/movie?primary_release_date.gte=1960-01-01&primary_release_date.lte=2010-12-31&vote_average.gte=7.5&vote_count.gte=1000&sort_by=vote_average.desc&page=1`,
        { headers: this.headers }
      );
      
      if (response.ok) {
        const data = await response.json();
        const tmdbMovies = data.results.slice(0, 20);
        
        for (const tmdbMovie of tmdbMovies) {
          const details = await this.getMovieDetails(tmdbMovie.id);
          movies.push(this.convertTMDBToMovie(tmdbMovie, details));
        }
      }
    } catch (error) {
      console.error('Error fetching highly rated classic movies:', error);
    }
    
    return movies;
  }

  private async getClassicMoviesByLanguages(): Promise<Movie[]> {
    const movies: Movie[] = [];
    const languages = ['en', 'fr', 'it', 'de', 'es', 'ja', 'ko'];
    
    for (const lang of languages) {
      try {
        const response = await fetch(
          `${this.BASE_URL}/discover/movie?with_original_language=${lang}&primary_release_date.gte=1960-01-01&primary_release_date.lte=2010-12-31&vote_count.gte=500&sort_by=vote_count.desc&page=1`,
          { headers: this.headers }
        );
        
        if (response.ok) {
          const data = await response.json();
          const tmdbMovies = data.results.slice(0, 3);
          
          for (const tmdbMovie of tmdbMovies) {
            const details = await this.getMovieDetails(tmdbMovie.id);
            movies.push(this.convertTMDBToMovie(tmdbMovie, details));
          }
        }
      } catch (error) {
        console.error(`Error fetching classic movies for language ${lang}:`, error);
      }
    }
    
    return movies;
  }

  private async getAwardWinningClassicMovies(): Promise<Movie[]> {
    const movies: Movie[] = [];
    
    try {
      // Get Oscar-winning movies (using high ratings and vote counts as proxy)
      const response = await fetch(
        `${this.BASE_URL}/discover/movie?primary_release_date.gte=1970-01-01&primary_release_date.lte=2015-12-31&vote_average.gte=8.0&vote_count.gte=2000&sort_by=vote_average.desc&page=1`,
        { headers: this.headers }
      );
      
      if (response.ok) {
        const data = await response.json();
        const tmdbMovies = data.results.slice(0, 20);
        
        for (const tmdbMovie of tmdbMovies) {
          const details = await this.getMovieDetails(tmdbMovie.id);
          movies.push(this.convertTMDBToMovie(tmdbMovie, details));
        }
      }
    } catch (error) {
      console.error('Error fetching award-winning classic movies:', error);
    }
    
    return movies;
  }
}

export const tmdbService = new TMDBService();