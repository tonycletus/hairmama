import { createRoot } from 'react-dom/client'
import { validateRequiredEnvironment, logEnvironmentStatus } from './lib/env-validator'
import App from './App.tsx'
import './index.css'

// Validate environment variables before starting the app
try {
  validateRequiredEnvironment();
  logEnvironmentStatus();
} catch (error) {
  console.error('❌ Environment validation failed:', error);
  // In development, show a helpful error message
  if (import.meta.env.DEV) {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `
        <div style="padding: 2rem; font-family: system-ui; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">🚨 Environment Configuration Error</h1>
          <p style="color: #374151; line-height: 1.6;">
            ${error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
            <h3 style="margin-top: 0;">Quick Fix:</h3>
            <ol style="color: #374151;">
              <li>Run <code>npm run setup</code> to create your .env file</li>
              <li>Add your API keys to the .env file</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      `;
    }
    throw error;
  }
}

createRoot(document.getElementById("root")!).render(<App />);
