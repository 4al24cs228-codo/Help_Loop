import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, XCircle, FileText, Plus, Eye } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

type RequestStatus = 'Draft' | 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'More Info Required';

interface MyRequest {
  id: string;
  title: string;
  category: string;
  status: RequestStatus;
  targetAmount?: number;
  raisedAmount?: number;
  submittedDate: string;
  lastUpdated: string;
  description: string;
  timeline: { action: string; actor: string; timestamp: string; note?: string }[];
  rejectionReason?: string;
  moreInfoRequested?: string;
}

const MY_REQUESTS: MyRequest[] = [
  {
    id: 'req-1',
    title: 'Medical Treatment Support for Father',
    category: 'Medical Help',
    status: 'Verified',
    targetAmount: 120000,
    raisedAmount: 87500,
    submittedDate: '2026-10-10T09:00:00Z',
    lastUpdated: '2026-10-18T14:30:00Z',
    description: 'My father requires bypass surgery and we need financial assistance to cover the hospital expenses.',
    timeline: [
      { action: 'Request Submitted', actor: 'Elena Rostova', timestamp: '2026-10-10T09:00:00Z' },
      { action: 'Under Review', actor: 'HelpLoop Team', timestamp: '2026-10-12T11:00:00Z', note: 'Documents being verified' },
      { action: 'Additional Documents Requested', actor: 'Reviewer Priya', timestamp: '2026-10-14T15:00:00Z', note: 'Hospital estimate letter required' },
      { action: 'Documents Submitted', actor: 'Elena Rostova', timestamp: '2026-10-16T10:00:00Z' },
      { action: 'Request Verified', actor: 'Reviewer Priya', timestamp: '2026-10-18T14:30:00Z', note: 'All documents verified. Fundraising enabled.' },
    ],
  },
  {
    id: 'req-2',
    title: 'Educational Scholarship for Daughter',
    category: 'Education Support',
    status: 'Under Review',
    targetAmount: 50000,
    raisedAmount: 0,
    submittedDate: '2026-10-20T11:00:00Z',
    lastUpdated: '2026-10-21T09:00:00Z',
    description: 'My daughter secured admission to engineering college but we cannot afford the fees this semester.',
    timeline: [
      { action: 'Request Submitted', actor: 'Elena Rostova', timestamp: '2026-10-20T11:00:00Z' },
      { action: 'Under Review', actor: 'HelpLoop Team', timestamp: '2026-10-21T09:00:00Z', note: 'Assigned to review queue' },
    ],
  },
  {
    id: 'req-3',
    title: 'Emergency Food Support for Family',
    category: 'Food & Essentials',
    status: 'Draft',
    submittedDate: '2026-10-22T08:00:00Z',
    lastUpdated: '2026-10-22T08:00:00Z',
    description: 'Draft request for monthly grocery assistance.',
    timeline: [],
  },
];

const statusConfig: Record<RequestStatus, { color: string; icon: React.ReactNode; label: string; bg: string }> = {
  Draft: { color: 'text-gray-600', icon: <Clock className="w-4 h-4" />, label: 'Draft', bg: 'bg-gray-100' },
  Pending: { color: 'text-amber-600', icon: <Clock className="w-4 h-4" />, label: 'Pending', bg: 'bg-amber-100' },
  'Under Review': { color: 'text-blue-600', icon: <Eye className="w-4 h-4" />, label: 'Under Review', bg: 'bg-blue-100' },
  Verified: { color: 'text-emerald-600', icon: <CheckCircle className="w-4 h-4" />, label: 'Verified ✓', bg: 'bg-emerald-100' },
  Rejected: { color: 'text-red-600', icon: <XCircle className="w-4 h-4" />, label: 'Rejected', bg: 'bg-red-100' },
  'More Info Required': { color: 'text-orange-600', icon: <AlertCircle className="w-4 h-4" />, label: 'More Info Required', bg: 'bg-orange-100' },
};

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<MyRequest | null>(null);

  const handleSubmitDraft = (id: string) => {
    toast.success('Request submitted for verification!');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Help Requests</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your submitted help requests</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/create')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Request
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Requests', value: MY_REQUESTS.length, color: 'text-gray-900' },
            { label: 'Verified', value: MY_REQUESTS.filter(r => r.status === 'Verified').length, color: 'text-emerald-600' },
            { label: 'Under Review', value: MY_REQUESTS.filter(r => r.status === 'Under Review').length, color: 'text-blue-600' },
            { label: 'Drafts', value: MY_REQUESTS.filter(r => r.status === 'Draft').length, color: 'text-gray-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
              <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {MY_REQUESTS.map((req, i) => {
            const config = statusConfig[req.status];
            const progress = req.targetAmount ? Math.round(((req.raisedAmount || 0) / req.targetAmount) * 100) : 0;

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', config.bg, config.color)}>
                          {config.icon}
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                          {req.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">{req.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{req.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(selectedRequest?.id === req.id ? null : req)}
                      className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      {selectedRequest?.id === req.id ? 'Hide' : 'Details'}
                    </button>
                  </div>

                  {/* Progress bar for verified requests */}
                  {req.targetAmount && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                        <span>₹{(req.raisedAmount || 0).toLocaleString('en-IN')} raised</span>
                        <span>Target: ₹{req.targetAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-right text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{progress}%</p>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
                    <span>Submitted: {new Date(req.submittedDate).toLocaleDateString('en-IN')}</span>
                    <span>•</span>
                    <span>Updated: {new Date(req.lastUpdated).toLocaleDateString('en-IN')}</span>
                  </div>

                  {/* Actions */}
                  {req.status === 'Draft' && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="primary" onClick={() => handleSubmitDraft(req.id)}>
                        Submit for Verification
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigate('/create')}>
                        Edit Draft
                      </Button>
                    </div>
                  )}

                  {req.status === 'Verified' && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="primary" onClick={() => navigate(`/campaign/${req.id}`)}>
                        View Campaign
                      </Button>
                    </div>
                  )}
                </div>

                {/* Expanded Timeline */}
                {selectedRequest?.id === req.id && req.timeline.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Request Timeline</h4>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                      <div className="space-y-4">
                        {req.timeline.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-4 relative">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10',
                              idx === req.timeline.length - 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                            )}>
                              {idx === req.timeline.length - 1 ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-bold">{idx + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 pb-2">
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{step.action}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">by {step.actor} — {new Date(step.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                              {step.note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{step.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty state if no requests */}
        {MY_REQUESTS.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No requests yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Submit a help request to get started.</p>
            <Button variant="primary" onClick={() => navigate('/create')} leftIcon={<Plus className="w-4 h-4" />}>
              Create Your First Request
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
