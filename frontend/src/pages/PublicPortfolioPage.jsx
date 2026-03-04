import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { portfolioAPI } from '../services/api';
import { Loader2, AlertCircle, Eye, Download } from 'lucide-react';
import WebDeveloperTemplate from '../components/templates/WebDeveloperTemplate';
import UIUXDesignerTemplate from '../components/templates/UIUXDesignerTemplate';
import VideoEditorTemplate from '../components/templates/VideoEditorTemplate';
import PhotographerTemplate from '../components/templates/PhotographerTemplate';
import GeneralPortfolioTemplate from '../components/templates/GeneralPortfolioTemplate';
import DigitalMarketerTemplate from '../components/templates/DigitalMarketerTemplate';

function PublicPortfolioPage() {
  const { subdomain: pathSubdomain } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const portfolioRef = useRef(null);

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
        if (err.response?.data?.code === 'TRIAL_EXPIRED') {
          setIsTrialExpired(true);
        } else {
          setError(err.response?.data?.message || 'Portfolio not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) {
      fetchPortfolio();
    }
  }, [subdomain]);

  // Trial expired state
  if (isTrialExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
        <div className="max-w-lg w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-10 text-center">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Free Trial Ended</h1>
          <p className="text-slate-300 mb-2">
            This portfolio's 7-day free trial has expired.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            The owner needs to upgrade to a paid plan to keep their portfolio live and publicly accessible.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Create Your Own Free Portfolio
            </button>
            <p className="text-slate-500 text-xs">
              Build and publish your portfolio free for 7 days — no credit card required
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        case 'digital-marketer':
          return <DigitalMarketerTemplate {...commonProps} />;
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

  const handleDownloadPDF = async () => {
    const element = portfolioRef.current;
    if (!element) return;

    // Load html2pdf from CDN if not already loaded
    if (!window.html2pdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    const html2pdf = window.html2pdf;
    const ownerName = portfolio.personalInfo?.name || portfolio.subdomain || 'portfolio';
    const fileName = `${ownerName.replace(/\s+/g, '-').toLowerCase()}-portfolio.pdf`;

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'px', format: 'a4', orientation: 'portrait', hotfixes: ['px_scaling'] },
    };

    html2pdf().set(opt).from(element).save();
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
      <div ref={portfolioRef}>
        {renderTemplate()}
      </div>
      <ViewCounter />
      {/* Download PDF button */}
      <button
        onClick={handleDownloadPDF}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
        title="Download as PDF"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    </div>
  );
}

export default PublicPortfolioPage;
