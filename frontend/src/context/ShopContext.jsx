import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import authFixManager from "../utils/authFix";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setTokens] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // 🔹 Sync token state with authFixManager
    useEffect(() => {
        const syncToken = () => {
            const currentToken = authFixManager.getToken();
            if (currentToken !== token) {
                setTokens(currentToken || '');
            }
        };
        syncToken();
        const interval = setInterval(syncToken, 1000);
        return () => clearInterval(interval);
    }, [token]);

    // 🔹 Add to cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        const isAuthenticated = await authFixManager.isAuthenticated();
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        try {
            const cleanToken = authFixManager.getToken();
            await axios.post(`${backendUrl}/api/cart/add`, {
                itemId,
                size
            }, {
                headers: {
                    'Authorization': `Bearer ${cleanToken}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Item added to cart!');
        } catch (error) {
            console.error('Add to cart error:', error);
            if (error.response?.status === 401) {
                toast.error('Authentication failed. Please login again.');
                authFixManager.clearAuth();
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    // 🔹 Count items in cart
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount;
    };

    // 🔹 Update quantity
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        try {
            const cleanToken = authFixManager.getToken();
            await axios.post(`${backendUrl}/api/cart/update`, {
                itemId, size, quantity
            }, {
                headers: {
                    'Authorization': `Bearer ${cleanToken}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Update quantity error:', error);
            if (error.response?.status === 401) {
                toast.error('Authentication failed. Please login again.');
                authFixManager.clearAuth();
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    // 🔹 Get total cart amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalAmount;
    };

    // 🔹 Fetch products from backend
    const fetchProducts = async () => {
        console.log('Starting product fetch from:', backendUrl + '/api/product/list');
        try {
            setLoading(true); // ✅ start loading before API call
            const response = await axios.get(backendUrl + '/api/product/list', {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Product fetch response:', response.data);

            if (response.data.success) {
                const products = response.data.products;
                console.log('Products loaded:', products.length);
                setProducts(Array.isArray(products) ? products : []);
            } else {
                toast.error(response.data.message || 'Failed to load products');
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error(error.response?.data?.message || 'Error fetching products');
            setProducts([]);
        } finally {
            setLoading(false); // ✅ stop loading when finished
            console.log('Product fetch completed');
        }
    };

    // 🔹 Fetch cart for logged-in user
    const getUserCart = async () => {
        try {
            const isAuthenticated = await authFixManager.isAuthenticated();
            if (!isAuthenticated) return;

            const cleanToken = authFixManager.getToken();
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, {
                headers: {
                    'Authorization': `Bearer ${cleanToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error('Cart fetch error:', error);
            if (error.response?.status === 401) {
                toast.error('Authentication failed. Please login again.');
                authFixManager.clearAuth();
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    // 🔹 Run only once on mount
    useEffect(() => {
        fetchProducts();
    }, []); // ✅ removed [backendUrl] dependency

    // 🔹 Initialize authentication
    useEffect(() => {
        const initializeAuth = async () => {
            await authFixManager.initializeAuth();
            const isAuthenticated = await authFixManager.isAuthenticated();
            if (isAuthenticated) {
                const currentToken = authFixManager.getToken();
                setTokens(currentToken);
                await getUserCart();
            }
        };
        initializeAuth();
    }, []);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, loading, backendUrl,
        setToken: setTokens, token
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
