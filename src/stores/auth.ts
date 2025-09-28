import { writable } from 'svelte/store';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthStore>({
    user: null,
    isAuthenticated: false
  });

  // Check localStorage on init
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      set({ user, isAuthenticated: true });
    }
  }

  return {
    subscribe,
    login: (username: string, password: string) => {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.username === username && u.password === password);
      
      if (user) {
        const userData = { id: user.id, username: user.username, email: user.email };
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isAuthenticated: true });
        return true;
      }
      return false;
    },
    register: (username: string, email: string, password: string) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find((u: any) => u.username === username || u.email === email)) {
        return false; // User already exists
      }
      
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const userData = { id: newUser.id, username: newUser.username, email: newUser.email };
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, isAuthenticated: true });
      return true;
    },
    logout: () => {
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
    }
  };
}

export const auth = createAuthStore();