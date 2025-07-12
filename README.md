# DropLink - Second-Hand Marketplace for Cambodia

**DropLink** is a comprehensive second-hand marketplace platform specifically designed for Cambodia, where people can list, search, and purchase vintage and second-hand items locally.

## 🌟 Features

### 🔐 User Authentication & Security
- **User Registration** with ID verification requirement
- **Secure Login** with JWT token authentication
- **Profile Management** with photo upload
- **ID Card Verification** for enhanced security
- **Password Reset** functionality

### 🛍️ Marketplace Features
- **Item Listing** with multiple image uploads
- **Advanced Search & Filtering** by category, location, price, condition
- **Categories & Subcategories** for better organization
- **Favorites System** for saving preferred items
- **Real-time Chat** between buyers and sellers
- **Location-based Filtering** by province, city, district
- **Pricing Options** in USD and KHR currencies

### 📱 User Experience
- **Responsive Design** for mobile and desktop
- **Modern UI/UX** with clean, intuitive interface
- **Real-time Notifications** via Socket.io
- **Image Gallery** for viewing item photos
- **User Ratings & Reviews** for trust building
- **Dashboard** for managing listings and sales

### 🛡️ Safety & Moderation
- **Content Reporting** system for inappropriate items
- **Admin Panel** for user and content management
- **User Verification** system
- **Terms of Service** and Privacy Policy compliance
- **Prohibited Items** guidelines

### 🎯 Target Categories
- **Electronics** (Smartphones, Laptops, Tablets, Cameras)
- **Furniture** (Chairs, Tables, Beds, Sofas)
- **Clothing** (Shirts, Pants, Shoes, Accessories)
- **Books & Stationery** (Textbooks, Novels, School supplies)
- **Household Items** (Kitchen appliances, Tools, Decor)
- **Vintage Items** (Antiques, Collectibles, Vintage clothing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/droplink-marketplace.git
   cd droplink-marketplace
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/droplink
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

6. **Seed the database** (Optional - for sample data)
   ```bash
   node server/scripts/seed.js
   ```

7. **Start the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run them separately
   # Terminal 1 - Server
   npm run server
   
   # Terminal 2 - Client
   npm run client
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/health

## 📱 Usage

### For Regular Users

1. **Registration**
   - Create account with email, phone, and location
   - Upload ID card photos (front and back)
   - Wait for admin verification

2. **Listing Items**
   - Click "Post Item" after verification
   - Upload photos and fill item details
   - Set price and delivery options
   - Publish listing

3. **Buying Items**
   - Browse categories or search items
   - Filter by location, price, condition
   - Contact seller via chat
   - Arrange pickup or delivery

4. **Communication**
   - Real-time messaging system
   - Make offers and negotiate prices
   - Share contact information securely

### For Admin Users

1. **User Management**
   - Verify user ID cards
   - Suspend/unsuspend accounts
   - View user statistics

2. **Content Moderation**
   - Review reported items
   - Remove inappropriate content
   - Manage categories

3. **Analytics**
   - View platform statistics
   - Monitor user activity
   - Track sales and engagement

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/change-password` - Change password

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/:id/favorite` - Toggle favorite
- `POST /api/items/:id/mark-sold` - Mark as sold

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get public profile
- `GET /api/users/my/items` - Get user's items
- `GET /api/users/my/favorites` - Get favorites
- `GET /api/users/my/dashboard` - Get dashboard data

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/conversation/:id` - Get conversation messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/verify` - Verify user
- `PUT /api/admin/users/:id/suspend` - Suspend user
- `GET /api/admin/reports` - Get reports
- `PUT /api/admin/reports/:id/resolve` - Resolve report

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Multer** - File uploads
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **React Query** - Data fetching
- **Socket.io Client** - Real-time features
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications

### DevOps & Tools
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection
- **Compression** - Response compression
- **Morgan** - HTTP request logging

## 📁 Project Structure

```
droplink-marketplace/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── contexts/       # React contexts
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── utils/          # Utility functions
├── server/                 # Express backend
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   └── uploads/           # File uploads
├── .env.example           # Environment variables template
├── package.json           # Project dependencies
└── README.md             # This file
```

## 🔐 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcryptjs
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **File Upload Security** with type and size restrictions
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers
- **ID Verification** for user authenticity

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Mobile Phones** (320px - 768px)
- **Tablets** (768px - 1024px)
- **Desktops** (1024px+)

## 🌍 Cambodian Localization

- **Khmer Language Support** (Phase 2)
- **Local Payment Methods** (ABA, Wing, Pi Pay)
- **Cambodia-specific Locations** (Provinces, Cities, Districts)
- **Local Currency Support** (USD, KHR)
- **Cultural Considerations** in UI/UX design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cambodia's Second-hand Market** - Inspiration for the platform
- **Gen Z Users** - Primary target audience
- **Local Communities** - For valuable feedback and requirements
- **Open Source Libraries** - For providing excellent tools

## 📞 Support

For support, email support@droplink.com or join our community forum.

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ User registration and authentication
- ✅ Item listing and management
- ✅ Search and filtering
- ✅ Real-time messaging
- ✅ Admin panel
- ✅ Mobile responsiveness

### Phase 2 (Upcoming)
- 🔄 Khmer language support
- 🔄 In-app payment integration
- 🔄 Advanced user ratings
- 🔄 Push notifications
- 🔄 Mobile app (React Native)
- 🔄 Social media integration

### Phase 3 (Future)
- 🔄 AI-powered recommendations
- 🔄 Delivery service integration
- 🔄 Seller verification badges
- 🔄 Auction functionality
- 🔄 Multi-vendor marketplace

---

**Built with ❤️ for Cambodia's second-hand community**
