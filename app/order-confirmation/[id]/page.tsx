'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useOrders } from '@/contexts/OrderContext'
import { Order } from '@/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params?.id as string
  const { getOrderById } = useOrders()
  const [order, setOrder] = useState<Order | undefined>()
  const router = useRouter()

  useEffect(() => {
    if (!orderId) return

    const foundOrder = getOrderById(orderId)
    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      // If order not found, redirect to home page
      router.push('/')
    }
  }, [orderId, getOrderById, router])

  if (!order) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        <p>Loading order details...</p>
      </div>
    )
  }

  // Format date
  const orderDate = new Date(order.date)
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-12'>
          <div className='inline-block bg-green-600 text-white p-4 rounded-full mb-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='w-12 h-12'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h1 className='text-4xl font-bold mb-4'>Order Confirmed!</h1>
          <p className='text-xl text-gray-400'>
            Your order has been placed successfully.
          </p>
        </div>

        <div className='border border-gray-800 p-6 mb-8'>
          <h2 className='text-xl font-bold mb-4'>Order Details</h2>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-gray-400'>Order Number:</p>
              <p className='font-bold'>{order.id}</p>
            </div>
            <div>
              <p className='text-gray-400'>Date:</p>
              <p>{formattedDate}</p>
            </div>
            <div>
              <p className='text-gray-400'>Status:</p>
              <p className='capitalize'>{order.status.replace('_', ' ')}</p>
            </div>
            <div>
              <p className='text-gray-400'>Total:</p>
              <p className='font-bold'>${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className='border border-gray-800 p-6 mb-8'>
          <h2 className='text-xl font-bold mb-4'>Items</h2>
          <div className='space-y-4'>
            {order.items.map((item, index) => (
              <div key={index} className='flex justify-between'>
                <div>
                  <p>
                    {item.quantity} × {item.name}{' '}
                    {item.size && `(${item.size})`}
                  </p>
                  {item.toppings && item.toppings.length > 0 && (
                    <ul className='text-sm text-gray-400 ml-4'>
                      {item.toppings.map((topping, i) => (
                        <li key={i}>+ {topping.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='border border-gray-800 p-6 mb-8'>
          <h2 className='text-xl font-bold mb-4'>Delivery Information</h2>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-gray-400'>Name:</p>
              <p>{order.customer.name}</p>
            </div>
            <div>
              <p className='text-gray-400'>Phone:</p>
              <p>{order.customer.phone}</p>
            </div>
            <div className='col-span-2'>
              <p className='text-gray-400'>Address:</p>
              <p>
                {order.customer.address}, {order.customer.city},{' '}
                {order.customer.zipCode}
              </p>
            </div>
          </div>
        </div>

        <div className='text-center'>
          <Link
            href='/'
            className='px-6 py-3 bg-primary hover:bg-primary-hover transition-colors inline-block'
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
