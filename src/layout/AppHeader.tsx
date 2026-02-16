"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
// import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6">
        {/* Left: Sidebar Toggle */}
        <div className="flex items-center">
          <button
            className="text-gray-500 dark:text-gray-400"
            onClick={() => {
              if (window.innerWidth >= 1024) {
                toggleSidebar();
              } else {
                toggleMobileSidebar();
              }
            }}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.22 7.28a.75.75 0 011.06 0L12 11.94l4.72-4.72a.75.75 0 111.06 1.06L13.06 13l4.72 4.72a.75.75 0 11-1.06 1.06L12 14.06l-4.72 4.72a.75.75 0 11-1.06-1.06L10.94 13 6.22 8.28a.75.75 0 010-1.06z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.33.25h13.33a.75.75 0 110 1.5H1.33a.75.75 0 010-1.5zm0 10h13.33a.75.75 0 110 1.5H1.33a.75.75 0 010-1.5zM1.33 5.25a.75.75 0 000 1.5H8a.75.75 0 000-1.5H1.33z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">

          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
