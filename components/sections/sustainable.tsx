export default function Sustainable() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="relative h-full min-h-162.5 w-full overflow-hidden py-16 md:py-24"
        style={{
          clipPath: "ellipse(95% 100% at 50% 100%)",
        }}
      >
        {/* YouTube Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/CFfP9DFeOog?autoplay=1&mute=1&loop=1&playlist=CFfP9DFeOog&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              minWidth: "177.77vh",
              minHeight: "56.25vw",
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45 z-1" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Sustainable
          </h2>

          <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-emerald-400">
            and ethical sourcing
          </h3>

          <p className="mt-6 max-w-3xl font-sans text-sm md:text-base leading-relaxed text-zinc-200">
            NovaMart has built a sustainable, transparent and ethical multi-category sourcing supply chain. We work directly with farmers, agro-growers, certified manufacturers, and local craftsmen to ensure due diligence and fair pay across our network. Every purchase on NovaMart directly empowers ethical commerce and dignified livelihoods.
          </p>
        </div>
      </div>
    </section>
  );
}