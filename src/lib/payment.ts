export function createLemonSqueezyCheckout(variantId: string, email?: string) {
  const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;
  const baseUrl = `https://${storeId}.lemonsqueezy.com/checkout/buy/${variantId}`;

  const params = new URLSearchParams();
  if (email) params.set("checkout[email]", email);
  params.set("embed", "0");

  return `${baseUrl}?${params.toString()}`;
}

export const PRICING = {
  basicReport: {
    variantId: "basic-report", // Replace with actual Lemon Squeezy variant ID
    price: 19.99,
    name: "Full Ba Zi Report",
  },
  monthlySubscription: {
    variantId: "monthly-sub",
    price: 9.99,
    name: "Monthly Fortune Guide",
  },
  premiumSubscription: {
    variantId: "premium-sub",
    price: 19.99,
    name: "Premium Destiny Navigator",
  },
};
