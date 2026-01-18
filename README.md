# Portfolio Builder - MERN Stack

A comprehensive portfolio builder platform where users can create professional portfolios with custom subdomains.

## Features

- **User Authentication**: Email OTP verification
- **Profession-specific Templates**: UI/UX, Developer, Designer, Photographer, Video Editor, etc.
- **Portfolio Builder**: Upload work (images, videos, PDFs, external links)
- **Content Management**: About, skills, projects, contact information
- **Subdomain Generation**: Unique subdomain for each portfolio
- **Storage Management**: 15GB storage included with subscription
- **Subscription System**: 7-day free trial, then ₹81/month

## Tech Stack

- **Frontend**: React.js with modern UI components
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with email OTP
- **File Upload**: Multer with cloud storage
- **Email Service**: NodeMailer
- **Payment**: Stripe integration

## Project Structure

```
portfolio/
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication & validation
│   ├── services/           # Business logic
│   └── uploads/            # File uploads
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Helper functions
│   │   └── styles/         # CSS/SCSS files
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up environment variables
5. Start the development servers

## Environment Variables

Create `.env` files in both backend and frontend directories with the required configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.