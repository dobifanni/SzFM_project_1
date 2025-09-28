<script lang="ts">
  import { game, type GameResult } from '../stores/game';
  import { auth } from '../stores/auth';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let gameState: any;
  let authState: any;
  let shareEmail = '';
  let shareMessage = '';
  let showEmailForm = false;

  const unsubscribe = game.subscribe(value => {
    gameState = value;
  });

  const unsubscribeAuth = auth.subscribe(value => {
    authState = value;
  });

  onMount(() => {
    if (authState?.user) {
      game.loadResults(authState.user.id);
    }
  });

  function playAgain() {
    // Start a new game with the same theme
    if (lastResult?.theme) {
      game.startGame(lastResult.theme);
      dispatch('play-again');
    }
  }

  function goToMainMenu() {
    dispatch('main-menu');
  }

  function shareResults() {
    showEmailForm = true;
  }

  function sendEmail() {
    if (!shareEmail) return;
    
    // Simulate sending email
    const lastResult = gameState.results[gameState.results.length - 1];
    const message = `Helló! Játszottam a Movie Kakukktojás játékkal és ${lastResult.score} pontot értem el ${lastResult.totalQuestions} kérdésből ${lastResult.theme} témában! Próbáld ki te is!`;
    
    shareMessage = `Email elküldve ${shareEmail} címre: "${message}"`;
    showEmailForm = false;
    
    // Clear after 5 seconds
    setTimeout(() => {
      shareMessage = '';
    }, 5000);
  }

  $: lastResult = gameState?.results?.[gameState.results.length - 1];
  $: allResults = gameState?.results || [];
  $: averageScore = allResults.length > 0 ? allResults.reduce((sum: number, r: GameResult) => sum + r.score, 0) / allResults.length : 0;
  $: bestScore = allResults.length > 0 ? Math.max(...allResults.map((r: GameResult) => r.score)) : 0;

  function getThemeName(theme) {
    const themes = {
      genre: 'Műfaj',
      director: 'Rendező', 
      rating: 'Értékelés',
      language: 'Nyelv',
      actors: 'Színészek',
      awards: 'Díjak'
    };
    return themes[theme] || theme;
  }
</script>

<div class="results-container">
  <div class="results-header">
    <h1>🎉 Játék Eredmény</h1>
  </div>

  {#if lastResult}
    <div class="current-result">
      <div class="result-card main-result">
        <h2>Aktuális Eredmény</h2>
        <div class="score-display">
          <span class="score-number">{lastResult.score}</span>
          <span class="score-total">/ {lastResult.totalQuestions * 10}</span>
        </div>
        <div class="result-details">
          <p><strong>Téma:</strong> {getThemeName(lastResult.theme)}</p>
          <p><strong>Helyes válaszok:</strong> {lastResult.score / 10}/{lastResult.totalQuestions}</p>
          <p><strong>Eltelt idő:</strong> {lastResult.timeSpent} másodperc</p>
          <p><strong>Pontosság:</strong> {Math.round((lastResult.score / 10 / lastResult.totalQuestions) * 100)}%</p>
        </div>
        
        <div class="action-buttons">
          <button on:click={playAgain} class="play-again-btn">
            🔄 Újra Játék
          </button>
          <button on:click={goToMainMenu} class="main-menu-btn">
            🏠 Főmenü
          </button>
          <button on:click={shareResults} class="share-btn">
            📧 Megosztás
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div class="statistics">
    <div class="stat-card">
      <h3>Összesített Statisztikák</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Játékok száma</span>
          <span class="stat-value">{allResults.length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Legjobb eredmény</span>
          <span class="stat-value">{bestScore}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Átlag pontszám</span>
          <span class="stat-value">{Math.round(averageScore)}</span>
        </div>
      </div>
    </div>
  </div>

  {#if allResults.length > 0}
    <div class="history">
      <h3>Korábbi Eredmények</h3>
      <div class="results-list">
        {#each allResults.slice(-5).reverse() as result}
          <div class="history-item">
            <div class="history-info">
              <strong>{getThemeName(result.theme)}</strong>
              <span class="history-date">{new Date(result.date).toLocaleDateString()}</span>
            </div>
            <div class="history-score">{result.score} pont</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if showEmailForm}
    <div class="modal-overlay" on:click={() => showEmailForm = false}>
      <div class="email-form" on:click|stopPropagation>
        <h3>Eredmény Megosztása</h3>
        <input 
          type="email" 
          placeholder="Barát email címe..." 
          bind:value={shareEmail}
          class="email-input"
        />
        <div class="email-buttons">
          <button on:click={sendEmail} class="send-btn">Küldés</button>
          <button on:click={() => showEmailForm = false} class="cancel-btn">Mégse</button>
        </div>
      </div>
    </div>
  {/if}

  {#if shareMessage}
    <div class="share-message">
      {shareMessage}
    </div>
  {/if}
</div>

<style>
  .results-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    padding: 2rem;
  }

  .results-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .results-header h1 {
    color: white;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .current-result {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
  }

  .result-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    text-align: center;
    max-width: 500px;
  }

  .main-result h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }

  .score-display {
    font-size: 4rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #3498db;
  }

  .score-total {
    font-size: 2rem;
    color: #7f8c8d;
  }

  .result-details {
    margin-bottom: 2rem;
    text-align: left;
  }

  .result-details p {
    margin: 0.5rem 0;
    color: #555;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .play-again-btn, .share-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .play-again-btn {
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    color: white;
  }

  .main-menu-btn {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .share-btn {
    background: linear-gradient(135deg, #f39c12, #e67e22);
    color: white;
  }

  .play-again-btn:hover, .main-menu-btn:hover, .share-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .statistics {
    margin-bottom: 2rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    max-width: 600px;
    margin: 0 auto;
  }

  .stat-card h3 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 1.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: rgba(52, 152, 219, 0.1);
    border-radius: 12px;
  }

  .stat-label {
    display: block;
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
  }

  .history {
    max-width: 600px;
    margin: 0 auto;
  }

  .history h3 {
    color: white;
    text-align: center;
    margin-bottom: 1rem;
  }

  .results-list {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 1rem;
    backdrop-filter: blur(10px);
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .history-item:last-child {
    border-bottom: none;
  }

  .history-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .history-date {
    font-size: 0.8rem;
    color: #7f8c8d;
  }

  .history-score {
    font-weight: bold;
    color: #3498db;
    font-size: 1.1rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .email-form {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
  }

  .email-form h3 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  .email-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .email-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .send-btn, .cancel-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }

  .send-btn {
    background: #3498db;
    color: white;
  }

  .cancel-btn {
    background: #e0e0e0;
    color: #2c3e50;
  }

  .share-message {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: #2ecc71;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .action-buttons {
      flex-direction: column;
    }
  }
</style>