import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Printer,
  X,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency, formatFullDateTime } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface ReceiptData {
  transactionId: string;
  amount: number;
  campaignTitle: string;
  campaignId?: string;
  donorName?: string;
  isAnonymous?: boolean;
  paymentMethod: string;
  date: string;
  goodnessPointsEarned: number;
  message?: string;
}

export interface DemoReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
}

export const DemoReceipt: React.FC<DemoReceiptProps> = ({
  isOpen,
  onClose,
  receiptData,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !receiptData) return null;

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `HelpLoop-Demo-Receipt-${receiptData.transactionId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture receipt canvas:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden my-8"
        >
          {/* Top banner controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Official Demo Receipt</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Close receipt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Receipt Paper Container */}
          <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh]">
            <div
              ref={receiptRef}
              id="printable-receipt"
              className="relative p-6 sm:p-8 bg-white border-2 border-emerald-500/20 rounded-2xl shadow-inner text-gray-800 font-sans overflow-hidden"
              style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
            >
              {/* Diagonal Watermark for Hackathon Demo Mode */}
              <div
                className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.06] rotate-[-30deg]"
                aria-hidden="true"
              >
                <div className="text-6xl sm:text-7xl font-black text-emerald-950 uppercase tracking-widest text-center leading-tight">
                  DEMO TRANSACTION
                  <br />
                  NO REAL MONEY
                </div>
              </div>

              {/* Receipt Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-5 border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                      <Heart className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <span className="text-xl font-black tracking-tight text-emerald-700">
                        HelpLoop
                      </span>
                      <span className="block text-[10px] tracking-wider uppercase font-semibold text-gray-500">
                        Social Impact Platform
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    501(c)(3) Simulation • 80G Registered Demo Gateway
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    SIMULATED RECEIPT
                  </span>
                  <div className="mt-2 text-xs text-gray-500">
                    <p className="font-semibold text-gray-800">
                      ID: <span className="font-mono">{receiptData.transactionId}</span>
                    </p>
                    <p>{formatFullDateTime(receiptData.date)}</p>
                  </div>
                </div>
              </div>

              {/* Mandatory Demo Mode Warning Banner */}
              <div className="my-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Demo Mode Notice:</strong> This is a simulated transaction for testing & hackathon demonstration purposes. No real money was debited or transferred.
                </span>
              </div>

              {/* Donor & Beneficiary Information Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 text-xs border-b border-gray-100">
                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                    Contributor
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {receiptData.isAnonymous ? 'Anonymous Donor' : receiptData.donorName || 'Kind Supporter'}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Status: {receiptData.isAnonymous ? 'Private Donation' : 'Public Recognition'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                    Payment Channel
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {receiptData.paymentMethod}
                  </p>
                  <p className="text-emerald-700 font-semibold text-[11px]">
                    Gateway Status: Verified Successful
                  </p>
                </div>
              </div>

              {/* Campaign Item Description */}
              <div className="py-4 border-b border-gray-200">
                <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                  Supported Cause
                </span>
                <p className="text-base font-bold text-gray-900 mt-1 leading-snug">
                  {receiptData.campaignTitle}
                </p>
                {receiptData.message && (
                  <p className="mt-2 p-2.5 rounded-lg bg-gray-50 italic text-xs text-gray-600 border border-gray-100">
                    "{receiptData.message}"
                  </p>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="py-4 space-y-2 border-b border-gray-200">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Donation Contribution</span>
                  <span>{formatCurrency(receiptData.amount)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>HelpLoop Platform Fee (0%)</span>
                  <span className="text-emerald-600 font-semibold">₹0 (Free for Good)</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Payment Gateway Processing (Demo)</span>
                  <span>₹0</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-extrabold text-gray-900">
                  <span>Total Simulated Contribution</span>
                  <span className="text-lg text-emerald-700 font-mono">
                    {formatCurrency(receiptData.amount)}
                  </span>
                </div>
              </div>

              {/* Goodness Points Awarded */}
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Goodness Points Awarded</p>
                    <p className="text-[11px] text-emerald-700">Added to your HelpLoop impact profile</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-300">
                  +{receiptData.goodnessPointsEarned} pts
                </span>
              </div>

              {/* Digital Signature & Footer Seal */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                <div>
                  <p className="font-semibold text-gray-600">Verified by HelpLoop Foundation</p>
                  <p>Cryptographically hashed demo audit #HL-DEMO-2026</p>
                </div>
                <div className="text-right">
                  <div className="font-serif italic text-sm text-gray-700 font-bold">
                    HelpLoop Verified
                  </div>
                  <p>Official Digital Stamp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons at bottom */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print Receipt
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              isLoading={isDownloading}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Image
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DemoReceipt;
