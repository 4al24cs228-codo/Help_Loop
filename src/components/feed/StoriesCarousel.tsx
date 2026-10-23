import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight, X, Heart, Send } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { DEMO_STORIES, DEMO_USERS } from '@/data/demoData';
import type { Story } from '@/types';

export const StoriesCarousel: React.FC = () => {
  const storeUser = useAppStore((state) => state.currentUser);
  const storeStories = useAppStore((state) => state.stories);
  const storeMarkViewed = useAppStore((state) => state.markStoryAsViewed);

  const currentUser = storeUser || DEMO_USERS[0];
  const stories = storeStories && storeStories.length > 0 ? storeStories : DEMO_STORIES;
  const markStoryAsViewed = storeMarkViewed || (() => {});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [newStoryUrl, setNewStoryUrl] = useState('');

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [stories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 350);
    }
  };

  // Open story modal
  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
    markStoryAsViewed(stories[index].id);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setStoryProgress(0);
  };

  const nextStory = () => {
    if (activeStoryIndex !== null) {
      if (activeStoryIndex < stories.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
        setStoryProgress(0);
        markStoryAsViewed(stories[activeStoryIndex + 1].id);
      } else {
        closeStory();
      }
    }
  };

  const prevStory = () => {
    if (activeStoryIndex !== null) {
      if (activeStoryIndex > 0) {
        setActiveStoryIndex(activeStoryIndex - 1);
        setStoryProgress(0);
      } else {
        setStoryProgress(0);
      }
    }
  };

  // Timer for active story
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const DURATION = 5000; // 5 seconds per story
    const INTERVAL = 50;
    const step = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + step;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused]);

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-card mb-6 overflow-hidden">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white hover:scale-105 active:scale-95 transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white hover:scale-105 active:scale-95 transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Stories Scrollable Row */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-1 px-1 scroll-smooth"
      >
        {/* "Your Story" Item */}
        <div className="flex flex-col items-center shrink-0 cursor-pointer group">
          <div
            onClick={() => setIsCreateModalOpen(true)}
            className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 transition-all transform group-hover:scale-105"
          >
            <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-white dark:bg-gray-900">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Your Story
          </span>
        </div>

        {/* Demo User Stories */}
        {stories.map((story, index) => {
          const isViewed = story.isViewed;
          return (
            <div
              key={story.id}
              onClick={() => openStory(index)}
              className="flex flex-col items-center shrink-0 cursor-pointer group"
            >
              <div
                className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 transition-all transform group-hover:scale-105 ${
                  isViewed
                    ? 'ring-2 ring-gray-300 dark:ring-gray-700'
                    : 'bg-gradient-to-tr from-emerald-400 via-teal-400 to-emerald-500 shadow-xs'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-white dark:bg-gray-900">
                  <img
                    src={story.user.avatar}
                    alt={story.user.name}
                    className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2 max-w-[72px] truncate tracking-tight text-center group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {story.user.name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
            onClick={closeStory}
          >
            {/* Story Card Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md h-[85vh] max-h-[740px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {/* Story Media Background */}
              <div className="absolute inset-0">
                <img
                  src={activeStory.mediaUrl}
                  alt={activeStory.caption || 'Story'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
              </div>

              {/* Progress Bar Header */}
              <div className="relative z-20 p-4 space-y-3">
                {/* Segmented Progress Bars */}
                <div className="flex gap-1.5 w-full">
                  {stories.map((s, idx) => {
                    let progressWidth = '0%';
                    if (idx < (activeStoryIndex || 0)) {
                      progressWidth = '100%';
                    } else if (idx === activeStoryIndex) {
                      progressWidth = `${storyProgress}%`;
                    }
                    return (
                      <div
                        key={s.id}
                        className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                      >
                        <div
                          className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                          style={{ width: progressWidth }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* User Info & Close */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeStory.user.avatar}
                      alt={activeStory.user.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-semibold text-sm">
                          {activeStory.user.name}
                        </span>
                        {activeStory.user.isVerified && (
                          <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-white/70 text-xs">{activeStory.timestamp}</span>
                    </div>
                  </div>

                  <button
                    onClick={closeStory}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                    aria-label="Close story"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tap Left/Right navigation hit zones */}
              <div className="absolute inset-0 z-10 flex">
                <div
                  className="w-1/3 h-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevStory();
                  }}
                  title="Previous Story"
                />
                <div
                  className="w-2/3 h-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextStory();
                  }}
                  title="Next Story"
                />
              </div>

              {/* Story Bottom Caption & Reply Bar */}
              <div className="relative z-20 p-4 pb-5 space-y-3">
                {activeStory.caption && (
                  <p className="text-white text-sm font-medium leading-relaxed drop-shadow-md bg-black/30 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                    {activeStory.caption}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Reply to ${activeStory.user.name.split(' ')[0]}...`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-full text-white placeholder-white/60 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Sent message to ${activeStory.user.name}!`);
                    }}
                    className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Story liked!');
                    }}
                    className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-md active:scale-95 transition-all"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Story Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Add to Your Story</h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Story Image URL
                  </label>
                  <input
                    type="url"
                    value={newStoryUrl}
                    onChange={(e) => setNewStoryUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNewStoryUrl(
                          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
                        )
                      }
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Use Demo Photo (Wetland)
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewStoryUrl(
                          'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
                        )
                      }
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Use Demo Photo (Supplies)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Caption
                  </label>
                  <textarea
                    value={newStoryCaption}
                    onChange={(e) => setNewStoryCaption(e.target.value)}
                    placeholder="Share an impact update, volunteer moment, or mutual aid highlight..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newStoryUrl) {
                        alert('Please provide an image URL');
                        return;
                      }
                      const newStory: Story = {
                        id: `story_${Date.now()}`,
                        userId: currentUser.id,
                        user: currentUser,
                        mediaUrl: newStoryUrl,
                        caption: newStoryCaption,
                        timestamp: 'Just now',
                        isViewed: false,
                      };
                      useAppStore.setState((state) => ({
                        stories: [newStory, ...state.stories],
                      }));
                      setIsCreateModalOpen(false);
                      setNewStoryCaption('');
                      setNewStoryUrl('');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    Share to Story
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
