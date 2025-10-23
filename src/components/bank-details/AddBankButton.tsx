'use client';
import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { generateBankLinkApi } from '@/api/users/userApi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  stripe_customer_id: string;
  autoTrigger?: boolean; // automatically open Stripe on page load if true
}

const AddBankButton = ({ stripe_customer_id, autoTrigger = false }: Props) => {

  const handleAddBank = async () => {
    if (!stripe_customer_id) return alert('Customer ID missing.');

    try {
      const res = await generateBankLinkApi({ stripe_customer_id });
      console.log('Stripe session response:', res);

      if (res?.data?.session_secret) {
        const stripe = await stripePromise;
        if (!stripe) return alert('Stripe failed to load.');

        const { error } = await stripe.collectFinancialConnectionsAccounts({
          clientSecret: res.data.session_secret,
        });

        if (error) {
          console.error('Stripe error:', error.message);
          alert(error.message);
        } else {
          alert('Bank account linked successfully!');
        }
      } else {
        alert('Failed to generate Stripe session.');
      }
    } catch (err) {
      console.error('Error generating bank link:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  // Auto-trigger on page load if enabled (fallback for WebView)
  useEffect(() => {
    if (autoTrigger) {
      handleAddBank();
    }
  }, [autoTrigger]);

  return (
    <></>    
  );
};

export default AddBankButton;
