import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import PublicPortfolioPage from '../../pages/PublicPortfolioPage';
import Layout from '../layout/Layout';

function SubdomainRouter() {
  const hostname = window.location.hostname.toLowerCase();
  
  // Check main domains, vercel hosts, and local dev hosts
  const isMainDomain = hostname === 'portiqqo.me' || 
                       hostname === 'www.portiqqo.me' || 
                       hostname.endsWith('.vercel.app') ||
                       hostname === 'localhost' || 
                       hostname === '127.0.0.1';

  // Check if we're on a portiqqo.me subdomain (e.g., username.portiqqo.me)
  const isSubdomain = hostname.endsWith('.portiqqo.me') && !isMainDomain;

  // Check if we're on a custom domain (e.g. johnsmith.dev)
  const isCustomDomain = !isMainDomain && !hostname.endsWith('.portiqqo.me');

  if (isSubdomain || isCustomDomain) {
    // We're on a subdomain or custom domain - show the portfolio page
    return <PublicPortfolioPage />;
  } else {
    // We're on the main domain - show the homepage
    return <Layout><HomePage /></Layout>;
  }
}

export default SubdomainRouter;
