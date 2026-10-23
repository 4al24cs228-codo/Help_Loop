import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Pin,
  Check,
  CheckCheck,
  Smile,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  X,
  Users,
  Sparkles,
  UserPlus,
  UserCheck,
  MessageCircle,
  Reply,
  ShieldCheck,
  Image as ImageIcon,
  ChevronRight,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { cn, timeAgo } from '../lib/utils';

interface ChatMember {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

interface MessageItem {
  id: string;
  senderId: string;
  content: string;
  created_at: string;
  isOwn: boolean;
  senderName?: string;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  reactions?: { emoji: string; count: number; userReacted?: boolean }[];
}

interface ConversationItem {
  id: string;
  type: 'direct' | 'communities' | 'group';
  title: string;
  name: string;
  avatar: string;
  members: ChatMember[];
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isOnline: boolean;
  updated_at: string;
  created_at: string;
  lastMessage?: {
    id: string;
    conversationId: string;
    senderId: string;
    sender: { id: string; name: string; username: string };
    content: string;
    isRead: boolean;
    created_at: string;
  };
}

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    type: 'direct',
    title: 'Sneha K.',
    name: 'Sneha K.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80',
    members: [],
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isOnline: true,
    updated_at: '2026-10-22T10:15:00Z',
    created_at: '2026-10-01T00:00:00Z',
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'usr-sneha',
      sender: { id: 'usr-sneha', name: 'Sneha K.', username: 'sneha_k' },
      content: 'Thanks for your support! 💚',
      isRead: false,
      created_at: '2026-10-22T10:15:00Z',
    },
  },
  {
    id: 'conv-2',
    type: 'direct',
    title: 'Rahul M.',
    name: 'Rahul M.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    members: [],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isOnline: false,
    updated_at: '2026-10-21T18:00:00Z',
    created_at: '2026-10-05T00:00:00Z',
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv-2',
      senderId: 'usr-1',
      sender: { id: 'usr-1', name: 'Elena', username: 'elena' },
      content: 'Thank you for the update on the flood relief!',
      isRead: true,
      created_at: '2026-10-21T18:00:00Z',
    },
  },
  {
    id: 'conv-3',
    type: 'communities',
    title: 'Medical Support Group',
    name: 'Medical Support Group',
    avatar: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=80&auto=format&fit=crop&q=80',
    members: [],
    unreadCount: 5,
    isPinned: true,
    isMuted: false,
    isOnline: false,
    updated_at: '2026-10-22T09:30:00Z',
    created_at: '2026-09-01T00:00:00Z',
    lastMessage: {
      id: 'msg-3',
      conversationId: 'conv-3',
      senderId: 'usr-sneha',
      sender: { id: 'usr-sneha', name: 'Priya', username: 'priya' },
      content: 'Is there any update on the blood group arrangement?',
      isRead: false,
      created_at: '2026-10-22T09:30:00Z',
    },
  },
  {
    id: 'conv-4',
    type: 'communities',
    title: 'Beach Cleanup Volunteers',
    name: 'Beach Cleanup Volunteers',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&auto=format&fit=crop&q=80',
    members: [],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isOnline: false,
    updated_at: '2026-10-21T11:13:00Z',
    created_at: '2026-10-10T00:00:00Z',
    lastMessage: {
      id: 'msg-4',
      conversationId: 'conv-4',
      senderId: 'usr-arjun',
      sender: { id: 'usr-arjun', name: 'Arjun', username: 'arjun' },
      content: 'Great job everyone! Till the next drive! 🌊',
      isRead: true,
      created_at: '2026-10-21T11:13:00Z',
    },
  },
];

const INITIAL_MESSAGES: Record<string, MessageItem[]> = {
  'conv-1': [
    {
      id: 'msg-1a',
      senderId: 'usr-sneha',
      senderName: 'Sneha K.',
      content: 'Hi! I saw your contribution to the Aarav campaign. So kind of you! 🙏',
      created_at: '2026-10-22T09:30:00Z',
      isOwn: false,
    },
    {
      id: 'msg-1b',
      senderId: 'usr-1',
      senderName: 'Elena Rostova',
      content: 'Happy to help! Little Aarav deserves to recover fully. Are you also following the case?',
      created_at: '2026-10-22T09:45:00Z',
      isOwn: true,
    },
    {
      id: 'msg-1c',
      senderId: 'usr-sneha',
      senderName: 'Sneha K.',
      content: 'Yes! I donated ₹500 yesterday. The HelpLoop verification gave me so much confidence. Thanks for your support! 💚',
      created_at: '2026-10-22T10:15:00Z',
      isOwn: false,
    },
  ],
  'conv-2': [
    {
      id: 'msg-2a',
      senderId: 'usr-rahul',
      senderName: 'Rahul M.',
      content: 'Hey! Are you joining the beach cleanup on Sunday?',
      created_at: '2026-10-21T16:00:00Z',
      isOwn: false,
    },
    {
      id: 'msg-2b',
      senderId: 'usr-1',
      senderName: 'Elena Rostova',
      content: 'Absolutely! Already registered. See you at 7 AM at Juhu Beach 🌊',
      created_at: '2026-10-21T16:30:00Z',
      isOwn: true,
    },
    {
      id: 'msg-2c',
      senderId: 'usr-rahul',
      senderName: 'Rahul M.',
      content: 'Great! I have shared the event in 5 WhatsApp groups. Should have 50+ volunteers.',
      created_at: '2026-10-21T17:00:00Z',
      isOwn: false,
    },
    {
      id: 'msg-2d',
      senderId: 'usr-1',
      senderName: 'Elena Rostova',
      content: 'Thank you for the update on the flood relief!',
      created_at: '2026-10-21T18:00:00Z',
      isOwn: true,
    },
  ],
  'conv-3': [
    {
      id: 'msg-3a',
      senderId: 'usr-admin',
      senderName: 'Admin Team',
      content: 'Welcome to the Medical Support Group! This is a safe space for discussing verified medical campaigns and volunteering opportunities.',
      created_at: '2026-10-20T10:00:00Z',
      isOwn: false,
    },
    {
      id: 'msg-3b',
      senderId: 'usr-2',
      senderName: 'Dr. Vivek',
      content: 'The hospital confirmed — 3 donors still needed. Reply here if you can donate at Santacruz tomorrow!',
      created_at: '2026-10-22T08:00:00Z',
      isOwn: false,
    },
    {
      id: 'msg-3c',
      senderId: 'usr-sneha',
      senderName: 'Priya Sharma',
      content: 'Is there any update on the blood group arrangement?',
      created_at: '2026-10-22T09:30:00Z',
      isOwn: false,
    },
  ],
  'conv-4': [
    {
      id: 'msg-4a',
      senderId: 'usr-arjun',
      senderName: 'Arjun N.',
      content: 'Great job everyone! We collected over 500 kg of plastic from Juhu Beach today!',
      created_at: '2026-10-21T11:00:00Z',
      isOwn: false,
    },
    {
      id: 'msg-4b',
      senderId: 'usr-1',
      senderName: 'Elena Rostova',
      content: 'Amazing team effort! Earned 20 Goodness Points each. 🌊',
      created_at: '2026-10-21T11:10:00Z',
      isOwn: true,
    },
    {
      id: 'msg-4c',
      senderId: 'usr-arjun',
      senderName: 'Arjun N.',
      content: 'Great job everyone! Till the next drive! 🌊',
      created_at: '2026-10-21T11:13:00Z',
      isOwn: false,
    },
  ],
};

const SUGGESTED_PEOPLE = [
  {
    id: 'usr-meera',
    name: 'Dr. Meera Rao',
    role: 'Pediatric Surgeon & Volunteer',
    avatar: 'https://images.unsplash.com/photo-1594824813637-295b706c9a9d?w=80&auto=format&fit=crop&q=80',
    mutualCircles: 3,
    isFollowing: false,
  },
  {
    id: 'usr-rohan',
    name: 'Rohan Verma',
    role: 'Disaster Relief Coordinator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    mutualCircles: 2,
    isFollowing: false,
  },
  {
    id: 'usr-ananya',
    name: 'Ananya Sen',
    role: 'Food Rescue Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    mutualCircles: 4,
    isFollowing: true,
  },
];

const EMOJI_PALETTE = ['💚', '🙏', '👍', '❤️', '😊', '🌊', '🎉', '👏', '🤝', '🌟'];

function formatChatTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export const MessagesPage: React.FC = () => {
  const { id: urlConvId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { decrementMessages } = useAppStore();

  const [conversations, setConversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);
  const [messagesMap, setMessagesMap] = useState<Record<string, MessageItem[]>>(INITIAL_MESSAGES);
  const [activeConvId, setActiveConvId] = useState<string>(urlConvId || 'conv-1');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState<boolean>(Boolean(urlConvId));

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'communities'>('all');
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<MessageItem | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedPeople, setSuggestedPeople] = useState(SUGGESTED_PEOPLE);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync if URL parameter changes
  useEffect(() => {
    if (urlConvId && urlConvId !== activeConvId) {
      setActiveConvId(urlConvId);
      setIsMobileChatOpen(true);
    }
  }, [urlConvId, activeConvId]);

  // Current conversation & its messages
  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = (activeConversation ? messagesMap[activeConversation.id] : []) || [];

  // Auto-scroll when messages change or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isTyping, activeConvId]);

  // Clear unread count when switching to a conversation
  const handleSelectConversation = (conv: ConversationItem) => {
    setActiveConvId(conv.id);
    setIsMobileChatOpen(true);
    setReplyingTo(null);
    setShowEmojiPicker(false);

    if (conv.unreadCount > 0) {
      decrementMessages();
      setConversations((prev) =>
        prev.map((item) => (item.id === conv.id ? { ...item, unreadCount: 0 } : item))
      );
    }

    // Keep URL synchronized without reloading
    navigate(`/messages/${conv.id}`, { replace: true });
  };

  // Sending message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || !activeConversation) return;

    const newMsgId = `msg-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newMsg: MessageItem = {
      id: newMsgId,
      senderId: user?.id || 'usr-1',
      senderName: user?.name || 'Elena Rostova',
      content: cleanText,
      created_at: timestamp,
      isOwn: true,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName || 'Member',
            content: replyingTo.content,
          }
        : undefined,
    };

    // Update active conversation's messages
    setMessagesMap((prev) => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMsg],
    }));

    // Update conversation lastMessage and timestamp
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              updated_at: timestamp,
              lastMessage: {
                id: newMsgId,
                conversationId: c.id,
                senderId: user?.id || 'usr-1',
                sender: {
                  id: user?.id || 'usr-1',
                  name: user?.name || 'Elena Rostova',
                  username: user?.username || 'elenarostova',
                },
                content: cleanText,
                isRead: true,
                created_at: timestamp,
              },
            }
          : c
      )
    );

    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);

    // Trigger fake typing indicator & auto-reply after sending
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      // Simulated contextual response
      let replyText = 'Thanks for your message! 💚';
      let senderName = activeConversation.title;
      let senderId = 'usr-responder';

      if (activeConversation.id === 'conv-1') {
        replyText = 'Wonderful! So glad we are connecting on HelpLoop. Let us keep making an impact together! 🌟';
        senderName = 'Sneha K.';
        senderId = 'usr-sneha';
      } else if (activeConversation.id === 'conv-2') {
        replyText = 'Sounds like a great plan! See you Sunday morning at 7 AM sharp. 🌊';
        senderName = 'Rahul M.';
        senderId = 'usr-rahul';
      } else if (activeConversation.id === 'conv-3') {
        replyText = 'Noted! We have updated the donor coordination sheet for the team. 🙏';
        senderName = 'Medical Support Bot';
        senderId = 'usr-bot';
      } else if (activeConversation.id === 'conv-4') {
        replyText = 'Super! Together we are keeping our coastlines clean! 🌊';
        senderName = 'Arjun N.';
        senderId = 'usr-arjun';
      }

      const autoReplyMsg: MessageItem = {
        id: `msg-reply-${Date.now()}`,
        senderId,
        senderName,
        content: replyText,
        created_at: new Date().toISOString(),
        isOwn: false,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeConversation.id]: [...(prev[activeConversation.id] || []), autoReplyMsg],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                updated_at: new Date().toISOString(),
                lastMessage: {
                  id: autoReplyMsg.id,
                  conversationId: c.id,
                  senderId,
                  sender: { id: senderId, name: senderName, username: senderName.toLowerCase().replace(/\s+/g, '') },
                  content: replyText,
                  isRead: true,
                  created_at: new Date().toISOString(),
                },
              }
            : c
        )
      );
    }, 2200);
  };

  // Add emoji reaction to message
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!activeConversation) return;
    setMessagesMap((prev) => {
      const msgs = prev[activeConversation.id] || [];
      return {
        ...prev,
        [activeConversation.id]: msgs.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = m.reactions || [];
          const existing = currentReactions.find((r) => r.emoji === emoji);
          let updated;
          if (existing) {
            updated = currentReactions.map((r) =>
              r.emoji === emoji
                ? {
                    ...r,
                    count: r.userReacted ? r.count - 1 : r.count + 1,
                    userReacted: !r.userReacted,
                  }
                : r
            ).filter((r) => r.count > 0);
          } else {
            updated = [...currentReactions, { emoji, count: 1, userReacted: true }];
          }
          return { ...m, reactions: updated };
        }),
      };
    });
  };

  // Follow / Unfollow suggested person
  const handleToggleFollow = (id: string, name: string) => {
    setSuggestedPeople((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isFollowing;
          if (nextState) {
            toast.success(`You are now following ${name}!`);
          } else {
            toast(`Unfollowed ${name}`, { icon: '👋' });
          }
          return { ...p, isFollowing: nextState };
        }
        return p;
      })
    );
  };

  // Start chat with suggested person
  const handleStartChat = (person: typeof SUGGESTED_PEOPLE[0]) => {
    const existing = conversations.find((c) => c.title.toLowerCase() === person.name.toLowerCase());
    if (existing) {
      handleSelectConversation(existing);
      return;
    }

    const newConvId = `conv-${Date.now()}`;
    const newConv: ConversationItem = {
      id: newConvId,
      type: 'direct',
      title: person.name,
      name: person.name,
      avatar: person.avatar,
      members: [],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isOnline: true,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      lastMessage: {
        id: `msg-init-${Date.now()}`,
        conversationId: newConvId,
        senderId: 'usr-1',
        sender: { id: 'usr-1', name: 'Elena', username: 'elena' },
        content: `Hi ${person.name}! I would love to collaborate on your social impact initiatives.`,
        isRead: true,
        created_at: new Date().toISOString(),
      },
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessagesMap((prev) => ({
      ...prev,
      [newConvId]: [
        {
          id: `msg-init-${Date.now()}`,
          senderId: 'usr-1',
          senderName: user?.name || 'Elena Rostova',
          content: `Hi ${person.name}! I would love to collaborate on your social impact initiatives.`,
          created_at: new Date().toISOString(),
          isOwn: true,
        },
      ],
    }));

    handleSelectConversation(newConv);
    toast.success(`Started conversation with ${person.name}!`);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'direct'
        ? conv.type === 'direct'
        : conv.type === 'communities' || conv.type === 'group';

    const matchesSearch =
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <AppLayout containerClassName="max-w-none w-full p-0 pb-0 lg:pb-0 h-[calc(100vh-57px)] lg:h-screen overflow-hidden">
      <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-gray-50 dark:bg-gray-950 font-sans">
        {/* ======================================================== */}
        {/* LEFT PANEL: Conversation List (340px - 380px Desktop)  */}
        {/* ======================================================== */}
        <aside
          className={cn(
            'w-full lg:w-[350px] xl:w-[390px] h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 transition-all duration-200',
            isMobileChatOpen ? 'hidden lg:flex' : 'flex'
          )}
        >
          {/* Top Bar */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Messages
                </h1>
                <Badge variant="success" size="sm" className="font-semibold text-[11px]">
                  WhatsApp Mode
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toast.success('All conversations are up-to-date.')}
                  title="Refresh chats"
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search chats or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all border border-transparent focus:border-emerald-500/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs: All | Direct | Communities */}
            <div className="flex items-center gap-1.5 mt-3 pt-1">
              {(['all', 'direct', 'communities'] as const).map((tab) => {
                const count =
                  tab === 'all'
                    ? conversations.length
                    : tab === 'direct'
                    ? conversations.filter((c) => c.type === 'direct').length
                    : conversations.filter((c) => c.type === 'communities' || c.type === 'group').length;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer flex items-center gap-1.5',
                      activeTab === tab
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/80 hover:text-gray-900'
                    )}
                  >
                    <span>{tab}</span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                        activeTab === tab
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Conversation List & Suggested People */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/80 scrollbar-hide">
            {filteredConversations.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <MessageCircle className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  No conversations found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different search term or check another tab.
                </p>
              </div>
            ) : (
              <div>
                {filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeConvId;
                  const isSentByMe = conv.lastMessage?.senderId === (user?.id || 'usr-1');

                  return (
                    <motion.div
                      key={conv.id}
                      whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.04)' }}
                      onClick={() => handleSelectConversation(conv)}
                      className={cn(
                        'flex items-center gap-3 p-3.5 sm:px-4 cursor-pointer transition-colors relative',
                        isSelected
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      )}
                    >
                      {/* Active green indicator line on left */}
                      {isSelected && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />
                      )}

                      {/* Avatar with Online indicator */}
                      <Avatar
                        src={conv.avatar}
                        name={conv.title}
                        size="md"
                        isOnline={conv.type === 'direct' ? conv.isOnline : false}
                      />

                      {/* Conversation details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className={cn(
                                'text-sm font-bold truncate',
                                isSelected
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-gray-900 dark:text-gray-100'
                              )}
                            >
                              {conv.title}
                            </span>
                            {conv.type === 'communities' && (
                              <Users className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                            )}
                          </div>

                          <span className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
                            {timeAgo(conv.updated_at)}
                          </span>
                        </div>

                        {/* Last message preview */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                            {isSentByMe && (
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            )}
                            <span className="truncate">{conv.lastMessage?.content || 'No messages yet'}</span>
                          </p>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {conv.isPinned && (
                              <Pin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                            )}

                            {conv.unreadCount > 0 && (
                              <span className="min-w-[18px] h-4.5 px-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ======================================================== */}
            {/* Suggested People to Connect Section                     */}
            {/* ======================================================== */}
            <div className="p-4 bg-gray-50/70 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
                  Suggested People
                </span>
                <Link
                  to="/helpcircles"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5"
                >
                  Join Communities
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {suggestedPeople.map((person) => (
                  <div
                    key={person.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 shadow-xs flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar src={person.avatar} name={person.name} size="sm" isOnline />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {person.name}
                          </h4>
                          <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {person.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleFollow(person.id, person.name)}
                        className={cn(
                          'px-2 py-1 rounded-lg text-[10px] font-semibold transition-all',
                          person.isFollowing
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                        )}
                      >
                        {person.isFollowing ? (
                          <span className="flex items-center gap-0.5">
                            <UserCheck className="w-3 h-3" />
                            Following
                          </span>
                        ) : (
                          'Follow'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartChat(person)}
                        title={`Message ${person.name}`}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/60 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT PANEL: WhatsApp-Inspired Chat View                */}
        {/* ======================================================== */}
        <section
          className={cn(
            'flex-1 flex flex-col h-full bg-[#f0f2f5]/50 dark:bg-gray-950/90 relative transition-all duration-200',
            !isMobileChatOpen ? 'hidden lg:flex' : 'flex'
          )}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between z-10 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileChatOpen(false)}
                    className="p-1.5 -ml-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl lg:hidden transition-colors"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <Avatar
                    src={activeConversation.avatar}
                    name={activeConversation.title}
                    size="md"
                    isOnline={activeConversation.type === 'direct' ? activeConversation.isOnline : false}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                        {activeConversation.title}
                      </h2>
                      {activeConversation.type === 'communities' ? (
                        <span className="text-[10px] font-semibold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded">
                          Community
                        </span>
                      ) : null}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate">
                      {activeConversation.type === 'direct' ? (
                        activeConversation.isOnline ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Online
                            </span>
                          </>
                        ) : (
                          'Offline • Recently active'
                        )
                      ) : (
                        <span>Verified group • 42 volunteers online</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Action Icons */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => toast('Voice calling is in private beta 📞', { icon: '📞' })}
                    title="Audio call"
                    className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toast('Video conferencing is coming soon! 🎥', { icon: '📹' })}
                    title="Video call"
                    className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeConversation.type === 'communities') {
                        navigate('/helpcircles');
                      } else {
                        toast.success(`Connected with ${activeConversation.title}`);
                      }
                    }}
                    title="Chat Info"
                    className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide">
                {/* Safe Space Banner for community chats */}
                <div className="max-w-md mx-auto my-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 text-center text-[11px] text-amber-800 dark:text-amber-300">
                  🔒 Messages are verified under HelpLoop community guidelines. Keep communication
                  transparent, helpful, and respectful.
                </div>

                {/* Date separator pill */}
                <div className="flex justify-center my-2">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full shadow-xs border border-gray-200/60 dark:border-gray-700/60">
                    Today
                  </span>
                </div>

                {/* Messages List */}
                {activeMessages.map((msg) => {
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex flex-col group',
                        msg.isOwn ? 'items-end' : 'items-start'
                      )}
                    >
                      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                        {/* Avatar for non-own message in community chat */}
                        {!msg.isOwn && activeConversation.type === 'communities' && (
                          <Avatar
                            name={msg.senderName || 'Member'}
                            size="xs"
                            className="mb-1"
                          />
                        )}

                        <div className="relative">
                          {/* Message Bubble */}
                          <div
                            className={cn(
                              'px-3.5 py-2.5 rounded-2xl text-sm relative shadow-xs leading-relaxed',
                              msg.isOwn
                                ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-tr-xs'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/60 rounded-tl-xs'
                            )}
                          >
                            {/* Sender name for group messages */}
                            {!msg.isOwn && activeConversation.type === 'communities' && (
                              <p className="text-[11px] font-bold text-emerald-600 dark:text-teal-400 mb-1">
                                {msg.senderName || 'Volunteer'}
                              </p>
                            )}

                            {/* Reply Quote preview */}
                            {msg.replyTo && (
                              <div
                                className={cn(
                                  'mb-2 p-2 rounded-lg text-xs border-l-2',
                                  msg.isOwn
                                    ? 'bg-black/15 border-white/80 text-emerald-100'
                                    : 'bg-gray-100 dark:bg-gray-700/60 border-emerald-500 text-gray-600 dark:text-gray-300'
                                )}
                              >
                                <span className="font-semibold block text-[10px]">
                                  {msg.replyTo.senderName}
                                </span>
                                <span className="line-clamp-1 italic">{msg.replyTo.content}</span>
                              </div>
                            )}

                            {/* Message content */}
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                            {/* Timestamp + Read Receipts */}
                            <div
                              className={cn(
                                'flex items-center justify-end gap-1 mt-1 text-[10px]',
                                msg.isOwn
                                  ? 'text-emerald-100/90'
                                  : 'text-gray-400 dark:text-gray-500'
                              )}
                            >
                              <span>{formatChatTime(msg.created_at)}</span>
                              {msg.isOwn && (
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-200 stroke-[2.2]" />
                              )}
                            </div>
                          </div>

                          {/* Hover Action Bar: Reply & Quick Reactions */}
                          <div
                            className={cn(
                              'absolute -top-3 hidden group-hover:flex items-center gap-1 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5 z-10 transition-all',
                              msg.isOwn ? 'right-2' : 'left-2'
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(msg);
                                inputRef.current?.focus();
                              }}
                              title="Reply"
                              className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 p-1"
                            >
                              <Reply className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAddReaction(msg.id, '💚')}
                              title="Love"
                              className="hover:scale-125 transition-transform text-xs"
                            >
                              💚
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddReaction(msg.id, '👍')}
                              title="Thumb up"
                              className="hover:scale-125 transition-transform text-xs"
                            >
                              👍
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddReaction(msg.id, '🙏')}
                              title="Namaste"
                              className="hover:scale-125 transition-transform text-xs"
                            >
                              🙏
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Displayed message reactions */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div
                          className={cn(
                            'flex flex-wrap gap-1 mt-1 px-1',
                            msg.isOwn ? 'justify-end mr-2' : 'justify-start ml-2'
                          )}
                        >
                          {msg.reactions.map((r, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleAddReaction(msg.id, r.emoji)}
                              className={cn(
                                'text-[10px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 transition-all',
                                r.userReacted
                                  ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 font-bold'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              )}
                            >
                              <span>{r.emoji}</span>
                              <span className="text-gray-600 dark:text-gray-300">{r.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Fake Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 py-1"
                    >
                      <Avatar src={activeConversation.avatar} name={activeConversation.title} size="xs" />
                      <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 px-3 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {activeConversation.title} is typing
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Reply Preview Bar */}
              <AnimatePresence>
                {replyingTo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 py-2 bg-emerald-50/90 dark:bg-emerald-950/40 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 border-l-3 border-emerald-500 pl-2.5 min-w-0">
                      <Reply className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <div className="text-xs truncate">
                        <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                          Replying to {replyingTo.senderName || 'Member'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 truncate text-[11px]">
                          {replyingTo.content}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Emoji Quick Picker Strip */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around gap-1"
                  >
                    {EMOJI_PALETTE.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                          inputRef.current?.focus();
                        }}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-lg transition-transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2"
              >
                {/* Emoji toggle */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  title="Choose emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Attachment icon */}
                <button
                  type="button"
                  onClick={() => toast.success('Simulated file upload ready.')}
                  className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  title="Attach file or photo"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all border border-transparent focus:border-emerald-500/40"
                />

                {/* Send Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!inputText.trim()}
                  className="rounded-xl w-10 h-10 !p-0 flex items-center justify-center flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </form>
            </>
          ) : (
            /* Empty State if No Active Conversation */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-900/50">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-inner">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Select a Conversation
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
                Choose a direct chat or volunteer community from the left to start messaging and
                collaborating.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default MessagesPage;
