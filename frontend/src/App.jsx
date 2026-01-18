import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

// Import pages
import HomePage from './pages/HomePage'
import UnifiedAuthPage from './pages/auth/UnifiedAuthPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import AuthCallbackPage from './pages/auth/AuthCallbackPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import HelpCenterPage from './pages/HelpCenterPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'

// Import templates
import WebDeveloperTemplate from './components/templates/WebDeveloperTemplate'
import UIUXDesignerTemplate from './components/templates/UIUXDesignerTemplate'
import PhotographerTemplate from './components/templates/PhotographerTemplate'
import VideoEditorTemplate from './components/templates/VideoEditorTemplate'
import IllustratorTemplate from './components/templates/IllustratorTemplate'
import DigitalMarketerTemplate from './components/templates/DigitalMarketerTemplate'
import ArchitectTemplate from './components/templates/ArchitectTemplate'
import GeneralPortfolioTemplate from './components/templates/GeneralPortfolioTemplate'

// Import editor components
import TemplateEditor from './components/editor/TemplateEditor'
import GeneralPortfolioBuilder from './components/editor/GeneralPortfolioBuilder'
import VideoEditorTemplateEditor from './components/editor/VideoEditorTemplateEditor'
import WebDeveloperTemplateEditor from './components/editor/WebDeveloperTemplateEditor'
import UIUXDesignerTemplateEditor from './components/editor/UIUXDesignerTemplateEditor'
import PhotographerTemplateEditor from './components/editor/PhotographerTemplateEditor'
import GeneralPortfolioTemplateEditor from './components/editor/GeneralPortfolioTemplateEditor'

// Import portfolio display
import PortfolioDisplay from './components/portfolio/PortfolioDisplay'

// Import preview page
import TemplatePreview from './pages/TemplatePreview'

// Import components
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import { AuthProvider } from './contexts/AuthContext'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/auth" element={<UnifiedAuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/register" element={<UnifiedAuthPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Information pages */}
            <Route path="/help-center" element={<Layout><HelpCenterPage /></Layout>} />
            <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
            <Route path="/terms-of-service" element={<Layout><TermsOfServicePage /></Layout>} />
            
            {/* Template preview routes */}
            <Route path="/preview/:templateType" element={<TemplatePreview />} />
            <Route path="/template/web-developer" element={<WebDeveloperTemplate />} />
            <Route path="/template/ui-ux-designer" element={<UIUXDesignerTemplate />} />
            <Route path="/template/photographer" element={<PhotographerTemplate />} />
            <Route path="/template/video-editor" element={<VideoEditorTemplate />} />
            <Route path="/template/illustrator" element={<IllustratorTemplate />} />
            <Route path="/template/digital-marketer" element={<DigitalMarketerTemplate />} />
            <Route path="/template/architect" element={<ArchitectTemplate />} />
            <Route path="/template/general" element={<GeneralPortfolioTemplate />} />
            
            {/* Template editor routes */}
            <Route path="/editor/:templateType" element={<TemplateEditor />} />
            <Route path="/builder/general" element={<GeneralPortfolioBuilder />} />
            <Route path="/editor/video-editor" element={<VideoEditorTemplateEditor />} />
            <Route path="/editor/web-developer" element={<WebDeveloperTemplateEditor />} />
            <Route path="/editor/ui-ux-designer" element={<UIUXDesignerTemplateEditor />} />
            <Route path="/editor/photographer" element={<PhotographerTemplateEditor />} />
            <Route path="/editor/general-portfolio" element={<GeneralPortfolioTemplateEditor />} />
            
            {/* Portfolio display route */}
            <Route path="/portfolio/:portfolioId" element={<PortfolioDisplay />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout><DashboardPage /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </div>
        
        {/* React Query Devtools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App