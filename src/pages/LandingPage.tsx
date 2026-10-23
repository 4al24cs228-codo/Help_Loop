import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShieldCheck,
  Users,
  HandHeart,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Compass,
  Share2,
  Lock,
  FileCheck2,
  Receipt,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Stethoscope,
  GraduationCap,
  UtensilsCrossed,
  FlameKindling,
  Boxes,
  HelpingHand,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { HelpLoopLogo } from '@/components/common/HelpLoopLogo';
import { useAppStore } from '@/store/useAppStore';

// Types for campaigns & categories
interface Campaign {
  id: string;
  title: string;
  category: string;
  image: string;
  raised: number;
  goal: number;
  donorsCount: number;
  daysLeft: number;
  organizer: {
    name: string;
    avatar: string;
    location: string;
  };
  verified: boolean;
  urgent?: boolean;
}

interface Category {
  id: string;
  name: string;
  count: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  tag: string;
}

// Sample featured campaigns
const featuredCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Emergency ICU Care & Heart Surgery for 6-Year-Old Aarav',
    category: 'Medical',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop&q=80',
    raised: 420000,
    goal: 550000,
    donorsCount: 312,
    daysLeft: 4,
    organizer: {
      name: 'Dr. Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&fit=crop&q=80',
      location: 'Bengaluru, KA',
    },
    verified: true,
    urgent: true,
  },
  {
    id: 'camp-2',
    title: 'Solar Learning Hubs & STEM Kits for 12 Rural Tribal Schools',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop&q=80',
    raised: 285000,
    goal: 320000,
    donorsCount: 194,
    daysLeft: 9,
    organizer: {
      name: 'Vidya Vikas Foundation',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80',
      location: 'Gadchiroli, MH',
    },
    verified: true,
  },
  {
    id: 'camp-3',
    title: 'Daily Nutrition Rations for 450 Daily-Wage Families & Elders',
    category: 'Food & Essentials',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&q=80',
    raised: 175000,
    goal: 200000,
    donorsCount: 228,
    daysLeft: 12,
    organizer: {
      name: 'Kiran Deep Collective',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&fit=crop&q=80',
      location: 'Old Delhi, DL',
    },
    verified: true,
  },
];

const categories: Category[] = [
  {
    id: 'medical',
    name: 'Medical',
    count: '340+ active needs',
    description: 'Critical surgeries, life-saving oncology care, and emergency pediatric treatments.',
    icon: Stethoscope,
    gradient: 'from-rose-500 to-pink-600',
    tag: 'Highest Priority',
  },
  {
    id: 'education',
    name: 'Education',
    count: '215+ projects',
    description: 'Scholarships, learning devices, rural classroom labs, and vocational training.',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
    tag: 'Future Builders',
  },
  {
    id: 'food',
    name: 'Food & Essentials',
    count: '480+ drives',
    description: 'Community kitchens, monthly food grains, malnutrition defense, and clean water.',
    icon: UtensilsCrossed,
    gradient: 'from-amber-500 to-orange-600',
    tag: 'Daily Nourishment',
  },
  {
    id: 'disaster',
    name: 'Disaster & Emergency',
    count: '95+ rapid alerts',
    description: 'Immediate flood & cyclone relief, temporary shelters, and emergency rescue packs.',
    icon: FlameKindling,
    gradient: 'from-red-500 to-rose-700',
    tag: 'Rapid Response',
  },
  {
    id: 'essentials',
    name: 'Other Essentials',
    count: '160+ community needs',
    description: 'Elderly care supplies, shelter maintenance, warm blankets, and animal rescue.',
    icon: Boxes,
    gradient: 'from-emerald-500 to-teal-600',
    tag: 'Grassroots Aid',
  },
  {
    id: 'volunteering',
    name: 'Volunteering',
    count: '520+ opportunities',
    description: 'Lend your physical hands, medical skills, mentorship hours, or logistical help.',
    icon: HelpingHand,
    gradient: 'from-purple-500 to-violet-600',
    tag: 'Ground Impact',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Monitor scroll for navbar transparency transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 selection:bg-emerald-500 selection:text-white">
      {/* ======================================================== */}
      {/* 1. NAVIGATION BAR (Transparent on scroll)               */}
      {/* ======================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 dark:bg-gray-950/85 backdrop-blur-md shadow-sm border-b border-gray-200/60 dark:border-gray-800/60 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            aria-label="HelpLoop Home"
          >
            <HelpLoopLogo
              iconSize="md"
              textClassName={isScrolled ? undefined : 'text-white dark:text-white'}
              textColor={isScrolled ? undefined : 'text-white'}
            />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`transition-colors cursor-pointer hover:text-emerald-400 ${
                isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-emerald-50/90'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className={`transition-colors cursor-pointer hover:text-emerald-400 ${
                isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-emerald-50/90'
              }`}
            >
              Causes
            </button>
            <button
              onClick={() => scrollToSection('campaigns')}
              className={`transition-colors cursor-pointer hover:text-emerald-400 ${
                isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-emerald-50/90'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className={`transition-colors cursor-pointer hover:text-emerald-400 ${
                isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-emerald-50/90'
              }`}
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('trust')}
              className={`transition-colors cursor-pointer hover:text-emerald-400 ${
                isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-emerald-50/90'
              }`}
            >
              Trust & Safety
            </button>
          </nav>

          {/* CTA & Theme Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className={`p-2 rounded-xl transition-all ${
                isScrolled
                  ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Login button */}
            <button
              onClick={() => navigate('/login')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white border border-white/30 hover:bg-white/15 backdrop-blur-sm'
              }`}
            >
              Login
            </button>

            {/* Get Started button */}
            <button
              onClick={() => navigate('/signup')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer ${
                isScrolled
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 shadow-black/10'
              }`}
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className={`p-2 rounded-lg ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 pt-3 pb-6 shadow-xl"
            >
              <div className="flex flex-col gap-3 text-base font-medium">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('categories')}
                  className="text-left py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Causes & Categories
                </button>
                <button
                  onClick={() => scrollToSection('campaigns')}
                  className="text-left py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Featured Campaigns
                </button>
                <button
                  onClick={() => scrollToSection('impact')}
                  className="text-left py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Our Impact
                </button>
                <button
                  onClick={() => scrollToSection('trust')}
                  className="text-left py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Trust & Verification
                </button>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold text-center text-gray-800 dark:text-gray-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/signup');
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-center text-white shadow-md shadow-emerald-500/20"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center pt-28 pb-20 overflow-hidden bg-hero">
        {/* Subtle glowing ambient spheres */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-7 text-white"
            >
              {/* Trust pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-emerald-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Next-Gen Grassroots Mutual Aid & Giving</span>
                <span className="hidden sm:inline text-white/40">•</span>
                <span className="hidden sm:inline text-emerald-100">Zero Middlemen</span>
              </div>

              {/* Logo highlight */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400 flex items-center justify-center text-teal-950 font-black">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="w-4 h-4"
                    >
                      <path d="M18.178 8c5.096 0 5.096 8 0 8-3.058 0-4.587-4-6.178-4s-3.12 4-6.178 4c-5.096 0-5.096-8 0-8 3.058 0 4.587 4 6.178 4s3.12-4 6.178-4z" />
                    </svg>
                  </div>
                  <span className="font-extrabold tracking-tight text-white text-base">HelpLoop Impact Network</span>
                </div>
              </div>

              {/* Tagline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mb-6 drop-shadow-sm">
                Real People.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-100">
                  Real Help.
                </span>{' '}
                A Stronger Tomorrow.
              </h1>

              {/* Subtext */}
              <p className="text-lg sm:text-xl text-emerald-50/90 font-normal leading-relaxed max-w-2xl mb-8">
                Join a community that cares. Support verified grassroots emergencies, volunteer your time, and create
                verifiable real-world impact with complete transparency.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-7 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 active:bg-emerald-100 font-bold text-base rounded-2xl transition-all shadow-lg shadow-black/15 flex items-center gap-2 group cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-7 py-3.5 bg-transparent hover:bg-white/10 active:bg-white/15 text-white font-semibold text-base rounded-2xl border-2 border-white/80 transition-all cursor-pointer"
                >
                  Login
                </button>
              </div>

              {/* 3 small pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/15">
                <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Heart className="w-4 h-4 fill-emerald-300/30" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">12,400+</div>
                    <div className="text-xs text-emerald-200/80">People Helped</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">8,200+</div>
                    <div className="text-xs text-emerald-200/80">Volunteers</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">340+</div>
                    <div className="text-xs text-emerald-200/80">Communities</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Community-Themed Image + Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Back glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-3xl blur-2xl opacity-40 -z-10" />

                {/* Main Image Frame */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl bg-gray-900 aspect-[4/3.6] sm:aspect-[4/3.3]">
                  <img
                    src="https://images.unsplash.com/photo-1593113598489-96b6aa9cdeab?w=600&h=500&fit=crop"
                    alt="HelpLoop community members joining hands in mutual aid"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/20" />

                  {/* Overlaid Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                        Live Neighborhood Drive
                      </span>
                    </div>
                    <span className="text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      Mumbai Central Loop
                    </span>
                  </div>
                </div>

                {/* Floating Card 1: Verified badge & rapid donation */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -left-6 sm:-left-8 bg-white dark:bg-gray-900 rounded-2xl p-3.5 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 z-20 max-w-[240px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      100% Verified
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">Hospital bills & ground checked</div>
                  </div>
                </motion.div>

                {/* Floating Card 2: Live Progress Stat */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -right-4 sm:-right-6 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 z-20 w-64"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Food Security Drive</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">92% funded</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[92%] rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    <span>₹1,84,000 raised</span>
                    <span>142 helpers</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW IT WORKS (3 Steps)                                */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple, Direct, Transparent</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              How HelpLoop Works
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              We bridge the gap between people facing emergencies and everyday changemakers ready to lend support,
              backed by rigorous verification.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700/80 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-4xl font-black text-gray-200 dark:text-gray-700">01</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Discover Verified Needs</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                Explore local community initiatives, urgent healthcare appeals, and volunteer requests in your city.
                Every appeal is cross-checked with documented proof.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Geotagged & verified appeals</span>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700/80 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <HandHeart className="w-7 h-7" />
                </div>
                <span className="text-4xl font-black text-gray-200 dark:text-gray-700">02</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Donate or Volunteer</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                Contribute micro-donations directly with zero hidden cuts, or pledge volunteer hours to distribute food,
                teach children, or coordinate emergency response on ground.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <CheckCircle className="w-4 h-4" />
                <span>100% direct disbursement to vendors</span>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700/80 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <span className="text-4xl font-black text-gray-200 dark:text-gray-700">03</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Track Real Impact</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                Receive photo updates, digital hospital settlement receipts, and direct audio/video thank-yous from the
                beneficiaries whose lives were changed.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <CheckCircle className="w-4 h-4" />
                <span>Transparent public ledger & updates</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CATEGORIES SECTION (6 Grid Cards)                     */}
      {/* ======================================================== */}
      <section id="categories" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                Explore Causes
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Support What You Care About
              </h2>
            </div>
            <p className="mt-3 md:mt-0 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md">
              From emergency hospitalizations to grassroots rural schools, discover focused categories created by
              neighborhoods.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = activeCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => navigate('/signup')}
                  className={`group relative rounded-3xl p-6 border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900/80 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-card-hover'
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5">
                    {cat.name}
                  </h3>

                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                    {cat.count}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/signup');
                    }}
                    className="flex items-center text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Explore initiatives</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FEATURED CAMPAIGNS                                    */}
      {/* ======================================================== */}
      <section id="campaigns" className="py-24 bg-gray-50/70 dark:bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
                <FlameKindling className="w-3.5 h-3.5 text-rose-500" />
                <span>Urgent & High Impact</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Featured Verified Campaigns
              </h2>
            </div>
            <button
              onClick={() => navigate('/signup')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <span>View All 240+ Active Campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.map((camp) => {
              const progress = Math.min(100, Math.round((camp.raised / camp.goal) * 100));

              return (
                <div
                  key={camp.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-card hover:shadow-card-hover transition-all flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                      src={camp.image}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                        {camp.category}
                      </span>
                      {camp.urgent && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>4 Days Left</span>
                        </span>
                      )}
                    </div>

                    {/* Verified stamp at bottom */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified by HelpLoop Team</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Organizer info */}
                    <div className="flex items-center gap-2.5 mb-3 text-xs text-gray-500 dark:text-gray-400">
                      <img
                        src={camp.organizer.avatar}
                        alt={camp.organizer.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{camp.organizer.name}</span>
                      <span>•</span>
                      <span>{camp.organizer.location}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2 mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {camp.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mt-auto pt-2">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(camp.raised)}</span>
                        <span className="text-gray-400">of {formatCurrency(camp.goal)}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {/* Meta stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700/60 mb-4">
                        <span>{camp.donorsCount} supporters</span>
                        <span>{progress}% funded</span>
                      </div>

                      {/* Action button */}
                      <button
                        onClick={() => navigate('/signup')}
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Support Campaign</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom view all CTA */}
          <div className="mt-14 text-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore All Verified Grassroots Campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. IMPACT STATS SECTION                                  */}
      {/* ======================================================== */}
      <section
        id="impact"
        className="py-20 bg-gradient-to-r from-teal-950 via-emerald-950 to-teal-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-4 h-4" />
              <span>Real-Time Audited Milestones</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Impact That Speaks For Itself
            </h2>
            <p className="text-emerald-100/80 text-sm sm:text-base mt-2">
              Every single rupee and volunteer hour is accounted for and publicly verified.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {/* Stat 1 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-teal-200 mb-2">
                12,400+
              </div>
              <div className="text-sm sm:text-base font-bold text-white mb-1">People Helped</div>
              <div className="text-xs text-emerald-200/70">Lives directly supported</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-100 mb-2">
                ₹47L+
              </div>
              <div className="text-sm sm:text-base font-bold text-white mb-1">Funds Raised</div>
              <div className="text-xs text-emerald-200/70">Disbursed with 0% cut</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-teal-200 mb-2">
                8,200+
              </div>
              <div className="text-sm sm:text-base font-bold text-white mb-1">Volunteers</div>
              <div className="text-xs text-emerald-200/70">Active on the ground</div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-100 mb-2">
                340+
              </div>
              <div className="text-sm sm:text-base font-bold text-white mb-1">Communities</div>
              <div className="text-xs text-emerald-200/70">Neighborhoods united</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. TRUST & VERIFICATION SECTION                          */}
      {/* ======================================================== */}
      <section id="trust" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparency & Integrity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              How HelpLoop Ensures 100% Legitimacy
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              In a world flooded with unverified appeals, HelpLoop stands as a benchmark for rigorous, multi-layer trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="rounded-3xl p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Evidence-Based Verification
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                No campaign goes live without verified hospital estimate letters, doctor signatures, government IDs,
                and an on-ground volunteer physically validating the situation.
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Hospital bill cross-verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Govt KYC & Aadhaar / PAN authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Local volunteer ground visit</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                <Receipt className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Transparent Fundraising
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Funds are settled directly to medical institutions, schools, or verified vendors wherever possible.
                Every disbursement is backed by public receipts and real-time ledger entries.
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>Direct-to-hospital payments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>Public audit ledger & receipts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>0% platform commission fee</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Protected Privacy
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Beneficiary dignity is our highest priority. Sensitive personal data, child identities, and confidential
                medical histories are strictly encrypted with bank-grade standards.
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>End-to-end encrypted record vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Strict minor & vulnerable protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Zero marketing spam or data resale</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. WAYS TO HELP SECTION (4 Icon Cards)                   */}
      {/* ======================================================== */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Choose How You Want to Make a Difference
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Impact isn't only about money. Give your expertise, share your voice, or build community resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Donate */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200/70 dark:border-gray-700/80 hover:shadow-card-hover transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Donate</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                Make small recurring micro-pledges or fund specific medical and educational requests with 100%
                transparency.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Start Donating
              </button>
            </div>

            {/* 2. Volunteer */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200/70 dark:border-gray-700/80 hover:shadow-card-hover transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <HelpingHand className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Volunteer</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                Show up physically for relief efforts, blood donation drives, tree plantations, or remote student
                mentorship.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Join as Volunteer
              </button>
            </div>

            {/* 3. Share & Spread */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200/70 dark:border-gray-700/80 hover:shadow-card-hover transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Share & Spread</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                Amplify urgent requests to your social circles. One share often brings the crucial donor who saves a life.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Become an Advocate
              </button>
            </div>

            {/* 4. Join Communities */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200/70 dark:border-gray-700/80 hover:shadow-card-hover transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Join Communities</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                Connect with neighborhood-level mutual aid circles in your locality to coordinate disaster response.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Find Local Loops
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. CTA BANNER                                            */}
      {/* ======================================================== */}
      <section className="py-20 bg-white dark:bg-gray-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 p-8 sm:p-14 text-white shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Your Impact Journey</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-base sm:text-lg text-emerald-50/90 leading-relaxed mb-8">
                Join thousands of verified changemakers, doctors, volunteers, and neighbors collaborating to ensure no
                one is left behind.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white text-emerald-900 hover:bg-emerald-50 active:bg-emerald-100 font-bold text-base rounded-2xl shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-semibold text-base rounded-2xl border border-white/30 backdrop-blur-md transition-all cursor-pointer"
                >
                  Existing Member? Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. FOOTER                                               */}
      {/* ======================================================== */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 text-sm pt-16 pb-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Col 1 & 2: Brand and Tagline */}
            <div className="lg:col-span-2">
              <HelpLoopLogo
                iconSize="md"
                textClassName="text-white"
                textColor="text-white"
                badge="Social Impact"
              />
              <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
                Real People. Real Help. A Stronger Tomorrow. Building community-first grassroots resilience and direct
                mutual aid across India.
              </p>
              {/* Simulated Notice */}
              <div className="mt-5 p-3 rounded-xl bg-gray-800/80 border border-gray-700/80 text-xs text-amber-300/90 flex items-start gap-2.5 max-w-sm">
                <span className="text-base leading-none">⚠️</span>
                <span>
                  Demo notice: This platform uses simulated payments for demonstration purposes. No real financial
                  transactions are processed.
                </span>
              </div>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Platform</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('categories')}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Browse Causes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('campaigns')}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Featured Campaigns
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('impact')}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Impact Ledger
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/signup')}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Volunteer Registration
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust & Legal */}
            <div>
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Trust & Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => scrollToSection('trust')}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Verification System
                  </button>
                </li>
                <li>
                  <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Donor Protection Code
                  </span>
                </li>
                <li>
                  <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Security & Encryption
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 5: Contact & Connect */}
            <div>
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Connect</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li className="flex items-center gap-1.5">
                  <span className="text-gray-300 font-semibold">Email:</span>
                  <span>support@helploop.in</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-gray-300 font-semibold">Location:</span>
                  <span>Mumbai & Bengaluru, India</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-gray-300 font-semibold">Status:</span>
                  <span className="text-emerald-400 font-medium">All systems operational</span>
                </li>
              </ul>

              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Twitter / X"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <div>© 2024 HelpLoop Social Impact Platform. Built with care for communities everywhere.</div>
            <div className="flex items-center gap-6">
              <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
              <span>•</span>
              <span className="hover:text-gray-400 cursor-pointer">Terms</span>
              <span>•</span>
              <span className="hover:text-gray-400 cursor-pointer">Simulated Sandbox</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
