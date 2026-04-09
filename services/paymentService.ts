import { loadStripe, Stripe } from "@stripe/stripe-js";

// Stripe initialization
export const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

export const payWithStripe = async (amount: number) => {
  try {
    const response = await fetch("/api/stripe-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    
    const session = await response.json();
    const stripe: Stripe | null = await stripePromise;
    
    if (stripe && session.id) {
      const { error } = await (stripe as any).redirectToCheckout({ sessionId: session.id });
      if (error) throw error;
    }
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    throw error;
  }
};

export const payWithBkash = async (amount: number) => {
  try {
    const response = await fetch("/api/bkash-create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    
    const data = await response.json();
    if (data.success && data.bkashURL) {
      window.location.href = data.bkashURL;
    } else {
      throw new Error("bKash payment initialization failed");
    }
  } catch (error) {
    console.error("bKash Payment Error:", error);
    throw error;
  }
};
