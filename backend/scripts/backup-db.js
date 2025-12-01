require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupDatabase = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const mongoUri = process.env.MONGO_URI;
    const dbName = mongoUri.split('/').pop().split('?')[0];

    console.log(`Starting database backup...`);
    console.log(`Database: ${dbName}`);

    const command = `mongodump --uri="${mongoUri}" --out="${backupPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Backup failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Warning: ${stderr}`);
        }

        console.log(`Backup completed successfully!`);
        console.log(`Backup location: ${backupPath}`);
    });
};

backupDatabase();