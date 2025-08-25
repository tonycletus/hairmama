/**
 * Environment Variable Validator
 * Centralized validation for all environment variables used in the application
 */

interface EnvironmentConfig {
  required: {
    [key: string]: string;
  };
  optional: {
    [key: string]: string;
  };
}

const ENV_CONFIG: EnvironmentConfig = {
  required: {
    VITE_SUPABASE_URL: 'Supabase project URL',
    VITE_SUPABASE_ANON_KEY: 'Supabase anonymous key',
    VITE_OPENROUTER_API_KEY: 'OpenRouter API key for AI analysis'
  },
  optional: {
    VITE_USDA_API_KEY: 'USDA FoodData Central API key',
    VITE_OPENAI_API_KEY: 'OpenAI API key for enhanced ingredient analysis',
    VITE_GEMINI_API_KEY: 'Google Gemini API key for enhanced ingredient analysis',
    VITE_HUGGINGFACE_API_KEY: 'Hugging Face API key for enhanced ingredient analysis'
  }
};

/**
 * Validates all environment variables and returns validation results
 */
export const validateEnvironment = () => {
  const results = {
    valid: true,
    missing: [] as string[],
    warnings: [] as string[],
    available: [] as string[]
  };

  // Check required variables
  for (const [key, description] of Object.entries(ENV_CONFIG.required)) {
    const value = import.meta.env[key];
    if (!value) {
      results.valid = false;
      results.missing.push(`${key} (${description})`);
    } else {
      results.available.push(`${key} (${description})`);
    }
  }

  // Check optional variables
  for (const [key, description] of Object.entries(ENV_CONFIG.optional)) {
    const value = import.meta.env[key];
    if (!value) {
      results.warnings.push(`${key} (${description}) - Optional, will disable related features`);
    } else {
      results.available.push(`${key} (${description})`);
    }
  }

  return results;
};

/**
 * Throws an error if required environment variables are missing
 */
export const validateRequiredEnvironment = () => {
  const validation = validateEnvironment();
  
  if (!validation.valid) {
    const missingList = validation.missing.join('\n  - ');
    throw new Error(
      `Missing required environment variables:\n  - ${missingList}\n\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }
};

/**
 * Logs environment validation results to console
 */
export const logEnvironmentStatus = () => {
  const validation = validateEnvironment();
  
  // Environment validation completed silently in production
  if (import.meta.env.DEV) {
    console.group('🔧 Environment Variables Status');
    
    if (validation.available.length > 0) {
      console.log('✅ Available:', validation.available.length);
      validation.available.forEach(env => console.log(`  ✓ ${env}`));
    }
    
    if (validation.missing.length > 0) {
      console.error('❌ Missing Required:', validation.missing.length);
      validation.missing.forEach(env => console.error(`  ✗ ${env}`));
    }
    
    if (validation.warnings.length > 0) {
      console.warn('⚠️ Optional (Missing):', validation.warnings.length);
      validation.warnings.forEach(env => console.warn(`  ? ${env}`));
    }
    
    console.groupEnd();
  }
  
  return validation;
};

/**
 * Get environment variable with validation
 */
export const getEnvVar = (key: string, required: boolean = false): string | undefined => {
  const value = import.meta.env[key];
  
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
};

/**
 * Check if a specific environment variable is available
 */
export const hasEnvVar = (key: string): boolean => {
  return !!import.meta.env[key];
};

// Auto-validate on import in development
if (import.meta.env.DEV) {
  logEnvironmentStatus();
}
