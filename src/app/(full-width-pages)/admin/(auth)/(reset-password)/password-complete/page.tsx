import PasswordCompleteForm from '@/components/auth/PasswordCompleteForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Forget Password Success Page | Sign In - Dashboard Template',
  description: 'This is Forget Password Success Page Dashboard Template',
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordCompleteForm />
    </Suspense>
  );
}
