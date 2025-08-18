import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { toast } from 'react-toastify';
import authManager from '../utils/authManager';
import apiClient from '../utils/apiClient';
import redirectManager from '../utils/redirectManager';
import { handleTokenError } from '../utils/tokenUtils';

const PlaceOrder = () => {
  const [method,setMethod] = useState('cod');
  const {navigate,backendUrl,cartItems,setCartItems,getCartAmount,delivery_fee,products} = useContext(ShopContext);
  const [formData,setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'', 
    zipcode:'',
    country:'',
    phone:''
  })
  
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value
    setFormData(data => ({...data,[name]:value}))
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order payment',
      description: 'Order payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response)
        try {
          const cleanToken = authManager.getToken();
          if (!cleanToken) {
            redirectManager.storeRedirect('/place-order');
            toast.error('Please login to complete payment');
            navigate('/login');
            return;
          }

          const userId = JSON.parse(atob(cleanToken.split('.')[1])).id;
          
          await apiClient.post('/api/order/verifyRazorpay', {
            ...response,
            userId
          });
          
          navigate('/orders')
          setCartItems({})
        } catch (error) {
          console.log(error)
          toast.error(error.response?.data?.message || 'Payment verification failed');
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (event) =>{
    event.preventDefault()
    
    try {
      // Enhanced authentication check with detailed logging
      console.log('Checking authentication before placing order...');
      
      const token = authManager.getToken();
      if (!token) {
        console.log('No token found, redirecting to login');
        redirectManager.storeRedirect('/place-order');
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

      // Validate token format
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        
        if (!payload.id && !payload.userId) {
          throw new Error('Invalid token payload');
        }
      } catch (tokenError) {
        console.error('Token parsing error:', tokenError);
        authManager.logout();
        toast.error('Invalid session. Please login again.');
        navigate('/login');
        return;
      }

      let orderItems = []
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item] > 0){
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo){
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
                orderItems.push(itemInfo);
            }
          }
        }
      }
      
      let orderData ={
        address: formData,
        items:orderItems,
        amount:getCartAmount() + delivery_fee
      };

      const userId = JSON.parse(atob(token.split('.')[1])).id || JSON.parse(atob(token.split('.')[1])).userId;
      orderData.userId = userId;

      console.log('Order data:', orderData);

      switch(method){
        case 'cod':
          const response = await apiClient.post('/api/order/place',orderData);
          
          if (response.data.success){
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message || 'Failed to place order');
          }
          break;

        case 'stripe':
          const responseStripe = await apiClient.post('/api/order/stripe',orderData);
          if (responseStripe.data.success){
            const {session_url} = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message || 'Failed to create Stripe session')
          }
          break;

        case 'razorpay':
          const responseRazorpay = await apiClient.post('/api/order/razorpay', orderData);
          if (responseRazorpay.data.success){
            initPay(responseRazorpay.data.order)
          } else {
            toast.error(responseRazorpay.data.message || 'Failed to create Razorpay order')
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Order placement error:', error);
      
      // Enhanced error handling
      if (error.response?.status === 401) {
        console.error('Authentication error details:', error.response.data);
        
        // Check for specific authentication errors
        const errorMessage = error.response.data?.message || 'Authentication failed';
        const errorCode = error.response.data?.error || 'UNKNOWN_AUTH_ERROR';
        
        if (errorCode === 'TOKEN_EXPIRED' || errorMessage.includes('expired')) {
          toast.error('Session expired. Please login again.');
          authManager.logout();
          navigate('/login');
        } else if (errorCode === 'INVALID_TOKEN' || errorMessage.includes('Invalid token')) {
          toast.error('Invalid session. Please login again.');
          authManager.logout();
          navigate('/login');
        } else {
          toast.error(`Authentication error: ${errorMessage}`);
          authManager.logout();
          navigate('/login');
        }
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Please login with proper credentials.');
        authManager.logout();
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-top'>

      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name'/>
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name'/>
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email adress'/>
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street'/>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City'/>
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State'/>
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode'/>
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country'/>
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone'/>
      </div>
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>

          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe'? 'bg-green-400':''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt=""/>
            </div>

            <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${method === 'razorpay'? 'bg-green-400':''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt=""/>
            </div>

            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${method === 'cod'? 'bg-green-400':''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
        </div>
        <div className='w-full text-end mt-8'>
          <button type='submit'className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
