import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Award,
  Sparkles,
  Info,
  Heart,
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { DEMO_EVENTS, DEMO_USERS } from '../data/demoData';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addGoodnessPoints } = useAppStore();

  const event = DEMO_EVENTS.find((e) => e.id === id) || DEMO_EVENTS[0];
  const [isJoined, setIsJoined] = useState(event.isJoined || false);
  const [attendeeCount, setAttendeeCount] = useState(event.registeredVolunteers || 15);

  const handleToggleJoin = () => {
    if (!isJoined) {
      if (attendeeCount >= event.maxVolunteers) {
        toast.error('This event has reached full volunteer capacity! Added to waitlist.');
        return;
      }
      setIsJoined(true);
      setAttendeeCount((prev) => prev + 1);
      const points = event.goodnessPoints || 100;
      addGoodnessPoints(points);
      toast.success(`Registered for ${event.title}! +${points} Goodness Points 🎉`);
    } else {
      setIsJoined(false);
      setAttendeeCount((prev) => Math.max(0, prev - 1));
      toast('Registration cancelled', { icon: 'ℹ️' });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Volunteering Events
        </button>

        {/* Hero Card */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {event.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black leading-tight">{event.title}</h1>
              <p className="text-emerald-100 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" /> {event.location}
              </p>
            </div>
          </div>
        </div>

        {/* Key Information Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Calendar className="w-5 h-5 text-emerald-600 mb-1" />
            <p className="text-xs text-gray-400">Date</p>
            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
              {new Date(event.startDate).toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Clock className="w-5 h-5 text-blue-600 mb-1" />
            <p className="text-xs text-gray-400">Time</p>
            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{event.time || '07:30 AM – 11:30 AM'}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Users className="w-5 h-5 text-teal-600 mb-1" />
            <p className="text-xs text-gray-400">Participants</p>
            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
              {attendeeCount} / {event.maxVolunteers} joined
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Award className="w-5 h-5 text-amber-500 mb-1" />
            <p className="text-xs text-gray-400">Reward</p>
            <p className="font-bold text-sm text-amber-600">+{event.goodnessPoints || 100} Goodness Points</p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={event.organizer.avatarUrl || event.organizer.avatar} name={event.organizer.name} size="lg" />
            <div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">
                Organized by Verified Partner
              </p>
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-1.5">
                {event.organizer.name}
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h3>
              <p className="text-xs text-gray-500">Contact: coordinator@helploop.in</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant={isJoined ? 'outline' : 'primary'}
              className="flex-1 sm:flex-none"
              onClick={handleToggleJoin}
            >
              {isJoined ? 'Cancel Registration' : 'Register as Volunteer'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Event link copied to clipboard!');
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Description & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">About the Volunteering Activity</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>

              {event.perks && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">What is Provided</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.perks.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300"
                      >
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Safety & Guidelines</h3>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Wear comfortable footwear and cotton clothing.</li>
                <li>• Carry a reusable personal water bottle.</li>
                <li>• All waste collection gear will be distributed on arrival.</li>
                <li>• Verified completion issues digital certificate hours.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
