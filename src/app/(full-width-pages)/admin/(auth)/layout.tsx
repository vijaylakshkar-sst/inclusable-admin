import GridShape from "@/components/common/GridShape";
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
    <div className="relative min-h-screen p-6 bg-white dark:bg-gray-900 flex items-center justify-center">
      <ThemeProvider>
        <div className="relative w-full max-w-4xl flex flex-col items-center justify-center gap-6 text-center px-4">
          {/* Grid background shape */}
          <GridShape />

          {/* Logo and Description */}
          <div className="flex flex-col items-center">
            <Link href="/" className="mb-4">
              <Image
                width={231}
                height={48}
                src="/images/logo/inclusable-logo.svg"
                alt="Logo"
              />
            </Link>
          </div>

          {/* Auth Form Content */}
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Theme Toggler */}
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </ThemeProvider>
    </div>
  );
}
