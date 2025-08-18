import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
            event.preventDefault ();
    }
  return (
    <div className='text-center max-w-2xl mx-auto'>
        <p className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>Subscribe now & get 20% off</p>
        <p className='text-gray-600 mt-3 mb-6 leading-relaxed'>
            Join our exclusive community of fashion enthusiasts and be the first to know about new arrivals, special promotions, and insider styling tips. Don't miss out on this limited-time offer!
        </p>
        <form onSubmit={onSubmitHandler} className='w-full max-w-md mx-auto flex items-center gap-3 my-6 border border-gray-300 rounded-full pl-4 pr-1 py-1'>
            <input 
                className='w-full flex-1 outline-none bg-transparent px-2' 
                type="email" 
                placeholder='Enter your Email' 
                required
            />
            <button 
                type='submit' 
                className='bg-black text-white text-sm px-6 py-2 rounded-full hover:bg-gray-800 transition-colors'
            >
                SUBSCRIBE
            </button>
        </form>
    </div>
  )
}

export default NewsletterBox

