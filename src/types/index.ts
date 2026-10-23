export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  avatarUrl?: string;
  avatar_url?: string;
  email?: string;
  isVerified?: boolean;
  is_verified?: boolean;
  isPatron?: boolean;
  isImpactPatron?: boolean;
  is_impact_patron?: boolean;
  role?: 'user' | 'volunteer' | 'organization' | 'admin' | 'patron' | 'organizer' | string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  headline?: string;
  privacySettings?: {
    anonymousDonations?: boolean;
    publicProfile?: boolean;
    showGoodnessPoints?: boolean;
    showOnlineStatus?: boolean;
  };
  notificationSettings?: {
    emailAlerts?: boolean;
    pushAlerts?: boolean;
    circleMessages?: boolean;
    monthlyDigest?: boolean;
  };
  impactPoints?: number;
  goodnessPoints?: number;
  goodness_points?: number;
  isOnline?: boolean;
  joinedDate?: string;
  sharedInterests?: string[];
  followersCount?: number;
  followingCount?: number;
  badges?: Badge[];
  impactSummary?: {
    totalDonated: number;
    hoursVolunteered: number;
    requestsHelped: number;
    campaignsSupported: number;
    eventsAttended?: number;
  };
  created_at?: string;
  updated_at?: string;
}

export type PostType = 'social' | 'help-request' | 'announcement' | 'event' | 'milestone';

export interface Comment {
  id: string;
  postId?: string;
  post_id?: string;
  user_id?: string;
  author: User;
  content: string;
  timestamp?: string;
  created_at?: string;
  likesCount?: number;
  likes_count?: number;
  isLiked?: boolean;
  replyTo?: string;
  replyToAuthor?: string;
  replies?: Comment[];
}

export interface HelpRequestDetails {
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  donorsCount: number;
  category: string;
  urgent?: boolean;
  daysLeft?: number;
  beneficiaryName?: string;
}

export interface EventDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  attendeesCount: number;
  isJoined?: boolean;
  imageUrl?: string;
  category?: string;
}

export interface MilestoneDetails {
  milestoneTitle: string;
  targetMetric: string;
  achievedMetric: string;
  progressPercentage: number;
  impactSummary: string;
}

export interface Post {
  id: string;
  author: User;
  type: PostType;
  caption: string;
  mediaUrls?: string[];
  createdAt?: string;
  created_at?: string;
  likesCount?: number;
  likes_count?: number;
  commentsCount?: number;
  comments_count?: number;
  sharesCount?: number;
  shares_count?: number;
  bookmarksCount?: number;
  bookmarks_count?: number;
  isLiked?: boolean;
  is_liked?: boolean;
  isBookmarked?: boolean;
  is_bookmarked?: boolean;
  isFollowingAuthor?: boolean;
  comments?: Comment[];
  category?: string;
  tags?: string[];
  isOwnPost?: boolean;
  helpRequest?: HelpRequestDetails;
  event?: EventDetails;
  milestone?: MilestoneDetails;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  caption?: string;
  timestamp: string;
  isViewed?: boolean;
  duration?: number;
}

export interface Champion {
  id: string;
  user: User;
  achievement: string;
  points: number;
  badgeName: string;
  badgeIcon: 'trophy' | 'award' | 'sparkles' | 'shield' | 'heart' | 'zap';
  rank: number;
}

export type FeedFilterTab = 'for-you' | 'following' | 'latest' | 'categories';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category?: string;
  points?: number;
}

export type EventCategory = 
  | 'Beach Cleanup' 
  | 'Blood Donation' 
  | 'Tree Planting' 
  | 'Food Distribution' 
  | 'Tutoring' 
  | 'Campus Events' 
  | 'Environment' 
  | 'Healthcare' 
  | 'Disaster Relief' 
  | 'Community' 
  | string;

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  location: string;
  venueAddress?: string;
  startDate: string;
  endDate?: string;
  time?: string;
  coverImage: string;
  organizer: User;
  organizerId?: string;
  organizer_id?: string;
  maxVolunteers: number;
  registeredVolunteers?: number;
  registered_volunteers?: number;
  isJoined?: boolean;
  is_joined?: boolean;
  isYourEvent?: boolean;
  status: 'Open' | 'Full' | 'Waitlist' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  goodnessPoints?: number;
  goodness_points?: number;
  perks?: string[];
  whatToBring?: string[];
  safetyInfo?: string[];
  registrationDeadline?: string;
  isPast?: boolean;
  coordinates?: { lat: number; lng: number };
  impactReport?: {
    summary?: string;
    volunteersAttended?: number;
    hoursLogged?: number;
    metrics?: { label: string; value: string }[];
  };
  created_at?: string;
  updated_at?: string;
}

export type CircleCategory = 
  | 'Environment' 
  | 'Healthcare' 
  | 'Education' 
  | 'Food Rescue' 
  | 'Disaster Relief' 
  | 'Community' 
  | 'Animal Welfare' 
  | string;

export interface HelpCircle {
  id: string;
  name: string;
  description: string;
  category: CircleCategory;
  memberCount?: number;
  member_count?: number;
  activeCount?: number;
  active_count?: number;
  coverImage: string;
  avatar: string;
  isJoined?: boolean;
  is_joined?: boolean;
  isFeatured?: boolean;
  cause: string;
  location?: string;
  leader?: User;
  rules?: string[];
  guidelines?: string[];
  topics?: string[];
  sharedGoal?: {
    title: string;
    current: number;
    target: number;
    unit: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CircleMembership {
  id: string;
  circleId: string;
  userId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt?: string;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  userName?: string;
  created_at?: string;
}

export interface CampaignShare {
  id: string;
  title: string;
  targetAmount: number;
  raisedAmount: number;
  coverImage: string;
  category: string;
}

export interface Message {
  id: string;
  conversationId?: string;
  conversation_id?: string;
  senderId?: string;
  sender_id?: string;
  sender: User;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'file';
  reactions?: MessageReaction[];
  isRead?: boolean;
  is_read?: boolean;
  readAt?: string;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  campaignCard?: CampaignShare;
  created_at?: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'communities' | 'group';
  title?: string;
  name?: string;
  avatar?: string;
  members: User[];
  lastMessage?: Message;
  last_message?: Message;
  unreadCount?: number;
  unread_count?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isOnline?: boolean;
  updated_at?: string;
  created_at?: string;
}

export type NotificationType = 
  | 'comment'
  | 'like'
  | 'follow'
  | 'donation'
  | 'milestone'
  | 'verification'
  | 'event'
  | 'community'
  | 'system'
  | 'message'
  | 'impact'
  | 'circle_update'
  | 'event_reminder'
  | 'badge_earned';

export interface Notification {
  id: string;
  userId?: string;
  type: NotificationType;
  title?: string;
  message: string;
  avatar?: string;
  link?: string;
  isRead?: boolean;
  is_read?: boolean;
  createdAt?: string;
  created_at?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  currency?: string;
  imageUrl?: string;
  coverImage?: string;
  cover_image?: string;
  organizer: User;
  daysLeft?: number;
  daysRemaining?: number;
  donorsCount?: number;
  isUrgent?: boolean;
  verified?: boolean;
  isVerified?: boolean;
  is_verified?: boolean;
  target_amount?: number;
  raised_amount?: number;
  supporterCount?: number;
  supporter_count?: number;
  deadline?: string;
  status?: string;
  location?: string;
  beneficiaryName?: string;
  beneficiary_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DemoTransaction {
  id: string;
  amount: number;
  currency: string;
  type?: 'donation' | 'direct_support' | 'campaign_boost';
  status: 'successful' | 'pending' | 'failed';
  recipientType?: 'campaign' | 'individual' | 'circle';
  recipient_type?: 'campaign' | 'individual' | 'circle';
  recipientId: string;
  recipient_id?: string;
  recipientName: string;
  recipient_name?: string;
  donorName?: string;
  paymentMethod?: string;
  payment_method?: string;
  transactionRef?: string;
  transaction_ref?: string;
  isDemo: boolean;
  is_demo?: boolean;
  message?: string;
  created_at: string;
  goodnessPointsEarned?: number;
}

export type HelpRequestStatus = 'Draft' | 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
export type HelpRequestPriority = 'High' | 'Medium' | 'Low';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  description?: string;
  verified?: boolean;
}

export interface EvidenceChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface RequestTimelineItem {
  id: string;
  action: string;
  actor: string;
  role?: string;
  timestamp: string;
  note?: string;
}

export interface HelpRequestItem {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAmount?: number;
  raisedAmount?: number;
  currency?: string;
  status: HelpRequestStatus;
  priority: HelpRequestPriority;
  submittedDate: string;
  beneficiaryName?: string;
  location?: string;
  submitter: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    avatar?: string;
    email?: string;
  };
  assignedTo?: string;
  assignedReviewerName?: string;
  documents: DocumentItem[];
  evidenceChecklist: EvidenceChecklistItem[];
  timeline: RequestTimelineItem[];
  internalNotes?: string;
  rejectionReason?: string;
  moreInfoRequested?: string;
  flaggedForReview?: boolean;
}

export interface CertificateData {
  id: string;
  holderName: string;
  achievementTitle: string;
  achievementDescription: string;
  issueDate: string;
  isValid: boolean;
  issuerName: string;
  issuerRole: string;
  issuerOrg: string;
  category: string;
  verificationCode: string;
  badgeType?: string;
  recognizedHours?: number;
  communityEndorsements?: number;
}

