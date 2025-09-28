import { writable } from 'svelte/store';
import { tmdbService, type Movie } from '../services/tmdb';

export interface GameResult {
  id: string;
  userId: string;
  theme: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  date: string;
}

export interface GameState {
  currentQuestion: number;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  selectedTheme: string;
  questions: any[];
  results: GameResult[];
}

function createGameStore() {
  const { subscribe, set, update } = writable<GameState>({
    currentQuestion: 0,
    score: 0,
    timeLeft: 30,
    isPlaying: false,
    selectedTheme: '',
    questions: [],
    results: []
  });

  return {
    subscribe,
    startGame: async (theme: string) => {
      const questions = await generateQuestions(theme);
      update(state => ({
        ...state,
        selectedTheme: theme,
        questions,
        currentQuestion: 0,
        score: 0,
        timeLeft: 60,
        isPlaying: true
      }));
    },
    answerQuestion: (isCorrect: boolean) => {
      update(state => ({
        ...state,
        score: isCorrect ? state.score + 10 : state.score,
        currentQuestion: state.currentQuestion + 1
      }));
    },
    endGame: (userId: string, elapsedTime: number) => {
      update(state => {
        const result: GameResult = {
          id: Date.now().toString(),
          userId,
          theme: state.selectedTheme,
          score: state.score,
          totalQuestions: state.questions.length,
          timeSpent: elapsedTime,
          date: new Date().toISOString()
        };

        const savedResults = JSON.parse(localStorage.getItem('gameResults') || '[]');
        savedResults.push(result);
        localStorage.setItem('gameResults', JSON.stringify(savedResults));

        return {
          ...state,
          isPlaying: false,
          results: savedResults
        };
      });
    },
    loadResults: (userId: string) => {
      const savedResults = JSON.parse(localStorage.getItem('gameResults') || '[]');
      const userResults = savedResults.filter((r: GameResult) => r.userId === userId);
      update(state => ({ ...state, results: userResults }));
    }
  };
}

async function generateQuestions(theme: string) {
  const questions = [];
  const totalQuestionsNeeded = 5;
  
  try {
    // Get movies from TMDB API
    const allMovies = await tmdbService.getMoviesForTheme(theme, 30);
    
    if (allMovies.length < 8) {
      console.warn('Not enough movies available from TMDB API');
      return [];
    }
    
    const usedMovies = new Set();
    
    for (let i = 0; i < totalQuestionsNeeded; i++) {
      // Get available movies (not yet used)
      const availableMovies = allMovies.filter(movie => !usedMovies.has(movie.id));
      
      if (availableMovies.length < 4) {
        console.warn(`Not enough unique movies available for question ${i + 1}`);
        break;
      }
      
      // Select 4 random movies from available ones
      const shuffledMovies = [...availableMovies].sort(() => 0.5 - Math.random()).slice(0, 4);
      
      // Mark these movies as used
      shuffledMovies.forEach(movie => usedMovies.add(movie.id));
      
      // Randomize which movie is the odd one out (0-3)
      const oddOneOut = Math.floor(Math.random() * 4);
      let questionText = '';
      const correctAnswer = oddOneOut;
      
      switch (theme) {
        case 'genre':
          // Make the odd one out have different genre, others share common genre
          const commonGenre = shuffledMovies[1].genre[0];
          for (let j = 0; j < 4; j++) {
            if (j !== oddOneOut) {
              shuffledMovies[j] = { ...shuffledMovies[j], genre: [commonGenre] };
            }
          }
          questionText = 'Melyik film NEM tartozik ugyanabba a műfajba?';
          break;
        case 'director':
          // Make three movies have same director, odd one out different
          const commonDirector = shuffledMovies[1].director;
          for (let j = 0; j < 4; j++) {
            if (j !== oddOneOut) {
              shuffledMovies[j] = { ...shuffledMovies[j], director: commonDirector };
            }
          }
          questionText = 'Melyik filmet NEM ugyanaz a rendező készítette?';
          break;
        case 'rating':
          // Make three movies have similar ratings, odd one out very different
          const baseRating = 8.5;
          for (let j = 0; j < 4; j++) {
            if (j !== oddOneOut) {
              shuffledMovies[j] = { ...shuffledMovies[j], rating: baseRating + (Math.random() * 0.4 - 0.2) };
            } else {
              shuffledMovies[j] = { ...shuffledMovies[j], rating: 6.0 + Math.random() * 1.0 };
            }
          }
          questionText = 'Melyik film értékelése tér el jelentősen a többitől?';
          break;
        case 'language':
          // Make three movies English, odd one out different language
          for (let j = 0; j < 4; j++) {
            if (j !== oddOneOut) {
              shuffledMovies[j] = { ...shuffledMovies[j], language: 'English' };
            } else {
              shuffledMovies[j] = { ...shuffledMovies[j], language: 'Korean' };
            }
          }
          questionText = 'Melyik film NEM angol nyelvű?';
          break;
        case 'actors':
          // Make three movies have a common actor, odd one out different
          // Find an actor from one of the movies to use as the common actor
          let commonActor = 'Unknown Actor';
          for (const movie of shuffledMovies) {
            if (movie.actors && movie.actors.length > 0) {
              commonActor = movie.actors[0];
              break;
            }
          }
          
          for (let j = 0; j < 4; j++) {
            if (j !== oddOneOut) {
              shuffledMovies[j] = { ...shuffledMovies[j], actors: [commonActor, shuffledMovies[j].actors[1] || 'Co-star'] };
            }
          }
          questionText = `Melyik filmben NEM játszik ${commonActor}?`;
          break;
        case 'awards':
          // Make three movies have awards, odd one out none
          for (let j = 0; j < 4; j++) {
            if (j !== oddOneOut) {
              shuffledMovies[j] = { ...shuffledMovies[j], awards: ['Academy Award Winner'] };
            } else {
              shuffledMovies[j] = { ...shuffledMovies[j], awards: [] };
            }
          }
          questionText = 'Melyik film NEM nyert Oscar-díjat?';
          break;
        default:
          questionText = 'Melyik film a kakukktojás?';
      }
      
      questions.push({
        id: i,
        question: questionText,
        movies: shuffledMovies,
        correctAnswer: correctAnswer,
        theme
      });
    }
  } catch (error) {
    console.error('Error generating questions:', error);
  }
  
  return questions;
}

function getGenreDisplayName(genre: string): string {
  const genreNames: { [key: string]: string } = {
    action: 'akció',
    comedy: 'vígjáték',
    drama: 'dráma',
    horror: 'horror',
    romance: 'romantikus',
    'sci-fi': 'sci-fi',
    thriller: 'thriller',
    fantasy: 'fantasy',
    crime: 'krimi',
    adventure: 'kaland',
    animation: 'animáció',
    documentary: 'dokumentum'
  };
  return genreNames[genre] || genre;
}

export const game = createGameStore();