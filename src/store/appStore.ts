/**
 * HelpLoop App Store (Zustand)
 * Manages global app state: social interactions, notifications, demo transactions,
 * Goodness Points, events, circles, and messaging.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Notification,
  Post,
  Comment,
  Campaign,
  Event,
  HelpCircle,
  Conversation,
  Message,
  DemoTransaction,
  User,
  Champion,
  Story,
} from '../types';
import {
  DEMO_NOTIFICATIONS,
  DEMO_POSTS,
  DEMO_CAMPAIGNS,
  DEMO_EVENTS,
  DEMO_CIRCLES,
  DEMO_CONVERSATIONS,
  DEMO_TRANSACTIONS,
  DEMO_USERS,
  DEMO_CHAMPIONS,
  DEMO_STORIES,
} from '../data/demoData';
import { generateDemoTransactionId } from '../lib/utils';

export interface AppState {
  // Current user info
  currentUser: User;

  // Social interactions (Stored as array of string IDs representing Sets)
  likedPosts: string[];
  bookmarkedPosts: string[];
  followedUsers: string[];
  joinedCircles: string[];
  joinedEvents: string[];

  // Aliases for compatibility
  likedPostIds: string[];
  bookmarkedPostIds: string[];
  followingUserIds: string[];
  joinedEventIds: string[];

  // Feed & Entities
  posts: Post[];
  campaigns: Campaign[];
  events: Event[];
  circles: HelpCircle[];
  champions: Champion[];
  stories: Story[];

  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;

  // Goodness Points
  goodnessPoints: number;

  // Demo Transactions
  demoTransactions: DemoTransaction[];

  // Messaging
  conversations: Conversation[];
  activeConversationId: string | null;

  // Actions
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  toggleFollow: (userId: string) => void;
  toggleJoinCircle: (circleId: string) => void;
  toggleJoinEvent: (eventId: string) => void;

  // Post Actions
  addPost: (post: Omit<Post, 'id' | 'created_at' | 'likesCount' | 'commentsCount'>) => void;
  addComment: (postId: string, content: string, author?: User | string, replyToAuthor?: string) => void;
  likeComment?: (postId: string, commentId: string) => void;
  deletePost: (postId: string) => void;
  reportPost: (postId: string, reason?: string) => void;
  muteUser: (userId: string) => void;
  blockUser: (userId: string) => void;
  donateToRequest: (postId: string, amount: number) => void;

  // Story Actions
  markStoryAsViewed: (storyId: string) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'> & { isRead?: boolean }) => void;

  // Goodness Points Actions
  addGoodnessPoints: (points: number, reason?: string) => void;

  // Demo Transactions Actions
  addDemoTransaction: (tx: Omit<DemoTransaction, 'id' | 'created_at' | 'isDemo' | 'status'> & { id?: string; status?: 'successful' | 'pending' | 'failed' }) => DemoTransaction;

  // Messaging Actions
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, content: string, sender: User) => void;

  // Reset to initial demo state
  resetToDemoData: () => void;
}

// Initial state values extracted from demo data
const INITIAL_LIKED_POSTS: string[] = DEMO_POSTS.filter((p) => p.isLiked || p.is_liked).map((p) => p.id);
const INITIAL_BOOKMARKED_POSTS: string[] = DEMO_POSTS.filter((p) => p.isBookmarked || p.is_bookmarked).map((p) => p.id);
const INITIAL_FOLLOWED_USERS: string[] = ['usr-2', 'user-sneha-1', 'user-rahul-2', 'user-ananya-3'];
const INITIAL_JOINED_CIRCLES: string[] = DEMO_CIRCLES.filter((c) => c.isJoined || c.is_joined).map((c) => c.id);
const INITIAL_JOINED_EVENTS: string[] = DEMO_EVENTS.filter((e) => e.isJoined || e.is_joined).map((e) => e.id);
const INITIAL_GOODNESS_POINTS: number = 1850;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Current user
      currentUser: DEMO_USERS[0],

      // State
      likedPosts: INITIAL_LIKED_POSTS,
      bookmarkedPosts: INITIAL_BOOKMARKED_POSTS,
      followedUsers: INITIAL_FOLLOWED_USERS,
      joinedCircles: INITIAL_JOINED_CIRCLES,
      joinedEvents: INITIAL_JOINED_EVENTS,

      // Aliases
      likedPostIds: INITIAL_LIKED_POSTS,
      bookmarkedPostIds: INITIAL_BOOKMARKED_POSTS,
      followingUserIds: INITIAL_FOLLOWED_USERS,
      joinedEventIds: INITIAL_JOINED_EVENTS,

      posts: DEMO_POSTS,
      campaigns: DEMO_CAMPAIGNS,
      events: DEMO_EVENTS,
      circles: DEMO_CIRCLES,
      champions: DEMO_CHAMPIONS,
      stories: DEMO_STORIES,

      notifications: DEMO_NOTIFICATIONS,
      unreadNotificationsCount: DEMO_NOTIFICATIONS.filter((n) => !n.isRead && !n.is_read).length,

      goodnessPoints: INITIAL_GOODNESS_POINTS,
      demoTransactions: DEMO_TRANSACTIONS,

      conversations: DEMO_CONVERSATIONS,
      activeConversationId: DEMO_CONVERSATIONS[0]?.id || null,

      // ======================================================================
      // Like / Bookmark / Follow / Join Handlers
      // ======================================================================

      toggleLike: (postId: string) => {
        const { likedPosts, posts } = get();
        const isCurrentlyLiked = likedPosts.includes(postId);

        const newLikedPosts = isCurrentlyLiked
          ? likedPosts.filter((id) => id !== postId)
          : [...likedPosts, postId];

        const delta = isCurrentlyLiked ? -1 : 1;

        const updatedPosts = posts.map((post) => {
          if (post.id === postId) {
            const count = Math.max(0, (post.likesCount ?? post.likes_count ?? 0) + delta);
            return {
              ...post,
              likesCount: count,
              likes_count: count,
              isLiked: !isCurrentlyLiked,
              is_liked: !isCurrentlyLiked,
            };
          }
          return post;
        });

        // Award 5 goodness points for the first time liking a community post
        if (!isCurrentlyLiked) {
          get().addGoodnessPoints(5, 'Engaging with community story');
        }

        set({
          likedPosts: newLikedPosts,
          likedPostIds: newLikedPosts,
          posts: updatedPosts,
        });
      },

      toggleBookmark: (postId: string) => {
        const { bookmarkedPosts, posts } = get();
        const isBookmarked = bookmarkedPosts.includes(postId);

        const newBookmarkedPosts = isBookmarked
          ? bookmarkedPosts.filter((id) => id !== postId)
          : [...bookmarkedPosts, postId];

        const updatedPosts = posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isBookmarked: !isBookmarked,
              is_bookmarked: !isBookmarked,
            };
          }
          return post;
        });

        set({
          bookmarkedPosts: newBookmarkedPosts,
          bookmarkedPostIds: newBookmarkedPosts,
          posts: updatedPosts,
        });
      },

      toggleFollow: (userId: string) => {
        const { followedUsers } = get();
        const isFollowed = followedUsers.includes(userId);

        const newFollowed = isFollowed
          ? followedUsers.filter((id) => id !== userId)
          : [...followedUsers, userId];

        set({
          followedUsers: newFollowed,
          followingUserIds: newFollowed,
        });
      },

      toggleJoinCircle: (circleId: string) => {
        const { joinedCircles, circles } = get();
        const isCurrentlyJoined = joinedCircles.includes(circleId);

        const newJoined = isCurrentlyJoined
          ? joinedCircles.filter((id) => id !== circleId)
          : [...joinedCircles, circleId];

        const updatedCircles = circles.map((circle) => {
          if (circle.id === circleId) {
            const currentCount = circle.memberCount ?? circle.member_count ?? 0;
            const updatedCount = Math.max(0, currentCount + (isCurrentlyJoined ? -1 : 1));
            return {
              ...circle,
              memberCount: updatedCount,
              member_count: updatedCount,
              isJoined: !isCurrentlyJoined,
              is_joined: !isCurrentlyJoined,
            };
          }
          return circle;
        });

        if (!isCurrentlyJoined) {
          get().addGoodnessPoints(50, 'Joined a mutual aid HelpCircle');
          get().addNotification({
            type: 'circle_update',
            title: 'Joined HelpCircle',
            message: `You successfully joined the ${circles.find((c) => c.id === circleId)?.name || 'HelpCircle'}.`,
            link: `/circles/${circleId}`,
          });
        }

        set({
          joinedCircles: newJoined,
          circles: updatedCircles,
        });
      },

      toggleJoinEvent: (eventId: string) => {
        const { joinedEvents, events } = get();
        const isCurrentlyJoined = joinedEvents.includes(eventId);

        const newJoined = isCurrentlyJoined
          ? joinedEvents.filter((id) => id !== eventId)
          : [...joinedEvents, eventId];

        const targetEvent = events.find((e) => e.id === eventId);

        const updatedEvents = events.map((event) => {
          if (event.id === eventId) {
            const currentCount = event.registeredVolunteers ?? event.registered_volunteers ?? 0;
            const updatedCount = Math.max(0, currentCount + (isCurrentlyJoined ? -1 : 1));
            return {
              ...event,
              registeredVolunteers: updatedCount,
              registered_volunteers: updatedCount,
              isJoined: !isCurrentlyJoined,
              is_joined: !isCurrentlyJoined,
            };
          }
          return event;
        });

        if (!isCurrentlyJoined && targetEvent) {
          get().addGoodnessPoints(targetEvent.goodnessPoints || 100, `Registered for ${targetEvent.title}`);
          get().addNotification({
            type: 'event_reminder',
            title: 'Volunteer Registration Confirmed',
            message: `You registered for "${targetEvent.title}". Check your schedule for location details!`,
            link: `/events/${eventId}`,
          });
        }

        set({
          joinedEvents: newJoined,
          joinedEventIds: newJoined,
          events: updatedEvents,
        });
      },

      // ======================================================================
      // Posts & Comments
      // ======================================================================

      addPost: (newPostData) => {
        const newPost: Post = {
          ...newPostData,
          id: `post-${Date.now()}`,
          likesCount: 0,
          likes_count: 0,
          commentsCount: 0,
          comments_count: 0,
          sharesCount: 0,
          bookmarksCount: 0,
          isLiked: false,
          is_liked: false,
          isBookmarked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));

        get().addGoodnessPoints(25, 'Shared a community story or appeal');
      },

      deletePost: (postId: string) => {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== postId),
        }));
      },

      reportPost: (_postId: string, _reason?: string) => {
        // Log or handle moderation report
      },

      muteUser: (userId: string) => {
        set((state) => ({
          followedUsers: state.followedUsers.filter((id) => id !== userId),
          followingUserIds: state.followingUserIds.filter((id) => id !== userId),
        }));
      },

      blockUser: (userId: string) => {
        set((state) => ({
          followedUsers: state.followedUsers.filter((id) => id !== userId),
          followingUserIds: state.followingUserIds.filter((id) => id !== userId),
        }));
      },

      donateToRequest: (postId: string, amount: number) => {
        get().addGoodnessPoints(Math.floor(amount / 10), `Donated to help request ${postId}`);
      },

      markStoryAsViewed: (storyId: string) => {
        set((state) => ({
          stories: state.stories.map((s) => (s.id === storyId ? { ...s, isViewed: true } : s)),
        }));
      },

      addComment: (postId: string, content: string, author?: User | string, replyToAuthor?: string) => {
        const currentUser = get().currentUser;
        const authorObj: User = typeof author === 'object' && author ? author : currentUser;
        const newComment: Comment = {
          id: `comm-${Date.now()}`,
          postId,
          post_id: postId,
          author: authorObj,
          content,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
          likesCount: 0,
          likes_count: 0,
          isLiked: false,
          replyTo: typeof author === 'string' ? author : undefined,
          replyToAuthor,
        };

        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const currentComments = post.commentsCount ?? post.comments_count ?? 0;
              const postComments = post.comments || [];
              return {
                ...post,
                commentsCount: currentComments + 1,
                comments_count: currentComments + 1,
                comments: [...postComments, newComment],
              };
            }
            return post;
          }),
        }));

        get().addGoodnessPoints(10, 'Contributed constructive discussion');
      },

      likeComment: (postId: string, commentId: string) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId && post.comments) {
              return {
                ...post,
                comments: post.comments.map((c) => {
                  if (c.id === commentId) {
                    const isLiked = !c.isLiked;
                    const current = c.likesCount ?? c.likes_count ?? 0;
                    const updated = Math.max(0, current + (isLiked ? 1 : -1));
                    return { ...c, isLiked, likesCount: updated, likes_count: updated };
                  }
                  return c;
                }),
              };
            }
            return post;
          }),
        }));
      },

      // ======================================================================
      // Notifications
      // ======================================================================

      markNotificationRead: (id: string) => {
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true, is_read: true } : n
          );
          return {
            notifications: updated,
            unreadNotificationsCount: updated.filter((n) => !n.isRead && !n.is_read).length,
          };
        });
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
            is_read: true,
          })),
          unreadNotificationsCount: 0,
        }));
      },

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString(),
          isRead: notificationData.isRead ?? false,
          is_read: notificationData.isRead ?? false,
          ...notificationData,
        };

        set((state) => {
          const updated = [newNotification, ...state.notifications];
          return {
            notifications: updated,
            unreadNotificationsCount: updated.filter((n) => !n.isRead && !n.is_read).length,
          };
        });
      },

      // ======================================================================
      // Goodness Points
      // ======================================================================

      addGoodnessPoints: (points: number, reason?: string) => {
        set((state) => ({
          goodnessPoints: state.goodnessPoints + points,
        }));

        if (points >= 50 && reason) {
          get().addNotification({
            type: 'badge_earned',
            title: `+${points} Goodness Points Earned!`,
            message: reason,
          });
        }
      },

      // ======================================================================
      // Demo Transactions & Campaign Funding
      // ======================================================================

      addDemoTransaction: (txData) => {
        const newTx: DemoTransaction = {
          id: txData.id || generateDemoTransactionId(),
          amount: txData.amount,
          currency: txData.currency || 'INR',
          type: txData.type,
          status: txData.status || 'successful',
          recipientType: txData.recipientType,
          recipient_type: txData.recipientType,
          recipientId: txData.recipientId,
          recipient_id: txData.recipientId,
          recipientName: txData.recipientName,
          recipient_name: txData.recipientName,
          donorName: txData.donorName || 'Abhishek Sharma',
          paymentMethod: txData.paymentMethod || 'UPI',
          payment_method: txData.paymentMethod || 'UPI',
          transactionRef: txData.transactionRef || `UPI/${Date.now().toString().slice(-8)}/DEMO`,
          transaction_ref: txData.transactionRef || `UPI/${Date.now().toString().slice(-8)}/DEMO`,
          isDemo: true,
          is_demo: true,
          message: txData.message,
          created_at: new Date().toISOString(),
        };

        // If recipient is a campaign, update campaign raised amount & supporter count
        set((state) => {
          const updatedCampaigns = state.campaigns.map((camp) => {
            if (camp.id === txData.recipientId) {
              const currentRaised = camp.raisedAmount ?? camp.raised_amount ?? 0;
              const currentSupporters = camp.supporterCount ?? camp.supporter_count ?? 0;
              return {
                ...camp,
                raisedAmount: currentRaised + txData.amount,
                raised_amount: currentRaised + txData.amount,
                supporterCount: currentSupporters + 1,
                supporter_count: currentSupporters + 1,
              };
            }
            return camp;
          });

          return {
            demoTransactions: [newTx, ...state.demoTransactions],
            campaigns: updatedCampaigns,
          };
        });

        // Award Goodness Points: 1 point for every ₹10 contributed (min 50)
        const earnedPoints = Math.max(50, Math.floor(txData.amount / 10));
        get().addGoodnessPoints(earnedPoints, `Contributed to ${txData.recipientName}`);

        // Notification for donor
        get().addNotification({
          type: 'donation',
          title: 'Demo Donation Successful',
          message: `₹${txData.amount.toLocaleString('en-IN')} successfully contributed to "${txData.recipientName}". (Ref: ${newTx.id})`,
          link: `/campaigns/${txData.recipientId}`,
        });

        return newTx;
      },

      // ======================================================================
      // Messaging
      // ======================================================================

      setActiveConversation: (conversationId: string | null) => {
        set({ activeConversationId: conversationId });
      },

      sendMessage: (conversationId: string, content: string, sender: User) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversationId,
          conversation_id: conversationId,
          senderId: sender.id,
          sender_id: sender.id,
          sender,
          content,
          isRead: false,
          is_read: false,
          created_at: new Date().toISOString(),
        };

        set((state) => {
          const updatedConversations = state.conversations.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessage: newMessage,
                last_message: newMessage,
                updated_at: new Date().toISOString(),
              };
            }
            return conv;
          });

          return {
            conversations: updatedConversations,
          };
        });
      },

      // ======================================================================
      // Reset State
      // ======================================================================

      resetToDemoData: () => {
        set({
          likedPosts: INITIAL_LIKED_POSTS,
          bookmarkedPosts: INITIAL_BOOKMARKED_POSTS,
          followedUsers: INITIAL_FOLLOWED_USERS,
          joinedCircles: INITIAL_JOINED_CIRCLES,
          joinedEvents: INITIAL_JOINED_EVENTS,
          posts: DEMO_POSTS,
          campaigns: DEMO_CAMPAIGNS,
          events: DEMO_EVENTS,
          circles: DEMO_CIRCLES,
          notifications: DEMO_NOTIFICATIONS,
          unreadNotificationsCount: DEMO_NOTIFICATIONS.filter((n) => !n.isRead && !n.is_read).length,
          goodnessPoints: INITIAL_GOODNESS_POINTS,
          demoTransactions: DEMO_TRANSACTIONS,
          conversations: DEMO_CONVERSATIONS,
          activeConversationId: DEMO_CONVERSATIONS[0]?.id || null,
        });
      },
    }),
    {
      name: 'helploop-app-storage',
      partialize: (state) => ({
        likedPosts: state.likedPosts,
        bookmarkedPosts: state.bookmarkedPosts,
        followedUsers: state.followedUsers,
        joinedCircles: state.joinedCircles,
        joinedEvents: state.joinedEvents,
        goodnessPoints: state.goodnessPoints,
        demoTransactions: state.demoTransactions,
      }),
    }
  )
);
