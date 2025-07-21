import { ThemeProvider } from '@/contexts/ThemeContext'
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
        <body>
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </ThemeProvider>
    </html>
  )
}
