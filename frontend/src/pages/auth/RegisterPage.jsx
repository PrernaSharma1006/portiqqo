import { Helmet } from 'react-helmet-async'

function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Create Account - Portiqqo</title>
        <meta name="description" content="Create your free Portiqqo account and start building your portfolio today" />
      </Helmet>

      <div className="min-h-screen bg-lavender-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-lavender-600">
              Start building your professional portfolio today
            </p>
          </div>
          
          <div className="card p-8">
            <p className="text-center text-lavender-600">
              Registration functionality will be implemented here with OTP verification
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage