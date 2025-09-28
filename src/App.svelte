<script lang="ts">
  import { auth } from './stores/auth';
  import { onMount } from 'svelte';
  import Login from './components/Login.svelte';
  import ThemeSelection from './components/ThemeSelection.svelte';
  import GamePlay from './components/GamePlay.svelte';
  import Results from './components/Results.svelte';

  let currentView = 'login'; // 'login', 'theme-selection', 'game', 'results'
  let authState: any;

  const unsubscribe = auth.subscribe(value => {
    authState = value;
    if (!value.isAuthenticated && currentView !== 'login') {
      currentView = 'login';
    } else if (value.isAuthenticated && currentView === 'login') {
      currentView = 'theme-selection';
    }
  });

  // Initialize view based on auth state
  onMount(() => {
    if (authState?.isAuthenticated) {
      currentView = 'theme-selection';
    } else {
      currentView = 'login';
    }
  });

  function handleThemeSelected() {
    currentView = 'game';
  }

  function handleGameEnded() {
    currentView = 'results';
  }

  function handlePlayAgain() {
    currentView = 'game';
  }

  function handleMainMenu() {
    currentView = 'theme-selection';
  }

  function logout() {
    auth.logout();
  }
</script>

<main>
  {#if !authState?.isAuthenticated}
    <Login />
  {:else}
    <div class="app-container">
      {#if currentView !== 'game' && currentView !== 'results'}
        <div class="header">
          <div class="user-info">
            Üdvözöljük, {authState.user?.username}!
          </div>
          <button on:click={logout} class="logout-btn">
            Kijelentkezés
          </button>
        </div>
      {/if}

      {#if currentView === 'theme-selection'}
        <ThemeSelection on:theme-selected={handleThemeSelected} />
      {:else if currentView === 'game'}
        <GamePlay on:game-ended={handleGameEnded} />
      {:else if currentView === 'results'}
        <Results on:play-again={handlePlayAgain} on:main-menu={handleMainMenu} />
      {/if}
    </div>
  {/if}
</main>

<style>
  .app-container {
    min-height: 100vh;
    position: relative;
  }

  .header {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .user-info {
    color: #2c3e50;
    font-weight: 600;
  }

  .logout-btn {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }

  @media (max-width: 768px) {
    .header {
      position: relative;
      top: 0;
      right: 0;
      margin: 1rem;
      justify-content: center;
    }
  }
</style>