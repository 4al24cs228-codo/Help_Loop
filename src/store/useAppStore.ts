import { create } from 'zustand';
import type { DemoTransaction } from '../types';
import { DEMO_CAMPAIGNS, type ExtendedCampaign } from '../data/demoData';

interface AppState {
  unreadNotifications: number;
  unreadMessages: number;
  isCreatePostModalOpen: boolean;
  theme: 'light' | 'dark';
  goodnessPoints: number;
  campaigns: ExtendedCampaign[];
  demoTransactions: DemoTransaction[];

  setUnreadNotifications: (count: number) => void;
  setUnreadMessages: (count: number) => void;
  decrementNotifications: () => void;
  decrementMessages: () => void;
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;
  toggleCreatePostModal: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  addDemoTransaction: (transaction: DemoTransaction) => void;
  addGoodnessPoints: (points: number) => void;
  updateCampaignTotal: (campaignId: string, amount: number) => void;
  updateCampaignRaised: (campaignId: string, amount: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  unreadNotifications: 3,
  unreadMessages: 4,
  isCreatePostModalOpen: false,
  theme: 'light',
  goodnessPoints: 340,
  campaigns: DEMO_CAMPAIGNS,
  demoTransactions: [
    {
      id: 'DEMO-2024-8192',
      amount: 500,
      currency: 'INR',
      type: 'donation',
      status: 'successful',
      recipientType: 'campaign',
      recipientId: 'camp-1',
      recipientName: 'Emergency Open-Heart Surgery for 6-Year-Old Aarav',
      donorName: 'Elena Rostova',
      paymentMethod: 'UPI',
      transactionRef: 'DEMO-REF-81920',
      isDemo: true,
      message: 'Wishing little Aarav a speedy recovery! Stay strong!',
      created_at: '2026-10-21T18:20:00Z',
    },
  ],

  setUnreadNotifications: (count: number) => set({ unreadNotifications: Math.max(0, count) }),

  setUnreadMessages: (count: number) => set({ unreadMessages: Math.max(0, count) }),

  decrementNotifications: () =>
    set((state) => ({ unreadNotifications: Math.max(0, state.unreadNotifications - 1) })),

  decrementMessages: () =>
    set((state) => ({ unreadMessages: Math.max(0, state.unreadMessages - 1) })),

  openCreatePostModal: () => set({ isCreatePostModalOpen: true }),

  closeCreatePostModal: () => set({ isCreatePostModalOpen: false }),

  toggleCreatePostModal: () =>
    set((state) => ({ isCreatePostModalOpen: !state.isCreatePostModalOpen })),

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { theme: nextTheme };
    }),

  setTheme: (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  addDemoTransaction: (transaction: DemoTransaction) =>
    set((state) => ({
      demoTransactions: [transaction, ...state.demoTransactions],
    })),

  addGoodnessPoints: (points: number) =>
    set((state) => ({
      goodnessPoints: state.goodnessPoints + points,
    })),

  updateCampaignTotal: (campaignId: string, amount: number) =>
    set((state) => ({
      campaigns: state.campaigns.map((camp) =>
        camp.id === campaignId
          ? {
              ...camp,
              raisedAmount: (camp.raisedAmount || 0) + amount,
              raised_amount: (camp.raised_amount || camp.raisedAmount || 0) + amount,
              supporterCount: (camp.supporterCount || 0) + 1,
              supporter_count: (camp.supporter_count || camp.supporterCount || 0) + 1,
            }
          : camp
      ),
    })),

  updateCampaignRaised: (campaignId: string, amount: number) =>
    set((state) => ({
      campaigns: state.campaigns.map((camp) =>
        camp.id === campaignId
          ? {
              ...camp,
              raisedAmount: (camp.raisedAmount || 0) + amount,
              raised_amount: (camp.raised_amount || camp.raisedAmount || 0) + amount,
              supporterCount: (camp.supporterCount || 0) + 1,
              supporter_count: (camp.supporter_count || camp.supporterCount || 0) + 1,
            }
          : camp
      ),
    })),
}));
