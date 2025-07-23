'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useOrders } from '@/contexts/OrderContext'
import { CustomerInfo } from '@/types'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/ui/BackButton'

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    isLoading,
  } = useCart()
  const { addOrder } = useOrders()
  const router = useRouter()
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Customer information state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  })

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Handle quantity change
  const handleQuantityChange = (
    id: string,
    newQuantity: number,
    toppings?: any[]
  ) => {
    updateQuantity(id, newQuantity, toppings)
  }

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    setCheckoutStep('checkout')
    window.scrollTo(0, 0)
  }

  // Handle place order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // Create a new order using the server action
      const result = await addOrder(cartItems, customerInfo, cartTotal)

      if (result.success && result.orderId) {
        // Explicitly clear the cart on the client side
        await clearCart()

        // Redirect to confirmation page
        router.push(`/order-confirmation/${result.orderId}`)
      } else {
        alert('There was an error placing your order. Please try again.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('There was an error placing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render cart items
  const renderCartItems = () => {
    if (isLoading) {
      return (
        <div className='text-center py-16'>
          <p className='text-xl'>Loading your cart...</p>
        </div>
      )
    }

    if (cartItems.length === 0) {
      return (
        <div className='text-center py-16'>
          <h2 className='text-2xl font-bold mb-4'>Your cart is empty</h2>
          <p className='text-gray-400 mb-8'>
            Add some delicious items to your cart!
          </p>
          <button
            onClick={() => router.push('/order-online')}
            className='px-6 py-3 bg-primary hover:bg-primary-hover transition-colors'
          >
            Browse Menu
          </button>
        </div>
      )
    }

    return (
      <div className='space-y-6'>
        {cartItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className='border border-gray-800 p-6'
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-xl font-bold'>{item.name}</h3>
                {item.size && <p className='text-gray-400'>{item.size}</p>}
                {item.toppings && item.toppings.length > 0 && (
                  <div className='mt-2'>
                    <p className='text-sm text-gray-400'>Toppings:</p>
                    <ul className='text-sm text-gray-400'>
                      {item.toppings
                        .filter((topping) => topping.added)
                        .map((topping, i) => (
                          <li key={`added-${i}`}>
                            <span className='text-green-500'>+</span>{' '}
                            {topping.name} (${topping.price.toFixed(2)})
                          </li>
                        ))}
                      {item.toppings
                        .filter((topping) => topping.removed)
                        .map((topping, i) => (
                          <li key={`removed-${i}`}>
                            <span className='text-red-500'>-</span>{' '}
                            {topping.name} (removed)
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className='text-right'>
                <p className='text-lg'>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className='text-sm text-gray-400'>
                  ${item.price.toFixed(2)} each
                </p>
              </div>
            </div>
            <div className='mt-4 flex justify-between items-center'>
              <div className='flex items-center'>
                <button
                  className='w-8 h-8 border border-gray-800 flex items-center justify-center'
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.quantity - 1,
                      item.toppings
                    )
                  }
                >
                  -
                </button>
                <span className='w-8 text-center'>{item.quantity}</span>
                <button
                  className='w-8 h-8 border border-gray-800 flex items-center justify-center'
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.quantity + 1,
                      item.toppings
                    )
                  }
                >
                  +
                </button>
              </div>
              <button
                className='text-red-500 hover:text-red-700 transition-colors'
                onClick={() => removeFromCart(item.id, item.toppings)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Render checkout form
  const renderCheckoutForm = () => {
    return (
      <form onSubmit={handlePlaceOrder} className='space-y-6'>
        <div className='border border-gray-800 p-6'>
          <h2 className='text-xl font-bold mb-4'>Contact Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm mb-1'>Full Name*</label>
              <input
                type='text'
                name='name'
                value={customerInfo.name}
                onChange={handleInputChange}
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
            <div>
              <label className='block text-sm mb-1'>Phone Number*</label>
              <input
                type='tel'
                name='phone'
                value={customerInfo.phone}
                onChange={handleInputChange}
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm mb-1'>Email*</label>
              <input
                type='email'
                name='email'
                value={customerInfo.email}
                onChange={handleInputChange}
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
          </div>
        </div>

        <div className='border border-gray-800 p-6'>
          <h2 className='text-xl font-bold mb-4'>Delivery Address</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='md:col-span-2'>
              <label className='block text-sm mb-1'>Street Address*</label>
              <input
                type='text'
                name='address'
                value={customerInfo.address}
                onChange={handleInputChange}
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
            <div>
              <label className='block text-sm mb-1'>City*</label>
              <input
                type='text'
                name='city'
                value={customerInfo.city}
                onChange={handleInputChange}
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
            <div>
              <label className='block text-sm mb-1'>Zip Code*</label>
              <input
                type='text'
                name='zipCode'
                value={customerInfo.zipCode}
                onChange={handleInputChange}
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
          </div>
        </div>

        <div className='border border-gray-800 p-6'>
          <h2 className='text-xl font-bold mb-4'>Payment Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='md:col-span-2'>
              <label className='block text-sm mb-1'>Card Number*</label>
              <input
                type='text'
                name='cardNumber'
                value={customerInfo.cardNumber}
                onChange={handleInputChange}
                placeholder='1234 5678 9012 3456'
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
            <div>
              <label className='block text-sm mb-1'>Expiry Date*</label>
              <input
                type='text'
                name='cardExpiry'
                value={customerInfo.cardExpiry}
                onChange={handleInputChange}
                placeholder='MM/YY'
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
            <div>
              <label className='block text-sm mb-1'>CVV*</label>
              <input
                type='text'
                name='cardCVV'
                value={customerInfo.cardCVV}
                onChange={handleInputChange}
                placeholder='123'
                required
                className='w-full p-2 bg-theme border border-gray-800'
              />
            </div>
          </div>
          <div className='mt-4 text-sm text-gray-400'>
            <p>* This is a demo app. No real payments will be processed.</p>
          </div>
        </div>

        <div className='border border-gray-800 p-6'>
          <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
          <div className='space-y-2'>
            {cartItems.map((item, index) => (
              <div key={index} className='flex justify-between'>
                <span>
                  {item.quantity} × {item.name} {item.size && `(${item.size})`}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className='border-t border-gray-800 pt-2 mt-4'>
              <div className='flex justify-between font-bold'>
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-between'>
          <button
            type='button'
            onClick={() => setCheckoutStep('cart')}
            className='px-6 py-3 border border-gray-800 hover:border-primary transition-colors'
            disabled={isSubmitting}
          >
            Back to Cart
          </button>
          <button
            type='submit'
            className={`px-6 py-3 bg-primary hover:bg-primary-hover transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='mb-8'>
        <BackButton />
      </div>

      <h1 className='text-4xl font-bold mb-12 text-center'>
        {checkoutStep === 'cart' ? 'Your Cart' : 'Checkout'}
      </h1>

      {checkoutStep === 'cart' ? (
        <>
          {renderCartItems()}

          {!isLoading && cartItems.length > 0 && (
            <div className='mt-8 border-t border-gray-800 pt-8'>
              <div className='flex justify-between items-center mb-8'>
                <span className='text-xl font-bold'>Total:</span>
                <span className='text-2xl'>${cartTotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <button
                  onClick={() => router.push('/order-online')}
                  className='px-6 py-3 border border-gray-800 hover:border-primary transition-colors'
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  className='px-6 py-3 bg-primary hover:bg-primary-hover transition-colors'
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        renderCheckoutForm()
      )}
    </div>
  )
}
