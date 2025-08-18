import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {

    const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);
  return (
    <div className='w-full'>
        <div className='text-2xl font-semibold mb-4'>
            <h2>CART TOTALS</h2>
        </div>
        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency}{getCartAmount()}.00</p>

            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {delivery_fee}.00</p>

            </div>
            <hr />
            <div className='flex justify-between font-semibold'>
                <b>Total</b>
                <b> {currency}{getCartAmount() === 0 ? 0:getCartAmount() + delivery_fee}.00</b>

            </div>
        </div>
    </div>
  )
}

export default CartTotal
