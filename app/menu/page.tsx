import { menuItems, appetizers, desserts, drinks } from '../data/menu'

export default function MenuPage() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold text-center mb-12'>Our Menu</h1>

      <div className='max-w-3xl mx-auto'>
        {/* Appetizers Section */}
        <div className='mb-12'>
          <div className='flex items-center mb-6'>
            <div className='h-px bg-accent flex-grow mr-4'></div>
            <h2 className='text-2xl font-bold'>APPETIZERS</h2>
            <div className='h-px bg-accent flex-grow ml-4'></div>
          </div>

          <div className='space-y-6'>
            {appetizers.map((item, index) => (
              <div key={index} className='border border-primary p-4'>
                <div className='flex justify-between items-baseline'>
                  <h3 className='text-xl font-bold'>{item.name}</h3>
                  <span className='text-lg'>${item.price}</span>
                </div>
                <p className='text-muted mt-1'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pizzas Section */}
        <div className='mb-12'>
          <div className='flex items-center mb-6'>
            <div className='h-px bg-accent flex-grow mr-4'></div>
            <h2 className='text-2xl font-bold'>PIZZAS</h2>
            <div className='h-px bg-accent flex-grow ml-4'></div>
          </div>

          {/* Classic Pizzas */}
          <div className='mb-8'>
            <h3 className='text-xl font-medium mb-4 border-l-4 border-primary pl-3'>
              Classic
            </h3>
            <div className='space-y-6'>
              {menuItems
                .filter((pizza) => pizza.category === 'classic')
                .map((pizza) => (
                  <div key={pizza.id} className='border border-primary p-4'>
                    <div className='flex justify-between items-baseline'>
                      <h4 className='text-xl font-bold'>{pizza.name}</h4>
                      <span className='text-lg'>${pizza.price}</span>
                    </div>
                    <p className='text-muted mt-1'>{pizza.description}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Specialty Pizzas */}
          <div className='mb-8'>
            <h3 className='text-xl font-medium mb-4 border-l-4 border-primary pl-3'>
              Specialty
            </h3>
            <div className='space-y-6'>
              {menuItems
                .filter((pizza) => pizza.category === 'specialty')
                .map((pizza) => (
                  <div key={pizza.id} className='border border-primary p-4'>
                    <div className='flex justify-between items-baseline'>
                      <h4 className='text-xl font-bold'>{pizza.name}</h4>
                      <span className='text-lg'>${pizza.price}</span>
                    </div>
                    <p className='text-muted mt-1'>{pizza.description}</p>
                    {pizza.featured && (
                      <span className='inline-block mt-2 text-xs px-2 py-1 bg-accent text-white uppercase tracking-wider'>
                        Chef&apos;s Special
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Vegetarian Pizzas */}
          <div className='mb-8'>
            <h3 className='text-xl font-medium mb-4 border-l-4 border-primary pl-3'>
              Vegetarian
            </h3>
            <div className='space-y-6'>
              {menuItems
                .filter((pizza) => pizza.category === 'vegetarian')
                .map((pizza) => (
                  <div key={pizza.id} className='border border-primary p-4'>
                    <div className='flex justify-between items-baseline'>
                      <h4 className='text-xl font-bold'>{pizza.name}</h4>
                      <span className='text-lg'>${pizza.price}</span>
                    </div>
                    <p className='text-muted mt-1'>{pizza.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Desserts Section */}
        <div className='mb-12'>
          <div className='flex items-center mb-6'>
            <div className='h-px bg-accent flex-grow mr-4'></div>
            <h2 className='text-2xl font-bold'>DESSERTS</h2>
            <div className='h-px bg-accent flex-grow ml-4'></div>
          </div>

          <div className='space-y-6'>
            {desserts.map((item, index) => (
              <div key={index} className='border border-primary p-4'>
                <div className='flex justify-between items-baseline'>
                  <h3 className='text-xl font-bold'>{item.name}</h3>
                  <span className='text-lg'>${item.price}</span>
                </div>
                <p className='text-muted mt-1'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Drinks Section */}
        <div>
          <div className='flex items-center mb-6'>
            <div className='h-px bg-accent flex-grow mr-4'></div>
            <h2 className='text-2xl font-bold'>DRINKS</h2>
            <div className='h-px bg-accent flex-grow ml-4'></div>
          </div>

          <div className='space-y-6'>
            {drinks.map((item, index) => (
              <div key={index} className='border border-primary p-4'>
                <div className='flex justify-between items-baseline'>
                  <h3 className='text-xl font-bold'>{item.name}</h3>
                  <span className='text-lg'>${item.price}</span>
                </div>
                <p className='text-muted mt-1'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
