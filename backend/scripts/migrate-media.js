require('dotenv').config();
const mongoose = require('mongoose');
const Media = require('../src/models/Media.model');
const cloudinary = require('../src/config/cloudinary');

const migrateMediaToCloudinary = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find all media without cloudinaryId
        const mediaToMigrate = await Media.find({
            cloudinaryId: { $exists: false }
        });

        console.log(`📦 Found ${mediaToMigrate.length} media files to migrate`);

        let migrated = 0;
        let failed = 0;

        for (const media of mediaToMigrate) {
            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(media.url, {
                    folder: `headly/${media.folder || 'general'}`,
                    public_id: media.filename,
                    resource_type: 'auto'
                });

                // Update media record
                media.cloudinaryId = result.public_id;
                media.url = result.secure_url;
                media.thumbnailUrl = result.secure_url;
                await media.save();

                migrated++;
                console.log(`✅ Migrated: ${media.originalName}`);
            } catch (error) {
                failed++;
                console.error(`❌ Failed to migrate ${media.originalName}:`, error.message);
            }
        }

        console.log(`\n✅ Migration completed!`);
        console.log(`   Migrated: ${migrated}`);
        console.log(`   Failed: ${failed}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        process.exit(1);
    }
};

migrateMediaToCloudinary();