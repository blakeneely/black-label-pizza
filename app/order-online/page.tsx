'use client'

import { useState } from 'react'
import { menuItems, appetizers, desserts, drinks } from '../data/menu'
import { MenuItem } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

// Define types for non-pizza items
interface SimpleMenuItem {
  name: string
  description: string
  price: number
}

type MenuItemType = 'pizzas' | 'appetizers' | 'desserts' | 'drinks'

export default function OrderOnlinePage() {
  const [activeCategory, setActiveCategory] = useState('pizza-classic')

  // Filter items based on active category
  const getFilteredItems = () => {
    if (activeCategory === 'appetizers') {
      return { type: 'appetizers' as MenuItemType, items: appetizers }
    } else if (activeCategory === 'desserts') {
      return { type: 'desserts' as MenuItemType, items: desserts }
    } else if (activeCategory === 'drinks') {
      return { type: 'drinks' as MenuItemType, items: drinks }
    } else {
      // Handle pizza categories
      const category = activeCategory.replace('pizza-', '')
      return {
        type: 'pizzas' as MenuItemType,
        items: menuItems.filter((item) => item.category === category),
      }
    }
  }

  const { type, items } = getFilteredItems()

  return (
    <div className='container mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold text-center mb-12'>Order Online</h1>

      {/* Category Navigation */}
      <div className='flex justify-center mb-12 overflow-x-auto'>
        <div className='inline-flex border-b border-primary'>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'appetizers'
                ? 'text-primary border-b-2 border-primary -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('appetizers')}
          >
            APPETIZERS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'pizza-classic'
                ? 'text-primary border-b-2 border-primary -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('pizza-classic')}
          >
            CLASSIC PIZZAS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'pizza-specialty'
                ? 'text-primary border-b-2 border-primary -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('pizza-specialty')}
          >
            SPECIALTY PIZZAS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'pizza-vegetarian'
                ? 'text-primary border-b-2 border-primary -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('pizza-vegetarian')}
          >
            VEGETARIAN PIZZAS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'desserts'
                ? 'text-primary border-b-2 border-primary -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('desserts')}
          >
            DESSERTS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'drinks'
                ? 'text-primary border-b-2 border-primary -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('drinks')}
          >
            DRINKS
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {type === 'pizzas' &&
          // Render pizzas with links to customization page
          (items as MenuItem[]).map((pizza) => (
            <Link
              key={pizza.id}
              href={`/order-online/${pizza.id}`}
              className='block'
            >
              <div className='border border-primary hover:border-accent transition-all'>
                <div className='relative h-48 w-full'>
                  <Image
                    src={pizza.image}
                    alt={pizza.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {pizza.featured && (
                    <div className='absolute top-4 right-4 bg-accent px-3 py-1'>
                      <span className='text-sm font-medium uppercase tracking-wider'>
                        Chef&apos;s Special
                      </span>
                    </div>
                  )}
                </div>
                <div className='p-6'>
                  <div className='flex justify-between items-center mb-3'>
                    <h3 className='text-xl font-bold'>{pizza.name}</h3>
                    <span className='text-xl'>${pizza.price}</span>
                  </div>
                  <p className='text-muted mb-6'>{pizza.description}</p>
                  <button className='w-full bg-primary text-white py-3 font-medium hover:bg-primary-hover transition-colors cursor-pointer'>
                    Customize
                  </button>
                </div>
              </div>
            </Link>
          ))}

        {type !== 'pizzas' &&
          // Render other menu items (appetizers, desserts, drinks)
          (items as SimpleMenuItem[]).map((item, index) => (
            <div
              key={index}
              className='border border-primary hover:border-accent transition-all'
            >
              <div className='p-6'>
                <div className='flex justify-between items-center mb-3'>
                  <h3 className='text-xl font-bold'>{item.name}</h3>
                  <span className='text-xl'>${item.price}</span>
                </div>
                <p className='text-muted mb-6'>{item.description}</p>
                <button className='w-full bg-primary text-white py-3 font-medium hover:bg-primary-hover transition-colors cursor-pointer'>
                  Add to Order
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
