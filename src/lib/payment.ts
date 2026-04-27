export function createLemonSqueezyCheckout(variantId: string, email?: string) {
  const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;
  const baseUrl = `https://${storeId}.lemonsqueezy.com/checkout/buy/${variantId}`;

  const params = new URLSearchParams();
  if (email) params.set("checkout[email]", email);
  params.set("embed", "0");

  return `${baseUrl}?${params.toString()}`;
}

export const PRICING = {
  baziTest: {
    variantId: "bazi-test",
    price: 9.99,
    name: "Bazi Wellness Blueprint",
  },
  claraMembership: {
    variantId: "clara-monthly",
    price: 6.99,
    name: "Clara Membership",
    trialDays: 7,
  },
};
