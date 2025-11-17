'use client'

import Header from '@/components/layout/Header';
import React, { Suspense } from 'react';
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { motion } from 'framer-motion'
import heroImage from '/public/hero.jpg'

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
       <>
            <Header />
            <section className="relative w-full bg-gray-50">
              <div className="relative w-full h-[450px]">
                <Image
                  src={heroImage}
                  alt="Hero"
                  layout="fill"
                  objectFit="cover"
                  className="brightness-90"
                  priority
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
                  <motion.h1
                    className="text-4xl font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Welcome to Our Platform
                  </motion.h1>

                  <motion.p
                    className="text-lg max-w-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Empowering users with secure sign-up, sign-in, and OTP verification.
                  </motion.p>
                </div>
              </div>
            </section>
          <p>Privacy policy page</p>

           <Footer />
        </>
    </Suspense>
  );
}
