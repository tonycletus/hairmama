#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Hairmama AI Environment Setup');
console.log('================================\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists!');
  console.log('📝 If you need to update your API keys, edit the .env file manually.\n');
} else {
  console.log('📝 Creating .env file...');
  
  const envContent = `# OpenRouter API Key for AI hair analysis
# Get your free API key from: https://openrouter.ai/keys
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase Configuration
# Get these from your Supabase project settings
VITE_SUPABASE_URL=https://lkcajltgxoovupudqzir.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Additional API Keys for enhanced features
# VITE_USDA_API_KEY=your_usda_api_key_here
# VITE_OPENAI_API_KEY=your_openai_api_key_here
# VITE_GEMINI_API_KEY=your_gemini_api_key_here
# VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please edit the .env file and replace the placeholder values with your actual API keys.\n');
}

console.log('🚀 Next steps:');
console.log('1. Get your free OpenRouter API key from: https://openrouter.ai/keys');
console.log('2. Get your Supabase credentials from your project settings');
console.log('3. Edit the .env file and replace the placeholders with your actual keys');
console.log('4. Restart your development server: npm run dev');
console.log('5. Test the AI analysis by uploading a hair photo!\n');

console.log('💡 Need help? Check SETUP.md for detailed instructions.');
