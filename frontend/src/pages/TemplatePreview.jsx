import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

// Import sample data for each template type
const sampleData = {
  'web-developer': {
    profile: {
      name: "Alex Thompson",
      title: "Senior Full Stack Developer",
      specialization: "fullstack",
      description: "Innovative full stack developer with 7+ years of experience crafting elegant solutions to complex problems. Specialized in building scalable, high-performance web applications using modern JavaScript frameworks, cloud architecture, and DevOps best practices. Passionate about clean code, user experience, and mentoring junior developers.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=400&fit=crop",
      location: "San Francisco, CA",
      email: "alex.thompson@example.com",
      phone: "+1 (555) 123-4567",
      github: "https://github.com/alexthompson",
      linkedin: "https://linkedin.com/in/alexthompson",
      website: "https://alexthompson.dev",
      twitter: "https://twitter.com/alexcodes"
    },
    techStack: {
      frontend: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS", "Redux", "React Query", "Framer Motion"],
      backend: ["Node.js", "Express", "Python", "Django", "FastAPI", "GraphQL", "REST APIs", "Microservices"],
      database: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Firebase", "Prisma ORM"],
      tools: ["Docker", "AWS", "Git", "CI/CD", "Jenkins", "Kubernetes", "Terraform", "Jest", "Cypress"]
    },
    experience: [
      {
        id: 1,
        company: "TechCorp Inc",
        position: "Senior Full Stack Developer",
        duration: "2021 - Present",
        description: "Led development of enterprise SaaS platform serving 50k+ users. Architected microservices infrastructure reducing response time by 60%."
      },
      {
        id: 2,
        company: "StartupXYZ",
        position: "Full Stack Developer",
        duration: "2019 - 2021",
        description: "Built scalable e-commerce platform from ground up. Implemented CI/CD pipelines and reduced deployment time by 75%."
      },
      {
        id: 3,
        company: "Digital Solutions Ltd",
        position: "Junior Developer",
        duration: "2018 - 2019",
        description: "Developed responsive web applications using React and Node.js. Collaborated with design team to improve user experience."
      }
    ],
    projects: [
      {
        id: 1,
        title: "E-Commerce Platform",
        description: "Enterprise-level e-commerce solution with real-time inventory management, advanced analytics dashboard, and AI-powered product recommendations. Handles 100k+ daily transactions with 99.9% uptime.",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS", "Redis", "Elasticsearch"],
        githubUrl: "https://github.com/alexthompson/ecommerce-platform",
        liveUrl: "https://shop-demo.example.com",
        highlights: ["99.9% uptime", "100k+ daily users", "AI recommendations"]
      },
      {
        id: 2,
        title: "Task Management SaaS",
        description: "Collaborative project management tool with real-time updates, team chat, time tracking, and comprehensive reporting. Used by 500+ companies worldwide.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
        technologies: ["Vue.js", "Express", "PostgreSQL", "Socket.io", "Docker", "Kubernetes"],
        githubUrl: "https://github.com/alexthompson/taskmaster",
        liveUrl: "https://taskmaster-demo.example.com",
        highlights: ["Real-time collaboration", "500+ companies", "Mobile apps"]
      },
      {
        id: 3,
        title: "Social Media Analytics",
        description: "Advanced analytics platform for social media managers. Track engagement, schedule posts, and generate comprehensive reports across multiple platforms.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        technologies: ["Next.js", "Python", "FastAPI", "MongoDB", "Chart.js", "TailwindCSS"],
        githubUrl: "https://github.com/alexthompson/social-analytics",
        liveUrl: "https://analytics-demo.example.com",
        highlights: ["Multi-platform support", "AI insights", "Automated reporting"]
      },
      {
        id: 4,
        title: "Real Estate Portal",
        description: "Modern property listing platform with virtual tours, mortgage calculator, and advanced search filters. Features map integration and saved searches.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
        technologies: ["React", "Django", "PostgreSQL", "Mapbox", "AWS S3"],
        githubUrl: "https://github.com/alexthompson/realestate-portal",
        liveUrl: "https://properties-demo.example.com",
        highlights: ["Virtual tours", "10k+ listings", "Mobile responsive"]
      },
      {
        id: 5,
        title: "Healthcare Appointment System",
        description: "HIPAA-compliant appointment scheduling system for healthcare providers. Features telemedicine integration, patient records, and automated reminders.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
        technologies: ["React", "Node.js", "MySQL", "WebRTC", "Twilio"],
        githubUrl: "https://github.com/alexthompson/health-scheduler",
        liveUrl: "https://health-demo.example.com",
        highlights: ["HIPAA compliant", "Video consultations", "SMS reminders"]
      },
      {
        id: 6,
        title: "DevOps Dashboard",
        description: "Centralized monitoring dashboard for DevOps teams. Real-time server metrics, deployment tracking, and automated alerts for critical events.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        technologies: ["Vue.js", "Python", "InfluxDB", "Grafana", "Docker"],
        githubUrl: "https://github.com/alexthompson/devops-dashboard",
        liveUrl: "https://devops-demo.example.com",
        highlights: ["Real-time monitoring", "Automated alerts", "Custom metrics"]
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "Stanford University",
        year: "2018",
        honors: "Magna Cum Laude"
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Google Cloud Professional Developer",
      "MongoDB Certified Developer"
    ],
    testimonials: [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "CTO at TechCorp",
        text: "Alex is an exceptional developer who consistently delivers high-quality solutions. Their expertise in full stack development and cloud architecture has been invaluable to our team.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 2,
        name: "Michael Chen",
        role: "Product Manager",
        text: "Working with Alex has been a pleasure. They have a unique ability to translate complex requirements into elegant technical solutions while maintaining excellent communication.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      }
    ],
    footer: {
      companyName: "Alex Thompson Development",
      tagline: "Building tomorrow's web solutions today",
      email: "alex.thompson@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      quickStats: {
        projects: "50+",
        experience: "7+ years",
        clients: "100+",
        technologies: "25+"
      },
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/alexthompson", icon: "Github" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/alexthompson", icon: "Linkedin" },
        { platform: "Twitter", url: "https://twitter.com/alexcodes", icon: "Twitter" }
      ],
      copyright: "© 2024 Alex Thompson. All rights reserved."
    }
  },
  'ui-ux-designer': {
    profile: {
      name: "Emma Martinez",
      title: "Senior UI/UX Designer",
      specialization: "ui-ux",
      description: "Award-winning UI/UX designer with 6+ years of experience creating intuitive, user-centered digital experiences. Expert in user research, wireframing, prototyping, and design systems. Passionate about accessibility, inclusive design, and bridging the gap between design and development.",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop",
      location: "New York, NY",
      email: "emma.martinez@example.com",
      phone: "+1 (555) 234-5678",
      behance: "https://behance.net/emmamartinez",
      dribbble: "https://dribbble.com/emmamartinez",
      linkedin: "https://linkedin.com/in/emmamartinez"
    },
    skills: {
      design: ["User Research", "Wireframing", "Prototyping", "UI Design", "UX Strategy", "Design Systems", "Information Architecture"],
      tools: ["Figma", "Adobe XD", "Sketch", "Adobe Creative Suite", "InVision", "Miro", "Principle", "After Effects"],
      specialties: ["Mobile Design", "Web Design", "Accessibility", "Design Thinking", "Usability Testing", "A/B Testing"]
    },
    caseStudies: [
      {
        id: 1,
        title: "FinTech Mobile Banking App Redesign",
        category: "mobile",
        image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&h=400&fit=crop",
        description: "Complete redesign of a mobile banking app to improve user engagement and simplify complex financial transactions.",
        challenge: "Users struggled with complex navigation, cluttered interface, and confusing financial terminology. The app had a 2.1 star rating with high abandonment rates during onboarding.",
        solution: "Conducted extensive user research with 50+ participants. Implemented card-based navigation, simplified onboarding flow from 8 steps to 3, introduced visual spending analytics, and created a comprehensive design system.",
        results: "App rating increased to 4.6 stars, user engagement up 145%, onboarding completion rate increased from 34% to 87%, and customer support tickets reduced by 60%.",
        timeline: "4 months",
        role: "Lead UX Designer",
        images: [
          "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"
        ]
      },
      {
        id: 2,
        title: "Healthcare Portal Transformation",
        category: "web",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
        description: "Redesigned patient portal for a major healthcare provider to improve appointment scheduling and medical records access.",
        challenge: "Patients found it difficult to schedule appointments, access medical records, and communicate with healthcare providers. The system had poor accessibility and was not mobile-friendly.",
        solution: "Created an intuitive dashboard with quick actions, implemented one-tap appointment scheduling, designed accessible medical records viewer (WCAG 2.1 AA compliant), and added secure messaging feature.",
        results: "Online appointment bookings increased by 210%, patient satisfaction scores improved from 3.2 to 4.7, reduced phone call volume by 45%, and achieved full WCAG 2.1 AA accessibility compliance.",
        timeline: "6 months",
        role: "Senior UX Designer",
        images: [
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop"
        ]
      },
      {
        id: 3,
        title: "E-Learning Platform UX Enhancement",
        category: "web",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
        description: "Enhanced user experience for online education platform serving 100k+ students worldwide.",
        challenge: "Students reported difficulty finding relevant courses, tracking progress, and engaging with course materials. High dropout rates and low course completion.",
        solution: "Designed personalized learning dashboard, implemented smart course recommendations, created interactive progress tracking, and designed gamification elements to increase engagement.",
        results: "Course completion rates increased from 23% to 61%, student engagement up 180%, average session duration increased by 90%, and user retention improved by 75%.",
        timeline: "5 months",
        role: "Lead UI/UX Designer",
        images: [
          "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
        ]
      },
      {
        id: 4,
        title: "Restaurant Management Dashboard",
        category: "web",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
        description: "Designed comprehensive dashboard for restaurant chain to manage orders, inventory, and staff across multiple locations.",
        challenge: "Restaurant managers struggled with outdated software, limited real-time insights, and complex reporting systems.",
        solution: "Created intuitive dashboard with real-time analytics, simplified order management interface, mobile-first design for on-the-go access, and customizable widgets.",
        results: "Order processing time reduced by 40%, inventory waste decreased by 30%, manager satisfaction score of 4.8/5, adopted by 150+ restaurants.",
        timeline: "4 months",
        role: "Senior Product Designer",
        images: [
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
        ]
      }
    ],
    experience: [
      {
        company: "DesignLab Inc",
        position: "Senior UI/UX Designer",
        duration: "2022 - Present",
        description: "Lead designer for enterprise SaaS products. Manage design system and mentor junior designers."
      },
      {
        company: "Creative Studio",
        position: "UI/UX Designer",
        duration: "2020 - 2022",
        description: "Designed user experiences for mobile apps and web platforms across various industries."
      },
      {
        company: "StartupHub",
        position: "Junior UX Designer",
        duration: "2019 - 2020",
        description: "Assisted in user research, wireframing, and prototyping for startup clients."
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "David Park",
        role: "Product Manager at FinTech Co",
        text: "Emma's design thinking and user-centered approach transformed our product. Her attention to detail and ability to balance user needs with business goals is exceptional.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 2,
        name: "Lisa Chen",
        role: "CEO at Healthcare Innovations",
        text: "Working with Emma was a game-changer. She didn't just make our product look good – she made it work better for our users. The results speak for themselves.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
      }
    ],
    footer: {
      companyName: "Emma Martinez Design Studio",
      tagline: "Crafting delightful user experiences",
      email: "emma.martinez@example.com",
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
      quickStats: {
        projects: "75+",
        experience: "6+ years",
        clients: "60+",
        satisfaction: "98%"
      },
      socialLinks: [
        { platform: "Behance", url: "https://behance.net/emmamartinez", icon: "Behance" },
        { platform: "Dribbble", url: "https://dribbble.com/emmamartinez", icon: "Dribbble" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/emmamartinez", icon: "Linkedin" }
      ],
      copyright: "© 2024 Emma Martinez. All rights reserved."
    }
  },
  'photographer': {
    profile: {
      name: "Marcus Rivera",
      title: "Professional Photographer & Visual Storyteller",
      specialty: "portrait",
      description: "Award-winning photographer with 8+ years of experience capturing authentic moments and creating compelling visual narratives. Specializing in portrait, wedding, commercial, and editorial photography. Featured in National Geographic, Vogue, and TIME Magazine.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=400&fit=crop",
      location: "Los Angeles, CA",
      email: "marcus.rivera@example.com",
      phone: "+1 (555) 345-6789",
      instagram: "https://instagram.com/marcusrivera",
      website: "https://marcusrivera.photography"
    },
    services: [
      {
        name: "Portrait Photography",
        description: "Professional headshots, personal branding, and portrait sessions",
        price: "Starting at $350"
      },
      {
        name: "Wedding Photography",
        description: "Full-day coverage with edited photos and online gallery",
        price: "Starting at $3,500"
      },
      {
        name: "Commercial Photography",
        description: "Product, lifestyle, and brand photography for businesses",
        price: "Starting at $500"
      },
      {
        name: "Event Photography",
        description: "Corporate events, parties, and special occasions",
        price: "Starting at $400/hour"
      }
    ],
    galleries: [
      {
        id: 1,
        title: "Corporate Portraits",
        description: "Professional headshots and corporate photography for executives and entrepreneurs",
        coverImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop",
        images: [
          { url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop", title: "Executive Portrait", caption: "CEO of Tech Company" },
          { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop", title: "Business Professional", caption: "Marketing Director" },
          { url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop", title: "Entrepreneur", caption: "Startup Founder" },
          { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop", title: "Professional Headshot", caption: "Financial Advisor" }
        ],
        count: 45
      },
      {
        id: 2,
        title: "Wedding Stories",
        description: "Capturing the magic and emotion of your special day",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
        images: [
          { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop", title: "The First Dance", caption: "Sarah & Michael" },
          { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop", title: "Ceremony Moments", caption: "Jessica & David" },
          { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop", title: "Golden Hour", caption: "Emma & James" },
          { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop", title: "Ring Exchange", caption: "Lisa & Robert" },
          { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=600&fit=crop", title: "Bridal Portrait", caption: "Amanda" }
        ],
        count: 120
      },
      {
        id: 3,
        title: "Urban Lifestyle",
        description: "Street photography and urban exploration",
        coverImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
        images: [
          { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop", title: "City Vibes", caption: "Downtown LA" },
          { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=600&fit=crop", title: "Street Style", caption: "Fashion District" },
          { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop", title: "Urban Explorer", caption: "Arts District" }
        ],
        count: 78
      },
      {
        id: 4,
        title: "Product & Commercial",
        description: "High-quality product photography for brands and e-commerce",
        coverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
        images: [
          { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop", title: "Luxury Watch", caption: "Product Shot" },
          { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop", title: "Sunglasses Collection", caption: "E-commerce Photography" },
          { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop", title: "Sneaker Campaign", caption: "Commercial Work" },
          { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop", title: "Audio Equipment", caption: "Tech Product" }
        ],
        count: 92
      },
      {
        id: 5,
        title: "Nature & Landscape",
        description: "Breathtaking landscapes and nature photography",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        images: [
          { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", title: "Mountain Majesty", caption: "Swiss Alps" },
          { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop", title: "Forest Path", caption: "Pacific Northwest" },
          { url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop", title: "Sunset Horizon", caption: "California Coast" }
        ],
        count: 65
      },
      {
        id: 6,
        title: "Editorial Fashion",
        description: "High-fashion editorial and model portfolio shoots",
        coverImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=400&fit=crop",
        images: [
          { url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop", title: "Fashion Editorial", caption: "Vogue Feature" },
          { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop", title: "Model Portfolio", caption: "Studio Session" }
        ],
        count: 54
      }
    ],
    awards: [
      "National Geographic Photo of the Year - Finalist (2024)",
      "International Photography Awards - Gold Medal (2023)",
      "Sony World Photography Awards - Winner (2022)",
      "Wedding Photographer of the Year - Regional Winner (2023)"
    ],
    clients: [
      "Nike", "Apple", "Vogue Magazine", "TIME", "National Geographic", "Airbnb", "Tesla", "Google"
    ],
    testimonials: [
      {
        id: 1,
        name: "Jennifer Smith",
        role: "Bride",
        text: "Marcus captured our wedding day perfectly! Every photo tells a story and brings back beautiful memories. His professionalism and artistic eye are unmatched.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face",
        rating: 5
      },
      {
        id: 2,
        name: "Tom Chen",
        role: "CEO, Tech Startup",
        text: "The corporate headshots Marcus took elevated our entire brand image. He made everyone feel comfortable and the results were outstanding.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 5
      },
      {
        id: 3,
        name: "Amanda Rodriguez",
        role: "Marketing Director",
        text: "We hired Marcus for our product launch and the photos were absolutely stunning. His attention to detail and creative vision exceeded all expectations.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        rating: 5
      }
    ],
    footer: {
      companyName: "Marcus Rivera Photography",
      tagline: "Capturing moments, creating memories",
      email: "marcus.rivera@example.com",
      phone: "+1 (555) 345-6789",
      location: "Los Angeles, CA",
      quickStats: {
        shoots: "500+",
        experience: "8+ years",
        clients: "200+",
        awards: "15+"
      },
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com/marcusrivera", icon: "Instagram" },
        { platform: "Facebook", url: "https://facebook.com/marcusrivera", icon: "Facebook" },
        { platform: "Website", url: "https://marcusrivera.photography", icon: "Globe" }
      ],
      copyright: "© 2024 Marcus Rivera Photography. All rights reserved."
    }
  },
  'video-editor': {
    profile: {
      name: "Jordan Blake",
      title: "Video Editor & Motion Designer",
      description: "Creative video editor and motion designer with 7+ years of experience crafting compelling visual stories. Specialized in commercial advertising, music videos, documentaries, and social media content. Expert in color grading, motion graphics, and visual effects.",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&h=400&fit=crop",
      location: "Los Angeles, CA",
      email: "jordan.blake@example.com",
      phone: "+1 (555) 456-7890",
      vimeo: "https://vimeo.com/jordanblake",
      youtube: "https://youtube.com/@jordanblake",
      instagram: "https://instagram.com/jordanblake"
    },
    skills: {
      editing: ["Video Editing", "Color Grading", "Sound Design", "Motion Graphics", "VFX", "3D Animation", "Storytelling"],
      software: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro", "Cinema 4D", "Blender", "Audition"],
      specialties: ["Commercial Ads", "Music Videos", "Documentary", "Social Media Content", "Corporate Videos", "Event Coverage"]
    },
    portfolio: [
      {
        id: 1,
        title: "Nike Brand Campaign",
        type: "Commercial",
        thumbnail: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=400&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "0:60",
        description: "High-energy commercial showcasing Nike's latest athletic wear collection. Features dynamic action shots, smooth transitions, and inspiring storytelling.",
        client: "Nike",
        role: "Lead Editor & Colorist",
        year: "2024",
        views: "2.3M"
      },
      {
        id: 2,
        title: "Indie Artist Music Video",
        type: "Music Video",
        thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "3:45",
        description: "Cinematic music video with creative visual effects, color grading, and narrative storytelling. Shot on RED camera with professional lighting.",
        client: "Independent Artist",
        role: "Editor & VFX Artist",
        year: "2024",
        views: "850K"
      },
      {
        id: 3,
        title: "Tech Product Launch",
        type: "Corporate",
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "2:15",
        description: "Sleek product showcase video for major tech launch. Features 3D animations, motion graphics, and professional voiceover.",
        client: "Apple",
        role: "Senior Video Editor",
        year: "2024",
        views: "5.1M"
      },
      {
        id: 4,
        title: "Environmental Documentary",
        type: "Documentary",
        thumbnail: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=400&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "28:30",
        description: "Award-winning short documentary on ocean conservation. Features aerial cinematography, interviews, and powerful storytelling.",
        client: "National Geographic",
        role: "Editor & Post-Production Supervisor",
        year: "2023",
        views: "1.7M"
      },
      {
        id: 5,
        title: "Social Media Campaign",
        type: "Social Media",
        thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "0:15",
        description: "Fast-paced vertical video optimized for Instagram and TikTok. Trendy transitions, text animations, and brand integration.",
        client: "Fashion Brand",
        role: "Content Creator & Editor",
        year: "2024",
        views: "3.2M"
      },
      {
        id: 6,
        title: "Wedding Highlight Film",
        type: "Event",
        thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "5:20",
        description: "Emotional wedding highlight reel with cinematic color grading, drone footage, and carefully selected music.",
        client: "Private Client",
        role: "Video Editor & Colorist",
        year: "2024",
        views: "125K"
      },
      {
        id: 7,
        title: "Travel Vlog Series",
        type: "Content Series",
        thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "12:45",
        description: "Multi-episode travel series featuring exotic locations, adventure activities, and cultural experiences.",
        client: "Travel Channel",
        role: "Lead Editor",
        year: "2023",
        views: "4.5M"
      },
      {
        id: 8,
        title: "Automotive Commercial",
        type: "Commercial",
        thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "0:45",
        description: "Luxury car commercial with dramatic lighting, slow-motion shots, and premium production value.",
        client: "Mercedes-Benz",
        role: "Editor & Motion Graphics Designer",
        year: "2024",
        views: "6.8M"
      }
    ],
    experience: [
      {
        company: "Premium Productions",
        position: "Senior Video Editor",
        duration: "2022 - Present",
        description: "Lead editor for high-profile commercial and branded content. Manage post-production workflow and mentor junior editors."
      },
      {
        company: "Creative Studio LA",
        position: "Video Editor",
        duration: "2020 - 2022",
        description: "Edited music videos, commercials, and digital content for various clients. Specialized in color grading and motion graphics."
      },
      {
        company: "Digital Media Agency",
        position: "Junior Editor",
        duration: "2018 - 2020",
        description: "Assisted in video production and post-production. Created social media content and learned advanced editing techniques."
      }
    ],
    awards: [
      "Vimeo Staff Pick - Best Editing (2024)",
      "Webby Award - Video Production (2023)",
      "AICP Award - Post-Production (2023)",
      "Tribeca Film Festival - Best Short Documentary (2023)"
    ],
    clients: [
      "Nike", "Apple", "Mercedes-Benz", "National Geographic", "Netflix", "Spotify", "Red Bull", "Coca-Cola"
    ],
    testimonials: [
      {
        id: 1,
        name: "Rachel Green",
        role: "Creative Director at Ad Agency",
        text: "Jordan's editing skills are phenomenal. They have an incredible ability to find the story in raw footage and bring it to life with perfect pacing and style.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 2,
        name: "Marcus Johnson",
        role: "Music Artist",
        text: "Best video editor I've ever worked with! Jordan understood my vision and created something even better than I imagined. The music video helped my song go viral.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      }
    ],
    footer: {
      companyName: "Jordan Blake Productions",
      tagline: "Bringing stories to life through video",
      email: "jordan.blake@example.com",
      phone: "+1 (555) 456-7890",
      location: "Los Angeles, CA",
      quickStats: {
        videos: "200+",
        experience: "7+ years",
        clients: "150+",
        views: "50M+"
      },
      socialLinks: [
        { platform: "Vimeo", url: "https://vimeo.com/jordanblake", icon: "Video" },
        { platform: "YouTube", url: "https://youtube.com/@jordanblake", icon: "Youtube" },
        { platform: "Instagram", url: "https://instagram.com/jordanblake", icon: "Instagram" }
      ],
      copyright: "© 2024 Jordan Blake Productions. All rights reserved."
    }
  },
  'general-portfolio': {
    profile: {
      name: "Taylor Anderson",
      title: "Creative Professional & Digital Innovator",
      description: "Multi-disciplinary creative professional with expertise in design, development, and content creation. Combining technical skills with artistic vision to deliver innovative digital solutions. Passionate about pushing boundaries and creating meaningful experiences.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
      location: "Seattle, WA",
      email: "taylor.anderson@example.com",
      phone: "+1 (555) 567-8901",
      website: "https://tayloranderson.com",
      linkedin: "https://linkedin.com/in/tayloranderson",
      twitter: "https://twitter.com/tayloranderson"
    },
    skills: [
      "Graphic Design",
      "Web Development",
      "UI/UX Design",
      "Branding",
      "Photography",
      "Video Editing",
      "Content Writing",
      "Social Media Strategy",
      "Project Management",
      "Creative Direction"
    ],
    services: [
      {
        title: "Brand Identity Design",
        description: "Complete brand identity packages including logo design, color schemes, typography, and brand guidelines.",
        icon: "🎨"
      },
      {
        title: "Web Design & Development",
        description: "Custom website design and development using modern technologies and best practices.",
        icon: "💻"
      },
      {
        title: "Content Creation",
        description: "High-quality content including copywriting, photography, and video production.",
        icon: "📸"
      },
      {
        title: "Digital Marketing",
        description: "Strategic digital marketing campaigns across social media, email, and content platforms.",
        icon: "📱"
      }
    ],
    projects: [
      {
        id: 1,
        title: "Eco-Friendly Brand Launch",
        category: "Branding",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
        description: "Complete brand identity and website for sustainable lifestyle brand. Includes logo design, packaging, and digital marketing strategy.",
        tags: ["Branding", "Web Design", "Marketing"]
      },
      {
        id: 2,
        title: "Modern Architecture Portfolio",
        category: "Web Design",
        image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop",
        description: "Clean, minimalist portfolio website for architecture firm showcasing their projects with stunning photography.",
        tags: ["Web Development", "Photography", "UI Design"]
      },
      {
        id: 3,
        title: "Restaurant Rebrand",
        category: "Branding",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
        description: "Full restaurant rebrand including new logo, menu design, signage, and social media presence.",
        tags: ["Branding", "Graphic Design", "Marketing"]
      },
      {
        id: 4,
        title: "Fitness App Concept",
        category: "UI/UX Design",
        image: "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&h=400&fit=crop",
        description: "Mobile app design concept for fitness tracking with gamification elements and social features.",
        tags: ["UI Design", "UX Design", "Mobile"]
      },
      {
        id: 5,
        title: "Product Photography Series",
        category: "Photography",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
        description: "Professional product photography for e-commerce brand featuring creative lighting and styling.",
        tags: ["Photography", "Commercial", "Product"]
      },
      {
        id: 6,
        title: "Tech Startup Website",
        category: "Web Development",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        description: "Dynamic landing page for SaaS startup with animations, interactive elements, and conversion optimization.",
        tags: ["Web Development", "UI Design", "React"]
      }
    ],
    experience: [
      {
        title: "Creative Director",
        company: "Digital Agency",
        duration: "2022 - Present",
        description: "Lead creative strategy and execution for diverse client projects. Manage creative team and oversee brand development."
      },
      {
        title: "Senior Designer",
        company: "Design Studio",
        duration: "2020 - 2022",
        description: "Designed digital products and brand identities for startups and established businesses."
      },
      {
        title: "Freelance Creative",
        company: "Self-Employed",
        duration: "2018 - 2020",
        description: "Provided design, development, and content creation services to various clients across industries."
      }
    ],
    education: [
      {
        degree: "B.A. Visual Communication Design",
        school: "Art Institute",
        year: "2018"
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Sarah Mitchell",
        role: "CEO, EcoLife Brand",
        text: "Taylor's creative vision and execution exceeded all expectations. They truly understood our brand values and brought them to life beautifully.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 2,
        name: "James Peterson",
        role: "Restaurant Owner",
        text: "The rebrand Taylor created has completely transformed our business. Customer engagement is up 200% and we've never looked better!",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      }
    ],
    footer: {
      companyName: "Taylor Anderson Creative",
      tagline: "Transforming ideas into digital reality",
      email: "taylor.anderson@example.com",
      phone: "+1 (555) 567-8901",
      location: "Seattle, WA",
      quickStats: {
        projects: "100+",
        experience: "6+ years",
        clients: "80+",
        satisfaction: "99%"
      },
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com/in/tayloranderson", icon: "Linkedin" },
        { platform: "Twitter", url: "https://twitter.com/tayloranderson", icon: "Twitter" },
        { platform: "Website", url: "https://tayloranderson.com", icon: "Globe" }
      ],
      copyright: "© 2024 Taylor Anderson. All rights reserved."
    }
  }
}

function TemplatePreview() {
  const { templateType } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const data = sampleData[templateType] || sampleData['general-portfolio']
  const profile = data.profile

  const handleUseTemplate = () => {
    if (!isAuthenticated) {
      // Store intended destination and redirect to auth
      localStorage.setItem('redirectAfterAuth', `/editor/${templateType}`)
      navigate('/auth')
    } else {
      // Navigate to editor
      navigate(`/editor/${templateType}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/#templates')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Templates</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>Preview Mode</span>
              </div>
              <button
                onClick={handleUseTemplate}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <span>{isAuthenticated ? 'Use This Template' : 'Sign In to Use Template'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Template Preview Content */}
      <div className="max-w-7xl mx-auto">
        {/* Banner Section */}
        <div className="relative h-80 bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600">
          <img
            src={profile.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
              />
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-2xl mb-4">{profile.title}</p>
              {profile.location && (
                <p className="text-lg">{profile.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-8 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{profile.description}</p>
            
            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Love this template?
                  </h3>
                  <p className="text-gray-600">
                    {isAuthenticated 
                      ? 'Start customizing it with your own content now!' 
                      : 'Sign in or create an account to start customizing this template with your content!'}
                  </p>
                </div>
                <button
                  onClick={handleUseTemplate}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap"
                >
                  {isAuthenticated ? 'Start Editing' : 'Get Started'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tech Stack / Portfolio Section */}
        {data.techStack && (
          <div className="bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tech Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(data.techStack).map(([category, techs]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech, idx) => (
                        <span key={idx} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Section for UI/UX and Video Editor */}
        {data.skills && !Array.isArray(data.skills) && (
          <div className="bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skills & Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(data.skills).map(([category, items]) => (
                  <div key={category} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{category}</h3>
                    <ul className="space-y-2">
                      {items.map((item, idx) => (
                        <li key={idx} className="text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Section for General Portfolio (array) */}
        {data.skills && Array.isArray(data.skills) && (
          <div className="bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skills</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="px-6 py-3 bg-white text-gray-800 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {data.experience && (
          <div className="bg-white p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Work Experience</h2>
              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-purple-600 pl-6 py-4">
                    <h3 className="text-xl font-bold text-gray-900">{exp.position || exp.title}</h3>
                    <div className="text-purple-600 font-medium mb-2">{exp.company} • {exp.duration}</div>
                    <p className="text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {data.projects && (
          <div className="bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.projects.map((project) => (
                  <div key={project.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      {project.category && (
                        <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {project.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 mt-3">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.tags && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.highlights && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {project.highlights.map((highlight, idx) => (
                            <div key={idx} className="text-sm text-gray-600 flex items-center mb-1">
                              <span className="text-purple-600 mr-2">✓</span>
                              {highlight}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Case Studies Section */}
        {data.caseStudies && (
          <div className="bg-white p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Case Studies</h2>
              <div className="grid grid-cols-1 gap-12">
                {data.caseStudies.map((study) => (
                  <div key={study.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                    <img src={study.image} alt={study.title} className="w-full h-80 object-cover" />
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        {study.category && (
                          <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {study.category}
                          </span>
                        )}
                        {study.timeline && (
                          <span className="text-gray-600 text-sm">Timeline: {study.timeline}</span>
                        )}
                        {study.role && (
                          <span className="text-gray-600 text-sm">Role: {study.role}</span>
                        )}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{study.title}</h3>
                      <p className="text-lg text-gray-600 mb-6">{study.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                            <span className="text-2xl mr-2">🎯</span> Challenge
                          </h4>
                          <p className="text-gray-700">{study.challenge}</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                            <span className="text-2xl mr-2">💡</span> Solution
                          </h4>
                          <p className="text-gray-700">{study.solution}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                            <span className="text-2xl mr-2">📈</span> Results
                          </h4>
                          <p className="text-gray-700">{study.results}</p>
                        </div>
                      </div>

                      {study.images && study.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          {study.images.slice(0, 3).map((img, idx) => (
                            <img key={idx} src={img} alt={`${study.title} ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Galleries Section */}
        {data.galleries && (
          <div className="bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Photo Galleries</h2>
              <p className="text-gray-600 text-center mb-8">Browse my curated collections</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.galleries.map((gallery) => (
                  <div key={gallery.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <div className="relative overflow-hidden">
                      <img 
                        src={gallery.coverImage} 
                        alt={gallery.title} 
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                      {gallery.count && (
                        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {gallery.count} photos
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{gallery.title}</h3>
                      {gallery.description && (
                        <p className="text-gray-600 text-sm">{gallery.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video Portfolio Section */}
        {data.portfolio && (
          <div className="bg-white p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Video Portfolio</h2>
              <p className="text-gray-600 text-center mb-8">Selected works from recent projects</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.portfolio.map((video) => (
                  <div key={video.id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative group cursor-pointer">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                      {video.type && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {video.type}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        {video.client && <span className="font-medium">{video.client}</span>}
                        {video.views && <span>{video.views} views</span>}
                      </div>
                      {video.year && (
                        <div className="mt-2 text-xs text-gray-500">{video.year}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Services Section */}
        {data.services && (
          <div className="bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.services.map((service, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-200">
                    {service.icon && (
                      <div className="text-4xl mb-4">{service.icon}</div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name || service.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    {service.price && (
                      <p className="text-purple-600 font-semibold">{service.price}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education Section */}
        {data.education && (
          <div className="bg-white p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-600">
                    <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                    <div className="text-purple-600 font-medium">{edu.school}</div>
                    <div className="text-gray-600">{edu.year}</div>
                    {edu.honors && (
                      <div className="mt-2 text-sm text-gray-700 italic">{edu.honors}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {data.certifications && (
          <div className="bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-gray-200">
                    <span className="text-2xl mr-4">🏆</span>
                    <span className="text-gray-800 font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Awards Section */}
        {data.awards && (
          <div className="bg-white p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Awards & Recognition</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.awards.map((award, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-lg flex items-center border border-purple-200">
                    <span className="text-3xl mr-4">🏆</span>
                    <span className="text-gray-800 font-medium">{award}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clients Section */}
        {data.clients && (
          <div className="bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Trusted By</h2>
              <p className="text-gray-600 text-center mb-8">Brands I've had the pleasure of working with</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {data.clients.map((client, idx) => (
                  <div key={idx} className="bg-white px-8 py-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <span className="text-gray-700 font-semibold text-lg">{client}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {data.testimonials && (
          <div className="bg-white p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Client Testimonials</h2>
              <p className="text-gray-600 text-center mb-8">What people say about working with me</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl shadow-md border border-purple-100">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-16 h-16 rounded-full mr-4 border-2 border-purple-300"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                        <div className="text-purple-600 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                    {testimonial.rating && (
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">★</span>
                        ))}
                      </div>
                    )}
                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Final CTA Section */}
        <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Portfolio?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {isAuthenticated 
              ? 'Click below to start customizing this template with your own content!' 
              : 'Sign in or create a free account to start building your professional portfolio today!'}
          </p>
          <button
            onClick={handleUseTemplate}
            className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            {isAuthenticated ? 'Start Editing This Template' : 'Get Started - It\'s Free'}
          </button>
        </div>

        {/* Template Footer (Editable by User) */}
        {data.footer && (
          <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 px-6">
            <div className="max-w-6xl mx-auto">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{data.footer.companyName}</h3>
                  <p className="text-gray-400 mb-4 text-xs leading-relaxed">{data.footer.tagline}</p>
                  <div className="space-y-2">
                    {data.footer.email && (
                      <a href={`mailto:${data.footer.email}`} className="flex items-center text-gray-300 hover:text-purple-400 transition-colors group">
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-2 group-hover:bg-purple-600 transition-all">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                          </svg>
                        </div>
                        <span className="text-xs">{data.footer.email}</span>
                      </a>
                    )}
                    {data.footer.phone && (
                      <a href={`tel:${data.footer.phone}`} className="flex items-center text-gray-300 hover:text-purple-400 transition-colors group">
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-2 group-hover:bg-purple-600 transition-all">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                          </svg>
                        </div>
                        <span className="text-xs">{data.footer.phone}</span>
                      </a>
                    )}
                    {data.footer.location && (
                      <div className="flex items-center text-gray-300">
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <span className="text-xs">{data.footer.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h4 className="text-base font-bold mb-3 text-purple-400">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(data.footer.quickStats).map(([key, value]) => (
                      <div key={key} className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-700 hover:border-purple-500 transition-all">
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-0.5">{value}</div>
                        <div className="text-[10px] text-gray-400 capitalize font-medium">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-base font-bold mb-3 text-purple-400">Quick Links</h4>
                  <div className="space-y-2">
                    {data.footer.socialLinks.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-white transition-all group"
                      >
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all">
                          <span className="text-sm transform group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                        <span className="text-sm font-medium">{link.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-800 pt-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                  <p className="text-gray-400 text-xs">{data.footer.copyright}</p>
                  <p className="text-gray-500 text-[10px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                    Built with Portiqqo • All content is customizable
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}

export default TemplatePreview
