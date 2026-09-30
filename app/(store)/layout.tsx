import { Suspense } from 'react';
import TopHeader from '@/components/sections/top-header';
import Header from '@/components/sections/header';
import Mainfooter from '@/components/sections/main-footer';
import Bottomfooter from '@/components/sections/bottom-footer';
import { AuthProvider } from "@/app/_providers/auth-provider";
import { CartProvider } from "@/app/_providers/cart-provider";
import { WishlistProvider } from "@/app/_providers/wishlist-provider";
import AuthModal from "@/components/auth-modal";
import BackToTop from "@/components/ui/back-to-top";
import FloatingWhatsApp from "@/components/ui/floating-whatsapp";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <TopHeader />
          <Suspense fallback={<div className="h-16 bg-olive-slate animate-pulse w-full" />}>
            <Header />
          </Suspense>
          {children}
          <Mainfooter />
          <Bottomfooter />
          <AuthModal />
          <FloatingWhatsApp />
          <BackToTop />
          <Toaster richColors closeButton position="bottom-right" />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
