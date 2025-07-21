import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='container mx-auto px-4 py-24 text-center'>
      <h1 className='text-5xl font-bold mb-6'>404</h1>
      <h2 className='text-3xl font-bold mb-8'>Pizza Not Found</h2>
      <p className='text-xl mb-8'>
        Sorry, the pizza you are looking for does not exist or has been removed
        from our menu.
      </p>
      <div className='flex justify-center gap-4'>
        <Link
          href='/menu'
          className='bg-yellow-500 text-black px-6 py-2 rounded-md font-medium hover:bg-yellow-400 transition-colors'
        >
          View Menu
        </Link>
        <Link
          href='/'
          className='bg-gray-800 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors'
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
