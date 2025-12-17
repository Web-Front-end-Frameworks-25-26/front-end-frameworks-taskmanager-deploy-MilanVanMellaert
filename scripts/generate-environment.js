const fs = require('fs');
const path = require('path');

// Lees environment variables van Vercel
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// Check of variables aanwezig zijn
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL en SUPABASE_KEY environment variables zijn vereist!');
  process.exit(1);
}

// Maak environment file content
const environmentContent = `export const environment = {
  production: true,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

const developmentContent = `export const environment = {
  production: false,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

// Maak environments directory als die niet bestaat
const envDir = path.join(__dirname, '..', 'src', 'environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Schrijf files
fs.writeFileSync(
  path.join(envDir, 'environment.ts'),
  environmentContent
);

fs.writeFileSync(
  path.join(envDir, 'environment.development.ts'),
  developmentContent
);

console.log('✅ Environment files generated successfully!');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey.substring(0, 20) + '...');