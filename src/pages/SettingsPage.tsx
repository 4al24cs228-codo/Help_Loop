import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Upload,
  Camera,
  RefreshCw,
  Link as LinkIcon,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  AtSign,
  Globe2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Heart,
  Check,
  Award,
  Image as ImageIcon,
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

// Curated avatar presets for quick selection
const PRESET_AVATARS = [
  {
    id: 'unsplash-1',
    label: 'Elena',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'unsplash-2',
    label: 'Priya',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'unsplash-3',
    label: 'Rahul',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'unsplash-4',
    label: 'Vikram',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'unsplash-5',
    label: 'Sunita',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'unsplash-6',
    label: 'Ananya',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'dicebear-1',
    label: 'Aarav',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
  },
  {
    id: 'dicebear-2',
    label: 'Kavya',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Kavya',
  },
  {
    id: 'dicebear-3',
    label: 'Rohan',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Rohan',
  },
  {
    id: 'dicebear-4',
    label: 'Bot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ImpactLoop',
  },
];

const AVAILABLE_CAUSES = [
  'Medical Relief',
  'Food & Essentials',
  'Rural Education',
  'Disaster Relief',
  'Child Welfare',
  'Animal Care',
  'Clean Water',
  'Elderly Support',
  'Mental Health',
  'Environmental Action',
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications' | 'security'>('profile');

  // Form State
  const [avatar, setAvatar] = useState(user?.avatarUrl || user?.avatar || '');
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [headline, setHeadline] = useState(user?.headline || 'Community Organizer & Grassroots Advocate');
  const [role, setRole] = useState(user?.role || 'volunteer');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || 'Bangalore, Karnataka');
  const [website, setWebsite] = useState(user?.website || '');
  const [twitter, setTwitter] = useState(user?.twitter || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [sharedInterests, setSharedInterests] = useState<string[]>(
    user?.sharedInterests || ['Medical Relief', 'Food & Essentials']
  );

  // Custom Avatar URL modal/input state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Privacy Settings
  const [anonymousDonations, setAnonymousDonations] = useState(
    user?.privacySettings?.anonymousDonations ?? false
  );
  const [publicProfile, setPublicProfile] = useState(
    user?.privacySettings?.publicProfile ?? true
  );
  const [showGoodnessPoints, setShowGoodnessPoints] = useState(
    user?.privacySettings?.showGoodnessPoints ?? true
  );
  const [showOnlineStatus, setShowOnlineStatus] = useState(
    user?.privacySettings?.showOnlineStatus ?? true
  );

  // Notification Settings
  const [emailAlerts, setEmailAlerts] = useState(
    user?.notificationSettings?.emailAlerts ?? true
  );
  const [pushAlerts, setPushAlerts] = useState(
    user?.notificationSettings?.pushAlerts ?? true
  );
  const [circleMessages, setCircleMessages] = useState(
    user?.notificationSettings?.circleMessages ?? true
  );
  const [monthlyDigest, setMonthlyDigest] = useState(
    user?.notificationSettings?.monthlyDigest ?? true
  );

  // Regional language
  const [language, setLanguage] = useState<'en' | 'kn' | 'hi' | 'ta'>('en');

  // Password change simulation
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Keep local state in sync if store user changes
  useEffect(() => {
    if (user) {
      setAvatar(user.avatarUrl || user.avatar || '');
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '+91 98765 43210');
      setHeadline(user.headline || 'Community Organizer & Grassroots Advocate');
      setRole(user.role || 'volunteer');
      setBio(user.bio || '');
      setLocation(user.location || 'Bangalore, Karnataka');
      setWebsite(user.website || '');
      setTwitter(user.twitter || '');
      setLinkedin(user.linkedin || '');
      setSharedInterests(user.sharedInterests || ['Medical Relief', 'Food & Essentials']);
      if (user.privacySettings) {
        setAnonymousDonations(user.privacySettings.anonymousDonations ?? false);
        setPublicProfile(user.privacySettings.publicProfile ?? true);
        setShowGoodnessPoints(user.privacySettings.showGoodnessPoints ?? true);
        setShowOnlineStatus(user.privacySettings.showOnlineStatus ?? true);
      }
      if (user.notificationSettings) {
        setEmailAlerts(user.notificationSettings.emailAlerts ?? true);
        setPushAlerts(user.notificationSettings.pushAlerts ?? true);
        setCircleMessages(user.notificationSettings.circleMessages ?? true);
        setMonthlyDigest(user.notificationSettings.monthlyDigest ?? true);
      }
    }
  }, [user]);

  // Handle Local Photo Upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        toast.success('Profile photo uploaded! Click "Save Changes" to apply.', { icon: '📸' });
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Generate a random illustrated avatar
  const handleGenerateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 9);
    const styles = ['avataaars', 'personas', 'micah', 'bottts'];
    const chosenStyle = styles[Math.floor(Math.random() * styles.length)];
    const generatedUrl = `https://api.dicebear.com/7.x/${chosenStyle}/svg?seed=${randomSeed}`;
    setAvatar(generatedUrl);
    toast.success('Generated new creative avatar!', { icon: '✨' });
  };

  // Apply custom image URL
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }
    setAvatar(customUrl.trim());
    setShowUrlInput(false);
    setCustomUrl('');
    toast.success('Custom avatar URL loaded!', { icon: '🔗' });
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatar('');
    toast.success('Avatar removed. Your initials will be displayed.', { icon: '🗑️' });
  };

  // Toggle interest tags
  const handleToggleInterest = (cause: string) => {
    setSharedInterests((prev) =>
      prev.includes(cause) ? prev.filter((c) => c !== cause) : [...prev, cause]
    );
  };

  // Save All Profile Settings
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error('Display Name cannot be empty');
      return;
    }

    setIsSaving(true);

    try {
      // Simulate saving latency
      await new Promise((resolve) => setTimeout(resolve, 350));

      const updatedData = {
        name: name.trim(),
        username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        email: email.trim(),
        phone: phone.trim(),
        headline: headline.trim(),
        role,
        bio: bio.trim(),
        location: location.trim(),
        avatar: avatar || undefined,
        avatarUrl: avatar || undefined,
        avatar_url: avatar || undefined,
        website: website.trim(),
        twitter: twitter.trim(),
        linkedin: linkedin.trim(),
        sharedInterests,
        privacySettings: {
          anonymousDonations,
          publicProfile,
          showGoodnessPoints,
          showOnlineStatus,
        },
        notificationSettings: {
          emailAlerts,
          pushAlerts,
          circleMessages,
          monthlyDigest,
        },
      };

      updateUser(updatedData);
      toast.success('Account & Profile settings saved successfully! 🎉');
    } catch {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to current stored user values
  const handleDiscardChanges = () => {
    if (user) {
      setAvatar(user.avatarUrl || user.avatar || '');
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '+91 98765 43210');
      setHeadline(user.headline || 'Community Organizer & Grassroots Advocate');
      setRole(user.role || 'volunteer');
      setBio(user.bio || '');
      setLocation(user.location || 'Bangalore, Karnataka');
      setWebsite(user.website || '');
      setTwitter(user.twitter || '');
      setLinkedin(user.linkedin || '');
      setSharedInterests(user.sharedInterests || ['Medical Relief', 'Food & Essentials']);
      toast('Changes reverted to saved values.', { icon: '↩️' });
    }
  };

  // Handle Password Change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password updated successfully! Next login requires the new password.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordFields(false);
  };

  // Export JSON Archive
  const handleExportData = () => {
    const exportPayload = {
      user: {
        ...user,
        name,
        username,
        email,
        phone,
        bio,
        location,
        avatar,
        sharedInterests,
        privacySettings: { anonymousDonations, publicProfile, showGoodnessPoints, showOnlineStatus },
        notificationSettings: { emailAlerts, pushAlerts, circleMessages, monthlyDigest },
      },
      exportedAt: new Date().toISOString(),
      platform: 'HelpLoop Mutual Aid & Social Impact Network',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `helploop_${username || 'profile'}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Your HelpLoop data package was downloaded.');
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <SettingsIcon className="w-6 h-6" />
              </div>
              Account Settings & Privacy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Customize your profile photo, personal information, privacy visibility, and notification preferences.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              View Public Profile
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAll}
              disabled={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'profile', label: 'Profile & Avatar', icon: User },
            { id: 'privacy', label: 'Privacy & Visibility', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Data', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PROFILE & AVATAR EDITING                          */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Left & Center Column (2 cols on large screen) */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1.1 AVATAR UPLOAD & SELECTION CARD */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-emerald-600" /> Profile Picture & Avatar
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Upload your own photo, choose from community presets, or generate a unique avatar.
                  </p>
                </div>

                {/* Avatar Display + Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="relative group">
                    <Avatar
                      src={avatar}
                      name={name || 'User'}
                      size="xl"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-900 shadow-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs"
                      title="Upload new image"
                    >
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                    </button>
                    {user?.isVerified && (
                      <div
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md"
                        title="Verified Changemaker"
                      >
                        <CheckCircle className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {avatar ? 'Active Profile Photo' : 'Initials Placeholder'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Supports PNG, JPG, GIF or SVG up to 5MB. Images are optimized and saved immediately.
                      </p>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        leftIcon={<Upload className="w-3.5 h-3.5" />}
                      >
                        Upload Photo
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateRandomAvatar}
                        leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                      >
                        Generate Avatar
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        leftIcon={<LinkIcon className="w-3.5 h-3.5" />}
                      >
                        Image URL
                      </Button>

                      {avatar && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveAvatar}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom URL Input Accordion */}
                <AnimatePresence>
                  {showUrlInput && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleApplyCustomUrl}
                      className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2 overflow-hidden"
                    >
                      <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Paste Public Image URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... or https://..."
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          className="flex-1 p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                        <Button type="submit" variant="primary" size="sm">
                          Apply URL
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowUrlInput(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Preset Avatars Gallery */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Or Pick From Curated Community Avatars
                  </label>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = avatar === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setAvatar(preset.url);
                            toast.success(`Selected ${preset.label} avatar!`);
                          }}
                          className={`relative rounded-full aspect-square p-0.5 transition-all group cursor-pointer ${
                            isSelected
                              ? 'ring-3 ring-emerald-500 scale-105 shadow-md'
                              : 'hover:scale-105 hover:ring-2 hover:ring-emerald-300'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-gray-800"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 rounded-full bg-emerald-600/40 flex items-center justify-center text-white">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 1.2 PUBLIC PROFILE INFORMATION */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" /> Basic Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Full Display Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Username / Handle
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="elenarostova"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Community Role / Title
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    >
                      <option value="user">Community Supporter</option>
                      <option value="volunteer">Verified Volunteer</option>
                      <option value="organizer">Grassroots Organizer</option>
                      <option value="patron">Impact Patron</option>
                      <option value="admin">Platform Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Location / Neighborhood
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Bangalore, Karnataka"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Profile Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Short 1-line mission statement"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Personal Bio / Mission
                    </label>
                    <span className="text-xs text-gray-400">{bio.length} / 300</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={300}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell neighbors and patrons why you're on HelpLoop..."
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* 1.3 PASSIONS & CAUSES TAGS */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" /> Causes You Champion
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Select the key social causes you are most passionate about supporting.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CAUSES.map((cause) => {
                    const isSelected = sharedInterests.includes(cause);
                    return (
                      <button
                        key={cause}
                        type="button"
                        onClick={() => handleToggleInterest(cause)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{cause}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1.4 CONTACT & SOCIAL LINKS */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-blue-500" /> Contact & Social Links
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Website / Portfolio
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Twitter / X
                    </label>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@handle"
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/..."
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Profile Preview */}
            <div className="space-y-6">
              <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Live Preview
                  </span>
                  <span className="text-[11px] text-gray-400">Updates as you edit</span>
                </div>

                {/* Mini Profile Card */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50/50 dark:bg-gray-800/40">
                  <div className="h-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 relative" />
                  <div className="px-4 pb-4 -mt-10 relative space-y-3">
                    <div className="flex items-end justify-between">
                      <Avatar
                        src={avatar}
                        name={name || 'User'}
                        size="lg"
                        className="w-16 h-16 border-4 border-white dark:border-gray-800 rounded-full shadow-md object-cover"
                      />
                      {user?.isVerified && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                          Verified
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                        {name || 'Your Full Name'}
                      </h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        @{username || 'username'}
                      </p>
                      {headline && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1">
                          {headline}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {bio || 'Your personal bio will appear here to introduce yourself to causes.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1">
                      {location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-500" /> {location}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <Award className="w-3 h-3" /> {user?.goodnessPoints || 1850} GP
                      </span>
                    </div>

                    {sharedInterests.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                        {sharedInterests.slice(0, 3).map((cause) => (
                          <span
                            key={cause}
                            className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold"
                          >
                            {cause}
                          </span>
                        ))}
                        {sharedInterests.length > 3 && (
                          <span className="text-[10px] text-gray-400 font-medium self-center">
                            +{sharedInterests.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action CTA inside preview */}
                <div className="space-y-2 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full justify-center"
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center"
                    onClick={handleDiscardChanges}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    Discard Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRIVACY & VISIBILITY                              */}
        {/* ======================================================== */}
        {activeTab === 'privacy' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" /> Privacy & Contribution Visibility
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Control what information is shared with campaign organizers, community circles, and the public.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Anonymous Donation Mode
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hide your name and exact contribution amounts from public campaign supporter lists.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={anonymousDonations}
                  onChange={(e) => setAnonymousDonations(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Public Profile Discoverability
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Allow people in your city and mutual aid circles to discover and view your impact profile.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={publicProfile}
                  onChange={(e) => setPublicProfile(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Show Goodness Points & Badges
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Display your earned Goodness Points and verified volunteer milestone badges on your profile.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={showGoodnessPoints}
                  onChange={(e) => setShowGoodnessPoints(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Active Status Indicator
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show a green online badge when you are actively browsing campaigns or available for volunteer tasks.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={showOnlineStatus}
                  onChange={(e) => setShowOnlineStatus(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="primary" onClick={handleSaveAll} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Privacy Settings'}
              </Button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: NOTIFICATIONS                                     */}
        {/* ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-500" /> Alert & Digest Preferences
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Customize how and when HelpLoop sends you critical updates and celebration receipts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Email Campaign Milestone Alerts
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive verified hospital settlement receipts and photo milestone updates for campaigns you supported.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Urgent Local Emergency Push Notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get alerted when a life-critical emergency or blood request is filed in your neighborhood.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Community Circle & Discussion Messages
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Notifications when members reply to your posts or send direct volunteer messages.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={circleMessages}
                  onChange={(e) => setCircleMessages(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Monthly Impact Passport Summary
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    A personalized monthly certificate showcasing your collective lives impacted and tax-exempt receipts.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={monthlyDigest}
                  onChange={(e) => setMonthlyDigest(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="primary" onClick={handleSaveAll} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Notification Preferences'}
              </Button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SECURITY & DATA CONTROLS                          */}
        {/* ======================================================== */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Password Management */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-600" /> Account Password & Security
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Keep your login credentials secure.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                >
                  {showPasswordFields ? 'Cancel' : 'Change Password'}
                </Button>
              </div>

              {showPasswordFields && (
                <form onSubmit={handlePasswordChange} className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm">
                      Update Password
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Appearance & Language */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" /> Appearance & Regional Languages
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Interface Theme</p>
                    <p className="text-xs text-gray-400">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-white dark:bg-gray-700 shadow-sm text-gray-700 dark:text-gray-200 hover:text-emerald-500 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 space-y-1.5">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Regional Language</p>
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value as any);
                      toast.success(`Language set to ${e.target.value.toUpperCase()}`);
                    }}
                    className="w-full p-2.5 bg-white dark:bg-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="en">English (Default)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Portability & Logout */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-600" /> Data Portability & Session
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Export Your HelpLoop Archive</p>
                  <p className="text-xs text-gray-400">Download a full JSON archive of your personal profile, badges, and mutual aid activities.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData} leftIcon={<Download className="w-4 h-4" />}>
                  Download Archive
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-red-500">Sign Out of Session</span>
                  <p className="text-xs text-gray-400">Safely log out from this device.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={() => {
                    logout();
                    navigate('/');
                    toast.success('Logged out safely.');
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
