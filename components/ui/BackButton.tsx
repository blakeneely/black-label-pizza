'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  label?: string
  fallbackHref?: string
}

export default function BackButton({
  label = 'Back',
  fallbackHref = '/order-online',
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    // Use browser history to go back if available
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      // Fallback to a specific route if there's no history
      router.push(fallbackHref)
    }
  }

  return (
    <button
      onClick={handleClick}
      className='inline-flex items-center bg-primary text-white px-4 py-2 font-medium hover:bg-primary-hover transition-colors cursor-pointer'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5 mr-2'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M10 19l-7-7m0 0l7-7m-7 7h18'
        />
      </svg>
      {label}
    </button>
  )
}
