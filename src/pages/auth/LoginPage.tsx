import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { HelpLoopLogo } from '../../components/common/HelpLoopLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});



  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    setErrorMessage(null);

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setErrorMessage(null);
      const res = await login(email.trim(), password);
      if (res && !res.success) {
        setErrorMessage(res.error || 'Invalid credentials. Please try again.');
        return;
      }
      toast.success('Signed in successfully! Welcome to HelpLoop.');
      navigate('/home', { replace: true });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setErrorMessage(errorMsg);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@helploop.in');
    setPassword('demo123');
    setFieldErrors({});
    setErrorMessage(null);

    try {
      const res = await login('demo@helploop.in', 'demo123');
      if (res && !res.success) {
        setErrorMessage(res.error || 'Could not sign in with demo credentials.');
        return;
      }
      toast.success('Welcome back to HelpLoop!');
      navigate('/home', { replace: true });
    } catch {
      setErrorMessage('Could not sign in with demo credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top right quick theme switch & back button */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="w-full flex flex-col lg:flex-row">
        {/* ======================================================== */}
        {/* LEFT COLUMN: BRANDING, VISUALS, & SOCIAL PROOF           */}
        {/* ======================================================== */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-hero flex-col justify-between p-12 text-white overflow-hidden">
          {/* Subtle decorative glow balls */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Back to Home */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group text-white">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold text-emerald-100">Back to HelpLoop</span>
            </Link>
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
              Grassroots Impact Network
            </div>
          </div>

          {/* Centerpiece Testimonial & Value Statement */}
          <div className="relative z-10 max-w-lg my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Direct Aid</span>
            </div>

            <blockquote className="text-2xl xl:text-3xl font-extrabold leading-snug tracking-tight mb-6">
              “HelpLoop transformed how our neighborhood handles emergencies. Transparency isn’t just a buzzword here—it’s verified in every receipt.”
            </blockquote>

            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&fit=crop&q=80"
                alt="Sunita Rao"
                className="w-12 h-12 rounded-full border-2 border-white/40 object-cover"
              />
              <div>
                <div className="font-bold text-base text-white">Sunita Rao</div>
                <div className="text-xs text-emerald-200">Community Volunteer Lead • Bengaluru East</div>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Direct</span>
                </div>
                <div className="text-xs text-emerald-100/80 leading-relaxed">
                  Zero commission on emergency medical campaigns.
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audited Ledgers</span>
                </div>
                <div className="text-xs text-emerald-100/80 leading-relaxed">
                  Every disbursement verified with hospital receipts.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/80 pt-6 border-t border-white/15">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>256-bit Bank Grade Encryption</span>
            </div>
            <span>© 2024 HelpLoop</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: LOGIN FORM                                 */}
        {/* ======================================================== */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            {/* Mobile Back Link */}
            <div className="lg:hidden mb-6">
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-emerald-600">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to HelpLoop Home</span>
              </Link>
            </div>

            {/* Logo at Top of Form */}
            <div className="mb-8">
              <HelpLoopLogo iconSize="lg" badge="Access" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-6">
                Welcome back
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Enter your credentials to access your community account.
              </p>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-xs uppercase tracking-wider mb-0.5">Authentication Failed</div>
                    <div>{errorMessage}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                    }}
                    placeholder="you@domain.com"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      fieldErrors.email
                        ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500'
                        : 'border-gray-200 dark:border-gray-800 focus:border-emerald-500'
                    }`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                    }}
                    placeholder="••••••••••••"
                    className={`w-full pl-10 pr-11 py-3 bg-white dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      fieldErrors.password
                        ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500'
                        : 'border-gray-200 dark:border-gray-800 focus:border-emerald-500'
                    }`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                  Keep me signed in on this device
                </label>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 dark:bg-gray-950 px-3 text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                  Or instant access
                </span>
              </div>
            </div>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold text-sm rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                  🚀
                </div>
                <div className="text-left">
                  <div className="font-bold text-xs text-gray-900 dark:text-white">Login as Demo User</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">demo@helploop.in / demo123</div>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900 transition-colors">
                1-Click
              </span>
            </button>

            {/* Link to Signup */}
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Don’t have an account?{' '}
              <Link
                to="/signup"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
