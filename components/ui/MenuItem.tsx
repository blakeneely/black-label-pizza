import Image from 'next/image'
import Link from 'next/link'
import { MenuItem as MenuItemType } from '@/types'

interface MenuItemProps {
  item: MenuItemType
}

export default function MenuItem({ item }: MenuItemProps) {
  return (
    <div className='flex items-center justify-between py-6 border-b border-gray-800'>
      <div className='flex items-center gap-4'>
        <div className='relative h-24 w-24 overflow-hidden'>
          <Image
            src={item.image}
            alt={item.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div>
          <h3 className='text-xl font-bold'>{item.name}</h3>
          <p className='text-gray-400'>{item.description}</p>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-xl'>${item.price}</span>
        <Link
          href={`/order-online/${item.id}`}
          className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-hover transition-colors'
        >
          Order
        </Link>
      </div>
    </div>
  )
}
