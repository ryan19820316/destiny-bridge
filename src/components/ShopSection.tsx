"use client";

import { useState } from "react";
import { isMemberActive } from "@/lib/profile";
import type { ShopProduct } from "@/types";

const PRODUCTS: ShopProduct[] = [
  {
    id: "rose-quartz",
    name: "Rose Quartz Heart",
    category: "crystals",
    description: "Invites love and warmth into your home. Perfect for the bedroom.",
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
    id: "feng-shui-bell",
    name: "Feng Shui Wind Chime",
    category: "home-decor",
    description: "Gentle sound shifts stagnant energy. Hang near your front door.",
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
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          Feng Shui <span className="gold-text">Shop</span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm">
          Curated picks to bring balance to your home. Members save on every item.
        </p>
        {!memberActive && (
          <p className="text-xs text-gold-400 mt-2">
            Join Clara Membership to unlock member prices.
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
                ? "bg-gold-400/20 text-gold-300 border border-gold-400/30"
                : "bg-mystic-800/50 text-gray-400 hover:bg-mystic-700/50"
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
            className="mystic-card rounded-2xl p-5 flex flex-col"
          >
            <div className="text-4xl mb-3">{product.imageEmoji}</div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white text-sm">
                {product.name}
              </h3>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full bg-mystic-700/80 text-gray-400"
                title={`${product.element} element`}
              >
                {ELEMENT_EMOJI[product.element]} {product.element}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3 flex-1">
              {product.description}
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div>
                {memberActive && product.memberPrice ? (
                  <>
                    <span className="text-lg font-bold text-gold-300">
                      ${product.memberPrice}
                    </span>
                    <span className="text-xs text-gray-500 line-through ml-2">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-white">
                    ${product.price}
                  </span>
                )}
              </div>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="px-4 py-2 rounded-xl bg-gold-400/15 text-gold-300 text-xs font-semibold hover:bg-gold-400/25 transition-all"
              >
                Shop →
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 text-center mt-8">
        * Some links are affiliate links. We may earn a small commission at no extra cost to you.
      </p>
    </section>
  );
}
