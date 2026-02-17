import { portfolioAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Save portfolio data to the backend
 * @param {Object} portfolioData - The portfolio data from the editor
 * @param {string} profession - The profession type (developer, ui-ux-designer, etc.)
 * @param {string} subdomain - Optional custom subdomain
 * @param {Function} onSuccess - Optional callback on success
 * @returns {Promise<Object>} - The saved portfolio response
 */
export const savePortfolioToBackend = async (portfolioData, profession, subdomain = null, onSuccess) => {
  try {
    const toastId = toast.loading('Saving portfolio...');
    
    // Prepare payload for backend
    const portfolioPayload = {
      title: portfolioData.profile?.name ? portfolioData.profile.name + "'s Portfolio" : "My Portfolio",
      profession,
      subdomain: subdomain || null, // Include custom subdomain if provided
      personalInfo: {
        firstName: portfolioData.profile?.name?.split(' ')[0] || '',
        lastName: portfolioData.profile?.name?.split(' ').slice(1).join(' ') || '',
        tagline: portfolioData.profile?.title || portfolioData.profile?.tagline || '',
        bio: portfolioData.profile?.description || portfolioData.profile?.bio || '',
        location: portfolioData.profile?.location || '',
        email: portfolioData.profile?.email || '',
        phone: portfolioData.profile?.phone || '',
        website: portfolioData.profile?.website || '',
        profileImage: {
          url: portfolioData.profile?.profileImage || portfolioData.profile?.image || ''
        }
      },
      socialLinks: {
        github: portfolioData.profile?.github || portfolioData.social?.github || '',
        linkedin: portfolioData.profile?.linkedin || portfolioData.social?.linkedin || '',
        twitter: portfolioData.profile?.twitter || portfolioData.social?.twitter || '',
        instagram: portfolioData.profile?.instagram || portfolioData.social?.instagram || '',
        behance: portfolioData.profile?.behance || portfolioData.social?.behance || '',
        dribbble: portfolioData.profile?.dribbble || portfolioData.social?.dribbble || '',
        youtube: portfolioData.profile?.youtube || portfolioData.social?.youtube || ''
      },
      // Map skills from different possible structures
      skills: extractSkills(portfolioData),
      // Map projects
      projects: extractProjects(portfolioData),
      // Store full template-specific data as JSON
      templateData: portfolioData
    };

    // Call API to save
    const response = await portfolioAPI.save(portfolioPayload);
    
    // Update local storage as backup
    localStorage.setItem(`${profession}Portfolio`, JSON.stringify(portfolioData));
    localStorage.setItem('savedPortfolioId', response.data.portfolio.id);
    localStorage.setItem('savedPortfolioSubdomain', response.data.portfolio.subdomain);
    
    toast.dismiss(toastId); // Dismiss loading toast silently
    
    if (onSuccess) {
      onSuccess(response.data.portfolio);
    }
    
    return response.data.portfolio;
  } catch (error) {
    console.error('Save error:', error);
    
    // Check if error is due to portfolio limit
    if (error.response?.data?.code === 'PORTFOLIO_LIMIT_REACHED') {
      toast.error(
        error.response.data.message,
        {
          duration: 5000,
          icon: '👑',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          }
        }
      );
    } else {
      toast.error(error.response?.data?.message || 'Failed to save portfolio');
    }
    
    throw error;
  }
};

/**
 * Publish portfolio (make it publicly accessible)
 * @param {string} profession - The profession type
 * @param {Function} onSuccess - Optional callback on success
 * @returns {Promise<Object>} - The published portfolio response
 */
export const publishPortfolioToBackend = async (profession, onSuccess) => {
  try {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please log in to publish your portfolio');
      throw new Error('Not authenticated');
    }
    
    const toastId = toast.loading('Publishing portfolio...');
    
    // Get saved portfolio ID
    const portfolioId = localStorage.getItem('savedPortfolioId');
    
    if (!portfolioId) {
      toast.error('Please save your portfolio first', { id: toastId });
      throw new Error('No saved portfolio found');
    }
    
    // Call API to publish
    const response = await portfolioAPI.publish(portfolioId, profession);
    
    const publicUrl = response.data.portfolio.publicUrl;
    const subdomain = response.data.portfolio.subdomain;
    
    toast.dismiss(toastId); // Dismiss loading toast
    
    // Copy to clipboard automatically (silently)
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    
    // Store the public URL
    localStorage.setItem('publicPortfolioUrl', publicUrl);
    localStorage.setItem('portfolioSubdomain', subdomain);
    
    if (onSuccess) {
      onSuccess(response.data.portfolio);
    }
    
    return response.data.portfolio;
  } catch (error) {
    console.error('Publish error:', error);
    toast.error(error.response?.data?.message || 'Failed to publish portfolio');
    throw error;
  }
};

/**
 * Extract skills from portfolio data (handles different formats)
 */
function extractSkills(portfolioData) {
  const skills = [];
  
  // Check for techStack (developer template)
  if (portfolioData.techStack) {
    Object.entries(portfolioData.techStack).forEach(([category, skillList]) => {
      if (Array.isArray(skillList)) {
        skillList.forEach(skill => {
          skills.push({ 
            name: typeof skill === 'string' ? skill : skill.name || 'Unknown',
            category: 'technical',
            level: 'intermediate'
          });
        });
      }
    });
  }
  
  // Check for skills array
  if (Array.isArray(portfolioData.skills)) {
    portfolioData.skills.forEach(skill => {
      if (typeof skill === 'string') {
        skills.push({ 
          name: skill, 
          category: 'technical',
          level: 'intermediate'
        });
      } else if (typeof skill === 'object' && skill.name) {
        skills.push({
          name: skill.name,
          category: mapCategory(skill.category),
          level: mapLevel(skill.level)
        });
      }
    });
  }
  
  // Check for tools array
  if (Array.isArray(portfolioData.tools)) {
    portfolioData.tools.forEach(tool => {
      skills.push({ 
        name: typeof tool === 'string' ? tool : tool.name,
        category: 'technical',
        level: 'intermediate'
      });
    });
  }
  
  return skills;
}

/**
 * Map category to valid enum value
 */
function mapCategory(category) {
  if (!category) return 'technical';
  
  const lowerCategory = category.toLowerCase();
  
  // Map common variations to valid values
  const categoryMap = {
    'frontend': 'technical',
    'backend': 'technical',
    'tools': 'technical',
    'programming': 'technical',
    'technical': 'technical',
    'design': 'design',
    'soft': 'soft',
    'language': 'language',
    'other': 'other'
  };
  
  return categoryMap[lowerCategory] || 'technical';
}

/**
 * Map level to valid enum value
 */
function mapLevel(level) {
  if (!level) return 'intermediate';
  
  // If it's already a valid enum value
  const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  if (validLevels.includes(level)) return level;
  
  // Convert numeric levels to enum
  if (typeof level === 'number' || !isNaN(level)) {
    const numLevel = parseInt(level);
    if (numLevel >= 90) return 'expert';
    if (numLevel >= 75) return 'advanced';
    if (numLevel >= 50) return 'intermediate';
    return 'beginner';
  }
  
  // Default
  return 'intermediate';
}

/**
 * Extract projects from portfolio data (handles different formats)
 */
function extractProjects(portfolioData) {
  if (!portfolioData.projects || !Array.isArray(portfolioData.projects)) {
    return [];
  }
  
  return portfolioData.projects.map(project => ({
    title: project.title || '',
    description: project.description || '',
    shortDescription: project.shortDescription || project.description?.substring(0, 150) || '',
    technologies: project.technologies || project.tools || [],
    category: project.category || 'other',
    images: project.images?.map(img => ({ url: img })) || [],
    videos: project.videos?.map(vid => ({ url: vid })) || [],
    links: {
      live: project.liveUrl || project.url || project.demo || '',
      github: project.githubUrl || project.github || '',
      demo: project.demoUrl || project.demo || ''
    },
    featured: project.featured || false
  }));
}
