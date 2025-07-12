# DropLink - Cambodia's Marketplace

DropLink is a modern, user-friendly marketplace designed specifically for Cambodians to buy and sell second-hand and vintage items locally.

## � Problem Statement

People in Cambodia often throw away or hoard old items, and buyers don't have a centralized, trustworthy place to find affordable second-hand products.

## 💡 Solution

DropLink provides a centralized, trustworthy platform where Cambodians can:
- List items for sale with detailed descriptions and photos
- Search and filter listings by category, location, and price
- Communicate directly with sellers through built-in messaging
- Browse by categories including furniture, clothing, shoes, vintage items, and household gadgets

## 👥 Target Audience

- **Primary**: Young adults, students, and families looking for affordable goods
- **Secondary**: Sellers with unused items (furniture, clothing, shoes, vintage items, household gadgets)
- **Focus**: Gen Z users who value sustainability and affordability

## ✨ Features

### 🔐 User Authentication
- Sign up and login functionality
- Profile management
- Secure authentication with JWT tokens

### 📝 Item Management
- Post items for sale with multiple photos
- Detailed item descriptions with specifications
- Category-based organization
- Condition ratings (New, Like New, Excellent, Good, Fair, Poor)
- Price negotiation options

### 🔍 Search & Discovery
- Advanced search functionality
- Filter by category, location, price range, and condition
- Sort by newest, price, rating, etc.
- Category-based browsing

### 💬 Communication
- Real-time messaging between buyers and sellers
- Contact seller directly via phone or email
- Message history and notifications

### ❤️ User Experience
- Favorites/wishlist functionality
- User ratings and reviews
- Responsive design for mobile and desktop
- Modern, intuitive interface

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form handling and validation
- **React Query** - Data fetching and caching
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Notifications
- **React Dropzone** - File upload handling

### Backend (Planned)
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.io** for real-time messaging
- **JWT** for authentication
- **Multer** for file uploads
- **Cloudinary** for image storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/droplink.git
cd droplink
```

2. Install client dependencies
```bash
cd client
npm install
```

3. Start the development server
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## 📁 Project Structure

```
droplink/
├── client/                 # React frontend
│   ├── public/            # Public assets
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── auth/     # Authentication components
│   │   │   ├── common/   # Common UI components
│   │   │   └── layout/   # Layout components
│   │   ├── contexts/     # React Context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   │   ├── admin/   # Admin pages
│   │   │   └── auth/    # Authentication pages
│   │   ├── utils/        # Utility functions
│   │   ├── App.js        # Main App component
│   │   └── index.js      # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend (planned)
├── README.md
└── package.json
```

## 🎨 Design Philosophy

- **Mobile-First**: Responsive design that works seamlessly on all devices
- **User-Friendly**: Intuitive navigation and clear calls-to-action
- **Modern**: Clean, contemporary design with purple accent colors
- **Fast**: Optimized for performance and quick loading
- **Accessible**: Following web accessibility best practices

## � Available Scripts

### Client
- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## � Screenshots

### Home Page
- Hero section with call-to-action
- Featured items showcase
- Category browsing
- Statistics and features

### Item Listing
- Grid/list view of items
- Advanced filtering options
- Search functionality
- Sorting capabilities

### Item Details
- Image gallery with thumbnails
- Detailed item information
- Seller contact information
- Safety tips

### User Dashboard
- Personal statistics
- Quick actions
- Recent activity
- Profile management

## 🌟 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **Payment Integration**: Secure payment processing
- **Geolocation**: Location-based search and delivery
- **Social Features**: User following and social sharing
- **Advanced Analytics**: Business intelligence dashboard
- **Multi-language**: Support for Khmer language
- **Delivery Integration**: Partner with local delivery services

## � Support

For support, email support@droplink.com or create an issue in this repository.

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- Design inspiration from modern marketplace platforms
- Icons by [Heroicons](https://heroicons.com/)
- Images from [Unsplash](https://unsplash.com/)
- Built with love for the Cambodian community

---

**Made with ❤️ in Cambodia**
