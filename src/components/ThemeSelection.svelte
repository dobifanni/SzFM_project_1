<script lang="ts">
  import { game } from '../stores/game';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const themes = [
    { id: 'genre', name: 'Műfaj', icon: '🎭', description: 'Találd meg a különböző műfajú filmet' },
    { id: 'director', name: 'Rendező', icon: '🎬', description: 'Melyik filmet más rendező készítette?' },
    { id: 'rating', name: 'Értékelés', icon: '⭐', description: 'Melyik film értékelése tér el?' },
    { id: 'language', name: 'Nyelv', icon: '🌍', description: 'Találd meg a más nyelvű filmet' },
    { id: 'actors', name: 'Színészek', icon: '🎪', description: 'Melyik filmben játszik más színész?' },
    { id: 'awards', name: 'Díjak', icon: '🏆', description: 'Melyik film nem nyert díjat?' }
  ];

  async function selectTheme(themeId: string) {
    await game.startGame(themeId);
    dispatch('theme-selected');
  }
</script>

<div class="theme-selection">
  <div class="header">
    <h1>🎬 Movie Kakukktojás</h1>
    <p>Válassz egy témát és találd meg a kakukktojást!</p>
  </div>

  <div class="themes-grid">
    {#each themes as theme}
      <div class="theme-card" on:click={() => selectTheme(theme.id)} on:keydown={(e) => e.key === 'Enter' && selectTheme(theme.id)} tabindex="0" role="button">
        <div class="theme-icon">{theme.icon}</div>
        <h3>{theme.name}</h3>
        <p>{theme.description}</p>
        <div class="play-button">
          <span>Játék</span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .theme-selection {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
  }

  .header {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
  }

  .header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .header p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .themes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .theme-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 2px solid transparent;
  }

  .theme-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: #3498db;
  }

  .theme-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .theme-card h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .theme-card p {
    color: #7f8c8d;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .play-button {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    display: inline-block;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .theme-card:hover .play-button {
    background: linear-gradient(135deg, #2980b9, #1c6ea4);
    transform: scale(1.05);
  }
</style>