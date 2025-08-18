import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0, 5))
    }, [products])

    return (
        <div>
            <div className='my-10'>
                <div className='text-center text-3xl py-8'>
                    <h2>BEST SELLERS</h2>
                    <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                        Discover our most loved pieces that have captured hearts worldwide. These customer favorites represent the perfect blend of style, comfort, and quality that define our brand. Each item has been carefully selected based on rave reviews and repeat purchases.
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    bestSeller.map((item, index) => (
                        <div key={index} className="product-item">
                            <img 
                                src={Array.isArray(item.image) ? item.image[0] : item.image} 
                                alt={item.name} 
                                className='w-full h-auto aspect-[3/4] object-cover'
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                                }}
                            />
                            <h3 className='mt-2 text-sm font-medium'>{item.name}</h3>
                            <p className='text-sm font-bold'>${item.price}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller
