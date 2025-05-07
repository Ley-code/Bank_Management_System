import { create } from 'zustand';

// Temporary mock auth store
export const useAuthStore = create((set) => ({
  user: { role: 'admin' }, // Mock admin user
  isAuthenticated: true, // Pretend user is logged in
  initializeAuth: () => set({ isAuthenticated: true }), // Empty mock
}));