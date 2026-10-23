import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, AtSign, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, isAuthenticated } = useAuthStore();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');



  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!agreed) { setError('Please accept the Terms of Service'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const result = await signup(form.email, form.password, form.name);
    if (result.success) {
      toast.success('Welcome to HelpLoop! 🎉');
      navigate('/home', { replace: true });
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-800 p-12 flex-col justify-between">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group text-white hover:text-emerald-100 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold text-emerald-100">Back to HelpLoop</span>
          </Link>
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
            Grassroots Impact Network
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">Join thousands making a difference</h1>
          <p className="text-emerald-100 text-lg">Create your account and start your impact journey today.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[['12,400+', 'People Helped'],['8,200+', 'Volunteers'],['340+', 'Communities'],['₹47L+', 'Raised']].map(([n, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl font-black text-white">{n}</div>
                <div className="text-emerald-200 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-emerald-200 text-sm">Real People. Real Help. A Stronger Tomorrow.</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Back to Home Link */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to HelpLoop Home</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 lg:hidden">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5"><circle cx="16" cy="16" r="12" stroke="white" strokeWidth="2.5"/><path d="M10 16a6 6 0 016-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <span className="font-bold text-gray-900">HelpLoop</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-1">Start your impact journey for free</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex gap-2 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Demo mode: Any email and password works. No real account is created.</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input-field pl-10" placeholder="Arjun Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input-field pl-10" placeholder="arjun_s" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">Password strength: <span className="font-medium">{strengthLabel[strength]}</span></span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" className="input-field pl-10 pr-10" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required />
                {form.confirm && (
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${form.password === form.confirm ? 'text-emerald-500' : 'text-red-400'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-emerald-500 rounded" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to HelpLoop's{' '}
                <span className="text-emerald-600 font-medium cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-emerald-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreed}
              className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
