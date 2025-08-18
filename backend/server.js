import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//App config
const app = express()
const port = process.env.PORT || 4000
 connectDB()
 connectCloudinary()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve test-upload.html for testing image uploads
app.get('/test-upload.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-upload.html'));
});

// Serve the improved test page
app.get('/test-upload-fixed.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-upload-fixed.html'));
});

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/', (req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+port))
