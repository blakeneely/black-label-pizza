import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { OrderProvider } from '@/contexts/OrderContext'
import './globals.css'
import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Black Label Pizza',
  description: 'Authentic Chicago-style tavern pizza in Nashville',
  icons: {
    icon: '/favicon.ico',
    apple: '/images/white-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <ThemeProvider>
        <CartProvider>
          <OrderProvider>
            <body>
              <Header />
              <main>{children}</main>
              <Footer />
            </body>
          </OrderProvider>
        </CartProvider>
      </ThemeProvider>
    </html>
  )
}
