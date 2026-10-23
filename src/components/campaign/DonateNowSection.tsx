import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react';
import type { ExtendedCampaign } from '../../data/demoData';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency, formatINR, calculateProgress } from '../../lib/utils';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { DonateModal } from './DonateModal';

export interface DonateNowSectionProps {
  className?: string;
  onCampaignClick?: (campaign: ExtendedCampaign) => void;
}

export const DonateNowSection: React.FC<DonateNowSectionProps> = ({
  className = '',
  onCampaignClick,
}) => {
  const navigate = useNavigate();
  const { campaigns } = useAppStore();

  // Selected campaign for the full donation modal
  const [activeDonationCampaign, setActiveDonationCampaign] = useState<ExtendedCampaign | null>(null);
  const [selectedInitialAmount, setSelectedInitialAmount] = useState<number>(50);

  // Per-card selected quick amount state { [campaignId]: amount | 'custom' }
  const [cardAmounts, setCardAmounts] = useState<Record<string, number>>({});
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});

  // Featured campaigns for the 4 primary categories: Medical Assistance, Education Support, Food & Essentials, Disaster Relief
  const targetCategories = [
    { key: 'medical', label: 'Medical Assistance' },
    { key: 'education', label: 'Education Support' },
    { key: 'food', label: 'Food & Essentials' },
    { key: 'disaster', label: 'Disaster Relief' },
  ];

  const featuredCampaigns: ExtendedCampaign[] = targetCategories
    .map(({ key }) => {
      return campaigns.find(
        (c) =>
          c.category?.toLowerCase() === key.toLowerCase() ||
          c.category?.toLowerCase().includes(key.toLowerCase())
      );
    })
    .filter(Boolean) as ExtendedCampaign[];

  // Fallback to top 4 campaigns if specific categories not fully matched
  const displayCampaigns =
    featuredCampaigns.length >= 4 ? featuredCampaigns : campaigns.slice(0, 4);

  const handleQuickAmountClick = (campaignId: string, amount: number) => {
    setCardAmounts((prev) => ({ ...prev, [campaignId]: amount }));
    setCustomAmounts((prev) => ({ ...prev, [campaignId]: '' }));
  };

  const handleCustomAmountChange = (campaignId: string, value: string) => {
    setCustomAmounts((prev) => ({ ...prev, [campaignId]: value }));
  };

  const handleDonateNowClick = (campaign: ExtendedCampaign) => {
    const custom = customAmounts[campaign.id];
    const quick = cardAmounts[campaign.id] || 50;
    const finalAmount = custom && parseFloat(custom) > 0 ? parseFloat(custom) : quick;

    setSelectedInitialAmount(finalAmount);
    setActiveDonationCampaign(campaign);
  };

  return (
    <section className={`py-6 space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200 dark:border-emerald-800">
            <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />
            <span>Donate Now</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Make a Difference Today
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Every contribution, no matter how small, can help someone in need.
          </p>
        </div>

        {/* Prominent Demo Notice Tag */}
        <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 self-start md:self-auto">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>DEMO MODE — NO REAL MONEY WILL BE TRANSFERRED.</span>
        </div>
      </div>

      {/* Grid of 4 Featured Category Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayCampaigns.map((camp) => {
          const isVerified = Boolean(camp.isVerified ?? camp.is_verified);
          const target = camp.targetAmount ?? camp.target_amount ?? 1;
          const raised = camp.raisedAmount ?? camp.raised_amount ?? 0;
          const progressPercent = calculateProgress(raised, target);
          const cover =
            camp.coverImage ||
            camp.cover_image ||
            camp.imageUrl ||
            'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?w=800';

          const activeAmount = cardAmounts[camp.id] ?? 50;
          const customVal = customAmounts[camp.id] ?? '';

          return (
            <motion.div
              key={camp.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div
                  onClick={() => {
                    if (onCampaignClick) onCampaignClick(camp);
                    else navigate(`/campaign/${camp.id}`);
                  }}
                  className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group"
                >
                  <img
                    src={cover}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 shadow-sm backdrop-blur-md">
                      {camp.category}
                    </span>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm backdrop-blur-md">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm backdrop-blur-md">
                        <AlertCircle className="w-3.5 h-3.5" /> Under Review
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Stats */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow-md z-10">
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      {camp.supporterCount || camp.supporter_count || 120} supporters
                    </span>
                    <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {camp.daysRemaining || camp.daysLeft || 12} days left
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3.5">
                  <h3
                    onClick={() => {
                      if (onCampaignClick) onCampaignClick(camp);
                      else navigate(`/campaign/${camp.id}`);
                    }}
                    className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {camp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>

                  {/* Progress Bar & Amounts */}
                  <div className="space-y-1.5 pt-1">
                    <ProgressBar value={progressPercent} height="sm" />
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                          {formatCurrency(raised)}
                        </span>
                        <span className="text-gray-400"> of {formatCurrency(target)}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Donation Actions */}
              <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="pt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Quick Amount
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Simulated INR
                    </span>
                  </div>

                  {/* Quick donation amounts: ₹10, ₹20, ₹50, ₹100 */}
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {[10, 20, 50, 100].map((amt) => {
                      const isSelected = !customVal && activeAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleQuickAmountClick(camp.id, amt)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                          }`}
                        >
                          {formatINR(amt)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount option */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="10"
                      placeholder="Custom amount (e.g. ₹250)"
                      value={customVal}
                      onChange={(e) => handleCustomAmountChange(camp.id, e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Emerald-green Donate Now Button */}
                <button
                  type="button"
                  disabled={!isVerified}
                  onClick={() => handleDonateNowClick(camp)}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isVerified
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20 active:scale-[0.99]'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>
                    {isVerified
                      ? `Donate Now (${formatINR(customVal ? parseFloat(customVal) || 0 : activeAmount)})`
                      : 'Verification Pending — Donations Disabled'}
                  </span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Shared Donation Modal */}
      <DonateModal
        isOpen={Boolean(activeDonationCampaign)}
        onClose={() => setActiveDonationCampaign(null)}
        campaign={activeDonationCampaign}
        initialAmount={selectedInitialAmount}
      />
    </section>
  );
};

export default DonateNowSection;
