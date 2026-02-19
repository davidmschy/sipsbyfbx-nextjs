'use client'

import Link from 'next/link'

interface HeaderProps {
  cartItemCount: number
  onCartClick: () => void
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-navy/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              SIPs by <span className="text-gold">FBX</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#products"
              className="text-gray-300 hover:text-gold transition-colors duration-200"
            >
              Products
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-gold transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-gold transition-colors duration-200"
            >
              Contact
            </a>
          </nav>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative p-2 text-gray-300 hover:text-gold transition-colors duration-200"
            aria-label="Shopping cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
