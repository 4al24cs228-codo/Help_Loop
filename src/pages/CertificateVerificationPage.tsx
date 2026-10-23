import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, ExternalLink, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const DEMO_CERTIFICATES: Record<string, {
  id: string;
  holderName: string;
  achievementTitle: string;
  achievementDescription: string;
  issueDate: string;
  isValid: boolean;
  issuerName: string;
  issuerOrg: string;
  category: string;
  badgeType: string;
}> = {
  'HLP-CERT-2026-KS001': {
    id: 'HLP-CERT-2026-KS001',
    holderName: 'Elena Rostova',
    achievementTitle: 'Kindness Starter — Level 1 Impact Milestone',
    achievementDescription: 'Has completed the HelpLoop Level 1 Impact Milestone including verified community contribution, profile completion, and active community engagement.',
    issueDate: '2026-10-18',
    isValid: true,
    issuerName: 'HelpLoop Trust & Safety Team',
    issuerOrg: 'HelpLoop Social Impact Platform',
    category: 'Impact Milestone',
    badgeType: 'Kindness Starter',
  },
};

export default function CertificateVerificationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const certificate = id ? DEMO_CERTIFICATES[id] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 self-start max-w-2xl w-full mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        HelpLoop Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Certificate Verification</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">HelpLoop Social Impact Platform</p>
        </div>

        {/* Certificate ID being verified */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-4 shadow-sm text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Verifying Certificate ID</p>
          <p className="font-mono text-sm font-bold text-gray-700 dark:text-gray-200">{id || 'Unknown'}</p>
        </div>

        {/* Result */}
        {certificate ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-emerald-200 dark:border-emerald-800 shadow-lg overflow-hidden"
          >
            {/* Valid Banner */}
            <div className="bg-emerald-500 py-3 px-6 text-white flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">This Certificate is Valid and Authentic</span>
            </div>

            {/* Certificate Content */}
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-4">HelpLoop Impact Certificate</p>

              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl mx-auto mb-4 shadow-md">
                🌱
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">This certifies that</p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{certificate.holderName}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">has been awarded the</p>
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">{certificate.achievementTitle}</h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto leading-relaxed mb-6">
                {certificate.achievementDescription}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6 text-left">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-1">Issue Date</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {new Date(certificate.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-1">Category</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{certificate.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-1">Issued By</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{certificate.issuerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-1">Certificate ID</p>
                  <p className="text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400">{certificate.id}</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                This certificate represents completion of a HelpLoop platform milestone. It is not an accredited academic qualification or professional licence.
                Verification confirms that this record exists, was issued, and remains valid at the time of this check.
              </p>

              <div className="mt-6">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Verified at {new Date().toLocaleTimeString('en-IN')} · {certificate.issuerOrg}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-red-200 dark:border-red-800 shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Certificate Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              The certificate ID <strong className="font-mono">{id}</strong> could not be verified. It may be invalid, expired, or the ID may have been entered incorrectly.
            </p>
            <p className="text-xs text-gray-400 mt-4 italic">
              Try the demo certificate: HLP-CERT-2026-KS001
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          <ExternalLink className="w-3 h-3 inline mr-1" />
          This is a public verification page. No private information is displayed.
        </p>
      </motion.div>
    </div>
  );
}
