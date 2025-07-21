'use client'

import { useState } from 'react'
import { MenuItem } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'

// Define available toppings directly in the component
const availableToppings = [
  { name: 'Extra Cheese', price: 1.5 },
  { name: 'Pepperoni', price: 2 },
  { name: 'Sausage', price: 2 },
  { name: 'Mushrooms', price: 1.5 },
  { name: 'Onions', price: 1 },
  { name: 'Green Peppers', price: 1 },
  { name: 'Black Olives', price: 1.5 },
  { name: 'Bacon', price: 2 },
  { name: 'Spinach', price: 1.5 },
  { name: 'Pineapple', price: 1.5 },
  { name: 'Jalapeños', price: 1 },
  { name: 'Giardiniera', price: 1.5 },
]

// Define available sizes
const sizes = [
  { name: 'Small (12")', price: -2 },
  { name: 'Medium (14")', price: 0 },
  { name: 'Large (16")', price: 3 },
]

interface PizzaCustomizerProps {
  pizza: MenuItem
}

export default function PizzaCustomizer({ pizza }: PizzaCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[1]) // Default to Medium
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const { resolvedTheme } = useTheme()

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = pizza.price
    const sizePrice = selectedSize.price

    const toppingsPrice = selectedToppings.reduce((total, topping) => {
      const toppingObj = availableToppings.find((t) => t.name === topping)
      return total + (toppingObj ? toppingObj.price : 0)
    }, 0)

    return (basePrice + sizePrice + toppingsPrice) * quantity
  }

  // Toggle topping selection
  const toggleTopping = (toppingName: string) => {
    if (selectedToppings.includes(toppingName)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== toppingName))
    } else {
      setSelectedToppings([...selectedToppings, toppingName])
    }
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
        <h3 className='text-xl font-bold mb-4'>Extra Toppings</h3>
        <div className='grid grid-cols-2 gap-3'>
          {availableToppings.map((topping) => (
            <button
              key={topping.name}
              className={`py-2 px-3 border flex justify-between items-center cursor-pointer ${
                selectedToppings.includes(topping.name)
                  ? resolvedTheme === 'dark'
                    ? 'border-primary border-2 bg-black text-white'
                    : 'border-primary border-2 bg-primary text-white'
                  : 'border-gray-800 text-gray-400 hover:border-primary'
              }`}
              onClick={() => toggleTopping(topping.name)}
            >
              <span>{topping.name}</span>
              <span>+${topping.price}</span>
            </button>
          ))}
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
      <button className='w-full bg-primary hover:bg-primary-hover py-4 text-white text-lg font-medium transition-colors cursor-pointer'>
        Add to Cart
      </button>
    </div>
  )
}
