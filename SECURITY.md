# Security Guidelines

## Environment Variables & Secrets Management

### ⚠️ CRITICAL: Never commit secrets to version control

This project uses environment variables to manage sensitive configuration. All secrets should be stored in `.env` files that are **NOT** committed to version control.

### Required Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# OpenRouter API Key for AI hair analysis
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://lkcajltgxoovupudqzir.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Additional API Keys for enhanced features
# VITE_USDA_API_KEY=your_usda_api_key_here
# VITE_OPENAI_API_KEY=your_openai_api_key_here
# VITE_GEMINI_API_KEY=your_gemini_api_key_here
# VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### Security Measures Implemented

1. **`.gitignore` Protection**: Environment files are excluded from version control
2. **Environment Variable Usage**: All secrets are accessed via `import.meta.env.VITE_*`
3. **Centralized Validation**: Environment variables are validated at startup
4. **No Hardcoded Secrets**: All sensitive data is externalized
5. **Graceful Degradation**: Optional features are disabled when API keys are missing
6. **Error Handling**: Clear error messages for missing environment variables

### Environment Validation

The application includes a comprehensive environment validation system:

- **Startup Validation**: All required environment variables are validated before the app starts
- **Development Error Display**: Helpful error messages in development mode
- **Console Logging**: Environment status is logged to console in development
- **Graceful Fallbacks**: Optional features are disabled when keys are missing

### Getting API Keys

- **OpenRouter**: https://openrouter.ai/keys (Free tier available)
- **Supabase**: Get from your Supabase project settings
- **USDA**: https://fdc.nal.usda.gov/api-key-signup.html
- **OpenAI**: https://platform.openai.com/api-keys
- **Google Gemini**: https://makersuite.google.com/app/apikey
- **Hugging Face**: https://huggingface.co/settings/tokens

### Security Best Practices

1. **Never hardcode secrets** in source code
2. **Use environment variables** for all sensitive configuration
3. **Rotate API keys** regularly
4. **Use least privilege** - only grant necessary permissions
5. **Monitor API usage** for unusual activity
6. **Keep dependencies updated** to patch security vulnerabilities
7. **Validate environment variables** at startup
8. **Use secure API endpoints** with proper authentication

### Development vs Production

- **Development**: Use `.env.local` for local development secrets
- **Production**: Use your hosting platform's environment variable system
- **Testing**: Use `.env.test` for test-specific configuration

### Emergency Response

If you suspect a secret has been compromised:

1. **Immediately rotate** the affected API key
2. **Check git history** for any committed secrets
3. **Update all environments** with the new key
4. **Monitor for unauthorized usage**
5. **Review access logs** for suspicious activity

### File Security Status

- ✅ `.env` files are gitignored
- ✅ No hardcoded secrets in source code
- ✅ Environment variables used for all sensitive data
- ✅ Centralized environment validation implemented
- ✅ Graceful error handling for missing variables
- ✅ Optional features properly disabled when keys missing
- ✅ Security documentation created and maintained

### Security Checklist

Before deploying to production:

- [ ] All environment variables are set in production environment
- [ ] No secrets are committed to version control
- [ ] API keys have appropriate rate limits and permissions
- [ ] Environment validation is working correctly
- [ ] Error handling is properly configured
- [ ] Dependencies are up to date
- [ ] Security documentation is current

### Recent Security Improvements

1. **Removed hardcoded Supabase credentials** from source code
2. **Added environment validation** at application startup
3. **Implemented graceful degradation** for optional features
4. **Enhanced error handling** with helpful development messages
5. **Centralized environment management** with validation utilities
6. **Updated all API integrations** to use environment variables
7. **Added comprehensive security documentation**
