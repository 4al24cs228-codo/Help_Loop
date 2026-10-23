import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Lock,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Button } from '../../components/ui/Button';
import { DEMO_REVIEW_CASES } from './AdminDashboard';
import { formatINR } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function ReviewRequestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const reviewCase = DEMO_REVIEW_CASES.find((c) => c.id === id) || DEMO_REVIEW_CASES[0];
  const [status, setStatus] = useState(reviewCase.status);
  const [internalNotes, setInternalNotes] = useState(reviewCase.reviewerNotes || '');
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Identity & beneficiary matching verified', checked: true },
    { id: 'c2', label: 'Hospital or institutional estimate letter cross-verified', checked: true },
    { id: 'c3', label: 'Bank / Trust beneficiary account details confirmed', checked: false },
    { id: 'c4', label: 'No conflicting duplicate claims found in registry', checked: true },
  ]);

  const [activeModalDoc, setActiveModalDoc] = useState<{ name: string; type: string; date: string; content: string } | null>(null);

  const sampleDocs = [
    {
      id: 'd-1',
      name: 'demo_hospital_estimate.pdf',
      type: 'Hospital Treatment Estimate',
      date: '18 Oct 2026',
      content:
        'ILLUSTRATIVE SAMPLE DOCUMENT — NOT A REAL MEDICAL CERTIFICATE.\n\nKokilaben Dhirubhai Ambani Hospital, Mumbai\nDepartment of Pediatric Cardiac Surgery\nPatient: Master Aarav Patil (Age 6)\nCase Ref: HLP-MED-2026-904\n\n1. Surgical Correction of Ventricular Septal Defect: ₹2,80,000\n2. 5-Day PICU & Post-operative Monitoring: ₹1,10,000\n3. Anesthesia, Oxygenation & Critical Care Consumables: ₹60,000\n\nTotal Estimated Cost: ₹4,50,000\nAuthorized Signatory: Dr. Anita Sharma, Chief of Surgery',
    },
    {
      id: 'd-2',
      name: 'demo_income_certificate.pdf',
      type: 'Tahshildar Income Assessment',
      date: '15 Oct 2026',
      content:
        'ILLUSTRATIVE SAMPLE DOCUMENT — GOVERNMENT REVENUE ASSESSMENT (DEMO).\n\nOffice of the Tahsildar, Thane District\nThis is to certify that Sri Ramesh Patil is employed as an unorganized construction laborer with an annual household income under ₹75,000. He is eligible for medical assistance from registered mutual aid trusts.\n\nOfficer Code: GOV-MH-98124',
    },
  ];

  const handleToggleCheck = (checkId: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === checkId ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleApprove = () => {
    setStatus('Verified');
    toast.success('Request verified! Public campaign fundraising is now activated.');
  };

  const handleRequestMoreInfo = () => {
    setStatus('More Info Required');
    toast('Applicant notified requesting additional documentation.', { icon: 'ℹ️' });
  };

  const handleReject = () => {
    setStatus('Rejected');
    toast.error('Request marked as rejected.');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Review Queue
        </button>

        {/* Case Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                  {status}
                </span>
                <span className="text-xs font-bold text-gray-400 font-mono">Case #{reviewCase.id}</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                {reviewCase.title}
              </h1>
              <p className="text-xs text-gray-500">
                Submitted on {new Date(reviewCase.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} by {reviewCase.submitterName} ({reviewCase.submitterEmail})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 font-semibold uppercase">Requested Aid</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatINR(reviewCase.targetAmount)}
              </p>
            </div>
          </div>

          {/* Protected Documents Viewer Area */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> Protected Confidential Supporting Evidence
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Only authorized HelpLoop reviewers have access to raw unredacted estimates and patient documents.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{doc.name}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">{doc.type}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{doc.date}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveModalDoc(doc)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Inspect
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Audit Checklist */}
          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Reviewer Checklist & Checks Performed
            </h3>
            <div className="space-y-2">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleCheck(item.id)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className={`text-sm font-medium ${item.checked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Administrative Audit Notes & Log
            </label>
            <textarea
              rows={3}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Record checks performed, hospital contact confirmation, or reason for review decision..."
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={handleReject}
            >
              Reject Request
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleRequestMoreInfo}>
                Request More Evidence
              </Button>
              <Button
                variant="primary"
                onClick={handleApprove}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Approve & Activate Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* Document Inspection Modal */}
        {activeModalDoc && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">{activeModalDoc.name}</h3>
                  <span className="text-xs text-amber-600 font-bold">DEMO WATERMARK: Illustrative Proof</span>
                </div>
                <button
                  onClick={() => setActiveModalDoc(null)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 max-h-80 overflow-y-auto">
                {activeModalDoc.content}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveModalDoc(null)}>
                  Close Viewer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
