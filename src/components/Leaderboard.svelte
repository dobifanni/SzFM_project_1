<script lang="ts">
  import { game, type GameResult } from '../stores/game';
  import { auth } from '../stores/auth';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let gameState: any;
  let authState: any;
  let allResults: GameResult[] = [];

  const unsubscribe = game.subscribe(value => {
    gameState = value;
  });

  const unsubscribeAuth = auth.subscribe(value => {
    authState = value;
  });

  onMount(() => {
    loadAllResults();
  });

  function loadAllResults() {
    const savedResults = JSON.parse(localStorage.getItem('gameResults') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Add username to results
    allResults = savedResults.map((result: GameResult) => {
      const user = users.find((u: any) => u.id === result.userId);
      return {
        ...result,
        username: user ? user.username : 'Ismeretlen'
      };
    }).sort((a: any, b: any) => b.score - a.score);
  }

  function goBack() {
    dispatch('go-back');
  }

  function getGenreName(genre: string) {
    const genres: { [key: string]: string } = {
      action: 'Akció',
      comedy: 'Vígjáték',
      drama: 'Dráma',
      horror: 'Horror',
      romance: 'Romantikus',
      'sci-fi': 'Sci-Fi',
      thriller: 'Thriller',
      fantasy: 'Fantasy',
      crime: 'Krimi',
      adventure: 'Kaland',
      animation: 'Animáció',
      documentary: 'Dokumentum'
    };
    return genres[genre] || genre;
  }

  function getRankIcon(index: number) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  }

  $: topResults = allResults.slice(0, 20);
  $: userResults = allResults.filter((r: any) => r.userId === authState?.user?.id);
  $: userBestScore = userResults.length > 0 ? Math.max(...userResults.map((r: any) => r.score)) : 0;
  $: userRank = allResults.findIndex((r: any) => r.userId === authState?.user?.id) + 1;
</script>

<div class="leaderboard">
  <div class="header">
    <button class="back-btn" on:click={goBack}>
      ← Vissza
    </button>
    <div class="title-section">
      <h1>🏆 Pontszámtábla</h1>
      <p>A legjobb eredmények</p>
    </div>
  </div>

  {#if authState?.user}
    <div class="user-stats">
      <div class="stat-card">
        <h3>📊 Saját Statisztikáid</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{userResults.length}</span>
            <span class="stat-label">Játékok</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{userBestScore}</span>
            <span class="stat-label">Legjobb</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{userRank > 0 ? userRank : '-'}</span>
            <span class="stat-label">Helyezés</span>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class="leaderboard-content">
    <div class="leaderboard-card">
      <h2>🎯 Top 20 Eredmény</h2>
      
      {#if topResults.length === 0}
        <div class="empty-state">
          <p>Még nincsenek eredmények.</p>
          <p>Legyél te az első!</p>
        </div>
      {:else}
        <div class="results-list">
          {#each topResults as result, index}
            <div class="result-item" class:current-user={result.userId === authState?.user?.id}>
              <div class="rank">
                {getRankIcon(index)}
              </div>
              <div class="player-info">
                <div class="username">{result.username}</div>
                <div class="game-info">
                  {getGenreName(result.theme)} • {new Date(result.date).toLocaleDateString()}
                </div>
              </div>
              <div class="score-info">
                <div class="score">{result.score}</div>
                <div class="accuracy">{Math.round((result.score / 10 / result.totalQuestions) * 100)}%</div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .leaderboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    padding: 2rem;
  }

  .header {
    margin-bottom: 2rem;
  }

  .back-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
  }

  .back-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
  }

  .title-section {
    text-align: center;
    color: white;
  }

  .title-section h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .title-section p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .user-stats {
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 1.5rem;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    max-width: 500px;
    width: 100%;
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
    background: rgba(79, 172, 254, 0.1);
    border-radius: 12px;
  }

  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #7f8c8d;
  }

  .leaderboard-content {
    display: flex;
    justify-content: center;
  }

  .leaderboard-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    width: 100%;
    max-width: 800px;
  }

  .leaderboard-card h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
    font-size: 1.8rem;
  }

  .empty-state {
    text-align: center;
    color: #7f8c8d;
    padding: 3rem;
  }

  .empty-state p {
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }

  .results-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .result-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .result-item:hover {
    background: rgba(52, 152, 219, 0.1);
    transform: translateX(5px);
  }

  .result-item.current-user {
    background: rgba(46, 204, 113, 0.1);
    border: 2px solid rgba(46, 204, 113, 0.3);
  }

  .rank {
    font-size: 1.5rem;
    font-weight: bold;
    width: 60px;
    text-align: center;
  }

  .player-info {
    flex: 1;
    margin-left: 1rem;
  }

  .username {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .game-info {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-top: 0.25rem;
  }

  .score-info {
    text-align: right;
  }

  .score {
    font-size: 1.5rem;
    font-weight: bold;
    color: #3498db;
  }

  .accuracy {
    font-size: 0.9rem;
    color: #7f8c8d;
  }

  @media (max-width: 768px) {
    .title-section h1 {
      font-size: 2rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .result-item {
      padding: 0.75rem;
    }
    
    .rank {
      width: 40px;
      font-size: 1.2rem;
    }
    
    .username {
      font-size: 1rem;
    }
  }
</style>