"use client";

import { useState } from "react";
import { toast } from "sonner";
import { newsletterEmailValidation } from "@/utils/validation";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = newsletterEmailValidation(email, true);
    if (!validation.isValid) {
      const errorMsg = validation.errors.email || "Invalid input";
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/resend/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thanks for subscribing!");
        setEmail("");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row" noValidate>
      <label className="sr-only" htmlFor="footer-newsletter-email">Email address</label>
      <input
        id="footer-newsletter-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-[#122638]/60 px-4 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-store-light focus:ring-4 focus:ring-store-light/15"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 shrink-0 rounded-xl bg-white px-5 text-sm font-semibold text-store-deep transition hover:bg-store-surface active:scale-[0.98] disabled:cursor-wait disabled:opacity-65"
      >
        {isSubmitting ? "Joining…" : "Join the list"}
      </button>
    </form>
  );
}
