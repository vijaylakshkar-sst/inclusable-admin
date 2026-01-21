'use client';

import Header from '@/components/layout/Header';
import React, { Suspense, useEffect, useState } from 'react';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import heroImage from '/public/hero.jpg';
import { getTermsApi, TermCondition } from '@/api/auth/app_content';

export default function DriverTermConditionsPage() {
  const [data, setData] = useState<TermCondition[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const res = await getTermsApi();
      console.log(res,'res');
      if (res.status) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching Terms & Conditions:', error);
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
                Terms & Conditions
              </motion.h1>

              <motion.p
                className="text-lg max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Please read our terms carefully before using the Inclusable Platform.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
      <section className="container mx-auto py-12 px-4 prose max-w-4xl">
        {loading ? (
          <p>Loading content...</p>
        ) : data && data.length > 0 ? (
          data
            .filter((item) => item.title === "Driver Term") // 🔥 only show User Term
            .map((item) => (
              <div key={item.id}>
                {/* <h2>{item.title}</h2> */}
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            ))
        ) : (
          <p>No Terms and Conditions found.</p>
        )}
      </section>

        <Footer />
      </>
    </Suspense>
  );
}
