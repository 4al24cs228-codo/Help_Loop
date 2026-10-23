import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Sparkles,
  ShieldCheck,
  Heart,
  Zap,
  RotateCw,
  ChevronRight,
  X,
  Star,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { DEMO_CHAMPIONS } from '@/data/demoData';
import type { Champion } from '@/types';

export const CommunityChampions: React.FC = () => {
  const storeChampions = useAppStore((state) => state.champions);
  const champions = storeChampions && storeChampions.length > 0 ? storeChampions : DEMO_CHAMPIONS;
  const [startIndex, setStartIndex] = useState(0);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  // Rotate through champions 3 at a time
  const handleRotate = () => {
    if (champions.length === 0) return;
    setStartIndex((prev) => (prev + 3) % champions.length);
  };

  // Get current 3 champions circularly
  const visibleChampions: Champion[] = [];
  const total = champions.length || 1;
  for (let i = 0; i < Math.min(3, total); i++) {
    const idx = (startIndex + i) % total;
    if (champions[idx]) {
      visibleChampions.push(champions[idx]);
    }
  }

  const renderBadgeIcon = (type: Champion['badgeIcon']) => {
    switch (type) {
      case 'trophy':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'award':
        return <Award className="w-4 h-4 text-blue-500" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-teal-500" />;
      case 'shield':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-amber-500" />;
      default:
        return <Star className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <section className="relative mb-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/40 border border-emerald-500/20 dark:border-emerald-500/20 p-4 sm:p-5 shadow-xs overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header strip */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                Community Champions
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Top Impact
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Celebrating selfless mutual aid leaders & grassroot organizers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Rotate Button */}
          <button
            onClick={handleRotate}
            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-gray-800 transition-all"
            title="Rotate champions"
            aria-label="Rotate champions"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* View All Link */}
          <button
            onClick={() => setIsViewAllOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Champion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <AnimatePresence mode="popLayout">
          {visibleChampions.map((champ, index) => (
            <motion.div
              key={`${champ.id}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xs rounded-xl p-3.5 border border-emerald-500/15 dark:border-emerald-500/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all hover:shadow-card hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                {/* Top row: Avatar + Name + Badge */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="relative shrink-0">
                    <img
                      src={champ.user.avatar}
                      alt={champ.user.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    {/* Impact Patron Badge */}
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-full flex items-center justify-center text-white ring-2 ring-white dark:ring-gray-900 shadow-xs"
                      title="Impact Patron"
                    >
                      <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {champ.user.name}
                      </h3>
                      {champ.user.isVerified && (
                        <span className="w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 block truncate">
                      @{champ.user.username}
                    </span>
                  </div>

                  {/* Badge Icon Pill */}
                  <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shrink-0">
                    {renderBadgeIcon(champ.badgeIcon)}
                  </div>
                </div>

                {/* Achievement Text */}
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-snug line-clamp-2 mb-3">
                  "{champ.achievement}"
                </p>
              </div>

              {/* Bottom: Points & Badge Title */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  {champ.badgeName}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {champ.points.toLocaleString()} <span className="text-gray-500 dark:text-gray-400 font-normal">pts</span>
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View All Champions Modal */}
      <AnimatePresence>
        {isViewAllOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsViewAllOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    HelpLoop Community Champions
                  </h3>
                </div>
                <button
                  onClick={() => setIsViewAllOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {champions.map((champ, i) => (
                  <div
                    key={champ.id}
                    className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center gap-3.5"
                  >
                    <div className="w-7 text-center font-black text-sm text-emerald-600 dark:text-emerald-400">
                      #{i + 1}
                    </div>

                    <div className="relative shrink-0">
                      <img
                        src={champ.user.avatar}
                        alt={champ.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center text-white ring-2 ring-white dark:ring-gray-900">
                        <ShieldCheck className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                          {champ.user.name}
                        </h4>
                        <span className="text-[10px] text-gray-500">@{champ.user.username}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                        {champ.achievement}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                        {champ.points.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">Impact Pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
