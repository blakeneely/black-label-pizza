'use client'

import { useState } from 'react'
import { useOrders } from '@/contexts/OrderContext'
import { OrderStatus } from '@/types'

export default function StorePage() {
  const { orders, updateOrderStatus } = useOrders()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  // Filter orders based on status
  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status === filter)

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Handle status change
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-8 text-center'>Store Dashboard</h1>

      {/* Filter Controls */}
      <div className='mb-8 flex justify-center'>
        <div className='inline-flex border border-gray-800 rounded-md overflow-hidden'>
          <button
            className={`px-4 py-2 ${
              filter === 'all' ? 'bg-primary text-white' : 'hover:bg-gray-400'
            }`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 ${
              filter === 'in_progress'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-400'
            }`}
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </button>
          <button
            className={`px-4 py-2 ${
              filter === 'completed'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-400'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {sortedOrders.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-xl text-gray-400'>No orders found</p>
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-gray-800'>
                <th className='py-4 px-4 text-left'>Order ID</th>
                <th className='py-4 px-4 text-left'>Date</th>
                <th className='py-4 px-4 text-left'>Customer</th>
                <th className='py-4 px-4 text-left'>Items</th>
                <th className='py-4 px-4 text-left'>Total</th>
                <th className='py-4 px-4 text-left'>Status</th>
                <th className='py-4 px-4 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className='border-b border-gray-800 hover:bg-primary-hover'
                >
                  <td className='py-4 px-4'>{order.id}</td>
                  <td className='py-4 px-4'>{formatDate(order.date)}</td>
                  <td className='py-4 px-4'>
                    <div>
                      <p className='font-medium'>{order.customer.name}</p>
                      <p className='text-sm'>{order.customer.phone}</p>
                      <p className='text-sm'>{order.customer.address}</p>
                    </div>
                  </td>
                  <td className='py-4 px-4'>
                    <div className='max-w-xs'>
                      {order.items.map((item, index) => (
                        <div key={index} className='mb-1 text-sm'>
                          {item.quantity}× {item.name}
                          {item.size && (
                            <span className='text-xs text-gray-400'>
                              {' '}
                              ({item.size})
                            </span>
                          )}
                          {item.toppings && item.toppings.length > 0 && (
                            <span className='text-xs text-gray-400'>
                              {' '}
                              with{' '}
                              {item.toppings
                                .filter((t) => t.added)
                                .map((t) => t.name)
                                .join(', ')}
                              {item.toppings.some((t) => t.removed) && (
                                <>
                                  {item.toppings.some((t) => t.added)
                                    ? ', '
                                    : ''}
                                  without{' '}
                                  {item.toppings
                                    .filter((t) => t.removed)
                                    .map((t) => t.name)
                                    .join(', ')}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='py-4 px-4'>${order.total.toFixed(2)}</td>
                  <td className='py-4 px-4'>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'in_progress'
                          ? 'bg-yellow-500 text-yellow-900'
                          : 'bg-green-500 text-green-900'
                      }`}
                    >
                      {order.status === 'in_progress'
                        ? 'In Progress'
                        : 'Completed'}
                    </span>
                  </td>
                  <td className='py-4 px-4'>
                    {order.status === 'in_progress' ? (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, 'completed')
                        }
                        className='px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors'
                      >
                        Mark Complete
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, 'in_progress')
                        }
                        className='px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors'
                      >
                        Reopen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Instructions */}
      <div className='mt-12 p-6 border border-gray-800 rounded-md'>
        <h2 className='text-xl font-bold mb-4'>Employee Instructions</h2>
        <ul className='list-disc pl-6 space-y-2'>
          <li>Monitor this page for new orders.</li>
          <li>
            Click &quot;Mark Complete&quot; when an order has been prepared and
            delivered.
          </li>
          <li>Use the filter buttons to view orders by status.</li>
          <li>
            Contact the customer using the provided phone number if there are
            any issues with the order.
          </li>
        </ul>
      </div>
    </div>
  )
}
