"use client";

import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/_providers/auth-provider";
import { useGoogleLogin } from "@react-oauth/google";
import {
  LuEye,
  LuEyeOff,
  LuLoader,
  LuLock,
  LuShieldCheck,
  LuTruck,
  LuCheck,
} from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FiPhone, FiMapPin, FiArrowLeft } from "react-icons/fi";
import Logo from "@/components/ui/logo";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const { login, loginWithGoogle, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // If already logged in, redirect to profile or specified path
  if (isAuthenticated) {
    router.replace(redirectUrl);
  }

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setGoogleLoading(true);
      try {
        await loginWithGoogle(tokenResponse.access_token);
        router.push(redirectUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setGoogleLoading(false);
      setError("Google sign-in was cancelled or failed.");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.push(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top back button */}
      <div className="max-w-5xl mx-auto w-full mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-emerald-700 transition-colors uppercase tracking-wider"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-zinc-200/80 overflow-hidden">
        {/* Left Column: Brand & Trust Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#121614] via-[#1A221E] to-[#121614] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="mb-8">
              <Logo variant="light" size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-4">
              <span>Webdev Software Solutions</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Welcome to Your Shopping Gateway
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
              Log in to manage your orders, track shipments across Dhaka & nationwide, and enjoy exclusive member vouchers.
            </p>

            {/* Value bullets */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <LuShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">100% Genuine Guarantee</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Strict quality inspection on every shipment</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <LuTruck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Next-Day Dhaka & Nationwide Delivery</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Dispatched securely from our central logistics hub</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <LuLock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Bank-Grade 256-Bit Protection</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Safe payments via bKash, Nagad & Cards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Support Footer */}
          <div className="pt-8 mt-8 border-t border-white/10 text-xs text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-300">
              <FiMapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Banani, Dhaka, Rajshahi</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <FiPhone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Executive Hotline: 01712345678</span>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
                  Sign In
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Access your customer portal
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400">New here?</span>
                <Link
                  href="/signup"
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Google 1-Click Login */}
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              disabled={googleLoading || submitting}
              className="w-full flex items-center justify-center gap-3 border border-zinc-300 py-3 rounded-xl hover:bg-zinc-50 hover:border-zinc-400 transition-all font-semibold text-xs text-zinc-800 cursor-pointer shadow-xs disabled:opacity-60"
            >
              {googleLoading ? <LuLoader className="w-4 h-4 animate-spin" /> : <FcGoogle className="w-5 h-5" />}
              <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                  Or sign in with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. saikat@example.com"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Password
                  </label>
                  <a
                    href="tel:01712345678"
                    className="text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 pr-11 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberLogin}
                    onChange={(e) => setRememberLogin(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span className="text-xs text-zinc-600 font-medium">Keep me signed in</span>
                </label>

                <span className="text-[11px] text-zinc-400">
                  Verified Secure SSL
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting && <LuLoader className="w-4 h-4 animate-spin" />}
                <span>{submitting ? "Signing in..." : "Sign In to Account"}</span>
              </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-zinc-400">
              Questions? Call customer support: <strong className="text-zinc-600">01712345678</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
          <LuLoader className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
