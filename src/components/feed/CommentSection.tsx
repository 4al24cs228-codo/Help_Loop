import React, { useState } from 'react';
import { Heart, Send, CornerDownRight, X, ShieldCheck, MessageCircle } from 'lucide-react';
import type { Comment } from '@/types';
import { useAppStore } from '@/store/appStore';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  commentsCount: number;
  onAddComment?: (text: string, replyToId?: string, replyToAuthor?: string) => void;
  onLikeComment?: (commentId: string) => void;
  isExpandedByDefault?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  commentsCount,
  onAddComment,
  onLikeComment,
  isExpandedByDefault = false,
}) => {
  const { currentUser, addComment, likeComment } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(isExpandedByDefault);
  const [commentText, setCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ id: string; author: string } | null>(null);

  const handleSendComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    if (onAddComment) {
      onAddComment(trimmed, replyTarget?.id, replyTarget?.author);
    } else {
      addComment(postId, trimmed, replyTarget?.id, replyTarget?.author);
    }

    setCommentText('');
    setReplyTarget(null);
    setIsExpanded(true);
  };

  const handleLike = (commentId: string) => {
    if (onLikeComment) {
      onLikeComment(commentId);
    } else if (likeComment) {
      likeComment(postId, commentId);
    }
  };

  const handleStartReply = (comment: Comment) => {
    setReplyTarget({
      id: comment.id,
      author: comment.author.name,
    });
  };

  // Determine comments to display
  const displayedComments = isExpanded ? comments : comments.slice(0, 2);
  const hasHiddenComments = comments.length > 2 && !isExpanded;

  return (
    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
      {/* Expander link if more than 2 comments */}
      {comments.length > 2 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          {isExpanded
            ? 'Hide additional comments'
            : `View all ${commentsCount || comments.length} comments`}
        </button>
      )}

      {/* Comments List */}
      {displayedComments.length > 0 ? (
        <div className="space-y-3">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2.5 text-xs group">
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                {comment.author.isPatron && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-600 rounded-full flex items-center justify-center text-white ring-1 ring-white dark:ring-gray-900"
                    title="Impact Patron"
                  >
                    <ShieldCheck className="w-2 h-2" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 dark:bg-gray-800/70 rounded-2xl px-3.5 py-2 inline-block max-w-full">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-gray-900 dark:text-white truncate">
                      {comment.author.name}
                    </span>
                    {comment.author.isVerified && (
                      <span className="w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                    {comment.replyToAuthor && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold mr-1.5">
                        @{comment.replyToAuthor}
                      </span>
                    )}
                    {comment.content}
                  </p>
                </div>

                {/* Sub row: timestamp, reply button, like count */}
                <div className="flex items-center gap-3 mt-1 pl-2 text-[11px] text-gray-400 dark:text-gray-500">
                  <span>{comment.timestamp}</span>
                  <button
                    onClick={() => handleStartReply(comment)}
                    className="font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Reply
                  </button>
                  {(comment.likesCount ?? 0) > 0 && (
                    <span>
                      {comment.likesCount} {comment.likesCount === 1 ? 'like' : 'likes'}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Like Button */}
              <button
                onClick={() => handleLike(comment.id)}
                className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  comment.isLiked
                    ? 'text-rose-500'
                    : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                }`}
                title={comment.isLiked ? 'Unlike comment' : 'Like comment'}
                aria-label="Like comment"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-500 stroke-rose-500' : ''}`}
                />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-3 px-4 bg-gray-50/70 dark:bg-gray-800/40 rounded-xl text-center flex flex-col items-center justify-center gap-1">
          <MessageCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-0.5" />
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            No comments yet
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            Be the first to share support or offer mutual aid!
          </p>
        </div>
      )}

      {/* Reply Banner when replying */}
      {replyTarget && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-1.5 truncate">
            <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              Replying to <span className="font-semibold">@{replyTarget.author}</span>
            </span>
          </div>
          <button
            onClick={() => setReplyTarget(null)}
            className="p-1 hover:text-emerald-900 dark:hover:text-emerald-100"
            aria-label="Cancel reply"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Comment Input */}
      <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-1">
        <div className="relative shrink-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30"
          />
        </div>

        <div className="flex-1 relative">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              replyTarget
                ? `Reply to @${replyTarget.author}...`
                : 'Add a comment or offer mutual aid...'
            }
            className="w-full pl-3.5 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-full text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all"
          />

          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
              commentText.trim()
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-xs'
                : 'text-gray-400 hover:text-gray-500 cursor-not-allowed opacity-50'
            }`}
            aria-label="Send comment"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
};
