import type { News } from "@/lib/admin-api";

/** Local editorial examples shown until the journal API has published articles. */
export const DEMO_NEWS: News[] = [
  {
    id: "demo-story-everyday-shopping",
    title: "A smarter way to shop for everyday essentials",
    slug: "smarter-everyday-shopping",
    excerpt: "A few thoughtful checks can make online shopping simpler, more confident, and better value.",
    content: `A good online shopping habit starts with knowing what you need. Make a short list, compare the details that matter, and take a moment to check the seller, product information, delivery options, and return policy before you place an order.\n\nLook beyond the first price you see. Clear photos, useful descriptions, genuine customer feedback, and transparent delivery costs help you understand the full value of a product. When you find something that suits your routine, save the details so your next shop is even easier.\n\nAt NovaMart, we bring everyday favourites together in one place so you can spend less time searching and more time enjoying what you chose.`,
    coverImageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&auto=format&fit=crop&q=85",
    author: "NovaMart Editorial Team",
    isPublished: true,
    publishedAt: "2026-10-02T08:30:00.000Z",
    createdAt: "2026-10-02T08:30:00.000Z",
    updatedAt: "2026-10-02T08:30:00.000Z",
  },
  {
    id: "demo-story-simple-skincare",
    title: "Build a simple, feel-good skincare routine",
    slug: "simple-skincare-routine-guide",
    excerpt: "Start with the basics, choose products that fit your preferences, and keep your routine easy to follow.",
    content: `A skincare routine does not need a long list of products. Many people start with three familiar steps: a gentle cleanser, a moisturiser that feels comfortable, and sun protection during the day. The best routine is one that fits your skin preferences and is easy to keep up with.\n\nRead the product label and directions, and introduce new products one at a time so you can decide how they work for you. If you have a specific skin concern, a qualified healthcare professional can offer advice tailored to your needs.\n\nLook for clear ingredient and usage information when comparing products. A considered choice can make your daily routine feel calm, personal, and simple.`,
    coverImageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&auto=format&fit=crop&q=85",
    author: "NovaMart Editorial Team",
    isPublished: true,
    publishedAt: "2026-09-18T08:30:00.000Z",
    createdAt: "2026-09-18T08:30:00.000Z",
    updatedAt: "2026-09-18T08:30:00.000Z",
  },
  {
    id: "demo-story-home-tech",
    title: "Small home tech upgrades that make a big difference",
    slug: "useful-home-tech-upgrades",
    excerpt: "Discover practical ways to make your daily setup more convenient, connected, and comfortable.",
    content: `The most useful home tech is often the kind you barely have to think about. A reliable charger in the right place, a tidy power strip, or a simple desk accessory can make everyday tasks feel smoother without adding clutter.\n\nBefore buying, check compatibility with the devices you already own, the space where you plan to use it, and the features you will actually reach for. A clear product description and warranty information can help you compare options with confidence.\n\nStart with one small improvement, see how it fits your routine, and build from there. Practical choices make a home setup feel more personal and work better for the whole household.`,
    coverImageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop&q=85",
    author: "NovaMart Editorial Team",
    isPublished: true,
    publishedAt: "2026-09-04T08:30:00.000Z",
    createdAt: "2026-09-04T08:30:00.000Z",
    updatedAt: "2026-09-04T08:30:00.000Z",
  },
];
