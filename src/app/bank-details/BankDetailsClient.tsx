'use client';
import { useEffect, useState } from 'react';
import AddBankButton from '@/components/bank-details/AddBankButton';
import { useSearchParams } from 'next/navigation';

export default function BankDetailsClient() {
  const searchParams = useSearchParams();
  const customerIdFromUrl = searchParams.get('customer_id') || '';
  const [stripeCustomerId, setStripeCustomerId] = useState<string>(customerIdFromUrl);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.stripe_customer_id) {
        setStripeCustomerId(event.data.stripe_customer_id);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Bank Details</h1> */}
      {stripeCustomerId ? (
        <AddBankButton stripe_customer_id={stripeCustomerId} autoTrigger />
      ) : (
        <p className="text-gray-600">Waiting for customer ID...</p>
      )}
    </div>
  );
}
