import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CreditCard,
  Building2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import type { Campaign } from '../../types';
import type { ExtendedCampaign } from '../../data/demoData';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatCurrency, formatINR, calculateProgress } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { DemoReceipt, type ReceiptData } from './DemoReceipt';
import toast from 'react-hot-toast';

export interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | ExtendedCampaign | null;
  initialAmount?: number;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  campaign,
  initialAmount = 50,
}) => {
  const { updateCampaignRaised, addDemoTransaction, addGoodnessPoints } = useAppStore();
  const { user } = useAuthStore();

  // Step state: 'select' -> 'review' -> 'processing' -> 'success'
  const [step, setStep] = useState<'select' | 'review'>('select');
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Receipt state
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  if (!campaign) return null;

  const isVerified = Boolean(campaign.isVerified ?? campaign.is_verified);
  const target = campaign.targetAmount ?? campaign.target_amount ?? 1;
  const raised = campaign.raisedAmount ?? campaign.raised_amount ?? 0;
  const progressPercent = calculateProgress(raised, target);
  const cover =
    campaign.coverImage ||
    campaign.cover_image ||
    campaign.imageUrl ||
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?w=800';

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const goodnessPointsToEarn = Math.max(10, Math.floor(effectiveAmount / 2));

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error('This campaign is pending verification. Donations are disabled.');
      return;
    }
    if (effectiveAmount < 10) {
      toast.error('Minimum donation amount is ₹10');
      return;
    }
    setStep('review');
  };

  const handleConfirmDonation = async () => {
    if (!isVerified || effectiveAmount < 10) return;

    setIsProcessing(true);

    try {
      // Simulate realistic payment gateway processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      const txId = `HL-TXN-${Date.now().toString().slice(-6)}`;
      const donorDisplayName = isAnonymous
        ? 'Anonymous Patron'
        : user?.name || 'Kind Citizen';

      // 1. Update Campaign raised amount and supporter count in store
      updateCampaignRaised(campaign.id, effectiveAmount);

      // 2. Add to demo transaction history
      addDemoTransaction({
        id: txId,
        amount: effectiveAmount,
        currency: 'INR',
        type: 'donation',
        status: 'successful',
        recipientType: 'campaign',
        recipientId: campaign.id,
        recipientName: campaign.title,
        donorName: donorDisplayName,
        paymentMethod,
        transactionRef: `REF-${Math.floor(Math.random() * 900000 + 100000)}`,
        isDemo: true,
        message: donorMessage || 'Supported with transparent community care.',
        created_at: new Date().toISOString(),
      });

      // 3. Award goodness points
      addGoodnessPoints(goodnessPointsToEarn);

      // 4. Construct receipt
      const receipt: ReceiptData = {
        transactionId: txId,
        amount: effectiveAmount,
        campaignTitle: campaign.title,
        campaignId: campaign.id,
        donorName: donorDisplayName,
        isAnonymous,
        paymentMethod,
        date: new Date().toISOString(),
        goodnessPointsEarned: goodnessPointsToEarn,
        message: donorMessage,
      };

      setReceiptData(receipt);
      setIsProcessing(false);
      onClose();
      setIsReceiptOpen(true);
      toast.success(`Demo donation of ${formatINR(effectiveAmount)} successful! 🎉`);
    } catch {
      setIsProcessing(false);
      toast.error('Simulated donation failed. Please try again.');
    }
  };

  const handleCloseAll = () => {
    setStep('select');
    setCustomAmount('');
    setSelectedAmount(50);
    setDonorMessage('');
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseAll}
        title={
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Heart className="w-5 h-5 fill-emerald-500/20" />
            </div>
            <span>{step === 'select' ? 'Support This Cause' : 'Review Contribution'}</span>
          </div>
        }
        description={
          step === 'select'
            ? 'Choose your donation amount. Every rupee is simulated in demo mode.'
            : 'Please review your details before confirming the simulated payment.'
        }
        size="md"
      >
        <div className="space-y-4">
          {/* Prominent Demo Disclaimer Banner */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="font-bold">
              DEMO MODE — NO REAL MONEY WILL BE TRANSFERRED.
            </span>
          </div>

          {/* Campaign Overview Card */}
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex gap-3 items-center">
            <img
              src={cover}
              alt={campaign.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  {campaign.category}
                </span>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" /> Verification Pending
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                {campaign.title}
              </h4>
              <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span>{formatCurrency(raised)} raised of {formatCurrency(target)}</span>
                <span className="font-bold text-emerald-600">{progressPercent}%</span>
              </div>
            </div>
          </div>

          {!isVerified ? (
            /* Unverified Campaign Notice */
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Donations Disabled: Verification Pending
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                To protect our community, contributions are only accepted after hospital and identity documents have been fully authenticated by HelpLoop administrators.
              </p>
              <Button variant="outline" size="sm" onClick={handleCloseAll} className="mt-2">
                Close
              </Button>
            </div>
          ) : step === 'select' ? (
            /* STEP 1: AMOUNT & ANONYMITY SELECTION */
            <form onSubmit={handleProceedToReview} className="space-y-4">
              {/* Quick Donation Amounts */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Select Quick Amount
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 50, 100].map((amt) => {
                    const isSelected = !customAmount && selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md scale-102'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                        }`}
                      >
                        <span className="text-sm font-extrabold">{formatINR(amt)}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                          +{Math.max(10, Math.floor(amt / 2))} GP
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Or Enter Custom Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="500000"
                    placeholder="Enter custom amount (min ₹10)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Simulated Payment Mode */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Payment Method (Simulated)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: Sparkles },
                    { id: 'Card', label: 'Debit / Card', icon: CreditCard },
                    { id: 'NetBanking', label: 'NetBanking', icon: Building2 },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = paymentMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPaymentMethod(item.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-500'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Words of Encouragement */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Note of Encouragement (Optional)
                </label>
                <input
                  type="text"
                  maxLength={120}
                  placeholder="e.g. Wishing full recovery and strength!"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Anonymous Recognition Checkbox */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
                <input
                  id="anonymous-toggle"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <label
                  htmlFor="anonymous-toggle"
                  className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer"
                >
                  <span className="font-bold">Donate anonymously</span> — hide my identity from public donor lists and community feeds.
                </label>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button type="button" variant="ghost" size="sm" onClick={handleCloseAll}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Review {formatINR(effectiveAmount)}
                </Button>
              </div>
            </form>
          ) : (
            /* STEP 2: REVIEW & CONFIRMATION SCREEN */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Transaction Summary
                </h4>

                <div className="flex items-center justify-between text-sm py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Donation Amount:</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatINR(effectiveAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Recipient Campaign:</span>
                  <span className="font-bold text-gray-900 dark:text-white max-w-[200px] truncate text-right">
                    {campaign.title}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Donor Name:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {isAnonymous ? 'Anonymous Supporter' : user?.name || 'Kind Citizen'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Platform Processing Fee:</span>
                  <span className="font-bold text-emerald-600">₹0 (100% Direct Aid)</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Goodness Points:
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    +{goodnessPointsToEarn} GP
                  </span>
                </div>
              </div>

              {donorMessage && (
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800 text-xs">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">Your message:</span>{' '}
                  <span className="italic text-gray-700 dark:text-gray-300">"{donorMessage}"</span>
                </div>
              )}

              {/* Review Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep('select')}
                  disabled={isProcessing}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleConfirmDonation}
                  isLoading={isProcessing}
                  leftIcon={<Heart className="w-4 h-4 fill-white" />}
                >
                  {isProcessing ? 'Simulating Transfer...' : `Confirm Demo Donation (${formatINR(effectiveAmount)})`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Official Demo Receipt Modal */}
      <DemoReceipt
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={receiptData}
      />
    </>
  );
};

export default DonateModal;
