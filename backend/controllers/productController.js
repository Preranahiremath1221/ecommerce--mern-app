import productModel from '../models/productModel.js';
import { v2 as cloudinary } from "cloudinary";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Parse and validate the data
    const parsedPrice = parseFloat(price);
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    const parsedBestseller = bestseller === 'true' || bestseller === true;
    
    // Validate required fields
    if (!name || !description || isNaN(parsedPrice) || !category || !subCategory) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing required fields: name, description, price, category, subCategory are required" 
        });
    }
    

    // Handle image upload safely
    let imagesUrl = [];
    
    // Check for uploaded images from multer fields
    const imageFields = ['image1', 'image2', 'image3', 'image4'];
    const uploadedImages = [];
    
    imageFields.forEach(field => {
      if (req.files && req.files[field]) {
        const files = Array.isArray(req.files[field]) ? req.files[field] : [req.files[field]];
        uploadedImages.push(...files);
      }
    });

    if (uploadedImages.length > 0) {
      imagesUrl = await Promise.all(
        uploadedImages.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
          return result.secure_url;
        })
      );
    }

    const productData = {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        image: imagesUrl,
        category: category.trim(),
        subCategory: subCategory.trim(),
        sizes: Array.isArray(parsedSizes) ? parsedSizes : [parsedSizes],
        bestseller: parsedBestseller,
        date: Date.now(),
        ratings: req.body.ratings || []
    };

    console.log('Product data:', productData);

    const product = new productModel(productData);
    await product.save();

    // Return product with image URLs explicitly included
    res.json({ success: true, message: "Product added successfully", product: {
      ...product._doc,
      image: imagesUrl
    } });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

   
  



//function for list product
const listProducts = async (req,res) =>{
    try {
        const products = await productModel.find({});
        console.log('Products retrieved:', products);
        res.json({ success: true, products: products.map(product => ({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            subCategory: product.subCategory,
            sizes: product.sizes,
            bestseller: product.bestseller,
        })) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//function for remove product
const removeProduct = async (req,res) =>{
    try{
      await productModel.findByIdAndDelete(req.body.id)
      res.json({ success: true, message: "Product removed successfully" });
    }catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//function for single product info
const singleProduct = async (req,res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId)
    res.json({ success: true, product })
    
  } catch (error) {
    console.log(error);
        res.json({ success: false, message: error.message });
  }
}

export {listProducts,addProduct,removeProduct,singleProduct }
