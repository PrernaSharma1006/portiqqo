import { portfolioAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Save portfolio data to the backend
 * @param {Object} portfolioData - The portfolio data from the editor
 * @param {string} profession - The profession type (developer, ui-ux-designer, etc.)
 * @param {Function} onSuccess - Optional callback on success
 * @returns {Promise<Object>} - The saved portfolio response
 */
export const savePortfolioToBackend = async (portfolioData, profession, onSuccess) => {
  try {
    const toastId = toast.loading('Saving portfolio...');
    
    // Prepare payload for backend
    const portfolioPayload = {
      title: portfolioData.profile?.name ? portfolioData.profile.name + "'s Portfolio" : "My Portfolio",
      profession,
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
    
    toast.success('Portfolio saved successfully!', { id: toastId });
    
    if (onSuccess) {
      onSuccess(response.data.portfolio);
    }
    
    return response.data.portfolio;
  } catch (error) {
    console.error('Save error:', error);
    toast.error(error.response?.data?.message || 'Failed to save portfolio');
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
    
    toast.success('Portfolio published successfully! 🎉', { id: toastId });
    
    // Show shareable link prominently
    toast.success(
      `Your portfolio is LIVE!\n\nShare this link:\n${publicUrl}\n\nAnyone can view your work at this link!`,
      { 
        duration: 15000,
        style: {
          maxWidth: '600px',
          fontSize: '14px',
          whiteSpace: 'pre-line'
        }
      }
    );
    
    // Copy to clipboard automatically
    try {
      await navigator.clipboard.writeText(publicUrl);
      setTimeout(() => {
        toast.success('📋 Link copied to clipboard!\n\nPaste it anywhere to share your portfolio!', {
          duration: 5000,
          style: {
            whiteSpace: 'pre-line'
          }
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast('Click the link in the notification to visit your portfolio', { duration: 5000 });
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
          skills.push({ name: skill, category: 'technical' });
        });
      }
    });
  }
  
  // Check for skills array
  if (Array.isArray(portfolioData.skills)) {
    portfolioData.skills.forEach(skill => {
      if (typeof skill === 'string') {
        skills.push({ name: skill, category: 'technical' });
      } else if (typeof skill === 'object' && skill.name) {
        skills.push(skill);
      }
    });
  }
  
  // Check for tools array
  if (Array.isArray(portfolioData.tools)) {
    portfolioData.tools.forEach(tool => {
      skills.push({ name: tool, category: 'technical' });
    });
  }
  
  return skills;
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
