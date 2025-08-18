import mongoose from 'mongoose';
import dotenv from 'dotenv';
import orderModel from '../models/orderModel.js';

dotenv.config();

const checkOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');
    
    const orders = await orderModel.find({});
    console.log('Total orders in database:', orders.length);
    
    if (orders.length > 0) {
      console.log('Sample order:', JSON.stringify(orders[0], null, 2));
    }
    
    // Check if there are any users with orders
    const userIds = [...new Set(orders.map(order => order.userId))];
    console.log('Users with orders:', userIds);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking orders:', error);
    process.exit(1);
  }
};

checkOrders();
