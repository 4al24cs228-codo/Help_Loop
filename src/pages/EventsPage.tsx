import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Search,
  Grid,
  List,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Compass,
  ArrowRight,
  UserPlus,
  UserMinus,
  SlidersHorizontal,
  Bookmark,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { CardSkeleton } from '../components/ui/SkeletonLoader';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

export interface EventOrganizer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified?: boolean;
}

export interface DemoEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  venueAddress?: string;
  startDate: string;
  time: string;
  coverImage: string;
  organizer: EventOrganizer;
  maxVolunteers: number;
  registeredVolunteers: number;
  isJoined?: boolean;
  status: 'Open' | 'Full' | 'Waitlist' | 'Completed';
  goodnessPoints: number;
  whatToBring?: string[];
  safetyInfo?: string[];
  registrationDeadline?: string;
  isOnWaitlist?: boolean;
}

export const DEMO_EVENTS: DemoEvent[] = [
  {
    id: 'evt-1',
    title: 'Juhu Beach Mega Cleanup Drive',
    description:
      'Join 200+ volunteers for the biggest coastal cleanup of the year. Bring water bottles, wear old clothes, and gloves provided.',
    category: 'Beach Cleanup',
    location: 'Juhu Beach, Mumbai',
    venueAddress: 'Juhu Beach Entry Gate near Holiday Inn, Mumbai 400049',
    startDate: '2026-10-26T07:00:00Z',
    time: '7:00 AM - 1:00 PM',
    coverImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    organizer: {
      id: 'usr-arjun',
      name: 'Arjun Verma',
      username: 'arjun_cleanearth',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop',
      isVerified: true,
    },
    maxVolunteers: 200,
    registeredVolunteers: 147,
    isJoined: false,
    status: 'Open',
    goodnessPoints: 100,
    whatToBring: ['Water bottle', 'Sun protection', 'Old clothes'],
    safetyInfo: ['Gloves will be provided', 'First aid available'],
    registrationDeadline: '2026-10-25T23:59:59Z',
  },
  {
    id: 'evt-2',
    title: 'Blood Donation Camp — Fortis Hospital',
    description:
      'Donate blood and save up to 3 lives. All blood groups needed. Refreshments provided. Get a health checkup at no cost.',
    category: 'Blood Donation',
    location: 'Fortis Hospital, Bannerghatta Road, Bengaluru',
    venueAddress: 'Fortis Hospital Blood Bank Wing, Bannerghatta Rd, Bengaluru 560076',
    startDate: '2026-10-28T09:00:00Z',
    time: '9:00 AM - 5:00 PM',
    coverImage:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
    organizer: {
      id: 'usr-dr-anita',
      name: 'Dr. Anita Sharma',
      username: 'dr_anita',
      avatar:
        'https://images.unsplash.com/photo-1594824813626-d62f48e3a242?w=80&auto=format&fit=crop',
      isVerified: true,
    },
    maxVolunteers: 100,
    registeredVolunteers: 63,
    isJoined: true,
    status: 'Open',
    goodnessPoints: 150,
    whatToBring: ['Government ID', 'Have breakfast before coming'],
    safetyInfo: ['Hemoglobin screening done', 'COVID protocols'],
    registrationDeadline: '2026-10-27T23:59:59Z',
  },
  {
    id: 'evt-3',
    title: '10,000 Tree Plantation — Nilgiri Forest Reserve',
    description:
      'Plant native saplings with the Forest Department in a certified eco-restoration zone. Train journey provided from Ooty.',
    category: 'Tree Planting',
    location: 'Nilgiri Forest Reserve, Tamil Nadu',
    venueAddress: 'Nilgiri Forest Department Base Camp, Ooty 643001',
    startDate: '2026-11-02T06:00:00Z',
    time: '6:00 AM - 2:00 PM',
    coverImage:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    organizer: {
      id: 'usr-vikram',
      name: 'Vikram Mehta',
      username: 'vikram_educate',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop',
      isVerified: true,
    },
    maxVolunteers: 150,
    registeredVolunteers: 89,
    isJoined: false,
    status: 'Open',
    goodnessPoints: 120,
    whatToBring: ['Sturdy shoes', 'Lunch included'],
    safetyInfo: ['Forest safety briefing mandatory'],
    registrationDeadline: '2026-11-01T23:59:59Z',
  },
  {
    id: 'evt-4',
    title: 'Community Kitchen — Sunday Food Distribution',
    description:
      'Help prepare and distribute 500 hot meals to homeless elderly in East Delhi. A warm afternoon of service.',
    category: 'Food Distribution',
    location: 'Annapurna Seva Kitchen, Shakarpur, Delhi',
    venueAddress: 'Block 12, Shakarpur Main Market, Near Metro Station, Delhi 110092',
    startDate: '2026-10-27T10:00:00Z',
    time: '10:00 AM - 3:00 PM',
    coverImage:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
    organizer: {
      id: 'usr-priya',
      name: 'Priya Nair',
      username: 'priya_feedhope',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop',
      isVerified: true,
    },
    maxVolunteers: 30,
    registeredVolunteers: 30,
    isJoined: false,
    status: 'Full',
    goodnessPoints: 80,
    whatToBring: ['Apron', 'Hairnet'],
    safetyInfo: ['Food safety gloves provided'],
    registrationDeadline: '2026-10-26T23:59:59Z',
  },
  {
    id: 'evt-5',
    title: 'Free Tutoring Camp — Math & Science (Class 8-10)',
    description:
      'Expert teachers volunteering to help underprivileged students prepare for board exams. Online and offline sessions.',
    category: 'Tutoring',
    location: 'Online + Vidya Trust Center, Bengaluru',
    venueAddress: 'Vidya Trust Education Hub, 4th Cross, Malleshwaram, Bengaluru 560003',
    startDate: '2026-11-05T10:00:00Z',
    time: '10:00 AM onwards (Weekends)',
    coverImage:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    organizer: {
      id: 'usr-vikram',
      name: 'Vikram Mehta',
      username: 'vikram_educate',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop',
      isVerified: true,
    },
    maxVolunteers: 20,
    registeredVolunteers: 14,
    isJoined: false,
    status: 'Open',
    goodnessPoints: 90,
    whatToBring: ['Laptop/tablet', 'Teaching materials provided'],
    safetyInfo: [],
    registrationDeadline: '2026-11-04T23:59:59Z',
  },
  {
    id: 'evt-6',
    title: 'Delhi University Green Campus Drive',
    description:
      'Join student volunteers in solar installation demo, zero-waste composting, and campus recycling audit across North Campus.',
    category: 'Campus Events',
    location: 'North Campus, Delhi University, Delhi',
    venueAddress: 'Faculty of Arts Lawn, University of Delhi, Delhi 110007',
    startDate: '2026-10-29T11:00:00Z',
    time: '11:00 AM - 4:00 PM',
    coverImage:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    organizer: {
      id: 'usr-arjun',
      name: 'Arjun Verma',
      username: 'arjun_cleanearth',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop',
      isVerified: true,
    },
    maxVolunteers: 80,
    registeredVolunteers: 52,
    isJoined: false,
    status: 'Open',
    goodnessPoints: 110,
    whatToBring: ['Student ID Card', 'Notebook'],
    safetyInfo: ['Eco kits distributed at entrance'],
    registrationDeadline: '2026-10-28T20:00:00Z',
  },
  {
    id: 'evt-7',
    title: 'Versova Beach Plastic Reclamation Drive',
    description:
      'Past volunteer drive removing 12 tons of microplastic debris with the civic authorities and marine biologists.',
    category: 'Beach Cleanup',
    location: 'Versova Beach, Andheri West, Mumbai',
    venueAddress: 'Versova Beach Jetty, Andheri West, Mumbai 400061',
    startDate: '2026-10-15T08:00:00Z',
    time: '8:00 AM - 2:00 PM',
    coverImage:
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80',
    organizer: {
      id: 'usr-dr-anita',
      name: 'Dr. Anita Sharma',
      username: 'dr_anita',
      avatar:
        'https://images.unsplash.com/photo-1594824813626-d62f48e3a242?w=80&auto=format&fit=crop',
      isVerified: true,
    },
    maxVolunteers: 250,
    registeredVolunteers: 250,
    isJoined: true,
    status: 'Completed',
    goodnessPoints: 130,
    whatToBring: ['Gloves', 'Heavy boots'],
    safetyInfo: ['Completed safely with zero injuries'],
    registrationDeadline: '2026-10-14T23:59:59Z',
  },
];

const CATEGORIES = [
  'All',
  'Beach Cleanup',
  'Blood Donation',
  'Tree Planting',
  'Food Distribution',
  'Tutoring',
  'Campus Events',
] as const;

const DATE_FILTERS = ['Upcoming', 'This Week', 'This Month', 'Past'] as const;

export default function EventsPage() {
  const navigate = useNavigate();
  const { addGoodnessPoints } = useAppStore();
  const { user } = useAuthStore();

  // Local state
  const [events, setEvents] = useState<DemoEvent[]>(DEMO_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('Upcoming');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['evt-2']));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-10-26');

  // Form state for creating new event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<string>('Beach Cleanup');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventAddress, setNewEventAddress] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-11-10');
  const [newEventTime, setNewEventTime] = useState('9:00 AM - 1:00 PM');
  const [newEventMaxVolunteers, setNewEventMaxVolunteers] = useState(50);
  const [newEventPoints, setNewEventPoints] = useState(100);
  const [newEventDesc, setNewEventDesc] = useState('');

  // Fixed reference date: 2026-10-22
  const REFERENCE_DATE = new Date('2026-10-22T00:00:00Z');

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // 1. Category filter
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesDesc = evt.description.toLowerCase().includes(query);
        const matchesLoc = evt.location.toLowerCase().includes(query);
        const matchesOrg = evt.organizer.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesOrg) {
          return false;
        }
      }

      // 3. Date filter
      const eventDate = new Date(evt.startDate);
      if (selectedDateFilter === 'Upcoming') {
        return eventDate >= REFERENCE_DATE;
      }
      if (selectedDateFilter === 'This Week') {
        // Oct 22 to Oct 29, 2026 (7 days)
        const weekEnd = new Date(REFERENCE_DATE);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return eventDate >= REFERENCE_DATE && eventDate <= weekEnd;
      }
      if (selectedDateFilter === 'This Month') {
        // October 2026
        return (
          eventDate.getFullYear() === 2026 &&
          eventDate.getMonth() === 9 // 0-indexed: 9 is October
        );
      }
      if (selectedDateFilter === 'Past') {
        return eventDate < REFERENCE_DATE || evt.status === 'Completed';
      }

      return true;
    });
  }, [events, selectedCategory, searchQuery, selectedDateFilter]);

  // Handle Join / Cancel / Waitlist
  const handleToggleJoin = (event: DemoEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (event.isJoined) {
      // Cancel registration
      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id
            ? {
                ...item,
                isJoined: false,
                registeredVolunteers: Math.max(0, item.registeredVolunteers - 1),
                status: item.status === 'Full' ? 'Open' : item.status,
              }
            : item
        )
      );
      toast('Registration cancelled', {
        icon: 'ℹ️',
        style: {
          borderRadius: '12px',
          background: '#374151',
          color: '#fff',
        },
      });
    } else if (event.status === 'Full') {
      // Toggle Waitlist
      const nowWaitlisted = !event.isOnWaitlist;
      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id
            ? {
                ...item,
                isOnWaitlist: nowWaitlisted,
              }
            : item
        )
      );
      if (nowWaitlisted) {
        toast.success(`You are added to the waitlist for "${event.title}"! We will alert you if a spot opens up.`);
      } else {
        toast('Removed from waitlist', { icon: 'ℹ️' });
      }
    } else {
      // Join Event
      setEvents((prev) =>
        prev.map((item) => {
          if (item.id === event.id) {
            const nextCount = item.registeredVolunteers + 1;
            return {
              ...item,
              isJoined: true,
              registeredVolunteers: nextCount,
              status: nextCount >= item.maxVolunteers ? 'Full' : 'Open',
            };
          }
          return item;
        })
      );

      // Award Goodness Points
      addGoodnessPoints(event.goodnessPoints);
      toast.success(
        `Registered for ${event.title}! 🎉 +${event.goodnessPoints} Goodness Points awarded to your impact score!`,
        { duration: 4000 }
      );
    }
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast('Event removed from saved', { icon: '🔖' });
      } else {
        next.add(id);
        toast.success('Event saved to your bookmarks!');
      }
      return next;
    });
  };

  const handleShareEvent = (event: DemoEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join this volunteer initiative on HelpLoop: ${event.title} in ${event.location}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventLocation.trim()) {
      toast.error('Please enter the event title and location');
      return;
    }

    const createdEvent: DemoEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle.trim(),
      description: newEventDesc.trim() || 'Community organized event hosted via HelpLoop.',
      category: newEventCategory,
      location: newEventLocation.trim(),
      venueAddress: newEventAddress.trim() || newEventLocation.trim(),
      startDate: `${newEventDate}T09:00:00Z`,
      time: newEventTime,
      coverImage:
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
      organizer: {
        id: user?.id || 'usr-1',
        name: user?.name || 'Elena Rostova',
        username: user?.username || 'elenarostova',
        avatar:
          user?.avatarUrl ||
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
        isVerified: true,
      },
      maxVolunteers: Number(newEventMaxVolunteers) || 50,
      registeredVolunteers: 1,
      isJoined: true,
      status: 'Open',
      goodnessPoints: Number(newEventPoints) || 100,
      whatToBring: ['Enthusiasm & Water Bottle'],
      safetyInfo: ['Standard community safety protocols followed'],
      registrationDeadline: `${newEventDate}T23:59:59Z`,
    };

    setEvents((prev) => [createdEvent, ...prev]);
    addGoodnessPoints(50);
    toast.success('Event created successfully! +50 Organizer Goodness Points awarded! 🌟');
    setIsCreateModalOpen(false);

    // Reset form
    setNewEventTitle('');
    setNewEventLocation('');
    setNewEventAddress('');
    setNewEventDesc('');
  };

  // Helper date formatter
  const formatEventDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Overall Statistics for top banner
  const totalSpots = events.reduce((acc, curr) => acc + curr.maxVolunteers, 0);
  const totalRegistered = events.reduce((acc, curr) => acc + curr.registeredVolunteers, 0);
  const totalPointsPool = events.reduce((acc, curr) => acc + curr.goodnessPoints, 0);

  // Calendar days generation for late October / early November 2026
  const calendarDays = [
    { day: 22, date: '2026-10-22', isCurrentMonth: true },
    { day: 23, date: '2026-10-23', isCurrentMonth: true },
    { day: 24, date: '2026-10-24', isCurrentMonth: true },
    { day: 25, date: '2026-10-25', isCurrentMonth: true },
    { day: 26, date: '2026-10-26', isCurrentMonth: true },
    { day: 27, date: '2026-10-27', isCurrentMonth: true },
    { day: 28, date: '2026-10-28', isCurrentMonth: true },
    { day: 29, date: '2026-10-29', isCurrentMonth: true },
    { day: 30, date: '2026-10-30', isCurrentMonth: true },
    { day: 31, date: '2026-10-31', isCurrentMonth: true },
    { day: 1, date: '2026-11-01', isCurrentMonth: false },
    { day: 2, date: '2026-11-02', isCurrentMonth: false },
    { day: 3, date: '2026-11-03', isCurrentMonth: false },
    { day: 4, date: '2026-11-04', isCurrentMonth: false },
    { day: 5, date: '2026-11-05', isCurrentMonth: false },
    { day: 6, date: '2026-11-06', isCurrentMonth: false },
  ];

  const calendarEventsForDate = events.filter((evt) =>
    evt.startDate.startsWith(selectedCalendarDate)
  );

  return (
    <AppLayout containerClassName="max-w-6xl">
      <div className="space-y-6 pb-12">
        {/* Page Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900 p-6 sm:p-8 text-white shadow-xl">
          {/* Subtle background decoration */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-32 bottom-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                Community Impact Drives
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Volunteer Events & Action Drives
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Connect with organizers, take direct action in beach cleanups, food pantries & blood
                donation camps, and earn certified Goodness Points for your Impact Passport.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-3 flex-shrink-0">
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-white text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 shadow-lg font-bold border-none"
                leftIcon={<Plus className="w-4 h-4 text-emerald-600" />}
              >
                Host an Event
              </Button>
              <div className="text-xs text-emerald-200 flex items-center gap-1.5 font-medium bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                100% Verified Community Organizers
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center sm:text-left">
              <span className="text-xs font-medium text-emerald-200 block">Total Initiatives</span>
              <span className="text-xl sm:text-2xl font-black text-white">{events.length} Drives</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center sm:text-left">
              <span className="text-xs font-medium text-emerald-200 block">Volunteers Active</span>
              <span className="text-xl sm:text-2xl font-black text-white">{totalRegistered}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center sm:text-left">
              <span className="text-xs font-medium text-emerald-200 block">Openings Available</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-300">
                {Math.max(0, totalSpots - totalRegistered)} Spots
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center sm:text-left">
              <span className="text-xs font-medium text-emerald-200 block">Goodness Reward Pool</span>
              <span className="text-xl sm:text-2xl font-black text-yellow-300">
                +{totalPointsPool} GP
              </span>
            </div>
          </div>
        </div>

        {/* Search, Date Filter & View Controls Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, city, keyword or organizer..."
                className="w-full pl-10 pr-9 py-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Filters Tabs */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto scrollbar-hide">
              {DATE_FILTERS.map((df) => {
                const isActive = selectedDateFilter === df;
                return (
                  <button
                    key={df}
                    type="button"
                    onClick={() => setSelectedDateFilter(df)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150',
                      isActive
                        ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    {df}
                  </button>
                );
              })}
            </div>

            {/* View Toggle (Grid | List | Calendar) */}
            <div className="flex items-center gap-1 self-end lg:self-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                )}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                )}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                )}
                title="Calendar View"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <SlidersHorizontal className="w-3 h-3" /> Categories:
            </span>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0',
                    active
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 font-semibold'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* CALENDAR VIEW */}
        {viewMode === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Interactive Month Grid */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-emerald-500" />
                    October – November 2026 Schedule
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click any highlighted date with an event badge to inspect drives
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
                  <span>● Active Events</span>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400">
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((cDay) => {
                  const dayEvents = events.filter((e) => e.startDate.startsWith(cDay.date));
                  const isSelected = selectedCalendarDate === cDay.date;
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={cDay.date}
                      type="button"
                      onClick={() => setSelectedCalendarDate(cDay.date)}
                      className={cn(
                        'min-h-[78px] p-2 rounded-2xl flex flex-col justify-between items-start border text-left transition-all duration-150',
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                          : hasEvents
                            ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300'
                            : 'border-transparent bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 opacity-60'
                      )}
                    >
                      <div className="w-full flex items-center justify-between">
                        <span
                          className={cn(
                            'text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center',
                            isSelected
                              ? 'bg-emerald-500 text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          )}
                        >
                          {cDay.day}
                        </span>
                        {hasEvents && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>

                      {hasEvents ? (
                        <div className="w-full mt-1">
                          <span className="block text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 truncate bg-emerald-100/80 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                            {dayEvents[0].category}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 dark:text-gray-600">Open</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Details Panel */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Selected Date
                  </span>
                  <h4 className="text-lg font-extrabold text-gray-900 dark:text-white">
                    {formatEventDate(selectedCalendarDate)}
                  </h4>
                </div>
                <Badge variant="info" size="sm">
                  {calendarEventsForDate.length} Drive{calendarEventsForDate.length === 1 ? '' : 's'}
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {calendarEventsForDate.length > 0 ? (
                  calendarEventsForDate.map((cEvt) => (
                    <div
                      key={cEvt.id}
                      onClick={() => navigate(`/events/${cEvt.id}`)}
                      className="group cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:border-emerald-500 hover:shadow-md transition-all bg-gray-50/50 dark:bg-gray-800/50"
                    >
                      <div className="flex gap-3">
                        <img
                          src={cEvt.coverImage}
                          alt={cEvt.title}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mb-1">
                            {cEvt.category}
                          </span>
                          <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                            {cEvt.title}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                            <Clock className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            {cEvt.time}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            {cEvt.location}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
                        <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          +{cEvt.goodnessPoints} GP
                        </span>
                        <Button
                          size="sm"
                          variant={cEvt.isJoined ? 'danger' : 'primary'}
                          onClick={(e) => handleToggleJoin(cEvt, e)}
                        >
                          {cEvt.isJoined ? 'Cancel Registration' : cEvt.status === 'Full' ? 'Join Waitlist' : 'Join Event'}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-4 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      No initiatives scheduled for this date
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
                      Choose another date on the calendar, or host a new volunteer activity yourself!
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(true)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Host on this date
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((evt, idx) => {
                const progressPct = Math.round(
                  (evt.registeredVolunteers / evt.maxVolunteers) * 100
                );
                const isBookmarked = bookmarkedIds.has(evt.id);

                return (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/events/${evt.id}`)}
                    className="group cursor-pointer bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col md:flex-row items-start md:items-center gap-5"
                  >
                    {/* Event Cover Image + Badges */}
                    <div className="relative w-full md:w-56 h-40 md:h-36 rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={evt.coverImage}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 backdrop-blur-md">
                          {evt.category}
                        </span>
                        {evt.status === 'Full' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                            Full
                          </span>
                        )}
                        {evt.status === 'Completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-600 text-white">
                            Past
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                        <span className="font-semibold flex items-center gap-1 text-yellow-300">
                          <Sparkles className="w-3.5 h-3.5" /> +{evt.goodnessPoints} GP
                        </span>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {formatEventDate(evt.startDate)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {evt.time}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {evt.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {evt.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          {evt.venueAddress || evt.location}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Avatar
                            name={evt.organizer.name}
                            src={evt.organizer.avatar}
                            size="xs"
                          />
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {evt.organizer.name}
                          </span>
                          {evt.organizer.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Progress & Action */}
                    <div className="w-full md:w-56 flex md:flex-col justify-between items-end gap-3 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-semibold text-gray-900 dark:text-gray-200">
                            {evt.registeredVolunteers} / {evt.maxVolunteers}
                          </span>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {progressPct}% filled
                          </span>
                        </div>
                        <ProgressBar
                          value={progressPct}
                          color={progressPct >= 100 ? 'amber' : 'emerald'}
                          height="sm"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full justify-end">
                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(evt.id, e)}
                          title="Save event"
                          className={cn(
                            'p-2 rounded-xl border transition-colors',
                            isBookmarked
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800'
                              : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                          )}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleShareEvent(evt, e)}
                          title="Share event"
                          className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        <Button
                          size="sm"
                          variant={
                            evt.isJoined
                              ? 'danger'
                              : evt.status === 'Full'
                                ? 'outline'
                                : 'primary'
                          }
                          onClick={(e) => handleToggleJoin(evt, e)}
                          className="flex-1 md:flex-initial min-w-[130px]"
                          leftIcon={
                            evt.isJoined ? (
                              <UserMinus className="w-3.5 h-3.5" />
                            ) : evt.status === 'Full' ? (
                              <Clock className="w-3.5 h-3.5" />
                            ) : (
                              <UserPlus className="w-3.5 h-3.5" />
                            )
                          }
                        >
                          {evt.isJoined
                            ? 'Cancel Reg.'
                            : evt.status === 'Full'
                              ? evt.isOnWaitlist
                                ? 'Waitlisted ✓'
                                : 'Join Waitlist'
                              : 'Join Event'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((evt, idx) => {
                const progressPct = Math.round(
                  (evt.registeredVolunteers / evt.maxVolunteers) * 100
                );
                const isBookmarked = bookmarkedIds.has(evt.id);

                return (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/events/${evt.id}`)}
                    className="group cursor-pointer bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Event Cover Image */}
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={evt.coverImage}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Top overlay badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 backdrop-blur-md shadow-sm">
                            {evt.category}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {evt.status === 'Full' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                                Full
                              </span>
                            )}
                            {evt.status === 'Completed' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-700 text-white shadow-sm">
                                Completed
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleToggleBookmark(evt.id, e)}
                              className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors',
                                isBookmarked
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-black/40 text-white hover:bg-black/60'
                              )}
                              title="Bookmark"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Bottom overlay: Goodness points */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white font-bold backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                            +{evt.goodnessPoints} GP
                          </span>
                          <span className="text-[11px] text-gray-200 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                            {evt.time}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-3.5">
                        {/* Date badge */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>{formatEventDate(evt.startDate)}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {evt.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>

                        {/* Location */}
                        <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="truncate">{evt.location}</span>
                        </div>

                        {/* Organizer pill */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <Avatar
                            name={evt.organizer.name}
                            src={evt.organizer.avatar}
                            size="sm"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                {evt.organizer.name}
                              </span>
                              {evt.organizer.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 block truncate">
                              @{evt.organizer.username}
                            </span>
                          </div>
                        </div>

                        {/* Volunteer progress */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              {evt.registeredVolunteers} / {evt.maxVolunteers} Volunteers
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              {evt.status === 'Full' ? 'Full' : `${evt.maxVolunteers - evt.registeredVolunteers} spots left`}
                            </span>
                          </div>
                          <ProgressBar
                            value={progressPct}
                            color={progressPct >= 100 ? 'amber' : 'emerald'}
                            height="sm"
                          />
                        </div>

                        {/* What to bring preview tags */}
                        {evt.whatToBring && evt.whatToBring.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {evt.whatToBring.slice(0, 2).map((item) => (
                              <span
                                key={item}
                                className="inline-block text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md"
                              >
                                ✓ {item}
                              </span>
                            ))}
                            {evt.whatToBring.length > 2 && (
                              <span className="inline-block text-[10px] font-medium text-gray-400 px-1 py-0.5">
                                +{evt.whatToBring.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-2">
                      <Button
                        size="md"
                        variant={
                          evt.isJoined
                            ? 'danger'
                            : evt.status === 'Full'
                              ? 'secondary'
                              : 'primary'
                        }
                        fullWidth
                        onClick={(e) => handleToggleJoin(evt, e)}
                        leftIcon={
                          evt.isJoined ? (
                            <UserMinus className="w-4 h-4" />
                          ) : evt.status === 'Full' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )
                        }
                      >
                        {evt.isJoined
                          ? 'Cancel Registration'
                          : evt.status === 'Full'
                            ? evt.isOnWaitlist
                              ? 'On Waitlist ✓'
                              : 'Join Waitlist'
                            : 'Join Event'}
                      </Button>
                      <button
                        type="button"
                        onClick={(e) => handleShareEvent(evt, e)}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        title="Share event"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <Compass className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                No matching events found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any volunteer drives matching "{searchQuery || selectedCategory}".
                Try clearing filters or search terms.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDateFilter('Upcoming');
                }}
              >
                Reset All Filters
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Host an Event
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Host New Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Host a Community Volunteer Event"
        description="Empower your community by organizing an impact initiative on HelpLoop."
        size="lg"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="e.g., Bandra Clean Coast Sunday Drive"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={newEventCategory}
                onChange={(e) => setNewEventCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Target Volunteers
              </label>
              <input
                type="number"
                min="5"
                max="1000"
                value={newEventMaxVolunteers}
                onChange={(e) => setNewEventMaxVolunteers(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Time Window
              </label>
              <input
                type="text"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                placeholder="e.g., 8:00 AM - 12:00 PM"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              City / Main Location *
            </label>
            <input
              type="text"
              required
              value={newEventLocation}
              onChange={(e) => setNewEventLocation(e.target.value)}
              placeholder="e.g., Bandra Carter Road, Mumbai"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Detailed Venue / Meeting Point
            </label>
            <input
              type="text"
              value={newEventAddress}
              onChange={(e) => setNewEventAddress(e.target.value)}
              placeholder="e.g., Amphitheatre Entrance, Carter Road Promenade"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Description & Volunteer Role
            </label>
            <textarea
              rows={3}
              value={newEventDesc}
              onChange={(e) => setNewEventDesc(e.target.value)}
              placeholder="Describe the initiative, instructions, and impact volunteers will create..."
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>
              Organizing this event will award you <strong>+50 Organizer Goodness Points</strong> upon publishing.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Volunteer Event
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
