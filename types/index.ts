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
  size?: string
}

export type OrderStatus = 'in_progress' | 'completed'

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
  city: string
  zipCode: string
  cardNumber: string
  cardExpiry: string
  cardCVV: string
}

export interface Order {
  id: string
  items: CartItem[]
  customer: CustomerInfo
  status: OrderStatus
  total: number
  date: string
}
