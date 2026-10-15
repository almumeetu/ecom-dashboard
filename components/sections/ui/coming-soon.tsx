import Image from 'next/image';
import Link from 'next/link';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
}

export default function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center bg-[#F7FAFD] overflow-hidden">
      {/* Repeating background pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "url('/images/pattern/pattern.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        {/* Icon */}
        <div className="w-16 h-20">
          <Image
            src="/images/icons/icon-3.svg"
            alt="NovaMart Crest"
            width={64}
            height={80}
            className="object-contain opacity-80"
          />
        </div>

        {/* Label */}
        <p className="font-gotham text-xs sm:text-sm uppercase tracking-[0.25em] text-[#8B4F2B]">
          Coming Soon
        </p>

        {/* Heading */}
        <h1 className="inline-flex flex-col items-center gap-1">
          {title ? (
            <>
              <span className="font-['Bembo_Std'] text-[#8B4F2B] text-4xl sm:text-5xl md:text-6xl font-normal leading-none">
                {title}
              </span>
            </>
          ) : (
            <>
              <span className="font-['Bembo_Std'] text-[#8B4F2B] text-4xl sm:text-5xl md:text-6xl font-normal leading-none">
                This Page is
              </span>
              <span className="font-['Snell_Roundhand_LT_Std'] italic text-[#8B4F2B] text-4xl sm:text-5xl md:text-6xl font-normal leading-none lowercase">
                being crafted
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="font-['Bembo_Std'] text-[#5F7489] text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
          {subtitle ||
            'We are carefully curating this experience for you. Check back soon for something extraordinary.'}
        </p>

        {/* Thin divider */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-[#8B4F2B]/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B4F2B]/50" />
          <div className="flex-1 h-px bg-[#8B4F2B]/30" />
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-10 py-3.5 border border-[#8B4F2B] text-[#8B4F2B] font-gotham text-xs uppercase tracking-widest hover:bg-[#8B4F2B] hover:text-white transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
