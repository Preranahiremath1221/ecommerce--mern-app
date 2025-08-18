import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'


const List = ({token}) => {

  const [list,setList] = useState([])

  const fetchList = async () => {
  try {
    
    const response = await axios.get(backendUrl + '/api/product/list')
    if(response.data.success) {
      setList(response.data.products);
    
    }

    else{
      toast.error(response.data.message)
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message)
    
  }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}})
      if(response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
       console.log(error);
       toast.error(error.message)
    }
  }

  useEffect(()=> {
    fetchList()
  },[])
  return (
    <>
        <p className='mb-2'>All Products List</p>
        <div className='flex flex-col gap-2'>

          <div className='hidden md:grid grid-cols-[80px_2fr_1fr_1fr_80px] items-center py-2 px-4 border bg-gray-100 text-sm font-medium'>
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b className='text-center'>Action</b>
          </div>
           {
            list.map((item,index)=> (
              <div className='grid grid-cols-[80px_2fr_1fr] md:grid-cols-[80px_2fr_1fr_1fr_80px] items-center gap-4 py-3 px-4 border text-sm hover:bg-gray-50' key={index}>
                <img className='w-12 h-12 object-cover rounded' src={item.image[0]} alt={item.name} />
                <p className='font-medium'>{item.name}</p>
                <p className='text-gray-600'>{item.category}</p>
                <p className='font-semibold'>{currency} {item.price}</p>
                <div className='flex justify-center'>
                  <button 
                    onClick={()=>removeProduct(item._id)}
                    className='bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors'
                    title="Remove product"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
           }
        </div>
    </>
  )
}

export default List