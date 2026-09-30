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
  LuShieldCheck,
  LuTruck,
  LuGift,
  LuCheck,
} from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FiPhone, FiMapPin, FiArrowLeft } from "react-icons/fi";
import Logo from "@/components/ui/logo";

function SignUpFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const { register, loginWithGoogle, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
        setError(err instanceof Error ? err.message : "Google registration failed. Please try again.");
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

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.push(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
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
        {/* Left Column: Benefits & Trust (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#121614] via-[#1A221E] to-[#121614] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="mb-8">
              <Logo variant="light" size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-4">
              <span>Verified Marketplace</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Create Your Customer Account
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
              Join 50,000+ happy shoppers enjoying verified products, fast nationwide doorstep delivery, and member benefits.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <LuGift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Exclusive Member Offers</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Special promotional vouchers on seasonal deals</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <LuTruck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Real-Time Delivery Tracker</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Live parcel tracking from our central logistics hub</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <LuShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">7-Day Hassle-Free Returns</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Prompt pickup and full refund protection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 text-xs text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-300">
              <FiMapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Banani, Dhaka, Rajshahi</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <FiPhone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Hotline: 01712345678</span>
            </div>
          </div>
        </div>

        {/* Right Column: Register Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
                  Sign Up
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Create your free account in 30 seconds
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400">Already a member?</span>
                <Link
                  href="/login"
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Log In
                </Link>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Google 1-Click Register */}
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              disabled={googleLoading || submitting}
              className="w-full flex items-center justify-center gap-3 border border-zinc-300 py-3 rounded-xl hover:bg-zinc-50 hover:border-zinc-400 transition-all font-semibold text-xs text-zinc-800 cursor-pointer shadow-xs disabled:opacity-60"
            >
              {googleLoading ? <LuLoader className="w-4 h-4 animate-spin" /> : <FcGoogle className="w-5 h-5" />}
              <span>{googleLoading ? "Connecting..." : "Sign Up with Google"}</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                  Or register with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saikat Islam"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 pr-10 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                    >
                      {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 pr-10 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <p className="text-[11px] text-zinc-500 leading-normal">
                  By clicking Sign Up, you agree to our 7-day return policy and customer guidelines.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting && <LuLoader className="w-4 h-4 animate-spin" />}
                <span>{submitting ? "Creating Account..." : "Create Customer Account"}</span>
              </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-zinc-400">
              Need help? Hotline: <strong className="text-zinc-600">01712345678</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
          <LuLoader className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <SignUpFormContent />
    </Suspense>
  );
}
