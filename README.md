# E-Commerce Application (MERN Stack)

A full-featured e-commerce platform built with the MERN (MongoDB, Express, React, Node.js) stack. This application includes a customer-facing frontend, an admin dashboard, and a robust backend API.

## 🚀 Features

### Customer Features
- User registration and authentication
- Product browsing and search
- Shopping cart functionality
- Secure checkout process
- Order tracking
- User profile management

### Admin Features
- Product management (CRUD operations)
- Order management and status updates
- User management
- Analytics dashboard
- Image upload functionality

### Technical Features
- JWT-based authentication
- Cloudinary integration for image storage
- Stripe and Razorpay payment integration
- Responsive design
- Real-time updates

## 🛠️ Tech Stack

### Frontend (Customer)
- **React** 19.1.0
- **Vite** 7.0.4
- **React Router** 7.7.1
- **Axios** 1.11.0
- **Tailwind CSS** 3.4.17
- **React Toastify** 11.0.5

### Admin Panel
- **React** 19.1.1
- **Vite** 7.1.0
- **React Router** 7.8.0
- **Tailwind CSS** 4.1.11

### Backend
- **Node.js** with Express 5.1.0
- **MongoDB** with Mongoose 8.17.1
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image storage
- **Stripe** and **Razorpay** for payments
- **Multer** for file uploads

## 📁 Project Structure

```
E-Commerce-app-MERN/
├── frontend/          # Customer-facing React app
├── admin/            # Admin dashboard React app
├── backend/          # Express.js API server
├── .gitignore
├── README.md
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Preranahiremath1221/E-Commerce-app-MERN.git
   cd E-Commerce-app-MERN
   ```

2. **Install dependencies for all services**

   Backend:
   ```bash
   cd backend
   npm install
   ```

   Frontend:
   ```bash
   cd frontend
   npm install
   ```

   Admin Panel:
   ```bash
   cd admin
   npm install
   ```

3. **Environment Variables**

   Create `.env` files in each service:

   **Backend (.env)**
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

   **Frontend (.env)**
   ```
   VITE_APP_API_URL=http://localhost:4000
   ```

   **Admin (.env)**
   ```
   VITE_APP_API_URL=http://localhost:4000
   ```

4. **Start the development servers**

   Backend:
   ```bash
   cd backend
   npm run server
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

   Admin:
   ```bash
   cd admin
   npm run dev
   ```

## 🎯 Usage

1. **Customer App**: Visit `http://localhost:5173`
2. **Admin Panel**: Visit `http://localhost:5174`
3. **API**: Runs on `http://localhost:4000`

## 🔧 API Endpoints

### Authentication
- `POST /api/user/register`
- `POST /api/user/login`

### Products
- `GET /api/product/list`
- `POST /api/product/add`
- `PUT /api/product/update`
- `DELETE /api/product/remove`

### Orders
- `POST /api/order/place`
- `GET /api/order/userorders`
- `GET /api/order/list`
- `PUT /api/order/status`

### Cart
- `POST /api/cart/add`
- `POST /api/cart/remove`
- `GET /api/cart/get`
- `POST /api/cart/update`

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Secure file upload handling

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the backend folder

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update the connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Prerana Hiremath**
- GitHub: [@Preranahiremath1212](https://github.com/Preranahiremath1221)

## 🙏 Acknowledgments

- React community
- Node.js ecosystem
- Tailwind CSS team
- All open-source contributors
