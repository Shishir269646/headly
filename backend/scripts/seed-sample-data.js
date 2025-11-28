require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Content = require('../models/Content.model');
const Category = require('../models/Category.model');
const { sampleUsers, sampleCategories, sampleContents } = require('./data/sample-data');

const seedSampleData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({ role: { $ne: 'admin' } });
        await Content.deleteMany({});
        await Category.deleteMany({});
        console.log('🗑️  Cleared existing sample data');

        // Create users
        const createdUsers = await User.create(sampleUsers);
        console.log(`✅ Created ${createdUsers.length} sample users`);

        // Create categories
        const createdCategories = await Category.create(sampleCategories);
        console.log(`✅ Created ${createdCategories.length} sample categories`);

        // Create contents
        const authorUser = createdUsers.find(u => u.role === 'author');
        const defaultCategory = createdCategories[0];

        const contentsWithAuthorAndCategory = sampleContents.map(content => ({
            ...content,
            author: authorUser._id,
            category: defaultCategory._id
        }));

        const createdContents = await Content.create(contentsWithAuthorAndCategory);
        console.log(`✅ Created ${createdContents.length} sample contents`);

        console.log('\n📋 Sample User Credentials:');
        sampleUsers.forEach(user => {
            console.log(`   ${user.role}: ${user.email} / ${user.password}`);
        });
    } catch (error) {
        console.error('❌ Error seeding sample data:', error.message);
        throw error;
    }
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await seedSampleData();

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    run();
}

module.exports = seedSampleData;
