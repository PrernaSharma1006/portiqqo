import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { portfolioAPI } from '../services/api';
import { Loader2, AlertCircle, Eye } from 'lucide-react';
import WebDeveloperTemplate from '../components/templates/WebDeveloperTemplate';
import UIUXDesignerTemplate from '../components/templates/UIUXDesignerTemplate';
import VideoEditorTemplate from '../components/templates/VideoEditorTemplate';
import PhotographerTemplate from '../components/templates/PhotographerTemplate';
import GeneralPortfolioTemplate from '../components/templates/GeneralPortfolioTemplate';

function PublicPortfolioPage() {
  const { subdomain: pathSubdomain } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get subdomain from URL hostname or path
  const getSubdomain = () => {
    const hostname = window.location.hostname;
    // If it's a subdomain like "example.portiqqo.me"
    if (hostname.endsWith('.portiqqo.me') && hostname !== 'portiqqo.me' && hostname !== 'www.portiqqo.me') {
      return hostname.replace('.portiqqo.me', '');
    }
    // Fallback to path-based (for backward compatibility)
    return pathSubdomain;
  };

  const subdomain = getSubdomain();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        console.log('Fetching portfolio for subdomain:', subdomain);
        const response = await portfolioAPI.getPublic(subdomain);
        console.log('Portfolio response:', response.data);
        setPortfolio(response.data.portfolio);
        setError(null);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.message || 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) {
      fetchPortfolio();
    }
  }, [subdomain]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The portfolio you are looking for does not exist or has been unpublished.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate template based on profession
  const renderTemplate = () => {
    const templateData = portfolio.templateData || {};
    const profession = portfolio.profession;

    console.log('Rendering template for profession:', profession);
    console.log('Template data:', templateData);

    // Props common to all templates
    const commonProps = {
      portfolioData: templateData,
      personalInfo: portfolio.personalInfo,
      socialLinks: portfolio.socialLinks,
      skills: portfolio.skills,
      projects: portfolio.projects,
      isPublic: true
    };

    try {
      switch (profession) {
        case 'web-developer':
        case 'developer':
          return <WebDeveloperTemplate {...commonProps} />;
        case 'ui-ux-designer':
          return <UIUXDesignerTemplate {...commonProps} />;
        case 'video-editor':
          return <VideoEditorTemplate {...commonProps} />;
        case 'photographer':
          return <PhotographerTemplate {...commonProps} />;
        case 'general':
          return <GeneralPortfolioTemplate {...commonProps} />;
        default:
          console.warn('Unknown profession:', profession, '- using general template');
          return <GeneralPortfolioTemplate {...commonProps} />;
      }
    } catch (error) {
      console.error('Error rendering template:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Portfolio</h1>
            <p className="text-gray-600 mb-6">
              There was an error rendering this portfolio. Please try again later.
            </p>
            <pre className="text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
              {error.message}
            </pre>
          </div>
        </div>
      );
    }
  };

  // Show view count badge
  const ViewCounter = () => (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full px-4 py-2 flex items-center space-x-2 z-50">
      <Eye className="w-4 h-4 text-gray-600" />
      <span className="text-sm text-gray-600">{portfolio.views} views</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderTemplate()}
      <ViewCounter />
    </div>
  );
}

export default PublicPortfolioPage;
