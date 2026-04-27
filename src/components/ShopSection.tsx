"use client";

import { useState } from "react";
import { isMemberActive } from "@/lib/profile";
import type { ShopProduct } from "@/types";

const PRODUCTS: ShopProduct[] = [
  {
    id: "rose-quartz",
    name: "Rose Quartz Heart",
    category: "crystals",
    description: "Invites love and warmth into your home. Perfect for the bedroom or living room.",
    price: 19.99,
    memberPrice: 14.99,
    affiliateUrl: "https://www.amazon.com/s?k=rose+quartz+heart+crystal",
    imageEmoji: "💗",
    element: "火",
  },
  {
    id: "amethyst-cluster",
    name: "Amethyst Cluster",
    category: "crystals",
    description: "Calms the mind and cleanses negative energy. Place on your nightstand.",
    price: 34.99,
    memberPrice: 24.99,
    affiliateUrl: "https://www.amazon.com/s?k=amethyst+cluster+natural",
    imageEmoji: "💜",
    element: "水",
  },
  {
    id: "citrine-point",
    name: "Citrine Point",
    category: "crystals",
    description: "The stone of abundance. Attracts prosperity and warms the home with Fire energy.",
    price: 24.99,
    memberPrice: 17.99,
    affiliateUrl: "https://www.amazon.com/s?k=natural+citrine+crystal+point",
    imageEmoji: "💛",
    element: "火",
  },
  {
    id: "feng-shui-bell",
    name: "Feng Shui Wind Chime",
    category: "home-decor",
    description: "Gentle sound shifts stagnant energy. Hang near your front door or in a hallway.",
    price: 29.99,
    memberPrice: 22.99,
    affiliateUrl: "https://www.amazon.com/s?k=feng+shui+wind+chime+metal",
    imageEmoji: "🔔",
    element: "金",
  },
  {
    id: "bagua-mirror",
    name: "Bagua Mirror",
    category: "home-decor",
    description: "Protects your entryway from harsh energy. Traditional convex design.",
    price: 18.99,
    memberPrice: 13.99,
    affiliateUrl: "https://www.amazon.com/s?k=bagua+mirror+feng+shui",
    imageEmoji: "🪞",
    element: "金",
  },
  {
    id: "ceramic-tea-set",
    name: "Handmade Tea Set",
    category: "home-decor",
    description: "Earth-element pottery grounds your morning ritual. Each piece is unique.",
    price: 44.99,
    memberPrice: 34.99,
    affiliateUrl: "https://www.amazon.com/s?k=handmade+ceramic+tea+set+asian",
    imageEmoji: "🍵",
    element: "土",
  },
  {
    id: "jade-bracelet",
    name: "Jade Beaded Bracelet",
    category: "jewelry",
    description: "Natural jade cools excess Fire and brings calm. Wear on your left wrist.",
    price: 25.99,
    memberPrice: 18.99,
    affiliateUrl: "https://www.amazon.com/s?k=natural+jade+bracelet+women",
    imageEmoji: "💚",
    element: "水",
  },
  {
    id: "obsidian-pendant",
    name: "Obsidian Protection Pendant",
    category: "jewelry",
    description: "Volcanic glass that shields against negativity. Wear close to your heart.",
    price: 22.99,
    memberPrice: 16.99,
    affiliateUrl: "https://www.amazon.com/s?k=obsidian+pendant+necklace",
    imageEmoji: "🖤",
    element: "水",
  },
  {
    id: "tiger-eye-bracelet",
    name: "Tiger Eye Bracelet",
    category: "jewelry",
    description: "Boosts confidence and grounds scattered energy. Perfect for important days.",
    price: 19.99,
    memberPrice: 14.99,
    affiliateUrl: "https://www.amazon.com/s?k=tiger+eye+bracelet+women",
    imageEmoji: "🐯",
    element: "土",
  },
  {
    id: "chrysanthemum-tea",
    name: "Organic Chrysanthemum Tea",
    category: "tea-herbs",
    description: "Cools internal heat. A gentle evening tea that soothes the eyes and mind.",
    price: 12.99,
    memberPrice: 8.99,
    affiliateUrl: "https://www.amazon.com/s?k=organic+chrysanthemum+tea",
    imageEmoji: "🌼",
    element: "金",
  },
  {
    id: "goji-berries",
    name: "Premium Goji Berries",
    category: "tea-herbs",
    description: "Nourishes Yin and supports your Water element. Add to tea or soups.",
    price: 14.99,
    memberPrice: 10.99,
    affiliateUrl: "https://www.amazon.com/s?k=organic+goji+berries+dried",
    imageEmoji: "🔴",
    element: "水",
  },
  {
    id: "mugwort",
    name: "Dried Mugwort (Ai Cao)",
    category: "tea-herbs",
    description: "Traditional herb for warming and grounding. Use in foot soaks or tea.",
    price: 11.99,
    memberPrice: 7.99,
    affiliateUrl: "https://www.amazon.com/s?k=dried+mugwort+herb+organic",
    imageEmoji: "🌿",
    element: "土",
  },
];

type Category = "all" | ShopProduct["category"];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "crystals", label: "Crystals" },
  { value: "home-decor", label: "Home Decor" },
  { value: "jewelry", label: "Jewelry" },
  { value: "tea-herbs", label: "Tea & Herbs" },
];

const ELEMENT_EMOJI: Record<string, string> = {
  木: "🌿",
  火: "🔥",
  土: "🏔️",
  金: "✨",
  水: "💧",
};

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const memberActive = isMemberActive();

  const filtered =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-3">
          Feng Shui <span className="gold-text">Shop</span>
        </h2>
        <p className="text-earth-500 max-w-md mx-auto text-sm">
          Curated picks to bring balance to your home. Members save on every item.
        </p>
        {!memberActive && (
          <p className="text-xs text-rose-500 mt-2">
            Join Clara Membership to unlock member prices (up to 35% off).
          </p>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.value
                ? "bg-indigo-800 text-cream-100 shadow-md"
                : "bg-cream-200 text-indigo-800/70 hover:bg-cream-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="mystic-card rounded-2xl p-5 flex flex-col hover:border-gold-400/30 transition-all"
          >
            <div className="text-4xl mb-3">{product.imageEmoji}</div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-indigo-900 text-sm">
                {product.name}
              </h3>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full bg-cream-200 text-earth-500"
                title={`${product.element} element`}
              >
                {ELEMENT_EMOJI[product.element]} {product.element}
              </span>
            </div>
            <p className="text-xs text-indigo-800/60 leading-relaxed mb-3 flex-1">
              {product.description}
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div>
                {memberActive && product.memberPrice ? (
                  <>
                    <span className="text-lg font-bold text-gold-500">
                      ${product.memberPrice}
                    </span>
                    <span className="text-xs text-indigo-800/40 line-through ml-2">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-indigo-900">
                    ${product.price}
                  </span>
                )}
              </div>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="px-4 py-2 rounded-xl bg-gold-400/15 text-gold-500 text-xs font-semibold hover:bg-gold-400/25 transition-all"
              >
                Shop →
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-indigo-800/40 text-center mt-8">
        * Some links are affiliate links. We may earn a small commission at no extra cost to you.
      </p>
    </section>
  );
}
