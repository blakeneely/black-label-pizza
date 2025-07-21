import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header() {
  return (
    <header className='bg-theme border-b border-theme sticky top-0 z-50'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <Link href='/' className='flex items-center'>
          <Image
            src='/images/logo.png'
            alt='Black Label Pizza'
            width={50}
            height={50}
            className='mr-3'
          />
          <div>
            <h1 className='text-xl font-bold'>BLACK LABEL</h1>
            <span className='text-xs tracking-widest text-accent'>
              TAVERN PIZZA
            </span>
          </div>
        </Link>
        <nav className='flex items-center'>
          <ul className='flex space-x-6 mr-4'>
            <li>
              <Link href='/' className='hover:text-primary transition-colors'>
                Home
              </Link>
            </li>
            <li>
              <Link
                href='/menu'
                className='hover:text-primary transition-colors'
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                href='/order-online'
                className='bg-primary hover:bg-primary-hover px-4 py-2 transition-colors'
              >
                Order Online
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
