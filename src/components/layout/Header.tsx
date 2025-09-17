'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
       <Link href="/" className="text-xl font-bold text-brand-600">  
          <img
            src="/images/logo/inclusable-logo.svg"
            alt="Logo"
            className="inline-block dark:hidden"
            width={154}
            height={32}
          />
        </Link>
        <nav className="space-x-6">
          <Link href="/" className="text-gray-700 hover:text-brand-600">
            Home
          </Link>
          {/* <Link href="/signin" className="text-gray-700 hover:text-brand-600">
            Sign In
          </Link> */}
          {/* <Link href="/signup" className="text-gray-700 hover:text-brand-600">
            Sign Up
          </Link> */}
        </nav>
      </div>
    </header>
  )
}
