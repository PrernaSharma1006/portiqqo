# Portfolio Builder

A comprehensive MERN-based portfolio builder platform where users can create professional portfolios with ease.

## 🚀 Features

- **Email OTP Authentication** - Secure login with email verification
- **Profession-Specific Templates** - Templates for developers, designers, photographers, etc.
- **File Upload System** - Support for images, videos, PDFs, and external links
- **Custom Subdomains** - Unique subdomain for each portfolio
- **Storage Management** - 15GB free storage with paid upgrade options
- **Subscription System** - Free and premium plans with Stripe integration
- **Responsive Design** - Works perfectly on all devices

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data management
- Axios for API calls

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for emails
- Cloudinary for file storage
- Stripe for payments

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd portfolio
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/portfolio-builder

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=1d
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@portfoliobuilder.com

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key

# App URLs
APP_URL=http://localhost:3000
API_URL=http://localhost:5000
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Portfolio Builder
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

Start the frontend development server:
```bash
npm run dev
```

## 📁 Project Structure

```
portfolio/
├── backend/                 # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & validation middleware
│   ├── services/           # Business logic services
│   ├── utils/              # Helper functions
│   └── uploads/            # File uploads directory
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Helper functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # CSS styles
│   └── public/             # Static assets
└── docs/                   # Documentation
```

## 🔧 Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `EMAIL_USER` - SMTP email username
- `EMAIL_PASS` - SMTP email password
- `CLOUDINARY_*` - Cloudinary credentials for file uploads
- `STRIPE_SECRET_KEY` - Stripe secret key for payments

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## 📊 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP for login/registration
- `POST /api/auth/verify-otp` - Verify OTP and authenticate
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Portfolios
- `GET /api/portfolios` - Get user portfolios
- `POST /api/portfolios` - Create new portfolio
- `GET /api/portfolios/:id` - Get portfolio by ID
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

### Templates
- `GET /api/templates` - Get available templates
- `GET /api/templates/:id` - Get template by ID
- `GET /api/templates/profession/:profession` - Get templates by profession

### Upload
- `POST /api/upload/image` - Upload image file
- `POST /api/upload/video` - Upload video file
- `POST /api/upload/pdf` - Upload PDF file

## 🎨 Design System

The project uses a comprehensive design system built with Tailwind CSS:

- **Colors**: Primary (blue), Secondary (gray), Accent (amber)
- **Typography**: Inter for body text, Poppins for headings
- **Components**: Consistent button, card, and form styles
- **Animations**: Smooth transitions and micro-interactions

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Email OTP verification for secure login
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers

## 💾 Database Models

### User Model
- Basic user information and authentication
- Subscription and storage management
- OTP verification system

### Portfolio Model
- Complete portfolio data structure
- Support for all content types
- SEO and analytics integration

### Template Model
- Template configuration and assets
- Profession-specific categorization
- Usage tracking and ratings

### Subscription Model
- Stripe integration for payments
- Storage and feature management
- Billing history tracking

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set up environment variables
2. Configure MongoDB Atlas
3. Set up Cloudinary account
4. Configure Stripe account
5. Deploy backend service

### Frontend Deployment (Vercel/Netlify)
1. Build the React application
2. Configure environment variables
3. Set up custom domain (optional)
4. Deploy frontend application

### Database Setup (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Set up cluster and database
3. Configure network access
4. Update connection string in environment

## 🧪 Testing

Run tests for backend:
```bash
cd backend
npm test
```

Run tests for frontend:
```bash
cd frontend
npm test
```

## 📈 Performance

- **Frontend**: Optimized bundle splitting and lazy loading
- **Backend**: Efficient database queries and caching
- **Images**: Automatic optimization with Cloudinary
- **SEO**: Server-side rendering support ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@portfoliobuilder.com
- Documentation: [docs.portfoliobuilder.com](https://docs.portfoliobuilder.com)
- Issues: GitHub Issues page

## 🎯 Roadmap

- [ ] Advanced template customization
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] AI-powered content suggestions
- [ ] Integration with popular design tools

---

Built with ❤️ by the Portfolio Builder team