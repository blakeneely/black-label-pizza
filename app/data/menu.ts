import { MenuItem } from '@/types'

// Pizza menu items
export const menuItems: MenuItem[] = [
  {
    id: 'cheese',
    name: 'Classic Cheese',
    description: 'Our signature sauce with mozzarella cheese.',
    price: 15,
    category: 'classic',
    image: '/images/cheese.jpg',
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    description: 'Classic cheese pizza topped with pepperoni.',
    price: 17,
    category: 'classic',
    image: '/images/pepperoni.jpg',
  },
  {
    id: 'sausage',
    name: 'Sausage',
    description: 'Classic cheese pizza topped with Italian sausage.',
    price: 17,
    category: 'classic',
    image: '/images/sausage.jpg',
  },
  {
    id: 'deluxe',
    name: 'The Deluxe',
    description: 'Pepperoni, sausage, mushrooms, onions, and green peppers.',
    price: 20,
    category: 'specialty',
    image: '/images/deluxe.jpg',
    featured: true,
  },
  {
    id: 'meat-lovers',
    name: 'Meat Lovers',
    description: 'Pepperoni, sausage, bacon, and ham.',
    price: 21,
    category: 'specialty',
    image: '/images/pepperoni.jpg',
  },
  {
    id: 'sausage-mushroom',
    name: 'Sausage & Mushroom',
    description: 'Italian sausage and fresh mushrooms.',
    price: 18,
    category: 'specialty',
    image: '/images/sausage-mushroom.jpg',
  },
  {
    id: 'bacon-giardiniera',
    name: 'Bacon & Giardiniera',
    description: 'Crispy bacon and spicy Chicago-style giardiniera.',
    price: 19,
    category: 'specialty',
    image: '/images/bacon-giardiniera.jpg',
    featured: true,
  },
  {
    id: 'veggie',
    name: 'Veggie Supreme',
    description:
      'Mushrooms, green peppers, onions, black olives, and tomatoes.',
    price: 19,
    category: 'vegetarian',
    image: '/images/cheese.jpg',
  },
  {
    id: 'spinach-mushroom',
    name: 'Spinach & Mushroom',
    description: 'Fresh spinach, mushrooms, and garlic.',
    price: 18,
    category: 'vegetarian',
    image: '/images/cheese.jpg',
  },
]

// Appetizers
export const appetizers = [
  {
    name: 'Garlic Bread',
    description: 'Toasted Italian bread with garlic butter and herbs.',
    price: 9,
    image: '/images/garlic-bread.jpg',
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Golden-fried mozzarella sticks with marinara sauce.',
    price: 9,
    image: '/images/cheese-sticks.jpg',
  },
  {
    name: 'Bruschetta',
    description:
      'Toasted bread topped with tomatoes, basil, garlic, and olive oil.',
    price: 8,
    image: '/images/bruschetta.jpg',
  },
  {
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings tossed in spicy buffalo sauce.',
    price: 11,
    image: '/images/buffalo-wings.jpg',
  },
]

// Desserts
export const desserts = [
  {
    name: 'Tiramisu',
    description:
      'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
    price: 7,
  },
  {
    name: 'Cannoli',
    description:
      'Crispy pastry shells filled with sweet ricotta cream and chocolate chips.',
    price: 6,
  },
  {
    name: 'Chocolate Lava Cake',
    description:
      'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.',
    price: 8,
  },
]

// Drinks
export const drinks = [
  {
    name: 'Soft Drinks',
    description: 'Coke, Diet Coke, Sprite, or Root Beer.',
    price: 3,
  },
  {
    name: 'Italian Soda',
    description: 'Sparkling water with your choice of flavor syrup.',
    price: 4,
  },
  {
    name: 'Craft Beer',
    description: 'Selection of local craft beers.',
    price: 7,
  },
  {
    name: 'House Wine',
    description: 'Red or white house wine by the glass.',
    price: 8,
  },
]
