import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from './store/useAuthStore';

// Lazy-loaded pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ExplorePage = React.lazy(() => import('./pages/ExplorePage'));
const DonatePage = React.lazy(() => import('./pages/DonatePage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const CampaignDetailPage = React.lazy(() => import('./pages/CampaignDetailPage'));
const CreateRequestPage = React.lazy(() => import('./pages/CreateRequestPage'));
const HelpCirclesPage = React.lazy(() => import('./pages/HelpCirclesPage'));
const HelpCircleDetailPage = React.lazy(() => import('./pages/HelpCircleDetailPage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));
const EventDetailPage = React.lazy(() => import('./pages/EventDetailPage'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const SavedPostsPage = React.lazy(() => import('./pages/SavedPostsPage'));
const MyContributionsPage = React.lazy(() => import('./pages/MyContributionsPage'));
const MyRequestsPage = React.lazy(() => import('./pages/MyRequestsPage'));
const ImpactPassportPage = React.lazy(() => import('./pages/ImpactPassportPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ReviewRequestPage = React.lazy(() => import('./pages/admin/ReviewRequestPage'));
const CertificateVerificationPage = React.lazy(() => import('./pages/CertificateVerificationPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
      <p className="text-sm text-gray-500 font-medium">Loading HelpLoop...</p>
    </div>
  </div>
);

// Page transition wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// Protected route - redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin route - redirects to home if not admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/home" replace />;
  return <>{children}</>;
};

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
        <Route path="/certificate/:id" element={<PageTransition><CertificateVerificationPage /></PageTransition>} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><PageTransition><HomePage /></PageTransition></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><PageTransition><ExplorePage /></PageTransition></ProtectedRoute>} />
        <Route path="/donate" element={<ProtectedRoute><PageTransition><DonatePage /></PageTransition></ProtectedRoute>} />
        <Route path="/donate/:category" element={<ProtectedRoute><PageTransition><CategoryPage /></PageTransition></ProtectedRoute>} />
        <Route path="/campaign/:id" element={<ProtectedRoute><PageTransition><CampaignDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><PageTransition><CreateRequestPage /></PageTransition></ProtectedRoute>} />
        <Route path="/helpcircles" element={<ProtectedRoute><PageTransition><HelpCirclesPage /></PageTransition></ProtectedRoute>} />
        <Route path="/helpcircles/:id" element={<ProtectedRoute><PageTransition><HelpCircleDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><PageTransition><MessagesPage /></PageTransition></ProtectedRoute>} />
        <Route path="/messages/:id" element={<ProtectedRoute><PageTransition><MessagesPage /></PageTransition></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><PageTransition><EventsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><PageTransition><EventDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><PageTransition><NotificationsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><PageTransition><SavedPostsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/contributions" element={<ProtectedRoute><PageTransition><MyContributionsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><PageTransition><MyRequestsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/impact" element={<ProtectedRoute><PageTransition><ImpactPassportPage /></PageTransition></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
        <Route path="/admin/review/:id" element={<AdminRoute><PageTransition><ReviewRequestPage /></PageTransition></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1f2937',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
