import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [OrderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
  try {
    if (!token) {
      setOrderData([]);
      return;
    }

    console.log('Loading orders with token:', token);
    const response = await axios.post(
      backendUrl + '/api/order/userorders',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Orders response:', response.data);

    if (response.data.success) {
      // Ensure orders is an array
      const ordersArray = Array.isArray(response.data.orders) ? response.data.orders : [];
      console.log('Orders array:', ordersArray);
      
      if (ordersArray.length === 0) {
        console.log('No orders found for user');
        setOrderData([]);
        return;
      }

      let allOrdersItem = [];

      ordersArray.forEach((order) => {
        // Ensure items is an array
        const itemsArray = Array.isArray(order.items) ? order.items : [];
        itemsArray.forEach((item) => {
          allOrdersItem.push({
            ...item,
            status: order.status || 'Order Placed',
            payment: order.payment || false,
            paymentMethod: order.paymentMethod || 'COD',
            date: order.date,
            orderId: order._id
          });
        });
      });

      console.log('Processed orders:', allOrdersItem);
      setOrderData(allOrdersItem.reverse());
    } else {
      console.log('API returned success: false');
      setOrderData([]);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    toast.error('Failed to load orders');
    setOrderData([]);
  }
};


  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>
      
      {OrderData.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-gray-500'>No orders found</p>
        </div>
      ) : (
        <div>
          {OrderData.map((item, index) => (
            <div key={index} className='py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt={item.name}/>
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                  <p className='mt-1'>Status: <span className='text-gray-400'>{item.status}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className={`min-w-2 h-2 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'}`}></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Refresh</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
