import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');

// Read existing .env file or create new one
let envContent = '';
if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
}

// Add admin credentials if they don't exist
if (!envContent.includes('ADMIN_EMAIL')) {
    envContent += '\nADMIN_EMAIL=admin@forever.com\n';
}
if (!envContent.includes('ADMIN_PASSWORD')) {
    envContent += 'ADMIN_PASSWORD=qwerty123\n';
}

// Write back to .env file
fs.writeFileSync(envPath, envContent);

console.log('Admin credentials configured successfully!');
console.log('Admin Email: admin@forever.com');
console.log('Admin Password: qwerty123');
