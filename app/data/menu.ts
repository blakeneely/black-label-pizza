import { MenuItem } from '@/types'

// Pizza menu items
export const menuItems: MenuItem[] = [
  {
    id: 'cheese',
    name: 'Classic Cheese',
    description: 'Our signature sauce with mozzarella cheese.',
    price: 14.99,
    category: 'classic',
    image: '/images/cheese.jpg',
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    description: 'Classic cheese pizza topped with pepperoni.',
    price: 16.99,
    category: 'classic',
    image: '/images/pepperoni.jpg',
  },
  {
    id: 'sausage',
    name: 'Sausage',
    description: 'Classic cheese pizza topped with Italian sausage.',
    price: 16.99,
    category: 'classic',
    image: '/images/sausage.jpg',
  },
  {
    id: 'deluxe',
    name: 'The Deluxe',
    description: 'Pepperoni, sausage, mushrooms, onions, and green peppers.',
    price: 19.99,
    category: 'specialty',
    image: '/images/deluxe.jpg',
    featured: true,
  },
  {
    id: 'meat-lovers',
    name: 'Meat Lovers',
    description: 'Pepperoni, sausage, bacon, and ham.',
    price: 20.99,
    category: 'specialty',
    image: '/images/pepperoni.jpg',
  },
  {
    id: 'sausage-mushroom',
    name: 'Sausage & Mushroom',
    description: 'Italian sausage and fresh mushrooms.',
    price: 17.99,
    category: 'specialty',
    image: '/images/sausage-mushroom.jpg',
  },
  {
    id: 'bacon-giardiniera',
    name: 'Bacon & Giardiniera',
    description: 'Crispy bacon and spicy Chicago-style giardiniera.',
    price: 18.99,
    category: 'specialty',
    image: '/images/bacon-giardiniera.jpg',
    featured: true,
  },
  {
    id: 'veggie',
    name: 'Veggie Supreme',
    description:
      'Mushrooms, green peppers, onions, black olives, and tomatoes.',
    price: 18.99,
    category: 'vegetarian',
    image: '/images/cheese.jpg',
  },
  {
    id: 'spinach-mushroom',
    name: 'Spinach & Mushroom',
    description: 'Fresh spinach, mushrooms, and garlic.',
    price: 17.99,
    category: 'vegetarian',
    image: '/images/cheese.jpg',
  },
]

// Appetizers
export const appetizers = [
  {
    name: 'Garlic Bread',
    description: 'Toasted Italian bread with garlic butter and herbs.',
    price: 5.99,
    image: '/images/garlic-bread.jpg',
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Golden-fried mozzarella sticks with marinara sauce.',
    price: 8.99,
    image: '/images/cheese-sticks.jpg',
  },
  {
    name: 'Bruschetta',
    description:
      'Toasted bread topped with tomatoes, basil, garlic, and olive oil.',
    price: 7.99,
    image: '/images/bruschetta.jpg',
  },
  {
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings tossed in spicy buffalo sauce.',
    price: 10.99,
    image: '/images/buffalo-wings.jpg',
  },
]

// Desserts
export const desserts = [
  {
    name: 'Tiramisu',
    description:
      'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
    price: 6.99,
  },
  {
    name: 'Cannoli',
    description:
      'Crispy pastry shells filled with sweet ricotta cream and chocolate chips.',
    price: 5.99,
  },
  {
    name: 'Chocolate Lava Cake',
    description:
      'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.',
    price: 7.99,
  },
]

// Drinks
export const drinks = [
  {
    name: 'Soft Drinks',
    description: 'Coke, Diet Coke, Sprite, or Root Beer.',
    price: 2.99,
  },
  {
    name: 'Italian Soda',
    description: 'Sparkling water with your choice of flavor syrup.',
    price: 3.99,
  },
  {
    name: 'Craft Beer',
    description: 'Selection of local craft beers.',
    price: 6.99,
  },
  {
    name: 'House Wine',
    description: 'Red or white house wine by the glass.',
    price: 7.99,
  },
]

export const availableToppings = [
  { name: 'Pepperoni', selected: false, price: 1.5 },
  { name: 'Mushrooms', selected: false, price: 1.0 },
  { name: 'Onions', selected: false, price: 1.0 },
  { name: 'Sausage', selected: false, price: 1.5 },
  { name: 'Green Peppers', selected: false, price: 1.0 },
  { name: 'Black Olives', selected: false, price: 1.0 },
  { name: 'Jalapeños', selected: false, price: 1.0 },
  { name: 'Spinach', selected: false, price: 1.0 },
  { name: 'Feta Cheese', selected: false, price: 1.5 },
  { name: 'Bacon', selected: false, price: 1.5 },
  { name: 'Ham', selected: false, price: 1.5 },
  { name: 'Chicken', selected: false, price: 2.0 },
]
