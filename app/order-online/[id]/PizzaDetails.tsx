'use client'

import Image from 'next/image'
import PizzaCustomizer from '@/components/ui/PizzaCustomizer'
import BackButton from '@/components/ui/BackButton'
import { MenuItem } from '@/types'

interface PizzaDetailsProps {
  pizza: MenuItem
}

export default function PizzaDetails({ pizza }: PizzaDetailsProps) {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='mb-8'>
        <BackButton />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Pizza Image */}
        <div className='relative h-96 border border-gray-800'>
          <Image
            src={pizza.image}
            alt={pizza.name}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          {pizza.featured && (
            <div className='absolute top-4 right-4 bg-accent px-3 py-1'>
              <span className='text-sm font-medium uppercase tracking-wider'>
                Chef&apos;s Special
              </span>
            </div>
          )}
        </div>

        {/* Pizza Details and Customization */}
        <div>
          <h1 className='text-3xl font-bold mb-2'>{pizza.name}</h1>
          <div className='h-1 w-16 bg-accent mb-6'></div>
          <p className='text-gray-400 text-lg mb-6'>{pizza.description}</p>
          <div className='mb-8'>
            <span className='text-2xl'>${pizza.price}</span>
            <span className='text-gray-400 ml-2'>(Medium 14&quot;)</span>
          </div>

          <PizzaCustomizer pizza={pizza} />
        </div>
      </div>
    </div>
  )
}
