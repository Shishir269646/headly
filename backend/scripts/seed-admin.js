require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model'); // Adjust path if needed
const adminUser = require('./data/admin-data');

const seedAdmin = async () => {
    try {
        // Check if an admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:', existingAdmin.email);
            return;
        }

        // Ensure required fields for your User model
        const adminPayload = {
            name: adminUser.name || "Super Admin",
            email: adminUser.email || "admin@example.com",
            password: adminUser.password || "Admin@123",
            role: "admin",
            bio: adminUser.bio || "Default system administrator",
            isActive: true,
            googleId: null,
            githubId: null,
            linkedinId: null,
            image: null,
        };

        // Create admin user (password will be hashed by schema)
        const admin = await User.create(adminPayload);

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password:', adminPayload.password);
        console.log('⚠️  IMPORTANT: Change this password immediately after first login!');
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        throw error;
    }
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB');

        await seedAdmin();

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

module.exports = seedAdmin;
