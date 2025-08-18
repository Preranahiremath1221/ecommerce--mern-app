import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import authManager from '../utils/authManager';
import redirectManager from '../utils/redirectManager';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getCartAmount, navigate } = useContext(ShopContext);

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, size, newQuantity);
    }
  };

  const handleRemoveItem = (productId, size) => {
    updateQuantity(productId, size, 0);
  };

  const handleCheckout = async () => {
    // Check authentication before proceeding
    const isAuthenticated = await authManager.isAuthenticated();
    if (!isAuthenticated) {
      redirectManager.storeRedirect('/place-order');
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    
    navigate('/place-order');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-20 px-4 sm:px-8 md:px-16 lg:px-24 py-8">
      {/* Cart Items */}
      <div className="flex-1">
        <Title text1={'SHOPPING'} text2={'CART'} />
        
        {Object.keys(cartItems).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <button 
              onClick={() => navigate('/collection')}
              className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {Object.entries(cartItems).map(([productId, sizes]) => {
              const product = products.find(p => p._id === productId);
              if (!product) return null;
              
              return Object.entries(sizes).map(([size, quantity]) => {
                if (quantity === 0) return null;
                
                return (
                  <div key={`${productId}-${size}`} className="flex items-center gap-4 border-b pb-4">
                    <img 
                      src={product.image[0]} 
                      alt={product.name} 
                      className="w-20 h-20 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{product.name}</h3>
                      <p className="text-gray-600">Size: {size}</p>
                      <p className="text-gray-600">{currency}{product.price}.00</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleQuantityChange(productId, size, quantity - 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(productId, size, quantity + 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="w-20 text-right font-medium">
                      {currency}{product.price * quantity}.00
                    </p>
                    
                    <button 
                      onClick={() => handleRemoveItem(productId, size)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                );
              });
            })}
          </div>
        )}
      </div>

      {/* Cart Total */}
      <div className="w-full sm:w-80 lg:w-96">
        <CartTotal />
        <button 
          onClick={handleCheckout}
          disabled={getCartAmount() === 0}
          className="w-full bg-black text-white py-3 mt-4 rounded hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;
