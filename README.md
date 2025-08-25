# Hairmama - AI-Powered Hair Analysis Platform

A modern web application that leverages artificial intelligence to provide comprehensive hair health analysis and personalized care recommendations.

## ✨ Features

- **AI-Powered Analysis**: Advanced computer vision for hair health assessment
- **Comprehensive Health Scoring**: Detailed evaluation across multiple hair health metrics
- **Personalized Recommendations**: Tailored care suggestions based on analysis results
- **Professional Reports**: Downloadable analysis reports in PDF format
- **User Authentication**: Secure user accounts and data management
- **Responsive Design**: Optimized for desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for required services

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hair-shine-spy-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   npm run setup
   ```
   
   Then edit the `.env` file with your API keys.

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8080`

## 📋 Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Required
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - Enhanced features
VITE_USDA_API_KEY=your_usda_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Services**: OpenRouter API
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout and navigation
│   ├── progress/       # Progress tracking components
│   ├── quiz/           # Assessment components
│   ├── reports/        # Report generation components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and services
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── integrations/       # Third-party integrations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run setup` - Initialize environment configuration

## 📸 Usage Guide

1. **Account Setup**: Create an account or sign in
2. **Photo Upload**: Upload a clear photo of your hair
3. **Analysis**: Receive comprehensive AI-powered analysis
4. **Review Results**: View detailed health metrics and recommendations
5. **Download Report**: Save your analysis as a professional PDF report

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

For security information and best practices, see [SECURITY.md](SECURITY.md).

## 📞 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

Built with ❤️ for the hair care community
