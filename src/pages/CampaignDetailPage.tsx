import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  Users,
  MapPin,
  Heart,
  Share2,
  Bookmark,
  Flag,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Building2,
  Smartphone,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Send,
  FileCheck2,
  Calendar,
  Lock,
  ChevronRight,
  Info,
  HelpCircle,
  AlertTriangle,
  Receipt,
  ThumbsUp,
} from 'lucide-react';

import { AppLayout } from '../components/layout';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { DemoReceipt, type ReceiptData } from '../components/campaign/DemoReceipt';
import { CampaignCard } from '../components/campaign/CampaignCard';
import {
  generateDemoTransactionId,
  formatINR,
  calcProgress,
  timeAgo,
  cn,
} from '../lib/utils';
import { DEMO_COMMENTS, type ExtendedCampaign } from '../data/demoData';
import type { Comment, DemoTransaction } from '../types';
import toast from 'react-hot-toast';

const PRESET_AMOUNTS = [10, 20, 50, 100];

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Stores
  const { campaigns, addDemoTransaction, addGoodnessPoints, updateCampaignTotal } = useAppStore();
  const { user } = useAuthStore();

  // Find active campaign
  const campaign = campaigns.find((c) => c.id === id);

  // Gallery state
  const [activeImage, setActiveImage] = useState<string>('');

  // Right panel quick donate & bookmark & share states
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number>(500);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('misleading');
  const [reportDetails, setReportDetails] = useState<string>('');

  // Donation Modal State
  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);
  const [donationStep, setDonationStep] = useState<1 | 2 | 3>(1);
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customAmountText, setCustomAmountText] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isPublicDonor, setIsPublicDonor] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [selectedBank, setSelectedBank] = useState<string>('State Bank of India');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Post-donation Receipt & Transaction State
  const [lastReceiptData, setLastReceiptData] = useState<ReceiptData | null>(null);
  const [lastTransactionId, setLastTransactionId] = useState<string>('');
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Local comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  // Initialize campaign media and comments
  useEffect(() => {
    if (campaign) {
      const cover = campaign.coverImage || campaign.cover_image || '';
      setActiveImage(cover);

      // Filter demo comments or provide meaningful seed comments
      const matched = DEMO_COMMENTS.filter(
        (c) => (c as any).postId === campaign.id || (c as any).post_id === campaign.id
      );

      if (matched.length > 0) {
        setComments(matched);
      } else {
        // Fallback default comments for campaigns without static comments in demoData
        setComments([
          {
            id: `comm-seed-1-${campaign.id}`,
            postId: campaign.id,
            author: {
              id: 'usr-s1',
              name: 'Dr. Ramesh Kulkarni',
              username: 'ramesh_k',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              isVerified: true,
              isImpactPatron: true,
              goodnessPoints: 1450,
            },
            content: 'Incredible initiative. Just made a contribution and shared with my university department colleagues.',
            likesCount: 12,
            isLiked: false,
            timestamp: '1 day ago',
          },
          {
            id: `comm-seed-2-${campaign.id}`,
            postId: campaign.id,
            author: {
              id: 'usr-s2',
              name: 'Ananya Roy',
              username: 'ananya_r',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
              isVerified: true,
              isImpactPatron: false,
              goodnessPoints: 620,
            },
            content: 'Transparent fund breakdown makes it so easy to trust. Standing with you all the way!',
            likesCount: 7,
            isLiked: true,
            timestamp: '5 hours ago',
          },
        ]);
      }
    }
  }, [campaign?.id]);

  // Handle 404 Campaign Not Found
  if (!campaign) {
    return (
      <AppLayout>
        <div className="py-16 px-4 text-center max-w-xl mx-auto space-y-5">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Campaign Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            The fundraising campaign you are looking for may have been completed, closed, or the
            link might be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              variant="primary"
              onClick={() => navigate('/donate')}
              leftIcon={<Heart className="w-4 h-4" />}
            >
              Explore Verified Causes
            </Button>
            <Button variant="outline" onClick={() => navigate('/home')}>
              Back to Home Feed
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Calculated values
  const isVerified = Boolean(campaign.isVerified ?? campaign.is_verified);
  const target = campaign.targetAmount ?? campaign.target_amount ?? 1;
  const raised = campaign.raisedAmount ?? campaign.raised_amount ?? 0;
  const supporters = campaign.supporterCount ?? campaign.supporter_count ?? 0;
  const progressPercent = calcProgress(raised, target);

  const daysLeft =
    typeof campaign.daysRemaining === 'number'
      ? campaign.daysRemaining
      : campaign.daysLeft ?? 14;

  const cover =
    activeImage ||
    campaign.coverImage ||
    campaign.cover_image ||
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?w=1200';

  const galleryImages = [
    campaign.coverImage || campaign.cover_image,
    ...(campaign.galleryImages || []),
  ].filter(Boolean) as string[];

  const organizerName = campaign.organizer?.name || 'HelpLoop Foundation';
  const organizerAvatar =
    campaign.organizer?.avatarUrl ||
    campaign.organizer?.avatar;
  const organizerBio =
    campaign.organizer?.bio ||
    'Dedicated social impact partner verified by HelpLoop Trust Committee.';

  // Related campaigns from same category
  const relatedCampaigns = campaigns
    .filter((c) => c.id !== campaign.id && c.category === campaign.category)
    .slice(0, 3);

  // If no same-category campaigns, fallback to other active campaigns
  const displayRelated =
    relatedCampaigns.length > 0
      ? relatedCampaigns
      : campaigns.filter((c) => c.id !== campaign.id).slice(0, 3);

  // Quick Amount Select Handlers
  const handleOpenDonateModal = (amount?: number) => {
    const amt = amount || selectedQuickAmount;
    setDonationAmount(amt);
    setIsCustomAmount(!PRESET_AMOUNTS.includes(amt));
    if (!PRESET_AMOUNTS.includes(amt)) {
      setCustomAmountText(amt.toString());
    }
    setDonationStep(1);
    setIsDonationModalOpen(true);
  };

  // Step 1: Continue to Payment Validation
  const handleProceedToPayment = () => {
    let finalAmount = donationAmount;
    if (isCustomAmount) {
      const parsed = parseFloat(customAmountText);
      if (isNaN(parsed)) {
        toast.error('Please enter a valid donation amount.');
        return;
      }
      finalAmount = parsed;
    }

    if (finalAmount < 10) {
      toast.error('Minimum donation amount is ₹10.');
      return;
    }

    if (finalAmount > 100000) {
      toast.error('Maximum donation limit per transaction is ₹1,00,000 in demo mode.');
      return;
    }

    setDonationAmount(finalAmount);
    setDonationStep(2);
  };

  // Step 2: Simulated Payment Processing
  const handleProcessPayment = () => {
    if (isProcessingPayment) return; // Prevent duplicate submission

    setIsProcessingPayment(true);

    setTimeout(() => {
      const txId = generateDemoTransactionId();
      // Points formula: 10% of donation amount, min 10 points
      const points = Math.max(10, Math.floor(donationAmount * 0.1));

      // Record demo transaction
      const newTransaction: DemoTransaction = {
        id: txId,
        amount: donationAmount,
        currency: 'INR',
        type: 'donation',
        status: 'successful',
        recipientType: 'campaign',
        recipientId: campaign.id,
        recipientName: campaign.title,
        donorName: isPublicDonor ? user?.name || 'Elena Rostova' : 'Anonymous Supporter',
        paymentMethod: `Demo ${paymentMethod}`,
        transactionRef: txId,
        isDemo: true,
        message: donorMessage.trim() || undefined,
        created_at: new Date().toISOString(),
        goodnessPointsEarned: points,
      };

      // Prepare receipt data
      const receipt: ReceiptData = {
        transactionId: txId,
        amount: donationAmount,
        campaignTitle: campaign.title,
        campaignId: campaign.id,
        donorName: isPublicDonor ? user?.name || 'Elena Rostova' : 'Anonymous Supporter',
        isAnonymous: !isPublicDonor,
        paymentMethod: `Demo ${paymentMethod}`,
        date: new Date().toISOString(),
        goodnessPointsEarned: points,
        message: donorMessage.trim() || undefined,
      };

      // Update Zustand App Store in real-time
      addDemoTransaction(newTransaction);
      updateCampaignTotal(campaign.id, donationAmount);
      addGoodnessPoints(points);

      // Save local states
      setLastReceiptData(receipt);
      setLastTransactionId(txId);
      setEarnedPoints(points);
      setIsProcessingPayment(false);
      setDonationStep(3);

      toast.success(`Demo contribution of ${formatINR(donationAmount)} recorded!`);
    }, 2000);
  };

  // Close Donation Modal
  const handleCloseDonationModal = () => {
    setIsDonationModalOpen(false);
    setIsProcessingPayment(false);
    setDonationStep(1);
    setDonorMessage('');
  };

  // Share handlers
  const handleShareWhatsApp = () => {
    const text = `Help support this verified cause on HelpLoop: "${campaign.title}". Together we can make a difference! ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Support this verified cause on @HelpLoop: "${campaign.title}". Every rupee creates impact!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
        window.location.href
      )}`,
      '_blank'
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast.success('Campaign link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success('Campaign saved to your bookmarks!');
    } else {
      toast('Campaign removed from your bookmarks.', { icon: '🔖' });
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportModalOpen(false);
    setReportDetails('');
    toast.success('Thank you. Campaign report received by HelpLoop Moderation.');
  };

  // Comments handlers
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newCommentText.trim();
    if (!text) return;

    setIsSubmittingComment(true);
    setTimeout(() => {
      const newComment: Comment = {
        id: `comm-user-${Date.now()}`,
        postId: campaign.id,
        author: {
          id: user?.id || 'usr-current',
          name: user?.name || 'Elena Rostova',
          username: user?.username || 'elenarostova',
          avatar: user?.avatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          isVerified: user?.isVerified ?? true,
          isImpactPatron: true,
          goodnessPoints: (user?.goodnessPoints || 340) + 10,
        },
        content: text,
        likesCount: 0,
        isLiked: false,
        timestamp: 'just now',
      };

      setComments([newComment, ...comments]);
      setNewCommentText('');
      setIsSubmittingComment(false);
      toast.success('Your comment was published!');
    }, 400);
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const wasLiked = c.isLiked;
          const currentLikes = c.likesCount ?? 0;
          return {
            ...c,
            isLiked: !wasLiked,
            likesCount: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <AppLayout containerClassName="max-w-6xl w-full">
      <div className="space-y-6 pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              to="/donate"
              className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Causes
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
            <span className="capitalize font-medium text-gray-600 dark:text-gray-300">
              {campaign.category}
            </span>
            <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
            <span className="truncate max-w-[200px] sm:max-w-xs text-gray-800 dark:text-gray-200 font-semibold">
              {campaign.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={cn(
                'p-2 rounded-xl border transition-colors flex items-center gap-1.5',
                isBookmarked
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              )}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark this campaign'}
            >
              <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
              <span className="hidden sm:inline text-xs font-semibold">
                {isBookmarked ? 'Saved' : 'Save'}
              </span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 hover:text-rose-500 hover:border-rose-300 transition-colors"
              title="Report campaign"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left/Main Details + Right Sticky Donation Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT / MAIN COLUMN (7 cols on lg, 8 cols on xl) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* 1. Cover Image & Gallery Section */}
            <div className="space-y-3">
              <div className="relative w-full h-[320px] sm:h-[420px] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                <img
                  src={cover}
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Verification Badge (Top Left) */}
                <div className="absolute top-4 left-4 z-10">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/95 text-white backdrop-blur-md shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                      Verified Cause
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/95 text-white backdrop-blur-md shadow-md">
                      <AlertCircle className="w-4 h-4" />
                      Verification Pending
                    </span>
                  )}
                </div>

                {/* Category Badge (Top Right) */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold capitalize bg-black/50 backdrop-blur-md text-white border border-white/20 shadow-md">
                    {campaign.category}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                  <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {campaign.location}
                  </span>

                  {campaign.taxExempt && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 backdrop-blur-md px-3 py-1 rounded-full font-semibold">
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      80G Tax Exemption Available
                    </span>
                  )}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={cn(
                        'relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all',
                        activeImage === imgUrl
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      )}
                    >
                      <img
                        src={imgUrl}
                        alt={`Preview thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Campaign Header & Title */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                {campaign.title}
              </h1>

              {campaign.beneficiaryName && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60 inline-flex">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Direct Beneficiary: {campaign.beneficiaryName}</span>
                </div>
              )}

              {/* Organizer Profile Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xs gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={organizerAvatar}
                    name={organizerName}
                    size="lg"
                    isOnline
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {organizerName}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {organizerBio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                  <Badge variant="success" size="sm">
                    Verified Organizer
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast('Direct messaging with organizer opened in demo mode.', { icon: '💬' })}
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>

            {/* 3. Mobile / Tablet Prominent Progress Bar (Visible on < lg screens) */}
            <div className="block lg:hidden bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="space-y-0.5">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      {formatINR(raised)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      raised of {formatINR(target)} goal
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {progressPercent}%
                  </span>
                </div>
                <ProgressBar value={progressPercent} height="md" color="emerald" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="font-extrabold text-base text-gray-900 dark:text-white">
                    {supporters}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-emerald-500" /> Supporters
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="font-extrabold text-base text-gray-900 dark:text-white">
                    {daysLeft > 0 ? daysLeft : 0}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Days Left
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                disabled={!isVerified}
                onClick={() => handleOpenDonateModal()}
                leftIcon={<Heart className="w-4 h-4 fill-white" />}
              >
                {isVerified ? 'Donate Now' : 'Verification Pending'}
              </Button>
            </div>

            {/* 4. Full Story & Description */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>The Story & Mission</span>
                </h2>
                <div className="h-1 w-12 bg-emerald-500 rounded-full mt-2" />
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p className="font-medium text-base text-gray-900 dark:text-gray-100 leading-relaxed">
                  {campaign.description}
                </p>

                {campaign.story ? (
                  campaign.story.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>
                    Every contribution will be immediately deployed in accordance with verified
                    institutional invoices and reviewed under HelpLoop's open audit mandate.
                  </p>
                )}
              </div>
            </div>

            {/* 5. Intended Use of Funds */}
            {campaign.intendedUse && campaign.intendedUse.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Intended Use of Funds
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      100% itemized and validated against partner vendor & hospital quotes
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    Verified Quotes
                  </Badge>
                </div>

                <div className="space-y-3 pt-2">
                  {campaign.intendedUse.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-snug">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Evidence & Trust Verification Summary */}
            {campaign.evidenceSummary && (
              <div className="bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        HelpLoop Trust & Verification Audit
                      </h2>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Audited by HelpLoop Field Officers • Verified on{' '}
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {campaign.evidenceSummary.verifiedDate}
                      </span>
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                    Audited Pass
                  </span>
                </div>

                {/* Checklist Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0',
                        campaign.evidenceSummary.hospitalContactVerified
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400'
                      )}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-900 dark:text-white">Hospital/Partner</p>
                      <p className="text-gray-500 dark:text-gray-400">Registry Confirmed</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0',
                        campaign.evidenceSummary.documentsAuthentic
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400'
                      )}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-900 dark:text-white">Documents</p>
                      <p className="text-gray-500 dark:text-gray-400">Authentic & Tested</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0',
                        campaign.evidenceSummary.beneficiaryReached
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400'
                      )}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-900 dark:text-white">Beneficiary</p>
                      <p className="text-gray-500 dark:text-gray-400">Identity Reached</p>
                    </div>
                  </div>
                </div>

                {/* Reviewer Notes Callout */}
                {campaign.evidenceSummary.reviewerNotes && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1.5">
                    <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Verification Committee Review Note:
                    </p>
                    <p className="text-emerald-800 dark:text-emerald-200/90 leading-relaxed">
                      {campaign.evidenceSummary.reviewerNotes}
                    </p>
                  </div>
                )}

                {/* Inspected Documents List */}
                {campaign.evidenceSummary.documentsList &&
                  campaign.evidenceSummary.documentsList.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Inspected Verification Documents
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {campaign.evidenceSummary.documentsList.map((doc, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-2xs"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* 7. Campaign Updates Timeline */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Campaign Updates & Milestones
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Direct on-ground progress logs from the campaign organizer
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {campaign.updates?.length || 0} updates
                </span>
              </div>

              {campaign.updates && campaign.updates.length > 0 ? (
                <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-3 pt-2">
                  {campaign.updates.map((update: any, idx: number) => (
                    <div key={update.id || idx} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-gray-900" />

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                            {timeAgo(update.created_at)}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                            Official Update #{campaign.updates!.length - idx}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          {update.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {update.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs">
                  No public updates logged yet. Check back soon!
                </div>
              )}
            </div>

            {/* 8. Community Comments & Encouragement Section */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                    Words of Support & Blessings
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Join the community in uplifting the beneficiary and organizer
                  </p>
                </div>
                <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">
                  {comments.length} comments
                </span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-3">
                <Avatar
                  src={user?.avatarUrl || user?.avatar}
                  name={user?.name || 'Elena'}
                  size="sm"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Leave a heartfelt message of encouragement..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-gray-400"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!newCommentText.trim() || isSubmittingComment}
                    isLoading={isSubmittingComment}
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Post
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4 pt-2">
                {comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 transition-all"
                  >
                    <Avatar
                      src={comm.author.avatar || (comm.author as any).avatar_url}
                      name={comm.author.name}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {comm.author.name}
                          </span>
                          {comm.author.isVerified && (
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold px-1.5 py-0.2 rounded-md">
                              ✓ Supporter
                            </span>
                          )}
                          <span className="text-[11px] text-gray-400">
                            • {comm.timestamp || timeAgo((comm as any).created_at || new Date().toISOString())}
                          </span>
                        </div>

                        {/* Like Comment Button */}
                        <button
                          onClick={() => handleLikeComment(comm.id)}
                          className={cn(
                            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors',
                            comm.isLiked
                              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                          )}
                          title="Like comment"
                        >
                          <ThumbsUp className={cn('w-3.5 h-3.5', comm.isLiked && 'fill-current')} />
                          <span>{comm.likesCount}</span>
                        </button>
                      </div>

                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comm.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. Related Campaigns Carousel / Grid */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Related Causes in {campaign.category}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Other community verified requests seeking compassionate support
                  </p>
                </div>
                <Link
                  to="/donate"
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {displayRelated.map((rel) => (
                  <CampaignCard
                    key={rel.id}
                    campaign={rel}
                    layout="grid"
                    onClick={(c) => navigate(`/campaign/${c.id}`)}
                    onDonate={(c) => navigate(`/campaign/${c.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL (Sticky Desktop Widget - 5 cols lg, 4 cols xl) ================= */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-6">
            {/* Main Donation Action Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/20 shadow-xl space-y-6 relative overflow-hidden">
              {/* Subtle glowing corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Progress Summary Header */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="space-y-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {formatINR(raised)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">
                      raised of {formatINR(target)} goal
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {progressPercent}%
                  </span>
                </div>

                <ProgressBar value={progressPercent} height="md" color="emerald" />

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <strong>{supporters}</strong> supporters
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Completed'}
                  </span>
                </div>
              </div>

              {/* Amount Selection Chips */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Select Donation Amount
                </label>

                <div className="grid grid-cols-5 gap-1.5">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = !isCustomAmount && selectedQuickAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedQuickAmount(amt);
                          setIsCustomAmount(false);
                        }}
                        className={cn(
                          'py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all text-center',
                          isSelected
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                        )}
                      >
                        ₹{amt}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomAmount(true);
                      setCustomAmountText(selectedQuickAmount.toString());
                    }}
                    className={cn(
                      'py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all text-center',
                      isCustomAmount
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                    )}
                  >
                    Custom
                  </button>
                </div>

                {/* Custom Amount input field */}
                {isCustomAmount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2"
                  >
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="10"
                        max="100000"
                        value={customAmountText}
                        onChange={(e) => setCustomAmountText(e.target.value)}
                        placeholder="Enter amount (10 - 1,00,000)"
                        className="w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 pl-1">
                      Minimum ₹10 • Maximum ₹1,00,000 (Demo simulation)
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Goodness Points Teaser */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                    Goodness Reward
                  </span>
                </div>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                  +{Math.max(10, Math.floor((isCustomAmount ? parseFloat(customAmountText) || 10 : selectedQuickAmount) * 0.1))} pts
                </span>
              </div>

              {/* Donate CTA Button */}
              <div className="space-y-2">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  disabled={!isVerified}
                  onClick={() =>
                    handleOpenDonateModal(
                      isCustomAmount ? parseFloat(customAmountText) || 500 : selectedQuickAmount
                    )
                  }
                  leftIcon={<Heart className="w-4 h-4 fill-white" />}
                  className="shadow-lg shadow-emerald-500/25 py-3.5"
                >
                  {isVerified ? 'Donate Now' : 'Verification Pending'}
                </Button>

                {!isVerified && (
                  <p className="text-center text-xs text-amber-600 dark:text-amber-400 font-medium">
                    This cause is currently undergoing background verification.
                  </p>
                )}
              </div>

              {/* Demo Mode Notice */}
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>DEMO MODE — NO REAL MONEY TRANSFERRED</span>
              </div>
            </div>

            {/* Share & Social Action Box */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Amplify This Cause
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors border border-emerald-100 dark:border-emerald-900 text-xs font-semibold"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors border border-blue-100 dark:border-blue-900 text-xs font-semibold"
                >
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span>Twitter / X</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 transition-colors border border-gray-200 dark:border-gray-700 text-xs font-semibold"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                  <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleToggleBookmark}
                  className="hover:text-emerald-600 transition-colors flex items-center gap-1"
                >
                  <Bookmark className={cn('w-3.5 h-3.5', isBookmarked && 'fill-emerald-500 text-emerald-500')} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark Cause'}
                </button>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="hover:text-rose-500 transition-colors flex items-center gap-1"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MULTI-STEP DONATION MODAL ================= */}
      <Modal
        isOpen={isDonationModalOpen}
        onClose={handleCloseDonationModal}
        title={
          donationStep === 1
            ? 'Make a Demo Contribution'
            : donationStep === 2
            ? 'Complete Demo Payment'
            : 'Contribution Confirmed!'
        }
        description={
          donationStep === 1
            ? 'Select contribution amount and optional words of encouragement'
            : donationStep === 2
            ? 'Choose simulated payment method to test the flow'
            : 'Thank you for standing with this verified cause'
        }
        size="md"
        showCloseButton={!isProcessingPayment}
      >
        <div className="space-y-5">
          {/* Yellow Banner Required on Steps 1 & 2 */}
          {(donationStep === 1 || donationStep === 2) && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/70 rounded-xl text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>DEMO MODE — NO REAL MONEY WILL BE TRANSFERRED</span>
            </div>
          )}

          {/* STEP 1: CHOOSE AMOUNT */}
          {donationStep === 1 && (
            <div className="space-y-4">
              {/* Campaign Mini Summary */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <img
                  src={cover}
                  alt={campaign.title}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {campaign.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    by {organizerName}
                  </p>
                </div>
              </div>

              {/* Amount Chips Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Select Amount (₹)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = !isCustomAmount && donationAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setDonationAmount(amt);
                          setIsCustomAmount(false);
                        }}
                        className={cn(
                          'py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center',
                          isSelected
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                        )}
                      >
                        ₹{amt}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomAmount(true);
                      setCustomAmountText(donationAmount.toString());
                    }}
                    className={cn(
                      'py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center',
                      isCustomAmount
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                    )}
                  >
                    Custom
                  </button>
                </div>

                {isCustomAmount && (
                  <div className="pt-2">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="10"
                        max="100000"
                        value={customAmountText}
                        onChange={(e) => setCustomAmountText(e.target.value)}
                        placeholder="Enter amount between 10 and 1,00,000"
                        className="w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Words of Encouragement */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Words of Encouragement (Optional)
                </label>
                <textarea
                  rows={2}
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  placeholder="e.g., Wishing you a speedy recovery! You are in our thoughts and prayers."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Public Recognition Toggle */}
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublicDonor}
                  onChange={(e) => setIsPublicDonor(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-gray-900 dark:text-white">
                    Show my name publicly on the supporters wall
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                    {isPublicDonor
                      ? `Visible as ${user?.name || 'Elena Rostova'}`
                      : 'You will appear as Anonymous Supporter'}
                  </p>
                </div>
              </label>

              {/* Step 1 Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button variant="ghost" size="md" onClick={handleCloseDonationModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleProceedToPayment}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: SIMULATED PAYMENT */}
          {donationStep === 2 && (
            <div className="space-y-4">
              {/* Payment Method Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Select Demo Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={cn(
                      'p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold',
                      paymentMethod === 'UPI'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    )}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={cn(
                      'p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold',
                      paymentMethod === 'Card'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    )}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Net Banking')}
                    className={cn(
                      'p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold',
                      paymentMethod === 'Net Banking'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    )}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Method Detail Sub-form */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-3">
                {paymentMethod === 'UPI' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Virtual Payment Address (VPA)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        Demo Verified
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value="demo@upi"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-not-allowed"
                      />
                      <Lock className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      Simulated UPI channel automatically authorizes in test mode.
                    </p>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400">
                        Test Card Number
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="4532 •••• •••• 4242"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-700 dark:text-gray-300 cursor-not-allowed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        readOnly
                        value="12/28"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 text-center cursor-not-allowed"
                      />
                      <input
                        type="text"
                        readOnly
                        value="CVV: 888"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 text-center cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'Net Banking' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      Select Demo Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Donation Contribution</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatINR(donationAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>HelpLoop Platform Fee (0%)</span>
                  <span className="text-emerald-600 font-semibold">₹0 (Free for Good)</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Payment Gateway Processing (Demo)</span>
                  <span>₹0</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm font-extrabold text-gray-900 dark:text-white">
                  <span>Total Simulated Amount</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-base font-black">
                    {formatINR(donationAmount)}
                  </span>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="ghost"
                  size="md"
                  disabled={isProcessingPayment}
                  onClick={() => setDonationStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  disabled={isProcessingPayment}
                  isLoading={isProcessingPayment}
                  onClick={handleProcessPayment}
                  leftIcon={<Lock className="w-4 h-4" />}
                  className="px-6"
                >
                  {isProcessingPayment ? 'Processing Demo Payment...' : 'Process Demo Payment'}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {donationStep === 3 && (
            <div className="py-2 space-y-5 text-center">
              {/* Animated Success Checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner"
              >
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </motion.div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Contribution Recorded!
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Thank you for testing the HelpLoop social donation flow. Your simulated contribution
                  has credited the campaign live!
                </p>
              </div>

              {/* Transaction Summary Card */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700/80 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                    {lastTransactionId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Amount Contributed</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatINR(donationAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Supported Cause</span>
                  <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                    {campaign.title}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Recognition</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {isPublicDonor ? user?.name || 'Elena Rostova' : 'Anonymous Supporter'}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-emerald-500/10 p-2 rounded-xl text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Goodness Points Earned</span>
                  </div>
                  <span className="font-extrabold">+{earnedPoints} pts</span>
                </div>
              </div>

              {/* Actions: View Receipt & Done */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsReceiptOpen(true)}
                  leftIcon={<Receipt className="w-4 h-4" />}
                >
                  View Demo Receipt
                </Button>
                <Button variant="primary" size="md" onClick={handleCloseDonationModal}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ================= DEMO RECEIPT MODAL ================= */}
      <DemoReceipt
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={lastReceiptData}
      />

      {/* ================= REPORT CAMPAIGN MODAL ================= */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Campaign for Moderation"
        description="Help us maintain complete trust and safety across the HelpLoop ecosystem."
        size="sm"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Select Reason
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'misleading', label: 'Misleading or fraudulent information' },
                { id: 'incorrect_beneficiary', label: 'Incorrect beneficiary or hospital details' },
                { id: 'inappropriate', label: 'Inappropriate or graphic imagery' },
                { id: 'duplicate', label: 'Duplicate campaign' },
                { id: 'other', label: 'Other concern' },
              ].map((r) => (
                <label
                  key={r.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r.id}
                    checked={reportReason === r.id}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Provide any relevant context or reference links..."
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsReportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default CampaignDetailPage;
