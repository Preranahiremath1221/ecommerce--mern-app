import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import SkeletonLoader from '../components/SkeletonLoader';
import { Link } from 'react-router-dom';




const Collection = () => {
  const { products, search, showSearch, loading } = useContext(ShopContext);
  
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  // Initialize with all products
  useEffect(() => {
    console.log('Collection useEffect triggered - products:', products, 'loading:', loading);
    
    // Force update filterProducts when products change
    if (products && Array.isArray(products)) {
      setFilterProducts([...products]); // Create new array reference to force re-render
      console.log('Collection products updated:', products.length);
    } else if (products && Array.isArray(products) && products.length === 0) {
      setFilterProducts([]);
      console.log('No products available');
    } else {
      // Initial load - ensure we get products even if context hasn't updated yet
      setTimeout(() => {
        if (products && Array.isArray(products) && products.length > 0) {
          setFilterProducts([...products]);
        }
      }, 100);
    }
  }, [products, loading])

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Apply search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter only if categories are selected
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    // Apply subcategory filter only if subcategories are selected
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  }

  const sortProduct = () => {
    let fpCopy = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        fpCopy.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        fpCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilterProducts(fpCopy);
  }

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]) // Change products to products.length

  // Sort products when sort type changes
  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Left Sidebar - Filters */} 
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
        </p>
        <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />

        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2 items-center'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory} />Men
            </label>
            <label className='flex gap-2 items-center'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} />Women
            </label>
            <label className='flex gap-2 items-center'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory} />Kids
            </label>
          </div>
        </div>

        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2 items-center'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory} />Topwear
            </label>
            <label className='flex gap-2 items-center'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} />Bottomwear
            </label>
            <label className='flex gap-2 items-center'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory} />Winterwear
            </label>
          </div>
        </div>
      </div>

      {/* Main Collection Display */} 
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {loading ? (
            <div className='col-span-full flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
              <p className='ml-4 text-gray-600'>Loading products...</p>
            </div>
          ) : filterProducts.length === 0 ? (
            <div className='col-span-full flex flex-col items-center justify-center h-64'>
              <p className='text-gray-600 text-lg mb-2'>No products found</p>
              <p className='text-gray-400 text-sm'>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Collection;
