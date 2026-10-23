import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkX, Grid, List, Search, Filter } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const SAVED_CAMPAIGNS = [
  {
    id: 'camp-1',
    title: 'Emergency Open-Heart Surgery for 6-Year-Old Aarav',
    category: 'Medical Help',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
    raisedAmount: 348500,
    targetAmount: 450000,
    daysLeft: 18,
    isVerified: true,
    savedAt: '2026-10-21T18:00:00Z',
  },
  {
    id: 'camp-2',
    title: 'Digital Classrooms & Solar Tablets for 120 Tribal Students',
    category: 'Education Support',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    raisedAmount: 182600,
    targetAmount: 220000,
    daysLeft: 31,
    isVerified: true,
    savedAt: '2026-10-20T09:00:00Z',
  },
  {
    id: 'camp-4',
    title: 'Assam Flood Relief: Emergency Clean Water & Rations',
    category: 'Disaster Relief',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80',
    raisedAmount: 512000,
    targetAmount: 600000,
    daysLeft: 7,
    isVerified: true,
    savedAt: '2026-10-19T11:00:00Z',
  },
];

const SAVED_POSTS = [
  {
    id: 'post-3',
    title: 'Incredible milestone! 🎉 Assam Flood Relief crosses 85%...',
    author: { name: 'Ananya S.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop' },
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80',
    savedAt: '2026-10-21T20:00:00Z',
    category: 'Milestone',
  },
];

export default function SavedPostsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'campaigns' | 'posts'>('all');
  const [search, setSearch] = useState('');
  const [savedCampaigns, setSavedCampaigns] = useState(SAVED_CAMPAIGNS);
  const [savedPosts, setSavedPosts] = useState(SAVED_POSTS);

  const removeFromSaved = (id: string, type: 'campaign' | 'post') => {
    if (type === 'campaign') {
      setSavedCampaigns(prev => prev.filter(c => c.id !== id));
    } else {
      setSavedPosts(prev => prev.filter(p => p.id !== id));
    }
    toast.success('Removed from saved');
  };

  const allItems = [
    ...savedCampaigns.map(c => ({ ...c, itemType: 'campaign' as const })),
    ...savedPosts.map(p => ({ ...p, itemType: 'post' as const })),
  ].filter(item =>
    !search || item.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayItems = activeTab === 'all'
    ? allItems
    : activeTab === 'campaigns'
    ? allItems.filter(i => i.itemType === 'campaign')
    : allItems.filter(i => i.itemType === 'post');

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-emerald-500" />
              Saved Posts
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {allItems.length} saved item{allItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={cn('p-2 rounded-lg transition-colors', view === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600')}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600')}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search saved items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {(['all', 'campaigns', 'posts'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all',
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid/List */}
        {displayItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Nothing saved yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Bookmark campaigns and posts to find them here.</p>
            <Button variant="primary" onClick={() => navigate('/donate')}>Explore Campaigns</Button>
          </div>
        ) : (
          <div className={cn(
            view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'
          )}>
            <AnimatePresence>
              {displayItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow group',
                    view === 'list' && 'flex gap-4'
                  )}
                >
                  {/* Image */}
                  <div
                    className={cn(
                      'overflow-hidden cursor-pointer',
                      view === 'grid' ? 'relative h-44' : 'w-28 h-28 flex-shrink-0 relative'
                    )}
                    onClick={() => item.itemType === 'campaign' ? navigate(`/campaign/${item.id}`) : navigate('/home')}
                  >
                    {(item as any).imageUrl && (
                      <img
                        src={(item as any).imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {/* Category badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full">
                      {(item as any).category || item.itemType}
                    </span>
                    {item.itemType === 'campaign' && (item as any).isVerified && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-bold rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <h3
                      className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors mb-2"
                      onClick={() => item.itemType === 'campaign' ? navigate(`/campaign/${item.id}`) : navigate('/home')}
                    >
                      {item.title}
                    </h3>

                    {/* Campaign progress */}
                    {item.itemType === 'campaign' && (item as any).targetAmount && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>₹{((item as any).raisedAmount || 0).toLocaleString('en-IN')}</span>
                          <span>{Math.round(((item as any).raisedAmount / (item as any).targetAmount) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, ((item as any).raisedAmount / (item as any).targetAmount) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{(item as any).daysLeft} days left</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Saved {new Date((item as any).savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                      <button
                        onClick={() => removeFromSaved(item.id, item.itemType)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        title="Remove from saved"
                      >
                        <BookmarkX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
