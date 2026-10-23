import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Flag,
  VolumeX,
  UserX,
  Trash2,
  Edit,
  Copy,
  Send,
  Sparkles,
  Trophy,
  ExternalLink,
  DollarSign,
  X,
} from 'lucide-react';
import type { Post } from '@/types';
import { useAppStore } from '@/store/appStore';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onShare?: (postId: string, method: string) => void;
  onFollow?: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onFollow,
}) => {
  const {
    currentUser,
    likedPostIds,
    bookmarkedPostIds,
    followingUserIds,
    joinedEventIds,
    toggleLike,
    toggleBookmark,
    toggleFollow,
    toggleJoinEvent,
    deletePost,
    reportPost,
    muteUser,
    blockUser,
    donateToRequest,
  } = useAppStore();

  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState<number>(25);
  const [customDonateAmount, setCustomDonateAmount] = useState<string>('');
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [likeHeartBurst, setLikeHeartBurst] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const isLiked = (likedPostIds || []).includes(post.id) || Boolean(post.isLiked);
  const isBookmarked = (bookmarkedPostIds || []).includes(post.id) || Boolean(post.isBookmarked);
  const isFollowing = (followingUserIds || []).includes(post.author?.id) || Boolean(post.isFollowingAuthor);
  const isOwnPost = Boolean(post.isOwnPost || (currentUser && post.author?.id === currentUser.id));
  const isEventJoined = post.event
    ? (joinedEventIds || []).includes(post.event.id) || Boolean(post.event.isJoined)
    : false;

  const handleLikeClick = () => {
    setLikeHeartBurst(true);
    setTimeout(() => setLikeHeartBurst(false), 700);

    if (onLike) {
      onLike(post.id);
    } else {
      toggleLike(post.id);
    }
  };

  const handleBookmarkClick = () => {
    if (onBookmark) {
      onBookmark(post.id);
    } else {
      toggleBookmark(post.id);
    }
  };

  const handleFollowClick = () => {
    if (onFollow) {
      onFollow(post.author.id);
    } else {
      toggleFollow(post.author.id);
    }
  };

  const handleShareOption = (method: string) => {
    if (method === 'copy') {
      navigator.clipboard?.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => {
        setShareCopied(false);
        setShowShareMenu(false);
      }, 1500);
    } else {
      setShowShareMenu(false);
      alert(`Shared post via ${method}!`);
    }

    if (onShare) {
      onShare(post.id, method);
    }
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customDonateAmount ? parseFloat(customDonateAmount) : donateAmount;
    if (finalAmount > 0) {
      donateToRequest(post.id, finalAmount);
      setDonateSuccess(true);
      setTimeout(() => {
        setDonateSuccess(false);
        setShowDonateModal(false);
      }, 1800);
    }
  };

  // Caption truncation logic
  const isLongCaption = post.caption.length > 200;
  const displayedCaption =
    isLongCaption && !isCaptionExpanded
      ? post.caption.slice(0, 190) + '...'
      : post.caption;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl mb-6 shadow-card overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 sm:p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Author Avatar with Patron Emblem */}
          <div className="relative shrink-0">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            {post.author.isPatron && (
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-full flex items-center justify-center text-white ring-2 ring-white dark:ring-gray-900 shadow-xs"
                title="Impact Patron"
              >
                <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Author Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {post.author.name}
              </h3>
              {post.author.isVerified && (
                <span
                  className="w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                  title="Verified Contributor"
                >
                  ✓
                </span>
              )}

              {/* Follow Button (if not own post) */}
              {!isOwnPost && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <button
                    onClick={handleFollowClick}
                    className={`text-xs font-semibold transition-colors ${
                      isFollowing
                        ? 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                        : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="truncate">@{post.author.username}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Post Type Badge & 3-Dots Menu */}
        <div className="flex items-center gap-2 relative">
          {post.type === 'help-request' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <AlertCircle className="w-3 h-3" />
              <span>Help Request</span>
            </span>
          )}

          {post.type === 'milestone' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>Milestone</span>
            </span>
          )}

          {post.type === 'event' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Calendar className="w-3 h-3" />
              <span>Event</span>
            </span>
          )}

          {post.type === 'announcement' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Sparkles className="w-3 h-3 text-teal-500" />
              <span>Announcement</span>
            </span>
          )}

          {/* 3 dots action menu */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMoreMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-8 z-30 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-dropdown border border-gray-100 dark:border-gray-700 p-1.5 space-y-0.5 text-xs font-medium"
              >
                {isOwnPost ? (
                  <>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        alert('Edit post dialog opened');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-blue-500" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        if (confirm('Are you sure you want to delete this post?')) {
                          deletePost(post.id);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Post</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        reportPost(post.id, 'Inappropriate content');
                        alert('Post has been reported to HelpLoop community moderators.');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report Post</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        muteUser(post.author.id);
                        alert(`Muted posts from @${post.author.username}`);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Mute @{post.author.username}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        blockUser(post.author.id);
                        alert(`Blocked @${post.author.username}`);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Block User</span>
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Caption & Content */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
          {displayedCaption}
          {isLongCaption && (
            <button
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className="ml-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline"
            >
              {isCaptionExpanded ? 'see less' : 'see more'}
            </button>
          )}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Image (if present) */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative px-4 sm:px-5 pb-3 group select-none">
          <div
            className="relative w-full max-h-96 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
            onDoubleClick={handleLikeClick}
          >
            <img
              src={post.mediaUrls[0]}
              alt={post.caption.slice(0, 40)}
              className="w-full max-h-96 object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
            />

            {/* Double Tap Heart Burst Animation */}
            <AnimatePresence>
              {likeHeartBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: 1 }}
                  exit={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-xl"
                >
                  <Heart className="w-20 h-20 text-white fill-rose-500 stroke-white stroke-2" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Specific Post Type Features */}

      {/* 1. Help Request Card Feature */}
      {post.type === 'help-request' && post.helpRequest && (
        <div className="mx-4 sm:mx-5 mb-4 p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 via-amber-50/40 to-emerald-50/40 dark:from-rose-950/20 dark:via-gray-800 dark:to-emerald-950/20 border border-rose-200/60 dark:border-rose-900/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {post.helpRequest.beneficiaryName || 'Direct Mutual Aid Initiative'}
            </span>
            {post.helpRequest.daysLeft && (
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 rounded-full">
                {post.helpRequest.daysLeft} days left
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  100,
                  (post.helpRequest.raisedAmount / post.helpRequest.targetAmount) * 100
                )}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-full"
            />
          </div>

          {/* Raised and Target Amounts + Donors */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                ${post.helpRequest.raisedAmount.toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                raised of ${post.helpRequest.targetAmount.toLocaleString()} goal
              </span>
            </div>
            <div className="text-right text-gray-500 dark:text-gray-400 font-medium">
              {post.helpRequest.donorsCount} supporters
            </div>
          </div>

          {/* Donate Action Button */}
          <button
            onClick={() => setShowDonateModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <DollarSign className="w-4 h-4 stroke-[2.5]" />
            <span>Donate to Mutual Aid</span>
          </button>
        </div>
      )}

      {/* 2. Milestone Post Feature */}
      {post.type === 'milestone' && post.milestone && (
        <div className="mx-4 sm:mx-5 mb-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-emerald-50/50 to-teal-50/50 dark:from-amber-950/30 dark:via-emerald-950/20 dark:to-teal-950/20 border border-amber-200/70 dark:border-amber-800/40">
          <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{post.milestone.milestoneTitle}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-amber-100 dark:border-amber-900/30 mb-3">
            <div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block">Target</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {post.milestone.targetMetric}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block">Achieved</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {post.milestone.achievedMetric}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
            ✨ {post.milestone.impactSummary}
          </p>
        </div>
      )}

      {/* 3. Event Post Feature */}
      {post.type === 'event' && post.event && (
        <div className="mx-4 sm:mx-5 mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/60 via-teal-50/40 to-emerald-50/40 dark:from-blue-950/30 dark:via-gray-800 dark:to-teal-950/20 border border-blue-200/60 dark:border-blue-900/40">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
            {post.event.title}
          </h4>

          <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{post.event.date} • {post.event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{post.event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>
                {post.event.attendeesCount} / {post.event.capacity} volunteers attending
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleJoinEvent(post.event!.id)}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
              isEventJoined
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-md active:scale-[0.98]'
            }`}
          >
            {isEventJoined ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>You're Attending! (Click to Leave)</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Join Event</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 sm:px-5 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors group"
            aria-label="Like post"
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isLiked
                    ? 'fill-rose-500 stroke-rose-500 text-rose-500'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-rose-500'
                }`}
              />
            </motion.div>
            <span
              className={
                isLiked
                  ? 'text-rose-500'
                  : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
              }
            >
              {post.likesCount}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => {
              setIsCommentsOpen(!isCommentsOpen);
              if (onComment) onComment(post.id);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
            aria-label="Comments"
          >
            <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
            <span>{post.commentsCount ?? (post.comments ? post.comments.length : 0)}</span>
          </button>

          {/* Share Button & Popover */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
              aria-label="Share post"
            >
              <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
              <span>{post.sharesCount}</span>
            </button>

            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute left-0 bottom-8 z-30 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-dropdown border border-gray-100 dark:border-gray-700 p-1.5 space-y-0.5 text-xs font-medium"
                >
                  <button
                    onClick={() => handleShareOption('copy')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Copy className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{shareCopied ? 'Link Copied!' : 'Copy Link'}</span>
                    </div>
                    {shareCopied && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </button>
                  <button
                    onClick={() => handleShareOption('message')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-500" />
                    <span>Share to Message</span>
                  </button>
                  <button
                    onClick={() => handleShareOption('community')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Share to Community Loop</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            isBookmarked
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          aria-label="Bookmark post"
        >
          <Bookmark
            className={`w-5 h-5 ${
              isBookmarked ? 'fill-teal-600 stroke-teal-600 dark:fill-teal-400 dark:stroke-teal-400' : ''
            }`}
          />
        </button>
      </div>

      {/* Comment Section Area */}
      <div className="px-4 sm:px-5 pb-4">
        <CommentSection
          postId={post.id}
          comments={post.comments || []}
          commentsCount={post.commentsCount ?? (post.comments ? post.comments.length : 0)}
          isExpandedByDefault={isCommentsOpen}
        />
      </div>

      {/* Donate Modal */}
      <AnimatePresence>
        {showDonateModal && post.helpRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowDonateModal(false)}
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
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Mutual Aid Contribution</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      100% direct community impact guarantee
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDonateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {donateSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    Thank You for Your Impact!
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Your contribution has been recorded transparently on the HelpLoop Impact Ledger.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDonateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select Contribution Amount
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 25, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setDonateAmount(amt);
                            setCustomDonateAmount('');
                          }}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                            donateAmount === amt && !customDonateAmount
                              ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Or Custom Amount ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={customDonateAmount}
                      onChange={(e) => setCustomDonateAmount(e.target.value)}
                      placeholder="e.g. 75"
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zero Platform Fees</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      HelpLoop is 100% community supported. Your contribution goes straight to {post.helpRequest.beneficiaryName || 'the beneficiary'}.
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDonateModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                      Confirm Support
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};
