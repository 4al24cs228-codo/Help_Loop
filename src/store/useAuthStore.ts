import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { DEMO_USERS, DEMO_BADGES } from '../data/demoData';

export interface AuthState {
  user: User | null;
  currentUser: User | null; // Compatibility alias
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setCurrentUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (data: Partial<User>) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    emailOrData: string | { name: string; username: string; email: string; password?: string },
    password?: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

const mockDefaultUser: User = {
  id: 'usr-1',
  name: 'Elena Rostova',
  username: 'elenarostova',
  email: 'demo@helploop.in',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  bio: 'Community organizer & food relief advocate. HelpLoop Platform Administrator.',
  headline: 'Community Organizer & Grassroots Advocate',
  role: 'admin',
  isVerified: true,
  isImpactPatron: true,
  impactPoints: 1420,
  goodnessPoints: 1850,
  isOnline: true,
  location: 'Bangalore, Karnataka',
  joinedDate: 'March 2024',
  sharedInterests: ['Medical Relief', 'Food & Essentials', 'Disaster Relief', 'Rural Education'],
  website: 'https://helploop.org/elena',
  twitter: '@elenarostova',
  linkedin: 'linkedin.com/in/elena-rostova',
  badges: DEMO_BADGES,
  impactSummary: {
    totalDonated: 12500,
    hoursVolunteered: 36,
    requestsHelped: 18,
    campaignsSupported: 12,
    eventsAttended: 5,
  },
  privacySettings: {
    anonymousDonations: false,
    publicProfile: true,
    showGoodnessPoints: true,
    showOnlineStatus: true,
  },
  notificationSettings: {
    emailAlerts: true,
    pushAlerts: true,
    circleMessages: true,
    monthlyDigest: true,
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: mockDefaultUser,
      currentUser: mockDefaultUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, currentUser: user, isAuthenticated: !!user }),
      setCurrentUser: (user) => set({ user, currentUser: user, isAuthenticated: !!user }),

      updateUser: (updates) =>
        set((state) => {
          const current = state.user || state.currentUser;
          if (!current) return { user: null, currentUser: null };
          const resolvedAvatar = updates.avatar ?? updates.avatarUrl ?? updates.avatar_url ?? current.avatar;
          const updatedUser: User = {
            ...current,
            ...updates,
            avatar: resolvedAvatar,
            avatarUrl: resolvedAvatar,
            avatar_url: resolvedAvatar,
            updated_at: new Date().toISOString(),
          };
          return { user: updatedUser, currentUser: updatedUser };
        }),

      updateProfile: (data) => get().updateUser(data),

      clearError: () => set({ error: null }),

      login: async (email: string, _password?: string) => {
        set({ isLoading: true, error: null });

        // Realistic UX latency
        await new Promise((resolve) => setTimeout(resolve, 350));

        const cleanEmail = (email || '').trim().toLowerCase();

        // 1. Check if matches primary admin / demo accounts
        if (
          cleanEmail === 'admin@helploop.in' ||
          cleanEmail === 'demo@helploop.in' ||
          cleanEmail === 'elena' ||
          cleanEmail === 'admin' ||
          cleanEmail === 'demo'
        ) {
          const defaultUser = {
            ...mockDefaultUser,
            email: cleanEmail === 'admin@helploop.in' ? 'admin@helploop.in' : 'demo@helploop.in',
          };
          set({
            user: defaultUser,
            currentUser: defaultUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        }

        // 2. Check if matches any demo user from DEMO_USERS
        const matchedDemo = DEMO_USERS.find(
          (u) =>
            (u.email && u.email.toLowerCase() === cleanEmail) ||
            (u.username && u.username.toLowerCase() === cleanEmail)
        );

        if (matchedDemo) {
          const activeUser: User = {
            ...matchedDemo,
            avatar: matchedDemo.avatarUrl || matchedDemo.avatar || matchedDemo.avatar_url,
            avatarUrl: matchedDemo.avatarUrl || matchedDemo.avatar || matchedDemo.avatar_url,
          };
          set({
            user: activeUser,
            currentUser: activeUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        }

        // 3. Fallback: Any valid email can sign in as a community patron
        if (cleanEmail.includes('@') || cleanEmail.length > 2) {
          const baseName = cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail;
          const formattedName =
            baseName
              .replace(/[._-]/g, ' ')
              .split(' ')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ') || 'Community Member';

          const avatarSeed = encodeURIComponent(formattedName);
          const customUser: User = {
            id: `usr-${Date.now()}`,
            email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@example.com`,
            name: formattedName,
            username: baseName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
            bio: 'Passionate citizen striving to make a transparent difference in the community.',
            headline: 'Community Impact Supporter',
            location: 'Bangalore, Karnataka',
            role: 'user',
            isVerified: true,
            is_verified: true,
            isImpactPatron: true,
            is_impact_patron: true,
            goodnessPoints: 150,
            goodness_points: 150,
            sharedInterests: ['Medical Relief', 'Food & Essentials'],
            created_at: new Date().toISOString(),
          };

          set({
            user: customUser,
            currentUser: customUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        }

        const errorMsg = 'Please enter a valid email address (e.g. demo@helploop.in or admin@helploop.in)';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      },

      signup: async (
        emailOrData: string | { name: string; username: string; email: string; password?: string },
        _password?: string,
        name?: string
      ) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 400));

        let userEmail = '';
        let userName = '';
        let userHandle = '';

        if (typeof emailOrData === 'object' && emailOrData !== null) {
          userEmail = emailOrData.email || '';
          userName = emailOrData.name || '';
          userHandle = emailOrData.username || '';
        } else {
          userEmail = emailOrData || '';
          userName = name || '';
          userHandle = userEmail.split('@')[0] || '';
        }

        const cleanEmail = userEmail.trim().toLowerCase();
        const cleanName = userName.trim();

        if (!cleanEmail || !cleanName) {
          const errorMsg = 'Please provide both your name and email.';
          set({ isLoading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }

        const avatarSeed = encodeURIComponent(cleanName);
        const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

        const newUser: User = {
          id: `usr-${Date.now()}`,
          email: cleanEmail,
          name: cleanName,
          username: userHandle.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase() || cleanEmail.split('@')[0],
          avatar: defaultAvatar,
          avatarUrl: defaultAvatar,
          avatar_url: defaultAvatar,
          bio: 'Community member on HelpLoop.',
          headline: 'Community Changemaker',
          location: 'Bangalore, Karnataka',
          role: 'user',
          isVerified: false,
          is_verified: false,
          isImpactPatron: false,
          is_impact_patron: false,
          goodnessPoints: 100,
          goodness_points: 100,
          isOnline: true,
          joinedDate: 'Just now',
          sharedInterests: ['Medical Relief', 'Food & Essentials'],
          created_at: new Date().toISOString(),
        };

        set({
          user: newUser,
          currentUser: newUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'helploop_auth_store',
      partialize: (state) => ({
        user: state.user,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
