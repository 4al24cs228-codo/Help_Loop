import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, MapPin, Users, HeartHandshake, AlertCircle } from 'lucide-react';
import type { Campaign } from '../../types';
import type { ExtendedCampaign } from '../../data/demoData';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency, calculateProgress } from '../../lib/utils';
import { DonateModal } from './DonateModal';

export interface CampaignCardProps {
  campaign: Campaign | ExtendedCampaign;
  layout?: 'grid' | 'list';
  onDonate?: (campaign: Campaign | ExtendedCampaign) => void;
  onClick?: (campaign: Campaign | ExtendedCampaign) => void;
  className?: string;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  layout = 'grid',
  onDonate,
  onClick,
  className = '',
}) => {
  const isVerified = Boolean(campaign.isVerified ?? campaign.is_verified);
  const target = campaign.targetAmount ?? campaign.target_amount ?? 1;
  const raised = campaign.raisedAmount ?? campaign.raised_amount ?? 0;
  const supporters = campaign.supporterCount ?? campaign.supporter_count ?? 0;
  const progressPercent = calculateProgress(raised, target);

  // Derive days remaining
  const calcDaysRemaining = () => {
    if ('daysRemaining' in campaign && typeof campaign.daysRemaining === 'number') {
      return campaign.daysRemaining;
    }
    if (campaign.deadline) {
      const diffMs = new Date(campaign.deadline).getTime() - new Date().getTime();
      return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
    return 14;
  };
  const daysLeft = calcDaysRemaining();

  // Verification status details
  const renderVerificationBadge = () => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/95 text-white backdrop-blur-md shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified
        </span>
      );
    }
    if (campaign.status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-sm">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/95 text-white backdrop-blur-md shadow-sm">
        <AlertCircle className="w-3.5 h-3.5" />
        Under Review
      </span>
    );
  };

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'medical':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900';
      case 'education':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900';
      case 'food':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900';
      case 'disaster':
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
      case 'community':
      case 'volunteering':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900';
    }
  };

  const cover = campaign.coverImage || campaign.cover_image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?w=800';
  const organizerName = campaign.organizer?.name || 'HelpLoop Partner';
  const organizerAvatar = campaign.organizer?.avatar_url || campaign.organizer?.avatar;

  const navigate = useNavigate();
  const [showDonateModal, setShowDonateModal] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(campaign);
    } else {
      navigate(`/campaign/${campaign.id}`);
    }
  };

  const handleDonateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isVerified) return;
    if (onDonate) {
      onDonate(campaign);
    } else {
      setShowDonateModal(true);
    }
  };

  if (layout === 'list') {
    return (
      <>
        <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
        className={`group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col md:flex-row cursor-pointer ${className}`}
      >
        {/* Cover image */}
        <div className="relative w-full md:w-72 h-56 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={cover}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">{renderVerificationBadge()}</div>
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border backdrop-blur-md ${getCategoryColor(
                campaign.category
              )}`}
            >
              {campaign.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {campaign.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                {daysLeft > 0 ? `${daysLeft} days left` : 'Completed'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {campaign.title}
            </h3>

            {/* Organizer */}
            <div className="flex items-center gap-2 mt-3">
              <Avatar src={organizerAvatar} name={organizerName} size="xs" />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                by {organizerName}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <ProgressBar value={progressPercent} height="sm" />
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {formatCurrency(raised)}
                </span>
                <span className="text-gray-400 dark:text-gray-500">
                  {' '}
                  / {formatCurrency(target)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  {progressPercent}% raised
                </span>
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {supporters}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              disabled={!isVerified}
              onClick={handleDonateClick}
              leftIcon={<HeartHandshake className="w-4 h-4" />}
            >
              {isVerified ? 'Donate Now' : 'Verification Pending'}
            </Button>
          </div>
        </div>
      </motion.div>
      {showDonateModal && (
        <DonateModal
          isOpen={showDonateModal}
          onClose={() => setShowDonateModal(false)}
          campaign={campaign}
        />
      )}
    </>
  );
}

  // Grid Layout
  return (
    <>
      <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className={`group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden cursor-pointer ${className}`}
    >
      {/* Cover Image (300px height per spec) */}
      <div className="relative w-full h-[300px] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <img
          src={cover}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Verification badge on top left */}
        <div className="absolute top-3.5 left-3.5 z-10">{renderVerificationBadge()}</div>

        {/* Category tag on top right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border shadow-sm backdrop-blur-md ${getCategoryColor(
              campaign.category
            )}`}
          >
            {campaign.category}
          </span>
        </div>

        {/* Floating location and days remaining overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-white/90">
          <span className="inline-flex items-center gap-1 drop-shadow-sm font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {campaign.location}
          </span>
          <span className="inline-flex items-center gap-1 drop-shadow-sm bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {daysLeft > 0 ? `${daysLeft} days left` : 'Completed'}
          </span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Organizer */}
          <div className="flex items-center gap-2 mb-2.5">
            <Avatar src={organizerAvatar} name={organizerName} size="xs" />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              by <strong className="text-gray-800 dark:text-gray-200">{organizerName}</strong>
            </span>
          </div>

          {/* Title (2-line clamp) */}
          <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {campaign.title}
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          {/* Progress Bar */}
          <ProgressBar value={progressPercent} height="sm" />

          {/* Raised and Target amounts */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                {formatCurrency(raised)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {' '}
                raised of {formatCurrency(target)}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
              {progressPercent}% raised
            </span>
          </div>

          {/* Supporters count */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>
              <strong>{supporters}</strong> generous supporters
            </span>
          </div>

          {/* Full-width Donate button - disabled if not verified */}
          <Button
            variant="primary"
            fullWidth
            size="md"
            disabled={!isVerified}
            onClick={handleDonateClick}
            leftIcon={<HeartHandshake className="w-4 h-4" />}
            className="mt-2"
          >
            {isVerified ? 'Donate Now' : 'Verification Pending'}
          </Button>
        </div>
      </div>
    </motion.div>
    {showDonateModal && (
      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        campaign={campaign}
      />
    )}
  </>
);
};

export default CampaignCard;
