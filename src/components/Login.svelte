<script lang="ts">
  import { auth } from '../stores/auth';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let username = '';
  let password = '';
  let error = '';
  let isLogin = true;
  let email = '';

  function handleSubmit() {
    error = '';
    
    if (isLogin) {
      const success = auth.login(username, password);
      if (!success) {
        error = 'Hibás felhasználónév vagy jelszó';
      }
    } else {
      if (!username || !email || !password) {
        error = 'Minden mező kitöltése kötelező';
        return;
      }
      
      const success = auth.register(username, email, password);
      if (!success) {
        error = 'A felhasználónév vagy email már foglalt';
      }
    }
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = '';
    username = '';
    password = '';
    email = '';
  }
</script>

<div class="login-container">
  <div class="login-card">
    <h1>{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</h1>
    
    {#if error}
      <div class="error">{error}</div>
    {/if}
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="input-group">
        <label for="username">Felhasználónév</label>
        <input type="text" id="username" bind:value={username} required />
      </div>
      
      {#if !isLogin}
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" bind:value={email} required />
        </div>
      {/if}
      
      <div class="input-group">
        <label for="password">Jelszó</label>
        <input type="password" id="password" bind:value={password} required />
      </div>
      
      <button type="submit" class="submit-btn">
        {isLogin ? 'Bejelentkezés' : 'Regisztráció'}
      </button>
    </form>
    
    <p class="toggle-text">
      {isLogin ? 'Még nincs fiókod?' : 'Már van fiókod?'}
      <button type="button" on:click={toggleMode} class="toggle-btn">
        {isLogin ? 'Regisztrálj' : 'Jelentkezz be'}
      </button>
    </p>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    padding: 2rem;
  }

  .login-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 400px;
    backdrop-filter: blur(10px);
  }

  h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #34495e;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  input:focus {
    outline: none;
    border-color: #3498db;
  }

  .submit-btn {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(52, 152, 219, 0.3);
  }

  .toggle-text {
    text-align: center;
    margin-top: 1.5rem;
    color: #7f8c8d;
  }

  .toggle-btn {
    background: none;
    border: none;
    color: #3498db;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
  }

  .error {
    background: #e74c3c;
    color: white;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
  }
</style>