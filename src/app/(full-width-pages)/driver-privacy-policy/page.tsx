'use client';

import Header from '@/components/layout/Header';
import React, { Suspense, useEffect, useState } from 'react';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import heroImage from '/public/hero.jpg';
import { getPrivacyPolicysApi, PrivacyPolicy } from '@/api/auth/app_content';

export default function PrivacyPolicyPage() {
  const [data, setData] = useState<PrivacyPolicy[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const res = await getPrivacyPolicysApi();
      if (res.status) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching Privacy Policy:', error);
    }
    setLoading(false);
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Header />

        {/* Hero Section */}
        <section className="relative w-full bg-gray-50">
          <div className="relative w-full h-[450px]">
            <Image
              src={heroImage}
              alt="Hero"
              fill
              className="object-cover brightness-90"
              priority
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
              <motion.h1
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Privacy Policy
              </motion.h1>

              <motion.p
                className="text-lg max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Learn how we collect, store, and handle your personal information responsibly.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="container mx-auto py-12 px-4 prose max-w-4xl numbered">
          {loading ? (
            <p>Loading content...</p>
            ) : data && data.length > 0 ? (
            data
                .filter(item => item.title === 'Driver Privacy Policy')
                .map(item => (
                <div key={item.id}>
                    <h2>{item.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
                ))
            ) : (
            <p>No Privacy Policy found.</p>
            )}
        </section>

        <Footer />
      </>
    </Suspense>
  );
}
