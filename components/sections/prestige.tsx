export default function Prestige() {
  
  return (
    <section className="relative w-full overflow-hidden">
      <div className="prestige-wrapper"> 
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ">
            <div className="text-center lg:text-left border-r border-stone-gray">
              <h2 
                className="text-3xl md:text-4xl lg:text-6xl font-['Bembo_Std'] leading-14 font-normal text-khaki-gold"
              >
                Recognized Where Taste
                Becomes Prestige
              </h2>
            </div>
            {/* Right Side - Content */}
            <div className="flex flex-col gap-6">
              {/* Top paragraph */}
              <p 
                className="text-sm md:text-base leading-relaxed text-stone-gray font-['Bembo_Std']"
              >
                Rooted in the agricultural hubs of Mohadevpur, Naogaon and Rajshahi Division, Trust Point Mart bridges the gap between verified producers and modern consumers. Built upon uncompromising quality and transparent origin, we position every selection not as a commodity, but as a trusted expression of authenticity.
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
                <h4 className="font-['Bembo_Std'] text-xs uppercase tracking-widest text-khaki-gold mb-2 font-semibold">
                  Verified Quality
                </h4>
                <blockquote className="font-['Snell_Roundhand_LT_Std'] italic text-2xl md:text-3xl text-stone-700 leading-relaxed">
                  &ldquo;For those who value authenticity at the highest level, Trust Point Mart is the choice without compromise.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}