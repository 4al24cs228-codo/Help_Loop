import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Calendar,
  MessageCircle,
  Share2,
  Heart,
  ArrowLeft,
  CheckCircle,
  Award,
  Sparkles,
  Info,
  MapPin,
  Target,
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { DEMO_CIRCLES, DEMO_POSTS, DEMO_EVENTS } from '../data/demoData';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function HelpCircleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addGoodnessPoints } = useAppStore();

  const circle = DEMO_CIRCLES.find((c) => c.id === id) || DEMO_CIRCLES[0];
  const [isJoined, setIsJoined] = useState(circle.isJoined || false);
  const [activeTab, setActiveTab] = useState<'feed' | 'chat' | 'events' | 'about'>('feed');

  // Community chat message input
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm-1',
      sender: 'Dr. Anita Sharma',
      text: 'Welcome new members! Our upcoming medical checkup drive coordinates with the government primary health center this Saturday.',
      time: '10:30 AM',
      isLead: true,
    },
    {
      id: 'm-2',
      sender: 'Sneha Kapoor',
      text: 'Thanks Anita! I have registered 4 fellow college volunteers for the coordination desk.',
      time: '11:15 AM',
      isLead: false,
    },
  ]);

  const handleToggleJoin = () => {
    const nextState = !isJoined;
    setIsJoined(nextState);
    if (nextState) {
      addGoodnessPoints(50);
      toast.success(`Joined ${circle.name}! +50 Goodness Points 🌱`);
    } else {
      toast(`Left ${circle.name}`, { icon: 'ℹ️' });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: user?.name || 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isLead: false,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    addGoodnessPoints(5);
    toast.success('Message posted to HelpCircle channel! +5 GP');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate('/helpcircles')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to HelpCircles
        </button>

        {/* Cover & Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="h-48 sm:h-64 w-full relative">
            <img
              src={circle.coverImage}
              alt={circle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={circle.avatar}
                  alt={circle.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow-xl"
                />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold mb-1 backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Community
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black">{circle.name}</h1>
                  <p className="text-emerald-200 text-xs sm:text-sm">
                    {circle.memberCount} members · {circle.cause}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isJoined ? 'outline' : 'primary'}
                  onClick={handleToggleJoin}
                  className={isJoined ? 'bg-white/20 text-white border-white/40' : ''}
                >
                  {isJoined ? 'Joined Community ✓' : 'Join HelpCircle'}
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/20 text-white border-white/40"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('HelpCircle link copied!');
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Community Shared Goal (Collective target) */}
        {circle.sharedGoal && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-5 border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Shared Community Milestone
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {circle.sharedGoal.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Progress: {circle.sharedGoal.current} / {circle.sharedGoal.target} {circle.sharedGoal.unit}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-48 bg-white dark:bg-gray-800 h-2.5 rounded-full overflow-hidden border border-emerald-200 dark:border-emerald-700">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (circle.sharedGoal.current / circle.sharedGoal.target) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          {[
            { id: 'feed', label: 'Community Feed' },
            { id: 'chat', label: 'Group Chat (WhatsApp Style)' },
            { id: 'events', label: 'Activities & Events' },
            { id: 'about', label: 'About & Guidelines' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Share an announcement, need, or volunteer update with {circle.name}
              </span>
              <Button size="sm" variant="primary" onClick={() => navigate('/create')}>
                Post in Circle
              </Button>
            </div>

            {DEMO_POSTS.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={post.author.avatarUrl || post.author.avatar} name={post.author.name} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{post.author.name}</h4>
                    <p className="text-xs text-gray-400">Community Member · 2 days ago</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{post.caption}</p>
                {post.mediaUrls && post.mediaUrls[0] && (
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post media"
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Group Chat */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">{circle.name} Group Channel</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{circle.memberCount} members online</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5]/20 dark:bg-gray-950">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-md ${
                    msg.sender === (user?.name || 'You') ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      msg.sender === (user?.name || 'You')
                        ? 'bg-emerald-500 text-white rounded-tr-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <p className="text-[11px] font-bold opacity-75 mb-0.5">{msg.sender}</p>
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="text-[10px] opacity-60 block text-right mt-1">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message to community..."
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
              <Button type="submit" variant="primary">
                Send
              </Button>
            </form>
          </div>
        )}

        {/* Tab 3: Activities & Events */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Upcoming Community Activities</h3>
            {DEMO_EVENTS.slice(0, 2).map((ev) => (
              <div
                key={ev.id}
                onClick={() => navigate(`/events/${ev.id}`)}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-4"
              >
                <img src={ev.coverImage} alt={ev.title} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    {ev.category}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{ev.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {ev.location}
                  </p>
                  <p className="text-xs text-emerald-600 font-bold mt-2">
                    {ev.registeredVolunteers} registered · {new Date(ev.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: About & Guidelines */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Community Purpose</h3>
            <p className="leading-relaxed">{circle.description}</p>

            <h3 className="font-bold text-base text-gray-900 dark:text-white pt-3">HelpCircle Guidelines</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <li>Be respectful, supportive, and compassionate with fellow members.</li>
              <li>Only share verified volunteer drives and assistance requests.</li>
              <li>Respect beneficiary privacy and follow HelpLoop verification procedures.</li>
              <li>Do not post commercial advertisements or unsolicited solicitations.</li>
            </ul>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
