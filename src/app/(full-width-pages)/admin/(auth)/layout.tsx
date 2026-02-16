
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen p-6 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="/images/bg-login.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      <ThemeProvider>
        <div className="relative w-full max-w-4xl flex flex-col items-center justify-center gap-6 text-center px-4 z-10">
          {/* Logo */}



          {/* Auth Form Content */}
          <div className="w-full max-w-md">

            {children}
          </div>
        </div>

        {/* Theme Toggler */}

      </ThemeProvider>
    </div>
  );
}
