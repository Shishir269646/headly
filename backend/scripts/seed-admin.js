require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');

const seedAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Manjirul Islam',
            email: 'admin@headly.app',
            password: 'admin123456', // Change this password immediately!
            role: 'admin',
            bio: 'System Administrator',
            isActive: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: admin123456');
        console.log('⚠️  IMPORTANT: Change this password immediately after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

module.exports = seedAdmin;