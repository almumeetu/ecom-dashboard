"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HiShieldCheck,
  HiTruck,
  HiBadgeCheck,
  HiOutlineSupport,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiStar,
  HiCheckCircle,
} from "react-icons/hi";
import {
  FiArrowRight,
  FiShoppingBag,
  FiUsers,
  FiAward,
  FiExternalLink,
} from "react-icons/fi";
import { FaWhatsapp, FaQuoteLeft, FaFacebook, FaPlay } from "react-icons/fa6";
import ScrollAnimate from "@/components/ui/scroll-animate";

export default function About() {
  const stats = [
    { value: "50,000+", label: "সন্তুষ্ট পরিবার", icon: FiUsers },
    { value: "100%", label: "ফরমালিনমুক্ত ও খাঁটি", icon: HiShieldCheck },
    { value: "সরাসরি বাগান", label: "মাঝে কোনো মধ্যস্বত্বভোগী নেই", icon: FiShoppingBag },
    { value: "৬৪ জেলা", label: "দ্রুত হোম ডেলিভারি", icon: HiTruck },
  ];

  const reels = [
    {
      title: "আজ থেকে শুরু হচ্ছে রুপালী আমের হোম ডেলিভারি",
      subtitle: "রাজশাহীর বাগান থেকে সরাসরি গাছপাকা রুপালী ও আম্রপালি আম প্যাকিং ও ডিসপ্যাচ।",
      url: "https://www.facebook.com/reel/2085813248644612",
      badge: "আম্রপালি ও রুপালী আম",
      tag: "Live Harvest",
    },
    {
      title: "সরাসরি বাগান থেকে আপনার বাড়ি — কোনো আড়ত নেই",
      subtitle: "গাছ থেকে পেরে সরাসরি ক্রেতার ঠিকানায় কুরিয়ার। শতভাগ ফরমালিনমুক্ত ও খাঁটি।",
      url: "https://www.facebook.com/reel/1037525895516511",
      badge: "বাগান থেকে সরাসরি",
      tag: "Orchard Fresh",
    },
    {
      title: "খাঁটি সতেজতার নিশ্চয়তা — ট্রাস্ট পয়েন্ট",
      subtitle: "মোহাম্মদ আব্দুল্লাহর সরাসরি তত্ত্বাবধানে প্রতিটি ঝুড়ি ও ক্রেটের কোয়ালিটি চেক।",
      url: "https://www.facebook.com/reel/730088990198543",
      badge: "কোয়ালিটি গ্যারান্টি",
      tag: "Verified Pure",
    },
  ];

  const pillars = [
    {
      icon: HiShieldCheck,
      title: "১০০% ফরমালিনমুক্ত ও খাঁটি",
      desc: "সরাসরি বাগান থেকে গাছপাকা আম সংগ্রহ করা হয়। কোনো প্রকার কেমিক্যাল বা কৃত্রিম পাকানোর ওষুধ স্পর্শও করে না।",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      icon: HiTruck,
      title: "সরাসরি বাগান থেকে আপনার বাড়ি",
      desc: "মাঝে কোনো আড়ত বা মধ্যস্বত্বভোগী নেই। তাই বাগান থেকে তুলে সরাসরি নিজস্ব তত্ত্বাবধানে দ্রুত আপনার ঘরে পৌঁছে দেওয়া হয়।",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: HiBadgeCheck,
      title: "সততাই আমাদের মূলধন (Trust Point)",
      desc: "ব্যবসা শুধু পণ্য বিক্রয় নয়, এটি একটি পবিত্র আমানত। ওজনে নিখুঁত, মানে সেরা এবং প্রতিটি ফলের জন্য আমাদের পূর্ণ দায়বদ্ধতা।",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      icon: HiOutlineSupport,
      title: "ফাউন্ডার ও ডিরেক্ট হেল্পলাইন",
      desc: "যেকোনো পরামর্শ, অর্ডার বা বাল্ক বুকিংয়ের জন্য প্রতিষ্ঠাতা মোহাম্মদ আব্দুল্লাহর সরাসরি হটলাইন 01707819676-এ যোগাযোগ করতে পারেন।",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  const categories = [
    {
      title: "রাজশাহীর খাঁটি ও ফরমালিনমুক্ত আম",
      desc: "রূপালী, আম্রপালি, গোপালভোগ, ক্ষীরশাপাত ও হিমসাগর আম—সরাসরি বাগান থেকে পেড়ে হোম ডেলিভারি।",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
      tag: "বাগান ফ্রেশ",
      link: "/products?search=mango",
    },
    {
      title: "খাঁটি খাদ্য ও অর্গানিক গ্রোসারি",
      desc: "ঘানিভাঙা খাঁটি সরিষার তেল, সুন্দরবনের প্রাকৃতিক মধু, ঘি ও পুষ্টিকর ড্রাই ফ্রুটস।",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
      tag: "১০০% অর্গানিক",
      link: "/products?search=grocery",
    },
    {
      title: "ফ্যাশন ও প্রিমিয়াম লাইফস্টাইল",
      desc: "আরামদায়ক ঐতিহ্যবাহী পাঞ্জাবি, সমকালীন পোশাক এবং দীর্ঘস্থায়ী প্রিমিয়াম ফ্যাশন কালেকশন।",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
      tag: "ট্রেন্ডিং",
      link: "/products?category=Fashion",
    },
    {
      title: "ফুটওয়্যার ও প্রয়োজনীয় এক্সেসরিজ",
      desc: "টেকসই স্নিকার্স, চামড়ার বেল্ট, ওয়ালেট ও দৈনন্দিন আধুনিক ফ্যাশন অনুষঙ্গ।",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      tag: "প্রিমিয়াম কোয়ালিটি",
      link: "/products?category=Footwear",
    },
  ];

  const testimonials = [
    {
      quote:
        "ট্রাস্ট পয়েন্ট থেকে রূপালী ও গোপালভোগ আম নিয়েছিলাম। প্রতিটি আম ছিল অক্ষত, মিষ্টি এবং সত্যিই গাছপাকা সুবাসযুক্ত। কোনো কেমিক্যালের গন্ধ ছিল না। মোহাম্মদ আব্দুল্লাহ ভাইয়ের সততা প্রশংসনীয়!",
      author: "ইঞ্জি. তারিকুল ইসলাম",
      location: "উত্তরা, ঢাকা",
      rating: 5,
    },
    {
      quote:
        "সরাসরি বাগান থেকে এত নিখুঁতভাবে কুরিয়ার প্যাকেজিং করে পাঠানো সত্যিই অবিশ্বাস্য। অনলাইনে আম কেনায় আগের খারাপ অভিজ্ঞতা ট্রাস্ট পয়েন্ট সম্পূর্ণ দূর করে দিয়েছে।",
      author: "ড. সামসুল আরেফিন",
      location: "রাজশাহী",
      rating: 5,
    },
    {
      quote:
        "মাঝে কোনো আড়তদার বা মধ্যস্বত্বভোগী না থাকায় দাম ছিল একদম ন্যায্য এবং মান অতুলনীয়। ডেলিভারিও পেয়েছি একদম সময়মতো। ট্রাস্ট পয়েন্টের জন্য শুভকামনা।",
      author: "নাসরিন সুলতানা",
      location: "ধানমন্ডি, ঢাকা",
      rating: 5,
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] text-zinc-900 font-sans">
      {/* ── 1. Impact Metrics Bar (Cleanly Spaced) ── */}
      <section className="pt-8 sm:pt-10 pb-4 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-zinc-200/80 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center p-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 2. Our Story Section: Trust Point ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <ScrollAnimate variant="fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wider uppercase">
                <FiAward className="w-4 h-4 text-emerald-600" />
                <span>আমাদের পরিচিতি ও অঙ্গীকার</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-[1.18]">
                সরাসরি বাগান থেকে আপনার বাড়ি, <span className="text-emerald-600">মাঝে কোনো মধ্যস্বত্বভোগী নেই</span>
              </h2>

              <p className="text-base sm:text-lg text-zinc-700 leading-relaxed font-normal">
                তরুণ উদ্যোক্তা ও দূরদর্শী নেতা <strong className="text-zinc-950 font-bold">মোহাম্মদ আব্দুল্লাহর</strong> হাত ধরে <strong className="text-zinc-950 font-bold">মহাদেবপুর, নওগাঁ, রাজশাহী</strong> থেকে গড়ে উঠেছে <strong className="text-emerald-700 font-extrabold">ট্রাস্ট পয়েন্ট (Trust Point)</strong>। আমাদের একমাত্র লক্ষ্য—অনলাইন কেনাকাটায় আস্থার সংকট দূর করে শতভাগ খাঁটি ও নিরাপদ পণ্য ঘরে ঘরে পৌঁছে দেওয়া।
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 text-sm leading-relaxed">
                <p className="font-semibold text-emerald-900 mb-1">
                  🌿 শতভাগ ফরমালিনমুক্ত ও খাঁটি সতেজতার গ্যারান্টি:
                </p>
                রাজশাহীর বিখ্যাত আম বাগান থেকে কোনো আড়তদার বা মধ্যস্বত্বভোগীর হাত ছাড়া সরাসরি আম সংগ্রহ করা হয়। গাছ থেকে নামিয়ে সযত্নে বাছাই করে নিজস্ব প্যাকিংয়ে দেশের যেকোনো প্রান্তে পৌঁছে দেওয়া হয়।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                  <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">মহাদেবপুর, নওগাঁ হেডকোয়ার্টার</h4>
                    <p className="text-xs text-zinc-500 mt-1">সরাসরি স্থানীয় বাগান ও চাষীদের সাথে সংযোগ এবং কেন্দ্রীয় কোয়ালিটি নিয়ন্ত্রণ।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                  <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">ভেজাল ও কেমিক্যালমুক্ত নিশ্চয়তা</h4>
                    <p className="text-xs text-zinc-500 mt-1">ক্যালসিয়াম কার্বাইড বা ফরমালিনের সম্পূর্ণ বিপরীত—প্রাকৃতিক সতেজতা।</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <span>পণ্যসমূহ দেখুন</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:01707819676"
                  className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-sm px-7 py-3.5 rounded-full border border-zinc-200 shadow-xs transition-all cursor-pointer"
                >
                  <HiPhone className="w-4 h-4 text-emerald-600" />
                  <span>সরাসরি কল করুন: 01707819676</span>
                </a>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-zinc-900 aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=900&auto=format&fit=crop&q=80"
                  alt="Fresh garden mangoes direct from orchard"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />

                {/* Floating Glassmorphic Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                      TP
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-950 leading-tight">
                        Trust Point (ট্রাস্ট পয়েন্ট)
                      </h4>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        সরাসরি বাগান থেকে আপনার বাড়ি • মহাদেবপুর, নওগাঁ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* ── 3. EXECUTIVE SPOTLIGHT: FOUNDER & CEO MOHAMMAD ABDULLAH ── */}
      <section className="py-20 sm:py-28 bg-[#0D1117] text-white relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-inner">
              <HiBadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Executive Leadership • প্রতিষ্ঠাতা ও পরিচালক</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Meet Our Founder &amp; CEO
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-3.5 leading-relaxed">
              সততা, দায়িত্বশীল নেতৃত্ব ও খাঁটি পণ্যের নিশ্চয়তায় ট্রাস্ট পয়েন্টকে এগিয়ে নিয়ে যাচ্ছেন মোহাম্মদ আব্দুল্লাহ।
            </p>
          </div>

          {/* Main CEO Executive Profile Card */}
          <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Left Column: Portrait & Direct Contact Actions */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-xs sm:max-w-sm mx-auto group">
                  {/* Glowing Ring Effect */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 rounded-3xl opacity-40 group-hover:opacity-75 blur-md transition duration-500" />
                  
                  <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border-2 border-white/20 aspect-square shadow-2xl">
                    <Image
                      src="/images/team/abdullah-2.jpg"
                      alt="Mohammad Abdullah - Founder & CEO of Trust Point"
                      width={960}
                      height={957}
                      priority
                      className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                    
                    {/* Floating Verified Seal Badge */}
                    <div className="absolute top-4 right-4 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-emerald-400/40">
                      <HiShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>Verified Founder &amp; Owner</span>
                    </div>

                    {/* Bottom Image Overlay Caption */}
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <div className="text-white font-extrabold text-lg sm:text-xl leading-snug">
                        Mohammad Abdullah
                      </div>
                      <div className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 mt-0.5">
                        <HiLocationMarker className="w-3.5 h-3.5 shrink-0" />
                        <span>Mohadevpur, Naogaon, Rajshahi</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct CEO Action Buttons below portrait */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xs sm:max-w-sm mt-5">
                  <a
                    href="tel:01707819676"
                    className="inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
                  >
                    <HiPhone className="w-4 h-4 shrink-0" />
                    <span>Call: 01707819676</span>
                  </a>

                  <a
                    href="https://wa.me/8801707819676?text=Assalamu%20Alaikum%20Mohammad%20Abdullah%20Sir%2C%20I%20am%20contacting%20you%20from%20Trust%20Point."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#25D366]/25 cursor-pointer"
                  >
                    <FaWhatsapp className="w-4 h-4 shrink-0 text-white" />
                    <span>WhatsApp CEO</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Founder's Story, Vision & Credentials */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3.5 py-1 rounded-full">
                      Founder &amp; Chief Executive Officer
                    </span>
                    <span className="text-xs font-semibold text-zinc-300 bg-zinc-800/80 border border-white/10 px-3 py-1 rounded-full">
                      মুহাম্মদ আব্দুল্লাহ
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-3">
                    Mohammad Abdullah
                  </h3>
                  <p className="text-emerald-400 text-sm font-semibold mt-1">
                    প্রতিষ্ঠাতা ও উদ্যোক্তা, ট্রাস্ট পয়েন্ট (Trust Point) • মহাদেবপুর, নওগাঁ
                  </p>
                </div>

                {/* Quote Block */}
                <div className="relative bg-zinc-950/60 border-l-4 border-emerald-500 rounded-r-2xl p-5 sm:p-6 backdrop-blur-xs">
                  <FaQuoteLeft className="w-6 h-6 text-emerald-500/30 mb-2" />
                  <p className="text-sm sm:text-base text-zinc-200 italic leading-relaxed">
                    &ldquo;সরাসরি বাগান থেকে আপনার বাড়ি, মাঝে কোনো আড়ত বা মধ্যস্বত্বভোগী নেই। তাই শতভাগ ফরমালিনমুক্ত ও খাঁটি সতেজতার গ্যারান্টি। আম কিংবা নিত্যপ্রয়োজনীয় পণ্য—ট্রাস্ট পয়েন্টে আপনি যা পাবেন, তা প্রতিটি পরিবারের জন্য শতভাগ খাঁটি ও নিরাপদ। মানুষের বিশ্বাস ও দুআই আমাদের ব্যবসার শ্রেষ্ঠ অর্জন।&rdquo;
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                    <div>
                      <span className="font-bold text-white uppercase tracking-wider">Mohammad Abdullah</span>
                      <span className="text-[11px] text-zinc-400 block">Founder &amp; CEO, Trust Point</span>
                    </div>
                    <span className="text-emerald-400 font-medium">Mohadevpur, Naogaon, Rajshahi</span>
                  </div>
                </div>

                {/* 3 Core Leadership Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div className="bg-zinc-800/60 border border-white/5 rounded-2xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-2">
                      <HiShieldCheck className="w-5 h-5" />
                    </div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      ১০০% ফরমালিনমুক্ত
                    </h5>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      রাসায়নিকমুক্ত গাছপাকা আমের খাঁটি নিশ্চয়তা।
                    </p>
                  </div>

                  <div className="bg-zinc-800/60 border border-white/5 rounded-2xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-2">
                      <HiLocationMarker className="w-5 h-5" />
                    </div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      মহাদেবপুর হেড অফিস
                    </h5>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      নওগাঁ-রাজশাহীর সেরা বাগান থেকে সরাসরি পরিচালনা।
                    </p>
                  </div>

                  <div className="bg-zinc-800/60 border border-white/5 rounded-2xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold mb-2">
                      <HiPhone className="w-5 h-5" />
                    </div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      ডিরেক্ট যোগাযোগ
                    </h5>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      সিইওর সাথে সরাসরি কথা বলুন: 01707819676 নম্বরে।
                    </p>
                  </div>
                </div>

                {/* Executive Contact Strip */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <HiPhone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Founder&apos;s Direct Desk: <a href="tel:01707819676" className="text-white font-bold hover:text-emerald-400 transition-colors">01707819676</a></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiLocationMarker className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Headquarters: <strong className="text-white">Mohadevpur, Naogaon, Rajshahi</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiBadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Brand: <strong className="text-white">Trust Point (ট্রাস্ট পয়েন্ট)</strong></span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 4. LIVE ORCHARD PROOF: FACEBOOK REELS & VIDEOS ── */}
      <section className="py-20 bg-zinc-950 text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-3 border border-emerald-800/80">
                <FaPlay className="w-3 h-3 text-emerald-400" />
                <span>সরাসরি বাগান থেকে লাইভ ভিডিও ও রিলস</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                বাস্তব প্রমাণ: দেখুন আমাদের বাগানের লাইভ ভিডিও
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mt-2">
                আম নামানো থেকে শুরু করে প্যাকিং পর্যন্ত প্রতিটি ধাপের লাইভ ভিডিও দেখুন আমাদের ফেসবুক পেজে।
              </p>
            </div>

            <a
              href="https://www.facebook.com/reel/2085813248644612"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-[#1877F2] hover:bg-[#1567d3] text-white px-5 py-3 rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <FaFacebook className="w-4 h-4" />
              <span>Facebook Page-এ যুক্ত হন</span>
              <FiExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reels.map((reel, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl bg-zinc-900 border border-white/10 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      {reel.badge}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {reel.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {reel.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed">
                    {reel.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-1"
                  >
                    <span className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <FaPlay className="w-2.5 h-2.5 text-emerald-400 ml-0.5" />
                    </span>
                    <span>রিলস ভিডিও দেখুন</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <span className="text-[11px] text-zinc-500">Facebook Reel</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Core Pillars of Excellence ── */}
      <section className="py-20 bg-white border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              কেন ট্রাস্ট পয়েন্ট সবার চেয়ে আলাদা
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-2">
              আমাদের ৪টি প্রধান মূলনীতি
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base mt-3 leading-relaxed">
              সরাসরি বাগান থেকে শুরু করে আপনার বাড়ির দস্তরখান পর্যন্ত—প্রতিটি পদক্ষেপে সততা ও বিশুদ্ধতার নিশ্চয়তা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 hover:border-emerald-500/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${p.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Curated Marketplace Departments ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              আমাদের প্রোডাক্ট রেঞ্জ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-2">
              খাঁটি আম, খাদ্যপণ্য ও লাইফস্টাইল কালেকশন
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base mt-2">
              সরাসরি বাগান ও বিশ্বস্ত কারিগরদের থেকে সংগৃহীত সেরা পণ্যসম্ভার।
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>সব পণ্য একসাথে দেখুন</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, idx) => (
            <Link
              key={idx}
              href={c.link}
              className="group rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-52 w-full overflow-hidden bg-zinc-100">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {c.tag}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  অর্ডার করুন →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 7. Operations & Corporate Headquarters ── */}
      <section className="py-20 bg-[#121614] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3.5 py-1 rounded-full">
                কেন্দ্রীয় কার্যালয় ও বাগান
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                মহাদেবপুর, নওগাঁ, রাজশাহী থেকে সারাদেশে
              </h2>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                ট্রাস্ট পয়েন্ট পরিচালিত হচ্ছে নওগাঁর ঐতিহ্যবাহী মহাদেবপুর থেকে। প্রতিষ্ঠাতা মোহাম্মদ আব্দুল্লাহর সরাসরি তত্ত্বাবধানে নিজস্ব বাগান থেকে ফ্রেশ ফল হার্ভেস্টিং, গ্রেডিং, প্যাকিং ও ডেলিভারি সম্পন্ন হয়।
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <HiLocationMarker className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">প্রধান কার্যালয় ও বাগান হাব</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      মোহাম্মদ আব্দুল্লাহ — মহাদেবপুর, নওগাঁ, রাজশাহী বিভাগ, বাংলাদেশ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <HiPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">প্রতিষ্ঠাতা ও ডিরেক্ট কল ডেস্ক</h4>
                    <a
                      href="tel:01707819676"
                      className="text-xs text-emerald-400 font-semibold hover:underline mt-0.5 inline-block"
                    >
                      01707819676 (+880 1707-819676)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <HiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">অফিসিয়াল ইমেইল</h4>
                    <a
                      href="mailto:support@webdevsoftware.com"
                      className="text-xs text-emerald-400 font-semibold hover:underline mt-0.5 inline-block"
                    >
                      support@webdevsoftware.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card with hours & contact */}
            <div className="lg:col-span-6 bg-zinc-900/90 border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>অর্ডার ও গ্রাহক সহায়তা সময়সূচি</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/10 text-zinc-300">
                  <span>শনিবার – বৃহস্পতিবার</span>
                  <span className="font-semibold text-white">সকাল ৯:০০ – রাত ৯:০০</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10 text-zinc-300">
                  <span>শুক্রবার</span>
                  <span className="font-semibold text-white">দুপুর ২:০০ – রাত ৯:০০</span>
                </div>
                <div className="flex justify-between py-2 text-zinc-300">
                  <span>অনলাইন ওয়েবসাইট বুকিং</span>
                  <span className="font-semibold text-emerald-400">২৪ ঘণ্টা উন্মুক্ত (৩৬৫ দিন)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/8801707819676?text=Assalamu%20Alaikum%20Mohammad%20Abdullah%20Sir%2C%20I%20am%20contacting%20you%20from%20Trust%20Point."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-center text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  WhatsApp-এ আম বুকিং করুন
                </a>
                <Link
                  href="/contact"
                  className="flex-1 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-center text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  পূর্ণাঙ্গ যোগাযোগ পেজ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Verified Customer Testimonials ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            গ্রাহকের মূল্যায়ন
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-2">
            সারাদেশের সন্তুষ্ট পরিবারদের অভিজ্ঞতা
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <HiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-zinc-700 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100">
                <h4 className="text-sm font-bold text-zinc-900">{t.author}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. Call To Action ── */}
      <section className="pb-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 md:p-16 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              আজই সরাসরি বাগান থেকে খাঁটি ফল অর্ডার করুন!
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              মাঝে কোনো আড়ত বা মধ্যস্বত্বভোগী নেই। শতভাগ ফরমালিনমুক্ত ও সুমিষ্ট আম সরাসরি আপনার বাড়িতে পৌঁছে যাবে।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/products"
                className="bg-white hover:bg-zinc-100 text-emerald-950 font-bold text-sm px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                আম ও পণ্য অর্ডার করুন
              </Link>
              <a
                href="tel:01707819676"
                className="bg-emerald-950/60 hover:bg-emerald-950 text-white border border-emerald-400/40 font-semibold text-sm px-8 py-4 rounded-full transition-colors cursor-pointer"
              >
                কল করুন: 01707819676
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
