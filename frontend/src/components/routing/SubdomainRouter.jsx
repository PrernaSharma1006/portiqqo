import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import PublicPortfolioPage from '../../pages/PublicPortfolioPage';
import Layout from '../layout/Layout';

function SubdomainRouter() {
  const hostname = window.location.hostname;
  
  // Check if we're on a subdomain (not main domain or www)
  const isSubdomain = hostname.endsWith('.portiqqo.me') && 
                      hostname !== 'portiqqo.me' && 
                      hostname !== 'www.portiqqo.me';

  if (isSubdomain) {
    // We're on a subdomain - show the portfolio page
    return <PublicPortfolioPage />;
  } else {
    // We're on the main domain - show the homepage
    return <Layout><HomePage /></Layout>;
  }
}

export default SubdomainRouter;
