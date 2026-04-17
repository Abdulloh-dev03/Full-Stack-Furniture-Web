# 🛋️ Full-Stack Furniture Web

A modern, full-stack e-commerce furniture store application built with **Next.js**, **Express.js**, **TypeScript**, and **Prisma ORM**. This application features a responsive frontend with advanced UI components and a robust backend API.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Build & Deployment](#build--deployment)

---

## 🎯 Project Overview

Full-Stack Furniture Web is a complete e-commerce solution designed for furniture retail. It provides a seamless shopping experience with product browsing, user authentication, cart management, and room visualization features.

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14.2.30** - React framework for production
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit & React-Redux** - State management
- **Ant Design** - UI component library
- **Framer Motion** - Animation library
- **GSAP** - Advanced animation toolkit
- **Swiper** - Touch slider component
- **React Icons** - Icon library
- **Lucide React** - Modern icon set
- **Axios** - HTTP client
- **React Dropzone** - File upload
- **Vercel Speed Insights** - Performance monitoring

### Backend
- **Express.js 5.1.0** - Web framework
- **TypeScript 5.8.3** - Type safety
- **Prisma 6.10.1** - ORM for database
- **PostgreSQL/MySQL** - Database (via Prisma)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Cookie Parser** - Cookie handling
- **Multer** - File uploads
- **Cloudinary** - Image storage service
- **Nodemon** - Development auto-reload

### Language Composition
- **TypeScript**: 47.6%
- **JavaScript**: 33.3%
- **CSS**: 19.1%

---

## ✨ Features

### Frontend Features
- 🎨 Modern and responsive UI with Tailwind CSS
- 📦 Product catalog with filtering and search
- 🛒 Shopping cart functionality with Redux state management
- 👤 User authentication and profile management
- 🎭 Room visualization feature
- 🔄 Smooth animations and transitions with Framer Motion & GSAP
- 📱 Mobile-friendly responsive design
- 🚀 Performance optimized with Vercel Speed Insights
- 🎯 Ant Design component library integration

### Backend Features
- 🔐 JWT-based authentication
- 🛡️ Password encryption with bcryptjs
- 📦 Product management API
- 🛒 Cart management system
- 👥 User management
- 📸 Image upload with Cloudinary integration
- 🔒 CORS security configuration
- 📚 Prisma ORM for database operations
- ✅ RESTful API endpoints

---

## 📁 Project Structure

```
Full-Stack-Furniture-Web/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js app directory
│   │   ├── components/         # Reusable React components
│   │   ├── redux/              # Redux store, slices, and actions
│   │   └── shared/             # Shared utilities and hooks
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.mjs
│   └── .env.local              # Frontend environment variables
│
├── backend/                     # Express.js backend application
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── routes/             # API routes (auth, products, room, cart)
│   │   ├── middleware/         # Custom middleware
│   │   ├── db/                 # Database utilities
│   │   ├── utils/              # Helper functions
│   │   └── server.ts           # Server entry point
│   └── prisma/
│       └── schema.prisma       # Database schema
│
├── package.json                # Root package.json with scripts
└── README.md                   # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL or MySQL database
- Cloudinary account (for image uploads)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdulloh-dev03/Full-Stack-Furniture-Web.git
   cd Full-Stack-Furniture-Web
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file in backend directory
   # Add your environment variables:
   # DATABASE_URL=your_database_url
   # PORT=5000
   # JWT_SECRET=your_jwt_secret
   # CLOUDINARY_NAME=your_cloudinary_name
   # CLOUDINARY_API_KEY=your_api_key
   # CLOUDINARY_API_SECRET=your_api_secret
   
   # Generate Prisma client
   npx prisma generate --schema=./prisma/schema.prisma
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   # Create .env.local file with:
   # NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout
- `GET /profile` - Get user profile

### Products (`/api/products`)
- `GET /` - Get all products
- `GET /:id` - Get product by ID
- `POST /` - Create product (admin)
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

### Cart (`/api/cart`)
- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /:itemId` - Update cart item
- `DELETE /:itemId` - Remove item from cart

### Room (`/api/room`)
- `GET /` - Get room data
- `POST /` - Create room design
- `PUT /:id` - Update room design

---

## 💻 Development

### Start Development Server

From the root directory:

```bash
# Start backend (with auto-reload via nodemon)
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`

### Build Project

```bash
npm run build
```

This will:
1. Generate Prisma client
2. Compile TypeScript to JavaScript

---

## 🌍 Build & Deployment

### Production Build

```bash
npm run build
npm start
```

### Frontend Deployment

The frontend is deployed on **Vercel**. Push to the main branch to trigger automatic deployment.

Deployed URL: `https://full-stack-furniture-web.vercel.app`

### Backend Deployment

Deploy the backend to your preferred hosting (Heroku, Railway, AWS, etc.):

```bash
npm run build
npm start
```

Ensure all environment variables are configured on your hosting platform.

---

## 🔒 Environment Variables

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/furniture_db
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 👨‍💻 Author

**Abdulloh-dev03**

---

## 📝 License

ISC

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For support or questions, please create an issue on the GitHub repository.

---

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Express.js community
- Prisma for excellent ORM
- Tailwind CSS for styling
- All contributors and developers
