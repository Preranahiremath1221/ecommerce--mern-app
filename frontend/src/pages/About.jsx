import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='text-center py-12'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>
      
      <div className='flex flex-col lg:flex-row gap-12 lg:gap-16 items-start'>
        <div className='w-full lg:w-1/2'>
          <img 
            className='w-full h-auto max-w-lg mx-auto rounded-lg shadow-xl' 
            src={assets.about_img} 
            alt="About Us" 
          />
        </div>
        
        <div className='w-full lg:w-1/2 space-y-6 text-gray-600'>
          <p className='text-lg leading-relaxed'>
            Discover our latest collection of trendy, high-quality clothing designed to keep you stylish and comfortable for every occasion.
          </p>
          <p className='text-lg leading-relaxed'>
            From casual wear to elegant outfits, we bring you the perfect blend of fashion and affordability — shop your favorites today!
          </p>
          
          <div className='space-y-4'>
            <h3 className='text-xl font-bold text-gray-800'>Our Mission</h3>
            <p className='leading-relaxed'>
              Upgrade your wardrobe with our handpicked apparel, crafted from premium fabrics to ensure a perfect fit and timeless style.
            </p>
          </div>
          
          <div className='text-xl py-4'>
            <Title text1={'WHY'} text2={'CHOOSE US'} />
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow'>
              <b className='text-gray-800'>Quality Assurance:</b>
              <p className='text-gray-600 text-sm'>Explore fashion that speaks your style — fresh arrivals, bold designs, and everyday essentials all in one place.</p>
            </div>
            <div className='border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow'>
              <b className='text-gray-800'>Convenience:</b>
              <p className='text-gray-600 text-sm'>Step into the season with our exclusive clothing range, combining comfort, quality, and trendsetting designs.</p>
            </div>
            <div className='border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow'>
              <b className='text-gray-800'>Exceptional Customer Service:</b>
              <p className='text-gray-600 text-sm'>Find your perfect look with our versatile clothing collection, made to match your unique personality and lifestyle.</p>
            </div>
          </div>
          
          <div className='mt-8'>
            <NewsletterBox/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
