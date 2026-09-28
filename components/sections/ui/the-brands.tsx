import Image from "next/image";

export default function TheBrands() {
  return (
    <section className="w-full bg-[#F6F6F6] py-16 px-6 md:px-12 lg:py-44"  style={{
          clipPath: "ellipse(95% 100% at 50% 0%)",
        }}>
      <div className="thebrands-wrapper">
        <div className="container mx-auto px-3">
          {/* Top Section - The Brand */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl">
                <span className="font-['Snell_Roundhand_LT_Std'] font-medium text-brand-primary">The </span>
                <span className="font-['Snell_Roundhand_LT_Std'] italic text-brand-primary">Brand</span>
              </h2>
              
              <p className="mt-6 font-['Bembo_Std'] text-lg font-normal leading-6">
                Trust Point Mart is an innovative multi-category hypermarket and marketplace platform founded by entrepreneur <span className="italic">Mohammad Abdullah</span>. Originating from Mohadevpur, Naogaon, Rajshahi Division, we bridge the gap between primary producers, agro-farms, and consumer households with authentic goods, fair pricing, and transparent standards.
              </p>
              
              <p className="mt-4 font-['Bembo_Std'] text-lg font-normal">
                No one delivers that kind of multi-category shopping experience with such care and authenticity quite like Trust Point Mart.
              </p>

              {/* Two Small Images with Our Promise */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="overflow-hidden">
                  <Image
                    src="/images/brands/images-1.png"
                    alt="Brand showcase 1"
                    width={340}
                    height={400}
                    className=" object-contain"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="overflow-hidden">
                    <Image
                      src="/images/brands/images-2.png"
                      alt="Brand showcase 2"
                      width={292}
                      height={364}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl">
                    <span className="font-['Bembo_Std'] font-medium text-brand-primary">Our </span>
                    <span className="font-['Snell_Roundhand_LT_Std'] italic text-olive-slate">Promise</span>
                  </h2>
                </div>
              </div>
            </div>

            {/* Right Side - Large Image */}
            <div className="overflow-hidden">
              <Image
                src="/images/brands/images-3.png"
                alt="Brand showcase 3"
                width={600}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <p className="font-['Bembo_Std'] text-lg font-normal leading-6">
                Trust Point Mart presents an exceptional vision for digital commerce in Bangladesh. Serving the growing demand for authentic groceries, lifestyle fashion, and modern tech, Trust Point Mart operates a cost-efficient supply chain directly from farmgate and verified manufacturers.
              </p>
            </div>
            <div>
              <p className="font-['Bembo_Std'] text-lg font-normal leading-6">
                Trust Point Mart offers depth of quality and verified authenticity across all departments. With expanding logistics hubs and nationwide delivery across all 64 districts, Trust Point Mart is poised for sustainable growth, ethical commerce, and trusted customer relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
