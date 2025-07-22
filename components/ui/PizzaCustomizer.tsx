'use client'

import { useState, useEffect } from 'react'
import { MenuItem } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

// Define available toppings directly in the component
const availableToppings = [
  { name: 'Extra Cheese', price: 2 },
  { name: 'Pepperoni', price: 2 },
  { name: 'Sausage', price: 2 },
  { name: 'Mushrooms', price: 2 },
  { name: 'Onions', price: 2 },
  { name: 'Green Peppers', price: 2 },
  { name: 'Black Olives', price: 2 },
  { name: 'Bacon', price: 2 },
  { name: 'Spinach', price: 2 },
  { name: 'Pineapple', price: 2 },
  { name: 'Jalapeños', price: 2 },
  { name: 'Giardiniera', price: 2 },
]

// Define available sizes
const sizes = [
  { name: 'Small (12")', price: -2 },
  { name: 'Medium (14")', price: 0 },
  { name: 'Large (16")', price: 3 },
]

// Map pizza names to their default toppings
const defaultToppings: Record<string, string[]> = {
  'Classic Cheese': ['Extra Cheese'],
  Pepperoni: ['Pepperoni'],
  Sausage: ['Sausage'],
  'The Deluxe': [
    'Pepperoni',
    'Sausage',
    'Mushrooms',
    'Onions',
    'Green Peppers',
  ],
  'Meat Lovers': ['Pepperoni', 'Sausage', 'Bacon'],
  'Sausage & Mushroom': ['Sausage', 'Mushrooms'],
  'Bacon & Giardiniera': ['Bacon', 'Giardiniera'],
  'Veggie Supreme': ['Mushrooms', 'Green Peppers', 'Onions', 'Black Olives'],
  'Spinach & Mushroom': ['Spinach', 'Mushrooms'],
}

interface PizzaCustomizerProps {
  pizza: MenuItem
}

export default function PizzaCustomizer({ pizza }: PizzaCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[1]) // Default to Medium
  const [initialToppings, setInitialToppings] = useState<string[]>([])
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [removedToppings, setRemovedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { resolvedTheme } = useTheme()
  const { addToCart } = useCart()
  const router = useRouter()

  // Initialize default toppings based on pizza type
  useEffect(() => {
    const pizzaDefaults = defaultToppings[pizza.name] || []
    setInitialToppings(pizzaDefaults)
    setSelectedToppings(pizzaDefaults)
    setRemovedToppings([])
  }, [pizza.name])

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = pizza.price
    const sizePrice = selectedSize.price

    // Calculate price for added toppings (those not in initialToppings)
    const addedToppingsPrice = selectedToppings
      .filter((topping) => !initialToppings.includes(topping))
      .reduce((total, topping) => {
        const toppingObj = availableToppings.find((t) => t.name === topping)
        return total + (toppingObj ? toppingObj.price : 0)
      }, 0)

    return (basePrice + sizePrice + addedToppingsPrice) * quantity
  }

  // Toggle topping selection
  const toggleTopping = (toppingName: string) => {
    if (selectedToppings.includes(toppingName)) {
      // Remove topping
      setSelectedToppings(selectedToppings.filter((t) => t !== toppingName))

      // If this was an initial topping, add it to removed toppings
      if (initialToppings.includes(toppingName)) {
        setRemovedToppings([...removedToppings, toppingName])
      }
    } else {
      // Add topping
      setSelectedToppings([...selectedToppings, toppingName])

      // If this was previously removed, remove it from removed toppings
      if (initialToppings.includes(toppingName)) {
        setRemovedToppings(removedToppings.filter((t) => t !== toppingName))
      }
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    // Get added toppings with prices (toppings not in initialToppings)
    const addedToppingsWithPrices = selectedToppings
      .filter((topping) => !initialToppings.includes(topping))
      .map((toppingName) => {
        const topping = availableToppings.find((t) => t.name === toppingName)
        return {
          name: toppingName,
          price: topping ? topping.price : 0,
          added: true,
        }
      })

    // Get removed toppings
    const removedToppingsWithPrices = removedToppings.map((toppingName) => {
      return { name: toppingName, price: 0, removed: true }
    })

    // Combine both for display
    const toppingsWithPrices = [
      ...addedToppingsWithPrices,
      ...removedToppingsWithPrices,
    ]

    // Create cart item
    const cartItem = {
      id: pizza.id,
      name: pizza.name,
      price: calculateTotalPrice() / quantity, // Price per item including toppings and size
      quantity,
      toppings: toppingsWithPrices,
      size: selectedSize.name,
      removedToppings: removedToppings,
    }

    // Add to cart
    addToCart(cartItem)

    // Show success message
    setAddedToCart(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setAddedToCart(false)
    }, 3000)
  }

  // Handle view cart
  const handleViewCart = () => {
    router.push('/cart')
  }

  // Determine if a topping is initial (included in the pizza by default)
  const isInitialTopping = (toppingName: string) => {
    return initialToppings.includes(toppingName)
  }

  return (
    <div>
      {/* Size Selection */}
      <div className='mb-8'>
        <h3 className='text-xl font-bold mb-4'>Size</h3>
        <div className='grid grid-cols-3 gap-4'>
          {sizes.map((size) => (
            <button
              key={size.name}
              className={`py-3 px-4 border cursor-pointer ${
                selectedSize.name === size.name
                  ? resolvedTheme === 'dark'
                    ? 'border-primary border-2 bg-black text-white'
                    : 'border-primary border-2 bg-primary text-white'
                  : 'border-gray-800 text-gray-400 hover:border-primary'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size.name}
              {size.price > 0 && (
                <span className='block text-sm mt-1'>+${size.price}</span>
              )}
              {size.price < 0 && (
                <span className='block text-sm mt-1'>${size.price}</span>
              )}
              {size.price === 0 && (
                <span className='block text-sm mt-1'>Base Price</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Toppings Selection */}
      <div className='mb-8'>
        <h3 className='text-xl font-bold mb-4'>Toppings</h3>
        <div className='grid grid-cols-2 gap-3'>
          {availableToppings.map((topping) => {
            const isSelected = selectedToppings.includes(topping.name)
            const isDefault = isInitialTopping(topping.name)

            return (
              <button
                key={topping.name}
                className={`py-2 px-3 border flex justify-between items-center cursor-pointer ${
                  isSelected
                    ? resolvedTheme === 'dark'
                      ? 'border-primary border-2 bg-black text-white'
                      : 'border-primary border-2 bg-primary text-white'
                    : 'border-gray-800 text-gray-400 hover:border-primary'
                }`}
                onClick={() => toggleTopping(topping.name)}
              >
                <div className='flex items-center'>
                  <span>{topping.name}</span>
                  {isDefault && (
                    <span className='ml-1 text-xs'>
                      {isSelected ? '(Included)' : '(Removed)'}
                    </span>
                  )}
                </div>
                {!isDefault && <span>+${topping.price}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Quantity */}
      <div className='mb-8'>
        <h3 className='text-xl font-bold mb-4'>Quantity</h3>
        <div className='flex items-center'>
          <button
            className='w-10 h-10 border border-gray-800 flex items-center justify-center text-xl cursor-pointer'
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className='w-12 text-center text-xl'>{quantity}</span>
          <button
            className='w-10 h-10 border border-gray-800 flex items-center justify-center text-xl cursor-pointer'
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className='flex justify-between items-center mb-8'>
        <span className='text-xl font-bold'>Total:</span>
        <span className='text-2xl'>${calculateTotalPrice().toFixed(2)}</span>
      </div>

      {/* Add to Cart Button */}
      {addedToCart ? (
        <div className='flex flex-col space-y-4'>
          <div className='bg-green-600 text-white py-3 px-4 text-center'>
            Added to cart!
          </div>
          <button
            onClick={handleViewCart}
            className='w-full bg-primary hover:bg-primary-hover py-4 text-white text-lg font-medium transition-colors cursor-pointer'
          >
            View Cart
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className='w-full bg-primary hover:bg-primary-hover py-4 text-white text-lg font-medium transition-colors cursor-pointer'
        >
          Add to Cart
        </button>
      )}
    </div>
  )
}
