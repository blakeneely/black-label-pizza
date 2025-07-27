import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section relative h-[70vh] flex items-center bg-theme bg-[url('/images/hero-bg.png')] bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-black before:opacity-50 before:z-0">
        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-xl'>
            <h1 className='text-5xl font-bold mb-4'>
              Nashville&apos;s Finest Pizza Tradition
            </h1>
            <p className='text-xl mb-4'>
              Authentic tavern pizzas made with premium ingredients and
              traditional recipes.
            </p>
            <p className='text-xl mb-8'>Call (612) 509-2970 to order now!</p>
            <div className='flex gap-4'>
              <Link
                href='/menu'
                className='px-8 py-3 bg-primary hover:bg-primary-hover transition-colors font-medium'
              >
                View Menu
              </Link>
              <Link
                href='/order-online'
                className='px-8 py-3 border border-accent bg-accent text-white hover:brightness-90 transition-all font-medium'
              >
                Order Online
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className='py-20 bg-theme'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Our Signature Pizzas
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Featured Pizza 1 */}
            <div className='border border-primary hover:border-accent transition-all h-full flex flex-col'>
              <div className='relative h-64 w-full'>
                <Image
                  src='/images/deluxe.jpg'
                  alt='The Deluxe Pizza'
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className='absolute top-4 right-4 bg-accent px-3 py-1'>
                  <span className='text-sm font-medium uppercase tracking-wider'>
                    Chef&apos;s Special
                  </span>
                </div>
              </div>
              <div className='p-6 flex flex-col flex-grow'>
                <h3 className='text-xl font-bold mb-2'>The Deluxe</h3>
                <p className='text-muted mb-4 flex-grow'>
                  Pepperoni, sausage, mushrooms, onions, and green peppers.
                </p>
                <Link
                  href='/order-online/deluxe'
                  className='inline-block w-full text-center bg-primary hover:bg-primary-hover py-3 transition-colors mt-auto'
                >
                  Order Now
                </Link>
              </div>
            </div>

            {/* Featured Pizza 2 */}
            <div className='border border-primary hover:border-accent transition-all h-full flex flex-col'>
              <div className='relative h-64 w-full'>
                <Image
                  src='/images/pepperoni.jpg'
                  alt='Classic Pepperoni Pizza'
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className='p-6 flex flex-col flex-grow'>
                <h3 className='text-xl font-bold mb-2'>Classic Pepperoni</h3>
                <p className='text-muted mb-4 flex-grow'>
                  Classic cheese pizza topped with pepperoni.
                </p>
                <Link
                  href='/order-online/pepperoni'
                  className='inline-block w-full text-center bg-primary hover:bg-primary-hover py-3 transition-colors mt-auto'
                >
                  Order Now
                </Link>
              </div>
            </div>

            {/* Featured Pizza 3 */}
            <div className='border border-primary hover:border-accent transition-all h-full flex flex-col'>
              <div className='relative h-64 w-full'>
                <Image
                  src='/images/bacon-giardiniera.jpg'
                  alt='Bacon & Giardiniera Pizza'
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className='absolute top-4 right-4 bg-accent px-3 py-1'>
                  <span className='text-sm font-medium uppercase tracking-wider'>
                    Chef&apos;s Special
                  </span>
                </div>
              </div>
              <div className='p-6 flex flex-col flex-grow'>
                <h3 className='text-xl font-bold mb-2'>Bacon & Giardiniera</h3>
                <p className='text-muted mb-4 flex-grow'>
                  Crispy bacon and spicy Chicago-style giardiniera.
                </p>
                <Link
                  href='/order-online/bacon-giardiniera'
                  className='inline-block w-full text-center bg-primary hover:bg-primary-hover py-3 transition-colors mt-auto'
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='primary-section py-20'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row items-center gap-12'>
            <div className='w-full md:w-1/2'>
              <div className='relative w-full h-64 md:h-96 border border-white'>
                <Image
                  src='/images/pizzeria.jpeg'
                  alt='Our Pizzeria'
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
            <div className='w-full md:w-1/2 mt-8 md:mt-0'>
              <h2 className='text-3xl font-bold mb-6'>Our Story</h2>
              <div className='h-1 w-16 bg-accent mb-6'></div>
              <p className='mb-6'>
                Black Label Pizza was founded in 2018 with a simple mission: to
                bring authentic Chicago-style tavern pizza to Nashville pizza
                lovers. Our recipes have been perfected over years of dedication
                to the craft.
              </p>
              <p className='mb-8'>
                We use only the freshest ingredients, from our house-made dough
                to our signature sauce and premium toppings. Every pizza is
                crafted with care and attention to detail.
              </p>
              <Link
                href='/menu'
                className='inline-block px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors font-medium'
              >
                Explore Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
