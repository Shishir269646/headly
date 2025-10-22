const crypto = require('crypto');

const generateSecrets = () => {
    console.log('🔐 Generated Secrets for .env file:\n');

    console.log('JWT_SECRET=' + crypto.randomBytes(64).toString('hex'));
    console.log('REFRESH_TOKEN_SECRET=' + crypto.randomBytes(64).toString('hex'));
    console.log('WEBHOOK_SECRET=' + crypto.randomBytes(32).toString('hex'));
    console.log('REVALIDATE_SECRET=' + crypto.randomBytes(32).toString('hex'));
    console.log('COOKIE_SECRET=' + crypto.randomBytes(32).toString('hex'));

    console.log('\n✅ Copy these secrets to your .env file');
    console.log('⚠️  Never commit these secrets to version control!');
};

generateSecrets();
