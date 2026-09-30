"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useAuth } from "@/app/_providers/auth-provider";
import { useGoogleLogin } from "@react-oauth/google";
import {
  LuX,
  LuEye,
  LuEyeOff,
  LuLoader,
  LuShieldCheck,
  LuTruck,
  LuGift,
} from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FiPhone, FiMapPin } from "react-icons/fi";
import Logo from "@/components/ui/logo";

type AuthView = "login" | "register";

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, register, loginWithGoogle } = useAuth();

  const [view, setView] = useState<AuthView>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setGoogleLoading(true);
      try {
        await loginWithGoogle(tokenResponse.access_token);
        handleClose();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Google sign-in failed. Please try again.";
        if (msg.includes("Failed to fetch") || msg.toLowerCase().includes("cannot connect")) {
          setError("Unable to connect to the backend server. Please verify the API server is running on port 5010.");
        } else {
          setError(msg);
        }
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setGoogleLoading(false);
      setError("Google sign-in was cancelled or failed.");
    },
  });

  if (!showAuthModal) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchView = () => {
    const next = view === "login" ? "register" : "login";
    setView(next);
    resetForm();
  };

  const handleClose = () => {
    setShowAuthModal(false);
    resetForm();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (view === "register") {
      if (!name.trim()) {
        setError("Please enter your name.");
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
    }

    setSubmitting(true);
    try {
      if (view === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      handleClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed. Please check credentials.";
      if (msg.includes("Failed to fetch") || msg.toLowerCase().includes("cannot connect")) {
        setError("Unable to connect to the backend server. Please verify the API server is running on port 5010.");
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-zinc-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          aria-label="Close"
        >
          <LuX className="w-5 h-5" />
        </button>

        {/* Left Decorative & Info Section (5 cols on md) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#121614] via-[#1A221E] to-[#121614] text-white p-8 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <Logo variant="light" size="sm" />

            <div className="inline-block mt-4 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[9px] font-bold tracking-widest uppercase">
              Webdev Software Solutions
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mt-3 leading-snug">
              {view === "login"
                ? "Sign In to Access Your Orders & Saved Cart"
                : "Create Your Account & Claim Member Benefits"}
            </h3>

            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Serving customers with verified products, express Dhaka delivery, and bank-grade data security.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2.5">
                <LuShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-zinc-300">100% Genuine Certified Brands</span>
              </div>
              <div className="flex items-start gap-2.5">
                <LuTruck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-zinc-300">Central Logistics &amp; Fast Nationwide Dispatch</span>
              </div>
              <div className="flex items-start gap-2.5">
                <LuGift className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-zinc-300">Exclusive Vouchers &amp; Flash Deal Alerts</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-emerald-500/40 ring-2 ring-emerald-500/20 shrink-0">
                <Image
                  src="/images/team/Abdullah.jpg"
                  alt="NovaMart Team"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="text-white font-bold">NovaMart Team</div>
                <div className="text-[10px] text-emerald-400 font-medium">Founder &amp; CEO</div>
              </div>
            </div>
            <div className="text-right text-[10px] text-zinc-400">
              <div className="flex items-center justify-end gap-1 text-zinc-300">
                <FiMapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Mohadevpur</span>
              </div>
              <a href="tel:01712345678" className="text-zinc-300 hover:text-emerald-400 font-semibold block mt-0.5">
                01712345678
              </a>
            </div>
          </div>
        </div>

        {/* Right Form Section (7 cols on md) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Header & Tabs - pr-12 leaves ample space for close button */}
          <div className="flex items-start justify-between pb-3 border-b border-zinc-100 mb-5 pr-12">
            <div>
              <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
                {view === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {view === "login" ? "Enter your email to sign in" : "Sign up in 30 seconds"}
              </p>
            </div>

            <button
              type="button"
              onClick={switchView}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer shrink-0 pt-1"
            >
              {view === "login" ? "New? Register" : "Have account? Log in"}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Google 1-Click */}
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            disabled={googleLoading || submitting}
            className="w-full flex items-center justify-center gap-2.5 border border-zinc-300 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors text-xs font-bold text-zinc-800 shadow-xs cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? <LuLoader className="w-4 h-4 animate-spin" /> : <FcGoogle className="w-4 h-4" />}
            <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                Or with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {view === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saikat Islam"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
              />
            </div>

            <div className={`grid gap-3 ${view === "register" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
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

              {view === "register" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat"
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
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
              )}
            </div>

            {view === "login" && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberLogin}
                    onChange={(e) => setRememberLogin(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span className="text-zinc-600">Remember login</span>
                </label>
                <a href="tel:01712345678" className="text-emerald-600 hover:underline">
                  Need help?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {submitting && <LuLoader className="w-4 h-4 animate-spin" />}
              <span>
                {submitting
                  ? "Processing..."
                  : view === "login"
                    ? "Sign In"
                    : "Create Account"}
              </span>
            </button>
          </form>

          {/* Bottom Switch View */}
          <div className="mt-4 pt-3 border-t border-zinc-100 text-center text-xs text-zinc-500">
            {view === "login" ? (
              <span>
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={switchView}
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchView}
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}
