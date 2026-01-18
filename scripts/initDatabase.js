#!/usr/bin/env node

/**
 * MongoDB Initialization Script
 * This script sets up the initial database structure and default data
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-builder';
const DB_NAME = process.env.DB_NAME || 'portfolio-builder';

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Create collections with indexes
    await createCollections(db);
    
    // Insert default data
    await insertDefaultData(db);

    console.log('✅ Database initialization completed');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

async function createCollections(db) {
  // Create users collection with indexes
  await db.createCollection('users');
  await db.collection('users').createIndexes([
    { key: { email: 1 }, unique: true },
    { key: { emailVerificationToken: 1 } },
    { key: { otpCode: 1 } },
    { key: { 'subscription.stripeCustomerId': 1 } },
    { key: { createdAt: 1 } },
    { key: { lastLogin: 1 } }
  ]);

  // Create portfolios collection with indexes
  await db.createCollection('portfolios');
  await db.collection('portfolios').createIndexes([
    { key: { user: 1 } },
    { key: { subdomain: 1 }, unique: true },
    { key: { profession: 1 } },
    { key: { isPublished: 1, isActive: 1 } },
    { key: { views: -1 } },
    { key: { createdAt: 1 } },
    { key: { updatedAt: 1 } }
  ]);

  // Create templates collection with indexes
  await db.createCollection('templates');
  await db.collection('templates').createIndexes([
    { key: { name: 1 }, unique: true },
    { key: { profession: 1 } },
    { key: { isActive: 1 } },
    { key: { isPremium: 1 } },
    { key: { usageCount: -1 } },
    { key: { 'rating.average': -1 } },
    { key: { tags: 1 } },
    { key: { createdAt: 1 } }
  ]);

  // Create subscriptions collection with indexes
  await db.createCollection('subscriptions');
  await db.collection('subscriptions').createIndexes([
    { key: { user: 1 }, unique: true },
    { key: { stripeCustomerId: 1 }, unique: true },
    { key: { stripeSubscriptionId: 1 }, unique: true, sparse: true },
    { key: { status: 1 } },
    { key: { currentPeriodEnd: 1 } },
    { key: { createdAt: 1 } }
  ]);

  console.log('✅ Collections and indexes created');
}

async function insertDefaultData(db) {
  // Insert default templates
  const defaultTemplates = [
    {
      name: 'minimalist-dev',
      displayName: 'Minimalist Developer',
      description: 'Clean and minimal template perfect for developers who prefer simplicity',
      profession: 'developer',
      preview: {
        desktop: 'https://example.com/previews/minimalist-dev-desktop.jpg',
        mobile: 'https://example.com/previews/minimalist-dev-mobile.jpg'
      },
      isActive: true,
      isPremium: false,
      config: {
        sections: {
          hero: { enabled: true, required: true, customizable: true },
          about: { enabled: true, required: false, customizable: true },
          skills: { enabled: true, required: false, customizable: true },
          experience: { enabled: true, required: false, customizable: true },
          projects: { enabled: true, required: false, customizable: true },
          contact: { enabled: true, required: true, customizable: true }
        },
        layout: {
          type: 'single-page',
          navigation: 'top',
          scrollBehavior: 'smooth'
        },
        colorScheme: {
          primary: '#3B82F6',
          secondary: '#1F2937',
          accent: '#F59E0B'
        }
      },
      tags: ['minimal', 'clean', 'developer', 'portfolio'],
      metadata: {
        author: 'Portfolio Builder Team',
        version: '1.0.0',
        difficulty: 'beginner'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'creative-designer',
      displayName: 'Creative Designer',
      description: 'Bold and colorful template for creative professionals and designers',
      profession: 'ui-ux-designer',
      preview: {
        desktop: 'https://example.com/previews/creative-designer-desktop.jpg',
        mobile: 'https://example.com/previews/creative-designer-mobile.jpg'
      },
      isActive: true,
      isPremium: false,
      config: {
        sections: {
          hero: { enabled: true, required: true, customizable: true },
          about: { enabled: true, required: false, customizable: true },
          skills: { enabled: true, required: false, customizable: true },
          projects: { enabled: true, required: false, customizable: true },
          services: { enabled: true, required: false, customizable: true },
          testimonials: { enabled: true, required: false, customizable: true },
          contact: { enabled: true, required: true, customizable: true }
        },
        layout: {
          type: 'portfolio-grid',
          navigation: 'side',
          scrollBehavior: 'parallax'
        },
        colorScheme: {
          primary: '#8B5CF6',
          secondary: '#1F2937',
          accent: '#F59E0B'
        }
      },
      tags: ['creative', 'colorful', 'designer', 'portfolio'],
      metadata: {
        author: 'Portfolio Builder Team',
        version: '1.0.0',
        difficulty: 'intermediate'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'photographer-showcase',
      displayName: 'Photographer Showcase',
      description: 'Image-focused template designed specifically for photographers',
      profession: 'photographer',
      preview: {
        desktop: 'https://example.com/previews/photographer-desktop.jpg',
        mobile: 'https://example.com/previews/photographer-mobile.jpg'
      },
      isActive: true,
      isPremium: false,
      config: {
        sections: {
          hero: { enabled: true, required: true, customizable: true },
          about: { enabled: true, required: false, customizable: true },
          projects: { enabled: true, required: true, customizable: true },
          services: { enabled: true, required: false, customizable: true },
          contact: { enabled: true, required: true, customizable: true }
        },
        layout: {
          type: 'portfolio-grid',
          navigation: 'hamburger',
          scrollBehavior: 'smooth'
        },
        colorScheme: {
          primary: '#000000',
          secondary: '#FFFFFF',
          accent: '#F59E0B'
        }
      },
      tags: ['photography', 'gallery', 'showcase', 'visual'],
      metadata: {
        author: 'Portfolio Builder Team',
        version: '1.0.0',
        difficulty: 'beginner'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Check if templates already exist
  const existingTemplatesCount = await db.collection('templates').countDocuments();
  if (existingTemplatesCount === 0) {
    await db.collection('templates').insertMany(defaultTemplates);
    console.log('✅ Default templates inserted');
  } else {
    console.log('ℹ️ Templates already exist, skipping insertion');
  }

  // Create admin user if it doesn't exist
  const existingAdmin = await db.collection('users').findOne({ email: 'admin@portfoliobuilder.com' });
  if (!existingAdmin) {
    const adminUser = {
      email: 'admin@portfoliobuilder.com',
      firstName: 'Admin',
      lastName: 'User',
      isEmailVerified: true,
      role: 'admin',
      isActive: true,
      storageUsed: 0,
      storageLimit: 1099511627776, // 1TB for admin
      subscription: {
        type: 'premium',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        cancelAtPeriodEnd: false
      },
      lastLogin: new Date(),
      loginCount: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('users').insertOne(adminUser);
    console.log('✅ Admin user created');
    console.log('📧 Admin email: admin@portfoliobuilder.com');
  } else {
    console.log('ℹ️ Admin user already exists');
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };