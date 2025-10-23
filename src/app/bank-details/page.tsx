import React, { Suspense } from 'react';
import BankDetailsClient from './BankDetailsClient';

export default function BankDetailsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <BankDetailsClient />
    </Suspense>
  );
}
