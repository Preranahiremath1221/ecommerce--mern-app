import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Add = ({token, setToken}) => {
  const navigate = useNavigate();
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const onSubmitHnadler = async (e) =>{
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{
        headers:{token}
      })
      
      if (response.data.success){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      }else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      
      // Handle JWT expired error
      if (error.response?.data?.message?.includes('jwt expired') || 
          error.response?.data?.message?.includes('Token expired') ||
          error.response?.data?.message?.includes('Not Authorized')) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        setToken('');
        navigate('/');
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }

  return (
    <form onSubmit={onSubmitHnadler} className='flex flex-col w-full items-start gap-3'>
      
      {/* Upload Images */}
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          
          <label htmlFor="image1">
            <img className='w-20' src={image1 ? URL.createObjectURL(image1) : assets.upload_area} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>

          <label htmlFor="image2">
            <img className='w-20' src={image2 ? URL.createObjectURL(image2) : assets.upload_area} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>

          <label htmlFor="image3">
            <img className='w-20' src={image3 ? URL.createObjectURL(image3) : assets.upload_area} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>

          <label htmlFor="image4">
            <img className='w-20' src={image4 ? URL.createObjectURL(image4) : assets.upload_area} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>

        </div>
      </div>

      {/* Product Name */}
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input 
          onChange={(e) => setName(e.target.value)} 
          value={name} 
          className='w-full max-w-[500px] px-3 py-2 border' 
          type="text" 
          placeholder='Type here' 
          required 
        />
      </div>

      {/* Product Description */}
      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea 
          onChange={(e) => setDescription(e.target.value)} 
          value={description} 
          className='w-full max-w-[500px] px-3 py-2 border' 
          placeholder='Write content here' 
          required 
        />
      </div>

      {/* Category, Subcategory & Price in One Row */}
      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2'>Product category</p>
          <select 
            className='w-full sm:w-[150px] px-3 py-2 border'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select 
            className='w-full sm:w-[150px] px-3 py-2 border'
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input 
            className='w-full sm:w-[120px] px-3 py-2 border' 
            type="number" 
            placeholder='25' 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-2'>
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <p 
              key={size} 
              className={`px-3 py-1 cursor-pointer ${sizes.includes(size) ? 'bg-black text-white' : 'bg-slate-200'}`}
              onClick={() => 
                setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
              }
            >
              {size}
            </p>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className='flex gap-2 mt-2'>
        <input 
          type="checkbox" 
          id='bestseller' 
          checked={bestseller}
          onChange={(e) => setBestseller(e.target.checked)}
        />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      {/* Submit Button */}
      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add
