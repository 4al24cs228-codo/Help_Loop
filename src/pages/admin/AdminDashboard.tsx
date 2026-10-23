import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Search,
  ExternalLink,
  Lock,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { formatINR } from '../../lib/utils';
import toast from 'react-hot-toast';

export interface AdminReviewCase {
  id: string;
  title: string;
  category: string;
  submitterName: string;
  submitterEmail: string;
  targetAmount: number;
  submittedDate: string;
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'More Info Required';
  priority: 'High' | 'Medium' | 'Low';
  documentCount: number;
  hospitalOrEntity: string;
  reviewerNotes?: string;
}

export const DEMO_REVIEW_CASES: AdminReviewCase[] = [
  {
    id: 'req-101',
    title: 'Accident Recovery & Corrective Surgery for Ravi Kumar',
    category: 'Medical Help',
    submitterName: 'Ravi Kumar',
    submitterEmail: 'ravi.k@example.com',
    targetAmount: 500000,
    submittedDate: '2026-10-22T08:30:00Z',
    status: 'Pending',
    priority: 'High',
    documentCount: 3,
    hospitalOrEntity: 'Kasturba Medical College Hospital, Manipal',
    reviewerNotes: 'Biopsy and trauma surgery estimate uploaded. Awaiting phone cross-verification.',
  },
  {
    id: 'req-102',
    title: 'Digital Learning Devices for 15 Rural High Schoolers',
    category: 'Education Support',
    submitterName: 'Vikram Mehta',
    submitterEmail: 'vikram@vidya-trust.in',
    targetAmount: 180000,
    submittedDate: '2026-10-21T14:00:00Z',
    status: 'Under Review',
    priority: 'Medium',
    documentCount: 2,
    hospitalOrEntity: 'Vidya Trust & Mandya Govt High School',
    reviewerNotes: 'Headmaster recommendation letter verified. Supplier quotation in review.',
  },
  {
    id: 'req-103',
    title: 'Emergency Ration & Clean Water Kits for Flood Victims',
    category: 'Disaster Relief',
    submitterName: 'Rahul Deshmukh',
    submitterEmail: 'rahul@rapidrelief.in',
    targetAmount: 400000,
    submittedDate: '2026-10-20T11:20:00Z',
    status: 'Verified',
    priority: 'High',
    documentCount: 4,
    hospitalOrEntity: 'Rapid Relief Assam Embankment Base',
    reviewerNotes: 'On-ground coordinator verified. Public donation workflow activated.',
  },
  {
    id: 'req-104',
    title: 'Community Meal Distribution Kitchen Equipment',
    category: 'Food & Essentials',
    submitterName: 'Priya Nair',
    submitterEmail: 'priya@annapurna-seva.org',
    targetAmount: 75000,
    submittedDate: '2026-10-19T09:40:00Z',
    status: 'Verified',
    priority: 'Low',
    documentCount: 2,
    hospitalOrEntity: 'Annapurna Seva Trust Kitchen',
    reviewerNotes: 'Trust registration certificate and kitchen rent agreement cross-checked.',
  },
  {
    id: 'req-105',
    title: 'Wheelchair & Home Ramp Assistance for Senior Veteran',
    category: 'Other Essentials',
    submitterName: 'Anand Rao',
    submitterEmail: 'anand.rao@example.com',
    targetAmount: 35000,
    submittedDate: '2026-10-18T16:15:00Z',
    status: 'More Info Required',
    priority: 'Medium',
    documentCount: 1,
    hospitalOrEntity: 'Orthopedic Mobility Center, Udupi',
    reviewerNotes: 'Requested revised quotation from authorized medical equipment vendor.',
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [cases, setCases] = useState<AdminReviewCase[]>(DEMO_REVIEW_CASES);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.submitterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hospitalOrEntity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = cases.filter((c) => c.status === 'Pending' || c.status === 'Under Review').length;
  const verifiedCount = cases.filter((c) => c.status === 'Verified').length;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" /> HelpLoop Trust & Verification Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Admin Review & Moderation Queue</h1>
            <p className="text-gray-300 text-sm max-w-xl">
              Inspect protected hospital estimates, applicant identity documents, and evidence checklists before approving public fundraising campaigns.
            </p>
          </div>

          <div className="flex gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-center px-3 border-r border-white/10">
              <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
              <p className="text-[11px] text-gray-300 uppercase font-semibold">Needs Review</p>
            </div>
            <div className="text-center px-3">
              <p className="text-2xl font-black text-emerald-400">{verifiedCount}</p>
              <p className="text-[11px] text-gray-300 uppercase font-semibold">Verified</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request, applicant, hospital..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto max-w-full w-full sm:w-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {[
              { id: 'all', label: 'All Cases' },
              { id: 'pending', label: 'Pending' },
              { id: 'under review', label: 'In Review' },
              { id: 'verified', label: 'Verified' },
              { id: 'more info required', label: 'Needs Info' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Cases List */}
        <div className="space-y-3">
          {filteredCases.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : item.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : item.status === 'Under Review'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">• ID: {item.id}</span>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Applicant: <strong className="text-gray-700 dark:text-gray-300">{item.submitterName}</strong> · Provider: {item.hospitalOrEntity}
                </p>

                {item.reviewerNotes && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-2 rounded-lg font-mono">
                    📝 Note: {item.reviewerNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-3 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-800">
                <div className="text-left md:text-right">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Requested Aid</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {formatINR(item.targetAmount)}
                  </p>
                  <span className="text-[11px] text-gray-400">
                    📎 {item.documentCount} Evidence Docs Attached
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/admin/review/${item.id}`)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Review Case
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
