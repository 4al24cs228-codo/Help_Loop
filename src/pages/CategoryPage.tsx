import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  Heart,
  GraduationCap,
  Utensils,
  AlertTriangle,
  Package,
  Award,
  ChevronDown,
  X,
  CreditCard,
  Building2,
  Share2,
  Flame,
  Check,
  Compass,
} from 'lucide-react';

import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { DONATE_CATEGORIES, DEMO_ORGANIZERS, type CategoryMetadata, type ExtendedCampaign } from '../data/demoData';
import { CampaignCard } from '../components/campaign/CampaignCard';
import { DemoReceipt, type ReceiptData } from '../components/campaign/DemoReceipt';
import { AppLayout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { formatINR, generateDemoTransactionId, cn } from '../lib/utils';
import toast from 'react-hot-toast';

// Volunteering event interface
interface VolunteeringEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  coverImage: string;
  organizer: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  maxVolunteers: number;
  registeredVolunteers: number;
  goodnessPoints: number;
  perks: string[];
  isWeekend?: boolean;
}

// 6 Hardcoded Demo Volunteering Events
const DEMO_VOLUNTEERING_EVENTS: VolunteeringEvent[] = [
  {
    id: 'evt-1',
    title: 'Ennore Creek Mangrove Plantation & Coastal Defense Drive',
    description:
      'Join hands with local coastal fishing community families to plant 2,000 Rhizophora mangrove saplings along tidal mudflats protecting against cyclone surges.',
    category: 'Tree Planting & Ecology',
    location: 'Ennore Creek, Chennai, Tamil Nadu',
    date: 'Sunday, 26 Oct 2026',
    time: '06:30 AM – 11:30 AM',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    organizer: {
      name: 'Arjun Verma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    maxVolunteers: 60,
    registeredVolunteers: 45,
    goodnessPoints: 150,
    perks: ['Verified Digital Certificate', 'Safety Gear & Bio-Gloves', 'Breakfast & Refreshments'],
    isWeekend: true,
  },
  {
    id: 'evt-2',
    title: 'Mega Blood Donation & Thalassemia Support Camp',
    description:
      'Partnering with Red Cross Blood Bank to mobilize 100+ units of emergency rare blood groups for pediatric leukemia and thalassemia patients across city hospitals.',
    category: 'Healthcare & Blood Donation',
    location: 'Indiranagar Community Hall, Bengaluru, Karnataka',
    date: 'Saturday, 1 Nov 2026',
    time: '09:00 AM – 03:00 PM',
    coverImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    organizer: {
      name: 'Dr. Anita Sharma',
      avatar: 'https://images.unsplash.com/photo-1594824813626-d62f48e3a242?w=250&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    maxVolunteers: 120,
    registeredVolunteers: 94,
    goodnessPoints: 200,
    perks: ['Medical Donor Certificate', 'Blood Group Card', 'Energy Nutrition Kit'],
    isWeekend: true,
  },
  {
    id: 'evt-3',
    title: 'Yamuna Floodplain Eco-Cleanup & Microplastics Sorting',
    description:
      'Community mobilizers and university students clearing non-biodegradable waste, nylon nets, and single-use plastic debris from migratory bird sanctuary wetlands.',
    category: 'Environment & Waste Segregation',
    location: 'Mayur Vihar Yamuna Ghat, East Delhi',
    date: 'Sunday, 2 Nov 2026',
    time: '07:00 AM – 11:00 AM',
    coverImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    organizer: {
      name: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    maxVolunteers: 80,
    registeredVolunteers: 62,
    goodnessPoints: 140,
    perks: ['Cleanup Warrior Badge', 'Compost Kit', 'Field Hydration'],
    isWeekend: true,
  },
  {
    id: 'evt-4',
    title: 'Weekend STEM Mentorship & Interactive Solar Tablet Camp',
    description:
      'Introduce scratch programming, basic digital literacy, and hands-on science experiments to 120 eager tribal middle school students in remote valley hamlets.',
    category: 'Education & Youth Tutoring',
    location: 'Gudalur Community Center, Nilgiris, Tamil Nadu',
    date: 'Saturday, 8 Nov 2026',
    time: '10:00 AM – 04:00 PM',
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    organizer: {
      name: 'Vikram Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    maxVolunteers: 25,
    registeredVolunteers: 18,
    goodnessPoints: 220,
    perks: ['Youth Mentor Certificate', 'Local Tribal Lunch', 'Free Learning Resources'],
    isWeekend: true,
  },
  {
    id: 'evt-5',
    title: 'Warmth for All: Midnight Blanket & Winter Rations Distribution',
    description:
      'Night route distribution of heavy fleece blankets, thermal woollen caps, and hot nutritious porridge to pavement dwellers, rickshaw pullers, and destitute elders.',
    category: 'Hunger & Winter Relief',
    location: 'Kalupur & Astodia Clock Tower, Ahmedabad, Gujarat',
    date: 'Friday, 14 Nov 2026',
    time: '09:30 PM – 01:30 AM',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    organizer: {
      name: 'Sunita Patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    maxVolunteers: 40,
    registeredVolunteers: 31,
    goodnessPoints: 180,
    perks: ['Night Volunteer Badge', 'High-Vis Safety Jacket', 'Hot Chai & Snacks'],
    isWeekend: false,
  },
  {
    id: 'evt-6',
    title: 'Disaster First-Aid & Emergency Inflatable Boat Logistics Drill',
    description:
      'Practical field training on rapid flood rescue operations, deployment of water purification kits, pediatric emergency care, and temporary shelter setup.',
    category: 'Disaster Preparedness & First-Aid',
    location: 'Brahmaputra Ghat Training Base, Guwahati, Assam',
    date: 'Saturday, 21 Nov 2026',
    time: '09:00 AM – 02:00 PM',
    coverImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
    organizer: {
      name: 'Rahul Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    maxVolunteers: 50,
    registeredVolunteers: 38,
    goodnessPoints: 175,
    perks: ['First Responder Certification', 'Emergency First-Aid Pouch', 'Lunch Included'],
    isWeekend: true,
  },
];

// Additional mock campaigns for categories with fewer entries in base demoData
const SUPPLEMENTAL_CAMPAIGNS: ExtendedCampaign[] = [
  {
    id: 'camp-supp-med-1',
    title: 'Bone Marrow Transplant & Post-Chemo Care for 7-Year-Old Tanya',
    description:
      'Tanya is battling acute lymphoblastic leukemia and urgently requires an allogeneic bone marrow transplant from an HLA-matched donor at Tata Memorial Hospital.',
    story:
      'Tanya was diagnosed with acute lymphoblastic leukemia 6 months ago. After multiple intensive cycles of chemotherapy, doctors advised an urgent bone marrow transplant to ensure remission.',
    category: 'medical',
    targetAmount: 850000,
    target_amount: 850000,
    raisedAmount: 640000,
    raised_amount: 640000,
    supporterCount: 382,
    supporter_count: 382,
    deadline: '2026-11-08T23:59:59Z',
    daysRemaining: 11,
    organizer: DEMO_ORGANIZERS.dr_sharma,
    organizerId: DEMO_ORGANIZERS.dr_sharma.id,
    organizer_id: DEMO_ORGANIZERS.dr_sharma.id,
    isVerified: true,
    is_verified: true,
    coverImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    cover_image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    beneficiaryName: 'Tanya Banerjee (Age 7)',
    beneficiary_name: 'Tanya Banerjee (Age 7)',
    location: 'Kolkata, West Bengal',
    taxExempt: true,
    intendedUse: ['₹6,00,000 — Stem cell infusion & clean room isolation charges'],
    evidenceSummary: {
      hospitalContactVerified: true,
      documentsAuthentic: true,
      beneficiaryReached: true,
      reviewerNotes: 'Biopsy and oncologist estimate letter verified with Tata Memorial registry.',
      verifiedDate: '19 Oct 2026',
      documentsList: ['Bone Marrow Transplant Medical Cost Certificate'],
    },
    updates: [],
    created_at: '2026-10-18T10:00:00Z',
    updated_at: '2026-10-21T12:00:00Z',
  },
  {
    id: 'camp-supp-edu-1',
    title: 'STEM & Robotics Learning Lab for Rural Government Girls High School',
    description:
      'Setting up a fully equipped science, robotics, and coding lab for 450 rural girls in Mandya to inspire next-generation women engineers and scientists.',
    story:
      'In rural Mandya, girls from agrarian families rarely get access to hands-on science experiments. Vidya Trust is building a state-of-the-art interactive lab with Arduino kits, 3D printers, and optical microscopes.',
    category: 'education',
    targetAmount: 180000,
    target_amount: 180000,
    raisedAmount: 135000,
    raised_amount: 135000,
    supporterCount: 168,
    supporter_count: 168,
    deadline: '2026-11-20T23:59:59Z',
    daysRemaining: 23,
    organizer: DEMO_ORGANIZERS.vikram_mehta,
    organizerId: DEMO_ORGANIZERS.vikram_mehta.id,
    organizer_id: DEMO_ORGANIZERS.vikram_mehta.id,
    isVerified: true,
    is_verified: true,
    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    cover_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    beneficiaryName: '450 Girls, Government Girls PU College',
    beneficiary_name: '450 Girls, Government Girls PU College',
    location: 'Mandya, Karnataka',
    taxExempt: true,
    intendedUse: ['₹90,000 — 15 STEM robotics experiment kits & electronic breadboards'],
    evidenceSummary: {
      hospitalContactVerified: false,
      documentsAuthentic: true,
      beneficiaryReached: true,
      reviewerNotes: 'School development management committee approval verified.',
      verifiedDate: '16 Oct 2026',
      documentsList: ['School Permission Letter', 'Hardware Quotations'],
    },
    updates: [],
    created_at: '2026-10-15T09:00:00Z',
    updated_at: '2026-10-19T14:00:00Z',
  },
  {
    id: 'camp-supp-food-1',
    title: 'Midday Milk & Nutrition Kits for 350 Slum Preschool Children',
    description:
      'Combating chronic childhood stunting and anemia by providing daily fortified milk, boiled eggs, and multi-grain porridge to children aged 2–6 in informal settlements.',
    story:
      'Over 60% of toddlers in these unauthorized settlements suffer from iron and protein deficiency. Annapurna Seva prepares fresh supplementary morning breakfast kits delivered directly to mothers.',
    category: 'food',
    targetAmount: 95000,
    target_amount: 95000,
    raisedAmount: 78500,
    raised_amount: 78500,
    supporterCount: 132,
    supporter_count: 132,
    deadline: '2026-11-06T23:59:59Z',
    daysRemaining: 9,
    organizer: DEMO_ORGANIZERS.priya_nair,
    organizerId: DEMO_ORGANIZERS.priya_nair.id,
    organizer_id: DEMO_ORGANIZERS.priya_nair.id,
    isVerified: true,
    is_verified: true,
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    cover_image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    beneficiaryName: '350 Toddlers & Children in Okhla Phase 1',
    beneficiary_name: '350 Toddlers & Children in Okhla Phase 1',
    location: 'South Delhi, Delhi',
    taxExempt: true,
    intendedUse: ['₹50,000 — 90 days bulk pasteurized milk & wholesome multigrain porridge'],
    evidenceSummary: {
      hospitalContactVerified: false,
      documentsAuthentic: true,
      beneficiaryReached: true,
      reviewerNotes: 'Anganwadi worker survey reports and health charts verified.',
      verifiedDate: '17 Oct 2026',
      documentsList: ['Anganwadi Health Registers'],
    },
    updates: [],
    created_at: '2026-10-17T11:00:00Z',
    updated_at: '2026-10-21T16:00:00Z',
  },
  {
    id: 'camp-supp-other-1',
    title: 'Lightweight Mobility Wheelchairs & Tri-Cycles for 45 Paralyzed Artisans',
    description:
      'Restoring independence and dignity for disabled rural handloom weavers and potters by distributing customized rough-terrain mobility tricycles.',
    story:
      'Without mobility aids, paralyzed craftspersons are confined to their beds, unable to work or participate in social life. Jan Kalyan Trust is providing durable Indian-made wheelchairs tailored for unpaved rural paths.',
    category: 'other',
    targetAmount: 140000,
    target_amount: 140000,
    raisedAmount: 98000,
    raised_amount: 98000,
    supporterCount: 115,
    supporter_count: 115,
    deadline: '2026-11-18T23:59:59Z',
    daysRemaining: 21,
    organizer: DEMO_ORGANIZERS.sunita_patel,
    organizerId: DEMO_ORGANIZERS.sunita_patel.id,
    organizer_id: DEMO_ORGANIZERS.sunita_patel.id,
    isVerified: true,
    is_verified: true,
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    cover_image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    beneficiaryName: '45 Physically Challenged Artisans in Surendranagar',
    beneficiary_name: '45 Physically Challenged Artisans in Surendranagar',
    location: 'Surendranagar, Gujarat',
    taxExempt: true,
    intendedUse: ['₹1,10,000 — 45 All-terrain manual tricycles with rear baggage carriage'],
    evidenceSummary: {
      hospitalContactVerified: false,
      documentsAuthentic: true,
      beneficiaryReached: true,
      reviewerNotes: 'Disability certificates issued by Civil Hospital verified.',
      verifiedDate: '15 Oct 2026',
      documentsList: ['Disability Medical Board Certificates'],
    },
    updates: [],
    created_at: '2026-10-16T14:00:00Z',
    updated_at: '2026-10-20T10:00:00Z',
  },
];

type FilterChip = 'All' | 'Verified' | 'Urgent' | 'Recently Added';
type SortOption = 'Most Funded' | 'Newest' | 'Most Supporters';

export const CategoryPage: React.FC = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const { campaigns, updateCampaignTotal, addGoodnessPoints, addDemoTransaction } = useAppStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('All');
  const [activeSort, setActiveSort] = useState<SortOption>('Most Funded');
  const [visibleCount, setVisibleCount] = useState<number>(4);

  // Volunteering state
  const [joinedEvents, setJoinedEvents] = useState<Record<string, boolean>>({});

  // Donation modal state
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<ExtendedCampaign | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isSubmittingDonation, setIsSubmittingDonation] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Identify current category from demoData
  const currentCategory = useMemo(() => {
    const found = DONATE_CATEGORIES.find(
      (c) => c.slug.toLowerCase() === categorySlug?.toLowerCase()
    );
    if (found) return found;

    // Graceful fallback if unknown slug
    return {
      id: `cat-${categorySlug || 'general'}`,
      slug: categorySlug || 'general',
      name: categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Causes',
      subtitle: 'Verified Community Social Initiatives',
      description: 'Explore on-ground vetted campaigns and community initiatives dedicated to creating lasting social change.',
      iconName: 'Heart' as const,
      gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      activeCount: 18,
    };
  }, [categorySlug]);

  const isVolunteering = categorySlug?.toLowerCase() === 'volunteering';

  // Render Category Icon
  const renderCategoryIcon = (iconName: CategoryMetadata['iconName'], className = 'w-7 h-7 text-white') => {
    switch (iconName) {
      case 'Heart':
        return <Heart className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Utensils':
        return <Utensils className={className} />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      case 'Package':
        return <Package className={className} />;
      case 'Users':
        return <Users className={className} />;
      default:
        return <Heart className={className} />;
    }
  };

  // Combine store campaigns with supplemental campaigns (avoiding duplicate IDs)
  const allCategoryCampaigns = useMemo(() => {
    if (isVolunteering) return [];

    const existingIds = new Set(campaigns.map((c) => c.id));
    const merged = [...campaigns];

    // Append non-duplicate supplemental campaigns
    for (const supp of SUPPLEMENTAL_CAMPAIGNS) {
      if (!existingIds.has(supp.id)) {
        merged.push(supp);
      }
    }

    const slug = categorySlug?.toLowerCase() || '';

    // Filter by category matching
    return merged.filter((camp) => {
      const campCat = camp.category.toLowerCase();
      if (campCat === slug) return true;
      if (slug === 'other' && (campCat === 'other' || campCat === 'community' || campCat === 'essentials')) {
        return true;
      }
      return false;
    });
  }, [campaigns, categorySlug, isVolunteering]);

  // Filter & Sort Campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    if (isVolunteering) return [];

    let list = [...allCategoryCampaigns];
    const q = searchQuery.trim().toLowerCase();

    // 1. Search filter
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.location && c.location.toLowerCase().includes(q)) ||
          (c.beneficiaryName && c.beneficiaryName.toLowerCase().includes(q)) ||
          (c.organizer?.name && c.organizer.name.toLowerCase().includes(q))
      );
    }

    // 2. Chip filters
    if (activeFilter === 'Verified') {
      list = list.filter((c) => Boolean(c.isVerified ?? c.is_verified));
    } else if (activeFilter === 'Urgent') {
      list = list.filter((c) => {
        const days = c.daysRemaining ?? (c.deadline ? Math.ceil((new Date(c.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 14);
        return days <= 14 && days > 0;
      });
    } else if (activeFilter === 'Recently Added') {
      // Sort or filter recent items (first 3)
      list = list.slice(0, Math.max(3, Math.ceil(list.length * 0.75)));
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (activeSort === 'Most Funded') {
        const raisedA = a.raisedAmount ?? a.raised_amount ?? 0;
        const raisedB = b.raisedAmount ?? b.raised_amount ?? 0;
        return raisedB - raisedA;
      }
      if (activeSort === 'Newest') {
        const dateA = new Date(a.created_at || '2026-10-01').getTime();
        const dateB = new Date(b.created_at || '2026-10-01').getTime();
        return dateB - dateA;
      }
      if (activeSort === 'Most Supporters') {
        const supA = a.supporterCount ?? a.supporter_count ?? 0;
        const supB = b.supporterCount ?? b.supporter_count ?? 0;
        return supB - supA;
      }
      return 0;
    });

    return list;
  }, [allCategoryCampaigns, searchQuery, activeFilter, activeSort, isVolunteering]);

  // Filter & Sort Volunteering Events
  const filteredAndSortedEvents = useMemo(() => {
    if (!isVolunteering) return [];

    let list = [...DEMO_VOLUNTEERING_EVENTS];
    const q = searchQuery.trim().toLowerCase();

    // 1. Search filter
    if (q) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.organizer.name.toLowerCase().includes(q)
      );
    }

    // 2. Chip filters
    if (activeFilter === 'Verified') {
      list = list.filter((e) => e.organizer.isVerified);
    } else if (activeFilter === 'Urgent') {
      // Spots almost full (< 15 spots left)
      list = list.filter((e) => e.maxVolunteers - e.registeredVolunteers <= 15);
    } else if (activeFilter === 'Recently Added') {
      list = list.slice(0, 4);
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (activeSort === 'Most Funded') {
        // Map to most registered volunteers
        return b.registeredVolunteers - a.registeredVolunteers;
      }
      if (activeSort === 'Newest') {
        return a.id.localeCompare(b.id);
      }
      if (activeSort === 'Most Supporters') {
        return b.goodnessPoints - a.goodnessPoints;
      }
      return 0;
    });

    return list;
  }, [isVolunteering, searchQuery, activeFilter, activeSort]);

  // Aggregate stats for category header
  const totalCategoryRaised = useMemo(() => {
    return allCategoryCampaigns.reduce(
      (acc, c) => acc + (c.raisedAmount ?? c.raised_amount ?? 0),
      0
    );
  }, [allCategoryCampaigns]);

  // Handle Volunteering Event Join / RSVP
  const handleToggleJoinEvent = (event: VolunteeringEvent) => {
    const isCurrentlyJoined = Boolean(joinedEvents[event.id]);

    if (!isCurrentlyJoined) {
      setJoinedEvents((prev) => ({ ...prev, [event.id]: true }));
      addGoodnessPoints(event.goodnessPoints);
      toast.success(
        `🎉 Registered as volunteer for "${event.title}"! +${event.goodnessPoints} Goodness Points awarded!`,
        { duration: 4000 }
      );
    } else {
      setJoinedEvents((prev) => ({ ...prev, [event.id]: false }));
      toast('Registration cancelled for this event.', { icon: 'ℹ️' });
    }
  };

  // Open Donate Modal
  const handleOpenDonateModal = (campaign: ExtendedCampaign) => {
    setSelectedCampaignForDonation(campaign);
    setDonationAmount(500);
    setCustomAmount('');
    setDonorMessage('');
    setIsAnonymous(false);
  };

  // Confirm Simulated Donation
  const handleConfirmDemoDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignForDonation) return;

    const finalAmount = customAmount ? parseFloat(customAmount) : donationAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    setIsSubmittingDonation(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const earnedPoints = Math.max(25, Math.floor(finalAmount / 10));
    const txId = generateDemoTransactionId();

    updateCampaignTotal(selectedCampaignForDonation.id, finalAmount);
    addGoodnessPoints(earnedPoints);

    const newTx = {
      id: txId,
      amount: finalAmount,
      currency: 'INR',
      type: 'donation' as const,
      status: 'successful' as const,
      recipientType: 'campaign' as const,
      recipientId: selectedCampaignForDonation.id,
      recipientName: selectedCampaignForDonation.title,
      donorName: isAnonymous ? 'Anonymous Donor' : user?.name || 'Elena Rostova',
      paymentMethod,
      transactionRef: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      isDemo: true,
      message: donorMessage || 'Sending heartfelt prayers and support!',
      created_at: new Date().toISOString(),
      goodnessPointsEarned: earnedPoints,
    };
    addDemoTransaction(newTx);

    setIsSubmittingDonation(false);
    setSelectedCampaignForDonation(null);

    const receipt: ReceiptData = {
      transactionId: txId,
      amount: finalAmount,
      campaignTitle: selectedCampaignForDonation.title,
      campaignId: selectedCampaignForDonation.id,
      donorName: isAnonymous ? 'Anonymous' : user?.name || 'Elena Rostova',
      isAnonymous,
      paymentMethod: `${paymentMethod} (Demo Gateway)`,
      date: new Date().toISOString(),
      goodnessPointsEarned: earnedPoints,
      message: donorMessage || 'Warmest wishes and blessings for full recovery.',
    };
    setActiveReceipt(receipt);
    setIsReceiptOpen(true);

    toast.success(
      `🎉 Demo donation of ${formatINR(finalAmount)} successful! +${earnedPoints} Goodness Points earned!`,
      { duration: 4000 }
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
    setActiveSort('Most Funded');
  };

  return (
    <AppLayout containerClassName="max-w-6xl">
      {/* 1. BACK BUTTON TO /donate */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/donate')}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <span>Donate & Help</span>
          <span>/</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold capitalize">
            {currentCategory.name}
          </span>
        </div>
      </div>

      {/* 2. CATEGORY HEADER WITH GRADIENT BACKGROUND */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden bg-gradient-to-br ${currentCategory.gradient} text-white shadow-xl`}
      >
        {/* Subtle background ambient circles */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner border border-white/30">
              {renderCategoryIcon(currentCategory.iconName, 'w-8 h-8 sm:w-10 sm:h-10 text-white')}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-white/25 backdrop-blur-md text-white mb-2 shadow-sm border border-white/20">
                <Sparkles className="w-3 h-3 text-amber-300" />
                HelpLoop Cause Chapter
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                {currentCategory.name}
              </h1>
              <p className="text-white/90 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                {currentCategory.description}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill Column */}
          <div className="flex md:flex-col gap-2.5 sm:gap-3 flex-wrap md:items-end flex-shrink-0 border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-6">
            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-left md:text-right min-w-[120px]">
              <div className="text-xs text-white/80 font-medium">
                {isVolunteering ? 'Upcoming Events' : 'Active Campaigns'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {isVolunteering ? DEMO_VOLUNTEERING_EVENTS.length : allCategoryCampaigns.length} Drives
              </div>
            </div>

            {!isVolunteering && (
              <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-left md:text-right min-w-[120px]">
                <div className="text-xs text-white/80 font-medium">Funds Mobilized</div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formatINR(totalCategoryRaised)}
                </div>
              </div>
            )}

            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-left md:text-right min-w-[120px]">
              <div className="text-xs text-white/80 font-medium">Verification Rate</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">
                100% Vetted
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. SEARCH & FILTER CONTROLS BAR */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isVolunteering
                  ? 'Search drives, locations, skills needed (e.g. tree planting, Chennai)...'
                  : `Search campaigns in ${currentCategory.name} (title, hospital, location)...`
              }
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden md:inline">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer"
              >
                <option value="Most Funded">
                  {isVolunteering ? 'Most Volunteers' : 'Most Funded'}
                </option>
                <option value="Newest">Newest</option>
                <option value="Most Supporters">
                  {isVolunteering ? 'Highest Goodness Points' : 'Most Supporters'}
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Chips: All | Verified | Urgent | Recently Added */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs">
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mr-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filter:</span>
          </div>
          {(['All', 'Verified', 'Urgent', 'Recently Added'] as FilterChip[]).map((chip) => {
            const isActive = activeFilter === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveFilter(chip)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl font-bold transition-all flex-shrink-0 border',
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                )}
              >
                {chip === 'Urgent' && <Flame className="w-3 h-3 inline mr-1 text-amber-300" />}
                {chip === 'Verified' && <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-400" />}
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CONTENT GRID */}
      {isVolunteering ? (
        /* VOLUNTEERING EVENTS VIEW */
        <section>
          {filteredAndSortedEvents.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <Compass className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No volunteering drives match your criteria
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                Try clearing your search query or switching filters to see upcoming events.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedEvents.slice(0, visibleCount).map((event, idx) => {
                  const isJoined = Boolean(joinedEvents[event.id]);
                  const spotsLeft = Math.max(0, event.maxVolunteers - event.registeredVolunteers - (isJoined ? 1 : 0));
                  const progress = Math.min(
                    100,
                    Math.round(((event.registeredVolunteers + (isJoined ? 1 : 0)) / event.maxVolunteers) * 100)
                  );

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                    >
                      {/* Image header with tags */}
                      <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            +{event.goodnessPoints} Pts
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/50 text-white backdrop-blur-md border border-white/20">
                            {event.category}
                          </span>
                        </div>

                        {/* Bottom overlay with Date and Location */}
                        <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1 text-white text-xs">
                          <div className="flex items-center gap-1.5 font-bold drop-shadow">
                            <Calendar className="w-3.5 h-3.5 text-amber-300" />
                            <span>{event.date} • {event.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/90 drop-shadow line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          {/* Organizer */}
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar src={event.organizer.avatar} name={event.organizer.name} size="xs" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Organized by <strong className="text-gray-800 dark:text-gray-200">{event.organizer.name}</strong>
                            </span>
                            {event.organizer.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>

                          <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {event.title}
                          </h3>

                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>

                          {/* Perks pills */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {event.perks.map((perk, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              >
                                ✓ {perk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Capacity progress & RSVP Button */}
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 space-y-2.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 dark:text-gray-400">
                              <strong>{event.registeredVolunteers + (isJoined ? 1 : 0)}</strong> of {event.maxVolunteers} Volunteers
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {spotsLeft} spots left
                            </span>
                          </div>
                          <ProgressBar value={progress} height="sm" />

                          <Button
                            variant={isJoined ? 'secondary' : 'primary'}
                            fullWidth
                            size="md"
                            onClick={() => handleToggleJoinEvent(event)}
                            leftIcon={isJoined ? <Check className="w-4 h-4 text-emerald-600" /> : <Users className="w-4 h-4" />}
                            className="mt-2"
                          >
                            {isJoined ? 'Registered ✓ (Click to Cancel)' : 'Join as Volunteer'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Load More Button for Events */}
              {filteredAndSortedEvents.length > visibleCount && (
                <div className="text-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    rightIcon={<ChevronDown className="w-4 h-4" />}
                  >
                    Load More Events ({filteredAndSortedEvents.length - visibleCount} remaining)
                  </Button>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Showing {visibleCount} of {filteredAndSortedEvents.length} volunteering drives
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      ) : (
        /* CAMPAIGNS VIEW (2 Columns on Desktop, 1 on Mobile as specified) */
        <section>
          {filteredAndSortedCampaigns.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No campaigns found in {currentCategory.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                No campaigns match your current search or filter. Try clearing filters to see all available initiatives.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 2 columns on desktop, 1 on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedCampaigns.slice(0, visibleCount).map((camp) => (
                  <CampaignCard
                    key={camp.id}
                    campaign={camp}
                    layout="grid"
                    onClick={() => navigate(`/campaign/${camp.id}`)}
                    onDonate={() => handleOpenDonateModal(camp)}
                  />
                ))}
              </div>

              {/* Load More / Pagination */}
              {filteredAndSortedCampaigns.length > visibleCount && (
                <div className="text-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    rightIcon={<ChevronDown className="w-4 h-4" />}
                  >
                    Load More Campaigns ({filteredAndSortedCampaigns.length - visibleCount} remaining)
                  </Button>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Showing {visibleCount} of {filteredAndSortedCampaigns.length} campaigns
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 5. SIMULATED QUICK DONATION MODAL */}
      <Modal
        isOpen={Boolean(selectedCampaignForDonation)}
        onClose={() => setSelectedCampaignForDonation(null)}
        title="Simulated Demo Donation"
        description="Support this cause in demo mode. All transactions and goodness points are simulated."
        size="md"
      >
        {selectedCampaignForDonation && (
          <form onSubmit={handleConfirmDemoDonation} className="space-y-4">
            {/* Campaign Summary Card */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <img
                src={selectedCampaignForDonation.coverImage || selectedCampaignForDonation.cover_image}
                alt={selectedCampaignForDonation.title}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 capitalize mb-0.5">
                  {selectedCampaignForDonation.category}
                </span>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                  {selectedCampaignForDonation.title}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Beneficiary: {selectedCampaignForDonation.beneficiaryName || 'Verified Recipient'}
                </p>
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Choose Amount (INR)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[250, 500, 1000, 2500].map((amt) => {
                  const isSelected = !customAmount && donationAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setDonationAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  );
                })}
              </div>

              {/* Custom amount */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="50"
                  max="1000000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Or enter custom amount (e.g. 1500)"
                  className="w-full pl-8 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Simulated Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { id: 'Card', label: 'Debit/Credit', icon: <CreditCard className="w-3.5 h-3.5" /> },
                  { id: 'NetBanking', label: 'NetBanking', icon: <Building2 className="w-3.5 h-3.5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      paymentMethod === item.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Words of Encouragement (Optional)
              </label>
              <input
                type="text"
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="e.g., Wishing you a speedy recovery and strength!"
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="cat-anonymous-check"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
              <label
                htmlFor="cat-anonymous-check"
                className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none"
              >
                Donate anonymously (hide my identity on public donor wall)
              </label>
            </div>

            {/* Goodness Points preview */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Goodness Points you will earn:</span>
              </div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-md shadow-sm border border-emerald-200 dark:border-emerald-700">
                +{Math.max(25, Math.floor((customAmount ? parseFloat(customAmount) || 0 : donationAmount) / 10))} pts
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCampaignForDonation(null)}
                disabled={isSubmittingDonation}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmittingDonation}
                leftIcon={<Heart className="w-4 h-4 fill-white" />}
              >
                Confirm Demo Donation of {formatINR(customAmount ? parseFloat(customAmount) || 0 : donationAmount)}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 6. OFFICIAL DEMO RECEIPT MODAL */}
      <DemoReceipt
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={activeReceipt}
      />
    </AppLayout>
  );
};

export default CategoryPage;
