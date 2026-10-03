export default function Presence() {
  return (
    <section className="w-full px-4">
      <div className="presence-wrapper">
        <div
          className="container mx-auto bg-center bg-no-repeat flex flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-12 px-8 sm:px-12 md:px-16 lg:px-24"
          style={{
            backgroundImage: "url('/images/presence.png')",
            backgroundSize: "100% 100%",
          }}
        >
          <div className="presence-content text-center flex flex-col items-center gap-5 lg:gap-8">
            <p className="text-zinc-600 text-xs md:text-sm font-bold tracking-widest uppercase">
              The Grand Passage
            </p>
            <h2 className="flex flex-row flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1">
              <span className="text-zinc-900 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                From the Gardens of Sylhet to
              </span>
              <span className="text-[#4F46E5] text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Tables Across the World
              </span>
            </h2>
            <p className="text-zinc-600 text-sm md:text-base font-normal leading-relaxed max-w-2xl mx-auto">
              What begins in quiet cultivation now finds its place in global refinement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}