<script lang="ts">
  import { game } from '../stores/game';
  import { auth } from '../stores/auth';
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let gameState: any;
  let timer: number;
  let timeLeft = 60;
  let gameStartTime = 0;

  const unsubscribe = game.subscribe(value => {
    gameState = value;
  });

  let authState: any;
  const unsubscribeAuth = auth.subscribe(value => {
    authState = value;
  });

  onMount(() => {
    gameStartTime = Date.now();
    startTimer();
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeAuth();
    if (timer) clearInterval(timer);
  });

  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function selectMovie(index: number) {
    const currentQuestion = gameState.questions[gameState.currentQuestion];
    const isCorrect = index === currentQuestion.correctAnswer;
    
    game.answerQuestion(isCorrect);
    
    // Check if all questions are answered after this answer
    if (gameState.currentQuestion >= gameState.questions.length) {
      // Small delay to show the answer was registered, then end game
      setTimeout(() => {
        endGame();
      }, 500);
    }
  }

  function endGame() {
    if (timer) clearInterval(timer);
    const elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
    game.endGame(authState.user.id, elapsedTime);
    dispatch('game-ended');
  }

  $: progress = ((60 - timeLeft) / 60) * 100;
  $: currentQuestion = gameState?.questions?.[gameState.currentQuestion];
  $: allQuestionsAnswered = gameState && gameState.currentQuestion >= gameState.questions.length;
  
</script>

{#if gameState && currentQuestion}
  <div class="game-container">
    <div class="game-header">
      <div class="timer-section">
        <div class="timer-circle">
          <span class="timer-text">{timeLeft}s</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress}%"></div>
        </div>
      </div>
      
      <div class="score-section">
        <div class="score">
          <span class="score-label">Pontszám</span>
          <span class="score-value">{gameState.score}</span>
        </div>
        
        <div class="question-counter">
          {Math.min(gameState.currentQuestion + 1, gameState.questions.length)} / {gameState.questions.length}
        </div>
      </div>
    </div>

    <div class="question-section">
      {#if allQuestionsAnswered}
        <h2 class="question-text">🎉 Minden kérdést megválaszoltál! Várd meg a timer végét...</h2>
      {:else}
      <h2 class="question-text">{currentQuestion.question}</h2>
      {/if}
      
      <div class="movies-grid">
        {#each currentQuestion.movies as movie, index}
          <div 
            class="movie-card" 
            class:disabled={allQuestionsAnswered}
            on:click={() => !allQuestionsAnswered && selectMovie(index)} 
            on:keydown={(e) => e.key === 'Enter' && !allQuestionsAnswered && selectMovie(index)} 
            tabindex={allQuestionsAnswered ? -1 : 0} 
            role="button"
          >
            <div class="movie-poster">
              {#if movie.poster_path}
                <img src="https://image.tmdb.org/t/p/w200{movie.poster_path}" alt="{movie.title} poster" />
              {:else}
                🎬
              {/if}
            </div>
            <h3 class="movie-title">{movie.title}</h3>
            <div class="movie-year">
              {movie.year}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .game-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #ff8e53 100%);
    padding: 2rem;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .timer-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .timer-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.5);
  }

  .timer-text {
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .progress-bar {
    width: 200px;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #FFC107, #F44336);
    transition: width 1s linear;
    border-radius: 4px;
  }

  .score-section {
    display: flex;
    align-items: center;
    gap: 2rem;
    color: white;
  }

  .score {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .score-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .score-value {
    font-size: 2rem;
    font-weight: bold;
  }

  .question-counter {
    font-size: 1.2rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 20px;
  }

  .question-section {
    text-align: center;
  }

  .question-text {
    color: white;
    font-size: 2rem;
    margin-bottom: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .movie-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 2px solid transparent;
  }

  .movie-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    border-color: #3498db;
  }

  .movie-card.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  .movie-poster {
    font-size: 3rem;
    margin-bottom: 1rem;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .movie-poster img {
    max-width: 80px;
    max-height: 120px;
    border-radius: 8px;
    object-fit: cover;
  }

  .movie-title {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 600;
    min-height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .movie-year {
    color: #7f8c8d;
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
  }

  @media (max-width: 768px) {
    .game-header {
      flex-direction: column;
      gap: 1rem;
    }
    
    .question-text {
      font-size: 1.5rem;
    }
    
    .movies-grid {
      grid-template-columns: 1fr;
    }
  }
</style>