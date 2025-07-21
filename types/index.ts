export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'classic' | 'specialty' | 'vegetarian'
  image: string
  featured?: boolean
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  toppings?: Array<{ name: string; price: number }>
}
