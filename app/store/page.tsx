'use client'

import { useState, useEffect } from 'react'
import { OrderStatus, Order } from '@/types'
import { getOrders, updateOrderStatus, deleteOrder } from '@/lib/order-actions'
import {
  FaCheck,
  FaTrash,
  FaUndo,
  FaCheckCircle,
  FaTimes,
} from 'react-icons/fa'

export default function StorePage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Load orders on component mount
  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await getOrders()
        setOrders(fetchedOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

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
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const success = await updateOrderStatus(orderId, status)

      if (success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        )
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  // Handle delete order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      const success = await deleteOrder(orderId)

      if (success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        )
        setConfirmDelete(null)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
    }
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
              filter === 'all' ? 'bg-primary text-white' : 'hover:bg-gray-800'
            }`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 ${
              filter === 'in_progress'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-800'
            }`}
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </button>
          <button
            className={`px-4 py-2 ${
              filter === 'completed'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-800'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className='text-center py-16'>
          <p className='text-xl'>Loading orders...</p>
        </div>
      ) : sortedOrders.length === 0 ? (
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
                  className='border-b border-gray-800 hover:bg-gray-900'
                >
                  <td className='py-4 px-4'>{order.id}</td>
                  <td className='py-4 px-4'>{formatDate(order.date)}</td>
                  <td className='py-4 px-4'>
                    <div>
                      <p className='font-medium'>{order.customer.name}</p>
                      <p className='text-sm text-gray-400'>
                        {order.customer.phone}
                      </p>
                      <p className='text-sm text-gray-400'>
                        {order.customer.address}
                      </p>
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
                          : 'bg-primary text-white'
                      }`}
                    >
                      {order.status === 'in_progress'
                        ? 'In Progress'
                        : 'Completed'}
                    </span>
                  </td>
                  <td className='py-4 px-4'>
                    <div className='flex space-x-3'>
                      {order.status === 'in_progress' ? (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, 'completed')
                          }
                          className='p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors'
                          title='Mark Complete'
                        >
                          <FaCheck size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, 'in_progress')
                          }
                          className='p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors'
                          title='Reopen'
                        >
                          <FaUndo size={16} />
                        </button>
                      )}

                      {confirmDelete === order.id ? (
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className='p-2 bg-accent text-white rounded-full hover:bg-accent-hover transition-colors'
                            title='Confirm Delete'
                          >
                            <FaCheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className='p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors'
                            title='Cancel'
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(order.id)}
                          className='p-2 bg-accent text-white rounded-full hover:bg-accent-hover transition-colors'
                          title='Remove'
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
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
            Click <FaCheck className='inline text-primary' size={14} /> to mark
            an order as complete when it has been prepared and delivered.
          </li>
          <li>
            Click <FaTrash className='inline text-accent' size={14} /> to
            permanently remove an order from the system.
          </li>
          <li>
            Click <FaUndo className='inline text-yellow-600' size={14} /> to
            reopen a completed order if needed.
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
