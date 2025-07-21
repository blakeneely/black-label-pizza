import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-theme border-t border-theme pt-12 pb-6'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          <div>
            <h3 className='text-xl font-bold mb-4'>BLACK LABEL PIZZA</h3>
            <div className='h-1 w-12 bg-primary mb-6'></div>
            <p className='text-muted mb-4'>
              Authentic Chicago-style pizza made with premium ingredients and
              traditional recipes.
            </p>
            <p className='text-muted'>Established 2018</p>
          </div>

          <div>
            <h3 className='text-xl font-bold mb-4'>HOURS</h3>
            <div className='h-1 w-12 bg-primary mb-6'></div>
            <ul className='space-y-2 text-muted'>
              <li>Monday - Thursday: 11am - 10pm</li>
              <li>Friday - Saturday: 11am - 12am</li>
              <li>Sunday: 12pm - 9pm</li>
            </ul>
          </div>

          <div>
            <h3 className='text-xl font-bold mb-4'>CONTACT</h3>
            <div className='h-1 w-12 bg-primary mb-6'></div>
            <ul className='space-y-2 text-muted'>
              <li>123 Pizza Street</li>
              <li>Nashville, TN 37205</li>
              <li>(312) 555-0123</li>
              <li>info@blacklabelpizza.com</li>
            </ul>
          </div>
        </div>

        <div className='border-t border-theme pt-6 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm text-muted mb-4 md:mb-0'>
            &copy; {new Date().getFullYear()} Black Label Pizza. All rights
            reserved.
          </p>
          <div className='flex space-x-6'>
            <Link
              href='/menu'
              className='text-sm text-muted hover:text-accent transition-colors'
            >
              Menu
            </Link>
            <Link
              href='/order-online'
              className='text-sm text-muted hover:text-accent transition-colors'
            >
              Order Online
            </Link>
            <Link
              href='#'
              className='text-sm text-muted hover:text-accent transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='#'
              className='text-sm text-muted hover:text-accent transition-colors'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
