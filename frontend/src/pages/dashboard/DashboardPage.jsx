import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../contexts/AuthContext'

function DashboardPage() {
  const { user, isAuthenticated } = useAuth()

  return (
    <>
      <Helmet>
        <title>Dashboard - Portiqqo</title>
        <meta name="description" content="Manage your portfolios, templates, and account settings" />
      </Helmet>

      <div className="min-h-screen bg-lavender-50">
        <div className="container-width section-padding page-padding">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
              Welcome {isAuthenticated && user ? user.firstName : 'to Your Dashboard'}!
            </h1>
            <p className="text-base sm:text-lg text-lavender-600">
              Create and manage your professional portfolios
            </p>
            {isAuthenticated && user && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Successfully logged in as <strong>{user.email}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Dashboard content will be implemented later */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">My Portfolios</h3>
              <p className="text-sm sm:text-base text-lavender-600 mb-3 sm:mb-4">
                Create and manage your portfolio websites
              </p>
              <button className="btn-primary w-full sm:w-auto">
                Create Portfolio
              </button>
            </div>

            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Storage Usage</h3>
              <p className="text-sm sm:text-base text-lavender-600 mb-3 sm:mb-4">
                Monitor your storage and upgrade when needed
              </p>
              <div className="w-full bg-lavender-200 rounded-full h-2 mb-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-xs sm:text-sm text-lavender-500">3.75 GB of 15 GB used</p>
            </div>

            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Account Settings</h3>
              <p className="text-sm sm:text-base text-lavender-600 mb-3 sm:mb-4">
                Manage your profile and subscription
              </p>
              <button className="btn-outline w-full sm:w-auto">
                View Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage