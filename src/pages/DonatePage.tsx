import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  GraduationCap,
  Utensils,
  AlertTriangle,
  Package,
  Users,
  Search,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  Share2,
} from 'lucide-react';

import { DONATE_CATEGORIES, type CategoryMetadata } from '../data/demoData';
import { AppLayout } from '../components/layout';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { CampaignCard } from '../components/campaign/CampaignCard';
import { DemoReceipt, type ReceiptData } from '../components/campaign/DemoReceipt';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatINR, generateDemoTransactionId } from '../lib/utils';
import type { ExtendedCampaign } from '../data/demoData';
import toast from 'react-hot-toast';

export const DonatePage: React.FC = () => {
  const navigate = useNavigate();
  const { campaigns, updateCampaignTotal, addGoodnessPoints, addDemoTransaction } = useAppStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<ExtendedCampaign | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isSubmittingDonation, setIsSubmittingDonation] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Icon mapping as required by specs
  const renderCategoryIcon = (iconName: CategoryMetadata['iconName'], className = 'w-7 h-7 text-white') => {
    switch (iconName) {
      case 'Heart':
        return <Heart className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Utensils':
        return <Utensils className={className} />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      case 'Package':
        return <Package className={className} />;
      case 'Users':
        return <Users className={className} />;
      default:
        return <Heart className={className} />;
    }
  };

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DONATE_CATEGORIES;
    return DONATE_CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.subtitle.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Featured 3 campaigns from useAppStore
  const featuredCampaigns = useMemo(() => {
    return campaigns.slice(0, 3);
  }, [campaigns]);

  // Total active campaigns count across categories
  const totalActiveDrives = useMemo(() => {
    return DONATE_CATEGORIES.reduce((acc, cat) => acc + cat.activeCount, 0);
  }, []);

  const handleOpenDonateModal = (campaign: ExtendedCampaign) => {
    setSelectedCampaignForDonation(campaign);
    setDonationAmount(500);
    setCustomAmount('');
    setDonorMessage('');
    setIsAnonymous(false);
  };

  const handleConfirmDemoDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignForDonation) return;

    const finalAmount = customAmount ? parseFloat(customAmount) : donationAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    setIsSubmittingDonation(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const earnedPoints = Math.max(25, Math.floor(finalAmount / 10));
    const txId = generateDemoTransactionId();

    // 1. Update campaign total in store
    updateCampaignTotal(selectedCampaignForDonation.id, finalAmount);

    // 2. Add goodness points
    addGoodnessPoints(earnedPoints);

    // 3. Add demo transaction
    const newTx = {
      id: txId,
      amount: finalAmount,
      currency: 'INR',
      type: 'donation' as const,
      status: 'successful' as const,
      recipientType: 'campaign' as const,
      recipientId: selectedCampaignForDonation.id,
      recipientName: selectedCampaignForDonation.title,
      donorName: isAnonymous ? 'Anonymous Donor' : user?.name || 'Elena Rostova',
      paymentMethod,
      transactionRef: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      isDemo: true,
      message: donorMessage || 'Sending heartfelt prayers and support!',
      created_at: new Date().toISOString(),
      goodnessPointsEarned: earnedPoints,
    };
    addDemoTransaction(newTx);

    setIsSubmittingDonation(false);
    setSelectedCampaignForDonation(null);

    // Prepare receipt
    const receipt: ReceiptData = {
      transactionId: txId,
      amount: finalAmount,
      campaignTitle: selectedCampaignForDonation.title,
      campaignId: selectedCampaignForDonation.id,
      donorName: isAnonymous ? 'Anonymous' : user?.name || 'Elena Rostova',
      isAnonymous,
      paymentMethod: `${paymentMethod} (Demo Gateway)`,
      date: new Date().toISOString(),
      goodnessPointsEarned: earnedPoints,
      message: donorMessage || 'Warmest wishes and blessings for full recovery.',
    };
    setActiveReceipt(receipt);
    setIsReceiptOpen(true);

    toast.success(
      `🎉 Demo donation of ${formatINR(finalAmount)} successful! +${earnedPoints} Goodness Points earned!`,
      { duration: 4000 }
    );
  };

  return (
    <AppLayout containerClassName="max-w-6xl">
      {/* 1. DEMO MODE BANNER (Yellow banner at top) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-700/60 shadow-sm flex items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                DEMO MODE — No real money will be transferred
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700">
                Simulation Active
              </span>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              All transactions, tax receipts, and impact points are simulated for hackathon demonstration. Explore, test donations, and experience HelpLoop risk-free!
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. PAGE HEADER with Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Verified Grassroots Giving
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Donate & Help
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
            Choose a verified cause you believe in. 100% of community contributions go directly toward authenticated hospital bills, learning kits, and relief supplies.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full md:w-80 relative flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search causes, categories..."
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. IMPACT STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-gray-800/90 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {totalActiveDrives}+
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Campaigns Active
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-gray-800/90 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              28,500+
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              People Helped
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-gray-800/90 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              54+
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Verified NGOs
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-gray-800/90 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              100%
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Direct Impact (₹0 Fee)
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. CATEGORY GRID (6 Categories) */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Browse by Cause Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Select any category to explore campaigns, field verification summaries & direct giving options.
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
            Showing {filteredCategories.length} categories
          </span>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="py-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No categories match "{searchQuery}"
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              Try searching for "medical", "education", "food", "disaster", or "volunteering".
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((category, index) => {
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  onClick={() => navigate(`/donate/${category.slug}`)}
                  className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer overflow-hidden"
                >
                  {/* Subtle decorative glow circle in corner */}
                  <div
                    className={`absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl pointer-events-none`}
                  />

                  <div>
                    {/* Top Row: Icon + Active Count */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {renderCategoryIcon(category.iconName, 'w-7 h-7 text-white')}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700">
                        {category.activeCount} Active
                      </span>
                    </div>

                    {/* Name & Subtitle */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {category.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Bottom Row: Browse Button */}
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Explore initiatives
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/donate/${category.slug}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-gray-950 transition-all shadow-sm"
                    >
                      <span>Browse</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. FEATURED / RECOMMENDED CAMPAIGNS SECTION (3 campaigns from useAppStore) */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 mb-1.5">
              <Heart className="w-3 h-3 fill-rose-500" />
              Verified Urgent Needs
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured & Urgent Campaigns
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              High-priority appeals reviewed and authenticated on-ground by HelpLoop volunteers.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/donate/medical')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All Campaigns
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCampaigns.map((camp) => (
            <CampaignCard
              key={camp.id}
              campaign={camp}
              layout="grid"
              onClick={() => navigate(`/campaign/${camp.id}`)}
              onDonate={() => handleOpenDonateModal(camp)}
            />
          ))}
        </div>
      </section>

      {/* 6. SIMULATED QUICK DONATION MODAL */}
      <Modal
        isOpen={Boolean(selectedCampaignForDonation)}
        onClose={() => setSelectedCampaignForDonation(null)}
        title="Simulated Demo Donation"
        description="Test the donation flow. No real funds or banking transactions occur."
        size="md"
      >
        {selectedCampaignForDonation && (
          <form onSubmit={handleConfirmDemoDonation} className="space-y-4">
            {/* Target Campaign Info Preview */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 flex items-center gap-3">
              <img
                src={selectedCampaignForDonation.coverImage || selectedCampaignForDonation.cover_image}
                alt={selectedCampaignForDonation.title}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 capitalize mb-0.5">
                  {selectedCampaignForDonation.category}
                </span>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                  {selectedCampaignForDonation.title}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Beneficiary: {selectedCampaignForDonation.beneficiaryName || 'Verified Recipient'}
                </p>
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Choose Amount (INR)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[250, 500, 1000, 2500].map((amt) => {
                  const isSelected = !customAmount && donationAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setDonationAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  );
                })}
              </div>

              {/* Custom amount input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="50"
                  max="1000000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Or enter custom amount (e.g. 1500)"
                  className="w-full pl-8 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Payment Method Selector (Demo) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Simulated Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { id: 'Card', label: 'Debit/Credit', icon: <CreditCard className="w-3.5 h-3.5" /> },
                  { id: 'NetBanking', label: 'NetBanking', icon: <Building2 className="w-3.5 h-3.5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      paymentMethod === item.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message / Prayer of encouragement */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Words of Encouragement (Optional)
              </label>
              <input
                type="text"
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="e.g., Praying for speedy recovery! Stay resilient!"
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="anonymous-check"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
              <label
                htmlFor="anonymous-check"
                className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none"
              >
                Donate anonymously (hide my name on public donor list)
              </label>
            </div>

            {/* Goodness Points preview */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Goodness Points you will earn:</span>
              </div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-md shadow-sm border border-emerald-200 dark:border-emerald-700">
                +{Math.max(25, Math.floor((customAmount ? parseFloat(customAmount) || 0 : donationAmount) / 10))} pts
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCampaignForDonation(null)}
                disabled={isSubmittingDonation}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmittingDonation}
                leftIcon={<Heart className="w-4 h-4 fill-white" />}
              >
                Confirm Demo Donation of {formatINR(customAmount ? parseFloat(customAmount) || 0 : donationAmount)}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 7. OFFICIAL DEMO RECEIPT MODAL */}
      <DemoReceipt
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={activeReceipt}
      />
    </AppLayout>
  );
};

export default DonatePage;
