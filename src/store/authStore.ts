/**
 * HelpLoop Authentication Store (Unified)
 * Re-exports the authoritative useAuthStore to prevent duplicate Zustand stores.
 */
export * from './useAuthStore';
export { useAuthStore, useAuthStore as default } from './useAuthStore';
