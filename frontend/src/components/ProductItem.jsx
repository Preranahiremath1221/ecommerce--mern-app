import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext)
  
  // Handle image array - use first image for display
  const productImage = Array.isArray(image) && image.length > 0 ? image[0] : image;

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        <img 
          className='hover:scale-110 transition ease-in-out w-full h-auto aspect-[3/4] object-cover'
          src={productImage} 
          alt={name || 'Product image'} 
        />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>
        {currency}
        {price}
      </p>
    </Link>
  )
}

export default ProductItem
