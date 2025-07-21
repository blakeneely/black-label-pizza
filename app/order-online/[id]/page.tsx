import { menuItems } from '../../data/menu'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PizzaDetailsClient from './PizzaDetailsClient'

// Define types for the page props
interface PageParams {
  id: string
}

// Generate static params for all pizza IDs
export function generateStaticParams() {
  return menuItems.map((pizza) => ({
    id: pizza.id,
  }))
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const resolvedParams = await params
  const pizza = menuItems.find((item) => item.id === resolvedParams.id)

  if (!pizza) {
    return {
      title: 'Pizza Not Found',
    }
  }

  return {
    title: `${pizza.name} - Black Label Pizza`,
    description: pizza.description,
  }
}

// Define the page component with proper typing for Next.js 15.4.2
export default async function Page({
  params,
}: {
  params: Promise<PageParams>
}) {
  const resolvedParams = await params
  const pizza = menuItems.find((item) => item.id === resolvedParams.id)

  if (!pizza) {
    notFound()
  }

  return <PizzaDetailsClient pizza={pizza} />
}
