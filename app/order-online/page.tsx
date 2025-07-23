'use client'

import { useState } from 'react'
import { menuItems, appetizers, desserts, drinks } from '../data/menu'
import { MenuItem } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { v4 as uuidv4 } from 'uuid'

// Define types for non-pizza items
interface SimpleMenuItem {
  name: string
  description: string
  price: number
  image?: string
}

type MenuItemType = 'pizzas' | 'appetizers' | 'desserts' | 'drinks'

export default function OrderOnlinePage() {
  const [activeCategory, setActiveCategory] = useState('pizza-classic')
  const { addToCart } = useCart()
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

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

  // Handle adding non-pizza items to cart
  const handleAddToCart = (item: SimpleMenuItem) => {
    // Generate a unique ID for the item
    const itemId = `${item.name
      .toLowerCase()
      .replace(/\s+/g, '-')}-${uuidv4().slice(0, 8)}`

    // Add item to cart
    addToCart({
      id: itemId,
      name: item.name,
      price: item.price,
      quantity: 1,
    })

    // Show feedback that item was added
    setAddedItems((prev) => ({
      ...prev,
      [itemId]: true,
    }))

    // Reset feedback after a short delay
    setTimeout(() => {
      setAddedItems((prev) => ({
        ...prev,
        [itemId]: false,
      }))
    }, 1500)
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold text-center mb-12'>Order Online</h1>

      {/* Category Navigation */}
      <div className='flex justify-center mb-12 overflow-x-auto'>
        <div className='inline-flex border-b-2 border-primary'>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'appetizers'
                ? 'text-primary border-b-3 border-accent -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('appetizers')}
          >
            APPETIZERS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'pizza-classic'
                ? 'text-primary border-b-3 border-accent -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('pizza-classic')}
          >
            CLASSIC PIZZAS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'pizza-specialty'
                ? 'text-primary border-b-3 border-accent -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('pizza-specialty')}
          >
            SPECIALTY PIZZAS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'pizza-vegetarian'
                ? 'text-primary border-b-3 border-accent -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('pizza-vegetarian')}
          >
            VEGETARIAN PIZZAS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'desserts'
                ? 'text-primary border-b-3 border-accent -mb-[1px]'
                : 'text-muted hover:text-theme'
            }`}
            onClick={() => setActiveCategory('desserts')}
          >
            DESSERTS
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeCategory === 'drinks'
                ? 'text-primary border-b-3 border-accent -mb-[1px]'
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
              className='block h-full'
            >
              <div className='border border-primary hover:border-accent transition-all h-full flex flex-col'>
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
                <div className='p-6 flex flex-col flex-grow'>
                  <div className='flex justify-between items-center mb-3'>
                    <h3 className='text-xl font-bold'>{pizza.name}</h3>
                    <span className='text-xl'>${pizza.price}</span>
                  </div>
                  <p className='text-muted mb-6'>{pizza.description}</p>
                  <div className='mt-auto'>
                    <button className='w-full bg-primary text-white py-3 font-medium hover:bg-primary-hover transition-colors cursor-pointer'>
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}

        {type !== 'pizzas' &&
          // Render other menu items (appetizers, desserts, drinks)
          (items as SimpleMenuItem[]).map((item, index) => {
            const itemId = `${item.name
              .toLowerCase()
              .replace(/\s+/g, '-')}-${index}`
            const isAdded = addedItems[itemId]

            return (
              <div
                key={index}
                className={`border border-primary hover:border-accent transition-all ${
                  type === 'appetizers' ? 'h-full flex flex-col' : ''
                }`}
              >
                {item.image && type === 'appetizers' && (
                  <div className='relative h-48 w-full'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div
                  className={`p-6 ${
                    type === 'appetizers' ? 'flex flex-col flex-grow' : ''
                  }`}
                >
                  <div className='flex justify-between items-center mb-3'>
                    <h3 className='text-xl font-bold'>{item.name}</h3>
                    <span className='text-xl'>${item.price}</span>
                  </div>
                  <p className='text-muted mb-6'>{item.description}</p>
                  <div className={type === 'appetizers' ? 'mt-auto' : ''}>
                    <button
                      className={`w-full py-3 font-medium transition-colors cursor-pointer ${
                        isAdded
                          ? 'bg-green-600 text-white'
                          : 'bg-primary text-white hover:bg-primary-hover'
                      }`}
                      onClick={() => handleAddToCart(item)}
                    >
                      {isAdded ? 'Added to Cart!' : 'Add to Order'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
