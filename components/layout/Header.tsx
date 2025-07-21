'use client'

import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { resolvedTheme } = useTheme()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  const logoSrc =
    resolvedTheme === 'dark'
      ? '/images/white-logo.png'
      : '/images/black-logo.png'

  return (
    <header className='bg-theme border-b border-theme sticky top-0 z-50'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <Link href='/' className='flex items-center'>
          <Image
            src={logoSrc}
            alt='Black Label Pizza'
            width={60}
            height={60}
            className='mr-1'
          />
          <div className='flex flex-col -space-y-1'>
            <h1 className='text-xl font-bold'>BLACK LABEL</h1>
            <span className='text-xs tracking-widest text-accent'>PIZZA</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center'>
          <ul className='flex space-x-6 mr-4'>
            <li className='relative'>
              <Link href='/' className='hover:text-primary transition-colors'>
                Home
                {pathname === '/' && (
                  <span className='absolute bottom-[-8px] left-0 w-full h-[3px] bg-accent'></span>
                )}
              </Link>
            </li>
            <li className='relative'>
              <Link
                href='/menu'
                className='hover:text-primary transition-colors'
              >
                Menu
                {pathname === '/menu' && (
                  <span className='absolute bottom-[-8px] left-0 w-full h-[3px] bg-accent'></span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href='/order-online'
                className={`px-4 py-2 transition-colors ${
                  pathname === '/order-online' ||
                  pathname.startsWith('/order-online/')
                    ? 'bg-primary-hover'
                    : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                Order Online
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className='flex items-center md:hidden'>
          <ThemeToggle />
          <button
            className='ml-4 p-2 z-50'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
          >
            {!isMenuOpen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-theme border-l border-theme shadow-lg z-40 transform transition-transform duration-300 ease-in-out w-64 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='p-6 pt-20'>
          <ul className='flex flex-col space-y-6'>
            <li className='relative'>
              <Link
                href='/'
                className='block text-xl py-2 hover:text-primary transition-colors'
              >
                Home
                {pathname === '/' && (
                  <span className='absolute bottom-0 left-0 w-16 h-[3px] bg-accent'></span>
                )}
              </Link>
            </li>
            <li className='relative'>
              <Link
                href='/menu'
                className='block text-xl py-2 hover:text-primary transition-colors'
              >
                Menu
                {pathname === '/menu' && (
                  <span className='absolute bottom-0 left-0 w-16 h-[3px] bg-accent'></span>
                )}
              </Link>
            </li>
            <li className='mt-6'>
              <Link
                href='/order-online'
                className={`block text-xl py-3 px-6 text-center transition-colors ${
                  pathname === '/order-online' ||
                  pathname.startsWith('/order-online/')
                    ? 'bg-primary-hover'
                    : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                Order Online
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
