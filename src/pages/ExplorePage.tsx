import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Search,
  Filter,
  Heart,
  Users,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { CampaignCard } from '../components/campaign/CampaignCard';
import { DonateNowSection } from '../components/campaign/DonateNowSection';
import { DonateModal } from '../components/campaign/DonateModal';
import { useAppStore } from '../store/useAppStore';
import { DEMO_CIRCLES, DEMO_EVENTS, DEMO_POSTS, DEMO_USERS, type ExtendedCampaign } from '../data/demoData';
import { formatINR, calculateProgress } from '../lib/utils';
import toast from 'react-hot-toast';

export default function ExplorePage() {
  const navigate = useNavigate();
  const { campaigns } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'campaigns' | 'events' | 'circles' | 'people'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDonateCampaign, setSelectedDonateCampaign] = useState<ExtendedCampaign | null>(null);

  const categories = ['All', 'Medical', 'Education', 'Food', 'Disaster', 'Volunteering'];

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || c.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Filter events
  const filteredEvents = DEMO_EVENTS.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filter circles
  const filteredCircles = DEMO_CIRCLES.filter((circle) => {
    const matchesSearch =
      circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circle.cause.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filter people
  const filteredPeople = DEMO_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 p-8 text-white shadow-xl shadow-emerald-500/10">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore HelpLoop</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Discover People, Causes & Communities</h1>
            <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
              Find inspiring changemakers, verified mutual aid requests, volunteering drives, and neighborhood HelpCircles.
            </p>
          </div>
        </div>

        {/* Search bar & filter tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search causes, verified requests, volunteering events, or people..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Type tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto max-w-full">
              {[
                { id: 'all', label: 'All' },
                { id: 'campaigns', label: `Causes (${filteredCampaigns.length})` },
                { id: 'events', label: `Events (${filteredEvents.length})` },
                { id: 'circles', label: `Circles (${filteredCircles.length})` },
                { id: 'people', label: `People (${filteredPeople.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFilter === tab.id
                      ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content sections based on activeFilter */}
        {(activeFilter === 'all' || activeFilter === 'campaigns') && filteredCampaigns.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Verified Causes & Requests ({filteredCampaigns.length})
              </h2>
              <button
                onClick={() => navigate('/donate')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                View all categories
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCampaigns.map((camp) => (
                <CampaignCard
                  key={camp.id}
                  campaign={camp}
                  onClick={() => navigate(`/campaign/${camp.id}`)}
                  onDonate={(c) => setSelectedDonateCampaign(c as any)}
                />
              ))}
            </div>

            {/* Visually attractive Donate Now section placed immediately after the Help Requests section */}
            <DonateNowSection onCampaignClick={(c) => navigate(`/campaign/${c.id}`)} />
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'events') && filteredEvents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Upcoming Volunteering & Campus Events ({filteredEvents.length})
              </h2>
              <button
                onClick={() => navigate('/events')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                View full calendar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-4"
                >
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      {event.category}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-1 truncate">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </p>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                      <span>{new Date(event.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {event.registeredVolunteers} joined
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'circles') && filteredCircles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-500" />
                Featured HelpCircles ({filteredCircles.length})
              </h2>
              <button
                onClick={() => navigate('/helpcircles')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Browse all communities
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCircles.map((circle) => (
                <div
                  key={circle.id}
                  onClick={() => navigate(`/helpcircles/${circle.id}`)}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
                >
                  <img
                    src={circle.avatar}
                    alt={circle.name}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {circle.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {circle.description}
                    </p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-1">
                      {circle.memberCount} members · {circle.cause}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="flex-shrink-0">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'people') && filteredPeople.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Community Champions & Changemakers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPeople.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center shadow-sm space-y-3"
                >
                  <Avatar
                    src={p.avatarUrl || p.avatar}
                    name={p.name}
                    size="lg"
                    className="mx-auto"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center justify-center gap-1">
                      {p.name}
                      {p.isVerified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono">@{p.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 px-2">
                      {p.bio || 'Active HelpLoop participant'}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {p.goodnessPoints || 100} pts
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/profile/${p.username}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Donate Modal for ExplorePage */}
        <DonateModal
          isOpen={Boolean(selectedDonateCampaign)}
          onClose={() => setSelectedDonateCampaign(null)}
          campaign={selectedDonateCampaign}
        />
      </div>
    </AppLayout>
  );
}
