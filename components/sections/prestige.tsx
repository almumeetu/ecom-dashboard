export default function Prestige() {
  
  return (
    <section className="relative w-full overflow-hidden">
      <div className="prestige-wrapper"> 
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ">
            <div className="text-center lg:text-left border-r border-stone-200">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-zinc-900"
              >
                Recognized Where Taste
                Becomes Prestige
              </h2>
            </div>
            {/* Right Side - Content */}
            <div className="flex flex-col gap-6">
              {/* Top paragraph */}
              <p 
                className="text-sm md:text-base leading-relaxed text-zinc-600 font-sans"
              >
                Headquartered in Banani, Dhaka, NovaMart bridges the gap between verified producers and modern consumers. Built upon uncompromising quality and transparent origin, we position every selection not as a commodity, but as a trusted expression of authenticity.
              </p>

              {/* Exceptional Quality Quote Banner */}
              <div className="mt-4 p-6 bg-[#F9F9FB] border border-[#E3E3E3] rounded-lg relative overflow-hidden group">
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: "url('/images/pattern/pattern.png')",
                    backgroundRepeat: 'repeat',
                    backgroundSize: '100px 100px',
                  }}
                />
                <h4 className="font-sans text-xs uppercase tracking-widest text-[#4F46E5] mb-2 font-bold">
                  Verified Quality
                </h4>
                <blockquote className="font-sans font-medium text-lg md:text-xl text-zinc-800 leading-relaxed">
                  &ldquo;For those who value authenticity at the highest level, NovaMart is the choice without compromise.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}