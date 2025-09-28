<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function startGame() {
    dispatch('start-game');
  }

  function showLeaderboard() {
    dispatch('show-leaderboard');
  }
</script>

<div class="homepage">
  <div class="hero-section">
    <h1>🎬 Movie Kakukktojás</h1>
    <p class="subtitle">Találd meg a kakukktojást a filmek között!</p>
    <p class="description">
      Válassz egy zsánert, és találd meg azt a filmet, ami nem tartozik a kiválasztott kategóriába.
      Teszteld a filmes tudásod és szerezz pontokat!
    </p>
  </div>

  <div class="main-buttons">
    <button class="main-btn start-btn" on:click={startGame}>
      <div class="btn-icon">🎮</div>
      <div class="btn-content">
        <h3>Játék kezdése</h3>
        <p>Új játék indítása</p>
      </div>
    </button>

    <button class="main-btn leaderboard-btn" on:click={showLeaderboard}>
      <div class="btn-icon">🏆</div>
      <div class="btn-content">
        <h3>Pontszámtábla</h3>
        <p>Legjobb eredmények</p>
      </div>
    </button>
  </div>

  <div class="features">
    <div class="feature">
      <div class="feature-icon">🎯</div>
      <h4>Precíz játékmenet</h4>
      <p>Találd meg a kakukktojást a filmek között</p>
    </div>
    <div class="feature">
      <div class="feature-icon">⚡</div>
      <h4>Gyors körök</h4>
      <p>30 másodperces időlimit minden kérdésre</p>
    </div>
    <div class="feature">
      <div class="feature-icon">📊</div>
      <h4>Statisztikák</h4>
      <p>Kövesd nyomon a fejlődésed</p>
    </div>
  </div>
</div>

<style>
  .homepage {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .hero-section {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
    max-width: 800px;
  }

  .hero-section h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  .description {
    font-size: 1.1rem;
    opacity: 0.8;
    line-height: 1.6;
  }

  .main-buttons {
    display: flex;
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .main-btn {
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 20px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 2px solid transparent;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    min-width: 280px;
  }

  .main-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: #3498db;
  }

  .start-btn:hover {
    border-color: #2ecc71;
  }

  .leaderboard-btn:hover {
    border-color: #f39c12;
  }

  .btn-icon {
    font-size: 3rem;
  }

  .btn-content {
    text-align: left;
  }

  .btn-content h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .btn-content p {
    color: #7f8c8d;
    margin: 0;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 900px;
    width: 100%;
  }

  .feature {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    color: white;
    backdrop-filter: blur(10px);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .feature h4 {
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  .feature p {
    opacity: 0.8;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .hero-section h1 {
      font-size: 2.5rem;
    }
    
    .main-buttons {
      flex-direction: column;
      width: 100%;
      max-width: 400px;
    }
    
    .features {
      grid-template-columns: 1fr;
    }
  }
</style>