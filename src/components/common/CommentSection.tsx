import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles, MessageCircle } from 'lucide-react';
import type { Comment } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDate } from '../../lib/utils';

export interface CommentSectionProps {
  initialComments?: Comment[];
  postId: string;
  title?: string;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  initialComments = [],
  postId,
  title = 'Words of Encouragement & Prayers',
  className = '',
}) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          const currentLikes = c.likesCount || 0;
          return {
            ...c,
            isLiked,
            likesCount: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
          };
        }
        return c;
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmitting(true);

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      post_id: postId,
      user_id: user?.id || 'usr-anon',
      author: {
        id: user?.id || 'usr-anon',
        name: user?.name || 'Kind Supporter',
        username: user?.username || 'kind_supporter',
        email: user?.email || '',
        avatar: user?.avatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        isVerified: user?.isVerified ?? true,
        isImpactPatron: true,
        goodnessPoints: 100,
        badges: [],
        created_at: new Date().toISOString(),
      },
      content: newCommentText.trim(),
      likesCount: 0,
      isLiked: false,
      created_at: new Date().toISOString(),
    };

    setTimeout(() => {
      setComments((prev) => [newComment, ...prev]);
      setNewCommentText('');
      setIsSubmitting(false);
    }, 250);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {comments.length} heartfelt {comments.length === 1 ? 'message' : 'messages'} from supporters
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddComment} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-3">
          <Avatar
            src={user?.avatarUrl || user?.avatar}
            name={user?.name || 'User'}
            size="md"
          />
          <div className="flex-1 space-y-3">
            <textarea
              rows={2}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Leave a message of hope, prayer, or encouragement..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Kindness inspires others
              </span>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!newCommentText.trim() || isSubmitting}
                isLoading={isSubmitting}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Post Message
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar
                    src={comment.author.avatar_url || comment.author.avatar}
                    name={comment.author.name}
                    size="sm"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {comment.author.name}
                      </span>
                      {comment.author.isImpactPatron && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                          Impact Patron
                        </span>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        • {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLike(comment.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    comment.isLiked
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      : 'text-gray-400 hover:text-rose-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  aria-label="Like comment"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
                    }`}
                  />
                  <span>{comment.likesCount || 0}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
            Be the first to share an encouraging message or prayer!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
