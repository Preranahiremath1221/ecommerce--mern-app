import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import RelatedProducts from '../components/RelatedProducts';
import StarRating from '../components/StarRating';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, backendUrl, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/single/${productId}`);
      if (response.data.success) {
        let product = response.data.product;

        // 🔑 Normalize sizes here (so productData.sizes always works)
        if (Array.isArray(product.size)) {
          product.sizes = product.size;
        } else if (Array.isArray(product.availableSizes)) {
          product.sizes = product.availableSizes;
        } else if (!Array.isArray(product.sizes)) {
          product.sizes = [];
        }
        const defaultSizes = ["XL", "XXL"];
       product.sizes = [...new Set([...product.sizes, ...defaultSizes])];

        setProductData(product);
        setImage(product.image[0]);
        console.log('Product data structure:', JSON.stringify(product, null, 2));
      } else {
        setProductData(null);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className='border-t-2 pt-10 flex justify-center items-center min-h-[400px]'>
        <p className='text-gray-500'>Loading product...</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className='border-t-2 pt-10 flex justify-center items-center min-h-[400px]'>
        <p className='text-gray-500'>Product not found. ID: {productId}</p>
      </div>
    );
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        
        {/* ------------ Product Images ------------ */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img 
                onClick={() => setImage(item)} 
                src={item} 
                key={index} 
                alt="" 
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' 
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} alt="" className='w-full h-auto' />
          </div>
        </div>

        {/* ------------ Product Info ------------ */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-2 mt-3'>
            <StarRating rating={productData.rating || 4.5} size='w-5 h-5' />
            <span className='text-sm text-gray-600'>({productData.rating || 4.5} / 5)</span>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* ------------ Sizes ------------ */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes && productData.sizes.length > 0 ? (
                productData.sizes.map((item, index) => (
                  <button 
                    onClick={() => setSize(item)} 
                    className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} 
                    key={index}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className='text-gray-500'>No sizes available</p>
              )}
            </div>
          </div>

          {/* ------------ Add to Cart ------------ */}
          <button 
            onClick={() => addToCart(productData._id, size)} 
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />

          {/* ------------ Delivery Info ------------ */}
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ------------ Description & Reviews ------------ */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
          <p>
            Discover the latest trends in fashion with our exclusive range of clothing. 
            Designed for comfort and style, our products are crafted with premium quality 
            materials that ensure durability and elegance.
          </p>
        </div>
      </div>

      {/* ------------ Related Products ------------ */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
