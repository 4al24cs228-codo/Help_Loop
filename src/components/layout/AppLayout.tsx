import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Sparkles, Send, Tag, Users, HeartHandshake } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AppLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  rightPanel,
  className,
  containerClassName,
}) => {
  const { isCreatePostModalOpen, closeCreatePostModal } = useAppStore();
  const { user } = useAuthStore();

  // Create post modal internal state
  const [postType, setPostType] = useState<'request' | 'offer' | 'story'>('request');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [category, setCategory] = useState('Community Care');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    setIsSubmitting(true);
    // Simulate network submission
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    setSuccessMessage('Your impact post has been shared with the community!');

    setTimeout(() => {
      setSuccessMessage(null);
      setPostTitle('');
      setPostContent('');
      closeCreatePostModal();
    }, 1200);
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200',
        className
      )}
    >
      {/* Skip link for screen reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Header: Mobile only */}
      <MobileHeader />

      {/* Left Sidebar: Desktop only (fixed 280px) */}
      <Sidebar />

      {/* Main Container Area with Desktop Sidebar Offset */}
      <div className="flex-1 lg:pl-[280px] flex flex-col">
        <div className="flex-1 flex justify-center w-full">
          {/* Main scrollable content */}
          <main
            id="main-content"
            className={cn(
              'flex-1 min-w-0 max-w-4xl w-full px-4 sm:px-6 py-6 pb-24 lg:pb-12',
              containerClassName
            )}
          >
            {children}
          </main>

          {/* Optional Right Panel (Desktop only: ≥1280px) */}
          {rightPanel && (
            <aside
              className="hidden xl:block w-80 2xl:w-96 flex-shrink-0 p-6 border-l border-gray-200/80 dark:border-gray-800 sticky top-0 h-screen overflow-y-auto scrollbar-hide"
              aria-label="Secondary sidebar"
            >
              {rightPanel}
            </aside>
          )}
        </div>
      </div>

      {/* Bottom Navigation: Mobile only */}
      <BottomNav />

      {/* Global Quick Create Post/Help Request Modal */}
      <Modal
        isOpen={isCreatePostModalOpen}
        onClose={closeCreatePostModal}
        title="Create New Impact Post"
        description="Share a request for assistance or offer support to your local HelpLoop circle."
        size="lg"
      >
        {successMessage ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Post Published!
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitPost} className="space-y-4">
            {/* Post Type Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                type="button"
                onClick={() => setPostType('request')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all',
                  postType === 'request'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                )}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                Need Help
              </button>
              <button
                type="button"
                onClick={() => setPostType('offer')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all',
                  postType === 'offer'
                    ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                )}
              >
                <Users className="w-3.5 h-3.5" />
                Offer Support
              </button>
              <button
                type="button"
                onClick={() => setPostType('story')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all',
                  postType === 'story'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Impact Story
              </button>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="post-title"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5"
              >
                Post Title
              </label>
              <input
                id="post-title"
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g., Volunteer drivers needed for weekend food pantry delivery"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="post-category"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1"
              >
                <Tag className="w-3 h-3" /> Cause Category
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
              >
                <option value="Community Care">Community Care & Neighbors</option>
                <option value="Food Relief">Food Relief & Pantries</option>
                <option value="Medical & Health">Medical & Health Assistance</option>
                <option value="Education & Youth">Education & Youth Mentorship</option>
                <option value="Disaster Relief">Disaster Response & Shelter</option>
                <option value="Elderly Support">Senior & Elder Support</option>
                <option value="Environment">Green Impact & Climate</option>
              </select>
            </div>

            {/* Content Details */}
            <div>
              <label
                htmlFor="post-details"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5"
              >
                Details & Objectives
              </label>
              <textarea
                id="post-details"
                required
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Explain the background, how many people are involved, what items or hours are needed, and how volunteers can participate..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
              />
            </div>

            {/* Author info preview */}
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-semibold">Posting as:</span>
              <span>{user?.name || 'Elena Rostova'} (@{user?.username || 'elenarostova'})</span>
              <span className="ml-auto text-[10px] bg-emerald-200/60 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full font-bold">
                Verified Helper
              </span>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="ghost"
                onClick={closeCreatePostModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Publish Impact Post
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AppLayout;
