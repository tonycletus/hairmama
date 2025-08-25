# Contributing to Hairmama

Thank you for your interest in contributing to Hairmama! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. Check if the issue has already been reported
2. Use the appropriate issue template
3. Provide detailed information including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (browser, OS, etc.)
   - Screenshots if applicable

### Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Describe the feature clearly and its benefits
3. Consider implementation complexity
4. Provide use cases and examples

### Code Contributions

#### Prerequisites

- Node.js 18+
- npm or yarn
- Git

#### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/tonycletus/hairmama.git
   cd hairmama
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   npm run setup
   ```
   Then add your API keys to the `.env` file.

4. **Start development server**
   ```bash
   npm run dev
   ```

#### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Code Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible
- Use interfaces for object shapes

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design
- Maintain accessibility standards

### Code Style

- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Follow the existing code formatting

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Test both success and error cases

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Update README for new features
- Keep API documentation current

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

## 🔒 Security

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Follow security best practices
- Report security vulnerabilities privately

### Environment Variables

- All secrets must be externalized
- Use the environment validation system
- Document new environment variables
- Test with missing optional variables

## 🚀 Pull Request Process

1. **Create a descriptive PR title**
2. **Fill out the PR template**
3. **Ensure all checks pass**
4. **Request review from maintainers**
5. **Address feedback and suggestions**
6. **Maintainers will merge when ready**

## 📞 Getting Help

- Check existing documentation
- Search existing issues and PRs
- Ask questions in discussions
- Join our community channels

## 🎉 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame

Thank you for contributing to Hairmama! 🎉
