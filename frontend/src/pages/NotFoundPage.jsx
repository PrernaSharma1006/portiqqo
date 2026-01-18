import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lavender-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-heading font-semibold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-lg text-lavender-600 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/"
            className="btn-primary px-6 py-3 rounded-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn-outline px-6 py-3 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
        
        <div className="mt-12 text-lavender-500">
          <p>Need help? <Link to="/contact" className="text-primary-600 hover:underline">Contact our support team</Link></p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage