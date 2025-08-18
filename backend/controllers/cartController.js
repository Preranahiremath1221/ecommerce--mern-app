import userModel from '../models/userModel.js'

const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const userId = req.user.userId || req.user.id;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        // Ensure itemId exists
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        // Update quantity
        if (cartData[itemId][size]) {
            cartData[itemId][size] += 1;
        } else {
            cartData[itemId][size] = 1;
        }

        // Save updated cart
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};
            cartData[itemId][size] = quantity;
        

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get user's cart
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id; 

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        
        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
