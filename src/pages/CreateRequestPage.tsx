import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Heart,
  BookOpen,
  Apple,
  AlertTriangle,
  Upload,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  ShieldCheck,
  Info,
  DollarSign,
  Package,
  Sparkles,
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addGoodnessPoints } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [requestType, setRequestType] = useState<string>('financial');
  const [category, setCategory] = useState<string>('medical');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [location, setLocation] = useState('Bangalore, Karnataka');
  const [targetAmount, setTargetAmount] = useState('150000');
  const [requestedGoods, setRequestedGoods] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');

  // Step 2: Uploaded Documents with detailed descriptions
  const [documents, setDocuments] = useState<
    Array<{ id: string; name: string; type: string; size: string; description: string; previewUrl?: string }>
  >([
    {
      id: 'doc-sample-1',
      name: 'hospital_treatment_estimate.pdf',
      type: 'application/pdf',
      size: '1.2 MB',
      description: 'Official treatment breakdown and surgical estimation letter from Apollo Hospital.',
    },
  ]);
  const [newDocDesc, setNewDocDesc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type || 'document',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      description: newDocDesc.trim() || 'Supporting verification document uploaded by applicant.',
    };

    setDocuments((prev) => [...prev, newDoc]);
    setNewDocDesc('');
    toast.success(`Attached "${file.name}" with description!`);
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast('Document removed', { icon: '🗑️' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    addGoodnessPoints(50);
    toast.success('Help request submitted for administrative verification! (+50 GP)');
  };

  if (isSubmitted) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-bold">
              Status: Pending Verification
            </span>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Application Successfully Submitted!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Your request <strong>"{title}"</strong> has entered the HelpLoop reviewer queue. Our team reviews hospital estimates, quotations, and identity evidence to maintain total community trust.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-left space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verification Steps</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4" /> 1. Application Received & Evidence Logged
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                <Clock className="w-4 h-4" /> 2. Reviewer Checklist & Document Cross-verification
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <ShieldCheck className="w-4 h-4" /> 3. Verification Approval & Public Campaign Activation
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="primary" onClick={() => navigate('/requests')}>
              View in My Requests
            </Button>
            <Button variant="outline" onClick={() => navigate('/home')}>
              Return to Feed
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Step Header */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Create Help Request · Step {step} of 3
              </span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                {step === 1 && 'Request Details & Purpose'}
                {step === 2 && 'Supporting Photos & Evidence Documents'}
                {step === 3 && 'Review & Verification Submission'}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              {step}/3
            </div>
          </div>

          {/* Stepper Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Details */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            {/* Request Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Type of Assistance Needed
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'financial', label: 'Financial Help', icon: DollarSign },
                  { id: 'goods', label: 'Essential Goods / Kits', icon: Package },
                  { id: 'volunteering', label: 'Volunteering Support', icon: Heart },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRequestType(t.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                        requestType === t.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-bold text-sm">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              >
                <option value="medical">Medical Assistance (Surgery, Medication, Hospital)</option>
                <option value="education">Education Support (College fees, Books, Devices)</option>
                <option value="food">Food & Essentials (Meals, Grocery Kits, Ration)</option>
                <option value="disaster">Disaster & Emergency Recovery</option>
                <option value="blood">Blood Donation Coordination</option>
                <option value="other">Other Community Needs</option>
              </select>
            </div>

            {/* Title & Beneficiary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Request Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Corrective Heart Surgery Support for 6yo Child"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Beneficiary Name / Family *
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="e.g. Master Aarav Patil"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Target Amount or Goods */}
            {requestType === 'financial' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Target Funding Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Location / Hospital City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Requested Items & Quantities *
                </label>
                <textarea
                  rows={3}
                  value={requestedGoods}
                  onChange={(e) => setRequestedGoods(e.target.value)}
                  placeholder="e.g. Rice: 100 kg, Cooking Oil: 20 L, Pulse packs: 40 kg, Hygiene Kits: 50 sets"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Detailed Case Summary & Need Justification *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the background, medical urgency, family condition, and how the funds or goods will be utilized transparently."
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="primary"
                onClick={() => {
                  if (!title.trim() || !description.trim()) {
                    toast.error('Please fill in required fields');
                    return;
                  }
                  setStep(2);
                }}
              >
                Proceed to Document Upload <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Supporting Documents */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex gap-3 text-sm text-blue-900 dark:text-blue-200">
              <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <div>
                <p className="font-bold">Evidence-Based Social Fundraising Policy</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                  HelpLoop requires supporting proof (hospital treatment estimations, government college fee structure, supplier quotation, or disaster damage photograph) before enabling financial donations. Each uploaded document requires a description.
                </p>
              </div>
            </div>

            {/* Document list */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Attached Verification Documents ({documents.length})
              </h3>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-400">{doc.size} · {doc.type}</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md mt-1 inline-block">
                        <strong>Description:</strong> {doc.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center space-y-3">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Upload Verification Proof (PDF, JPG, PNG)
                </p>
                <p className="text-xs text-gray-400">Max size: 10MB each</p>
              </div>

              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                  placeholder="Document description (e.g. Apollo Hospital surgical quotation dated 14 Oct)"
                  className="w-full p-2.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl mb-3 text-gray-900 dark:text-white"
                />
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-all">
                  <Upload className="w-4 h-4" />
                  Select & Attach File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Previous Step
              </Button>
              <Button variant="primary" onClick={() => setStep(3)}>
                Review Application <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Submit */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Application Summary & Consent
            </h2>

            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 space-y-4 border border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Category</span>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{category}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Type</span>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{requestType}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Beneficiary</span>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{beneficiaryName || 'Self'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Target</span>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {requestType === 'financial' ? `₹${parseInt(targetAmount || '0').toLocaleString('en-IN')}` : requestedGoods || 'Items specified'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-400 uppercase font-bold">Title</span>
                <p className="font-bold text-gray-900 dark:text-white text-base mt-0.5">{title}</p>
              </div>

              <div>
                <span className="text-xs text-gray-400 uppercase font-bold">Description</span>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{description}</p>
              </div>

              <div>
                <span className="text-xs text-gray-400 uppercase font-bold">Evidence Attached</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {documents.map((d) => (
                    <span
                      key={d.id}
                      className="px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono font-medium text-gray-700 dark:text-gray-200"
                    >
                      📎 {d.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
              <strong>Applicant Truthfulness Declaration:</strong> By submitting this request, you certify that all information and uploaded estimate documents are accurate to the best of your knowledge. HelpLoop does not guarantee complete funding but commits to transparent, evidence-based review.
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Documents
              </Button>
              <Button
                variant="primary"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Submit for Verification
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
