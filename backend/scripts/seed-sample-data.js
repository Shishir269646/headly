require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Content = require('../models/Content.model');

const sampleUsers = [
    {
        name: 'John Editor',
        email: 'editor@headly.app',
        password: 'editor123456',
        role: 'editor',
        bio: 'Content Editor'
    },
    {
        name: 'Jane Author',
        email: 'author@headly.app',
        password: 'author123456',
        role: 'author',
        bio: 'Content Writer'
    },
    {
        name: 'Bob Viewer',
        email: 'viewer@headly.app',
        password: 'viewer123456',
        role: 'viewer',
        bio: 'Content Viewer'
    }
];

const sampleContents = [
    {
        title: 'Getting Started with Headly CMS',
        excerpt: 'Learn how to use Headly CMS for your next project',
        body: 'Headly is a modern headless CMS built with Node.js and MongoDB...',
        status: 'published',
        categories: ['Tutorial', 'Getting Started'],
        tags: ['headless-cms', 'nodejs', 'mongodb'],
        seo: {
            metaTitle: 'Getting Started with Headly CMS',
            metaDescription: 'Complete guide to getting started with Headly CMS'
        }
    },
    {
        title: 'Building RESTful APIs with Express',
        excerpt: 'A comprehensive guide to building RESTful APIs',
        body: 'Express.js is a minimal and flexible Node.js web application framework...',
        status: 'published',
        categories: ['Development', 'Backend'],
        tags: ['express', 'rest-api', 'nodejs'],
        seo: {
            metaTitle: 'Building RESTful APIs with Express',
            metaDescription: 'Learn how to build scalable RESTful APIs with Express.js'
        }
    },
    {
        title: 'MongoDB Best Practices',
        excerpt: 'Essential MongoDB best practices for production',
        body: 'MongoDB is a popular NoSQL database. Here are some best practices...',
        status: 'draft',
        categories: ['Database', 'Best Practices'],
        tags: ['mongodb', 'database', 'nosql']
    }
];

const seedSampleData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({ role: { $ne: 'admin' } });
        await Content.deleteMany({});
        console.log('🗑️  Cleared existing sample data');

        // Create users
        const createdUsers = await User.create(sampleUsers);
        console.log(`✅ Created ${createdUsers.length} sample users`);

        // Create contents
        const authorUser = createdUsers.find(u => u.role === 'author');
        const contentsWithAuthor = sampleContents.map(content => ({
            ...content,
            author: authorUser._id
        }));

        const createdContents = await Content.create(contentsWithAuthor);
        console.log(`✅ Created ${createdContents.length} sample contents`);

        console.log('\n📋 Sample User Credentials:');
        sampleUsers.forEach(user => {
            console.log(`   ${user.role}: ${user.email} / ${user.password}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding sample data:', error.message);
        process.exit(1);
    }
};

module.exports = seedSampleData;
