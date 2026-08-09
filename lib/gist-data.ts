export type Gist = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
};

export const gists: Gist[] = [
  {
    id: "1",
    slug: "how-to-choose-the-right-property",
    title: "How to Choose the Right Property for Your Investment",
    excerpt:
      "A practical guide to choosing a property that matches your goals, budget and long-term wealth plans.",
    content: [
      "Choosing a property is one of the most important decisions an investor can make. Whether you are buying your first home, expanding your property portfolio or looking for a rental investment, the right decision begins with understanding your objectives.",
      "Start by identifying the purpose of the property. A property intended for personal use may have very different requirements from one purchased purely for rental income or long-term appreciation.",
      "Location should also be carefully considered. Access to roads, schools, commercial areas, transportation and other important infrastructure can have a significant effect on a property's value.",
      "Finally, consider your budget and future expenses. A good property investment should not only fit today's budget but also make sense as part of your long-term financial plan.",
    ],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    author: "SAYOLA KAYBEE GLOBAL LIMITED",
    publishedAt: "August 9, 2026",
    views: 245,
    likes: 32,
    comments: 14,
    category: "Real Estate",
  },
  {
    id: "2",
    slug: "why-location-matters-in-real-estate",
    title: "Why Location Matters in Real Estate",
    excerpt:
      "Understanding why location remains one of the strongest factors influencing property value and demand.",
    content: [
      "There is a reason experienced property investors pay close attention to location. Two properties with similar physical characteristics can have very different values simply because they are located in different areas.",
      "Good connectivity, infrastructure, economic activity and access to essential services can all contribute to stronger property demand.",
      "Investors should therefore look beyond the building itself and study the wider environment before making a purchase.",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    author: "SAYOLA KAYBEE GLOBAL LIMITED",
    publishedAt: "August 7, 2026",
    views: 183,
    likes: 27,
    comments: 9,
    category: "Property Tips",
  },
  {
    id: "3",
    slug: "real-estate-as-a-wealth-building-tool",
    title: "Real Estate as a Wealth-Building Tool",
    excerpt:
      "How strategic property ownership can become part of a long-term wealth creation strategy.",
    content: [
      "Real estate has long been considered an important component of wealth-building strategies. Property can potentially provide rental income, capital appreciation and opportunities for portfolio diversification.",
      "However, successful property investment requires research and careful planning. Investors need to understand their market, financing options, operating costs and potential risks.",
      "At SAYOLA KAYBEE GLOBAL LIMITED, our goal is to help clients make informed real estate decisions while building sustainable wealth.",
    ],
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
    author: "SAYOLA KAYBEE GLOBAL LIMITED",
    publishedAt: "August 5, 2026",
    views: 316,
    likes: 41,
    comments: 18,
    category: "Wealth Creation",
  },
];

export function getGistBySlug(slug: string) {
  return gists.find((gist) => gist.slug === slug);
}
