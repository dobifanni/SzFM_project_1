<script lang="ts">
  import { game } from '../stores/game';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const genres = [
    { id: 'action', name: 'Akció', icon: '💥', description: 'Izgalmas akció filmek' },
    { id: 'comedy', name: 'Vígjáték', icon: '😂', description: 'Szórakoztató vígjátékok' },
    { id: 'drama', name: 'Dráma', icon: '🎭', description: 'Mélyen ható drámák' },
    { id: 'horror', name: 'Horror', icon: '👻', description: 'Ijesztő horror filmek' },
    { id: 'romance', name: 'Romantikus', icon: '💕', description: 'Szívmelengető szerelmes filmek' },
    { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀', description: 'Tudományos fantasztikus filmek' },
    { id: 'thriller', name: 'Thriller', icon: '🔪', description: 'Feszültségekkel teli thrillerek' },
    { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️', description: 'Varázslatos fantasy világok' },
    { id: 'crime', name: 'Krimi', icon: '🕵️', description: 'Bűnügyi történetek' },
    { id: 'adventure', name: 'Kaland', icon: '🗺️', description: 'Izgalmas kalandfilmek' },
    { id: 'animation', name: 'Animáció', icon: '🎨', description: 'Animációs filmek' },
    { id: 'documentary', name: 'Dokumentum', icon: '📹', description: 'Valós történetek' }
  ];

  function selectGenre(genreId: string) {
    game.startGame(genreId);
    dispatch('genre-selected');
  }

  function goBack() {
    dispatch('go-back');
  }
</script>

<div class="genre-selection">
  <div class="header">
    <button class="back-btn" on:click={goBack}>
      ← Vissza
    </button>
    <div class="title-section">
      <h1>🎬 Zsáner Választás</h1>
      <p>Válassz egy zsánert a játékhoz!</p>
      <div class="info-box">
        <p><strong>Játékszabály:</strong> 3 film ugyanabból a zsánerből + 1 kakukktojás (más zsánerből)</p>
      </div>
    </div>
  </div>

  <div class="genres-grid">
    {#each genres as genre}
      <div class="genre-card" on:click={() => selectGenre(genre.id)} on:keydown={(e) => e.key === 'Enter' && selectGenre(genre.id)} tabindex="0" role="button">
        <div class="genre-icon">{genre.icon}</div>
        <h3>{genre.name}</h3>
        <p>{genre.description}</p>
        <div class="play-button">
          <span>Játék</span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .genre-selection {
    min-height: 100vh;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #ff8e53 100%);
    padding: 2rem;
  }

  .header {
    margin-bottom: 3rem;
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
    margin-bottom: 1.5rem;
  }

  .info-box {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    max-width: 600px;
    margin: 0 auto;
  }

  .info-box p {
    margin: 0;
    font-size: 1rem;
  }

  .genres-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .genre-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 2px solid transparent;
  }

  .genre-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    border-color: #3498db;
  }

  .genre-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .genre-card h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .genre-card p {
    color: #7f8c8d;
    margin-bottom: 1.5rem;
    line-height: 1.4;
    font-size: 0.9rem;
  }

  .play-button {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    padding: 0.6rem 1.2rem;
    border-radius: 20px;
    display: inline-block;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .genre-card:hover .play-button {
    background: linear-gradient(135deg, #2980b9, #1c6ea4);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    .title-section h1 {
      font-size: 2rem;
    }
    
    .genres-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }
</style>