# Contributing to AgriGPT Frontend

Thank you for your interest in contributing to **AgriGPT Frontend**! We're excited to have you as part of our community. This document provides guidelines and instructions to help you contribute effectively to this project.

---

## 📋 Table of Contents

1. [Project Introduction](#-project-introduction)
2. [Code of Conduct](#-code-of-conduct)
3. [Getting Started](#-getting-started)
4. [Development Setup](#-development-setup)
5. [Project Structure](#-project-structure)
6. [Coding Standards](#-coding-standards)
7. [Style Guide](#-style-guide)
8. [Commit Guidelines](#-commit-guidelines)
9. [Pull Request Process](#-pull-request-process)
10. [Issue Guidelines](#-issue-guidelines)
11. [Testing](#-testing)
12. [Documentation](#-documentation)
13. [Community](#-community)

---

## 🌾 Project Introduction

**AgriGPT Frontend** is a modern React-based web application designed to provide intelligent agricultural insights and consultancy services. Built with cutting-edge technologies, this platform aims to democratize access to agricultural knowledge through AI-powered interactions.

### Key Features

- **AI-Powered Consultancy**: Interactive chat interface for agricultural guidance
- **Admin Dashboard**: Comprehensive management tools for administrators
- **User Authentication**: Secure login and protected routes
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Modern Stack**: React 19, Vite, React Router DOM

### Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 3.4.18
- **Routing**: React Router DOM 7.10.1
- **HTTP Client**: Axios 1.13.2
- **Icons**: React Icons 5.5.0
- **Linting**: ESLint 9.39.1

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**

- The use of sexualized language or imagery and unwelcome sexual attention
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version

### Quick Start

1. **Fork the Repository**

   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/agrigpt-frontend.git
   cd agrigpt-frontend
   ```

3. **Add Upstream Remote**

   ```bash
   git remote add upstream https://github.com/alumnx-ai-labs/agrigpt-frontend.git
   ```

4. **Install Dependencies**

   ```bash
   npm install
   ```

5. **Set Up Environment Variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Start Development Server**

   ```bash
   npm run dev
   ```

7. **Open in Browser**
   ```
   Navigate to http://localhost:5173
   ```

---

## 🛠 Development Setup

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=your_api_base_url
```

For production deployment, refer to `.env.production.example`:

```env
VITE_API_BASE_URL=your_production_api_url
VITE_ENVIRONMENT=production
```

### Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build production-ready bundle            |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint to check code quality         |

### Development Workflow

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**

   - Write clean, maintainable code
   - Follow our coding standards
   - Add comments where necessary

3. **Test Your Changes**

   ```bash
   npm run dev
   # Manually test all affected features
   ```

4. **Lint Your Code**

   ```bash
   npm run lint
   ```

5. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to GitHub and create a PR from your fork to the main repository

---

## 📂 Project Structure

```
agrigpt-frontend/
├── .env                      # Environment variables (not in git)
├── .env.example              # Example environment configuration
├── .env.production.example   # Production environment template
├── .gitignore                # Git ignore rules
├── README.md                 # Project overview
├── docs/                     # Documentation files
│   └── CONTRIBUTING.md       # This file
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── public/                   # Static assets
│   └── vite.svg              # Vite logo
├── src/                      # Source code
│   ├── App.css               # App-level styles
│   ├── App.jsx               # Main App component
│   ├── index.css             # Global styles and Tailwind imports
│   ├── main.jsx              # Application entry point
│   ├── assets/               # Images, fonts, and other assets
│   ├── components/           # Reusable React components
│   │   ├── Navbar.jsx        # Navigation component
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── context/              # React Context providers
│   │   └── AuthContext.jsx   # Authentication context
│   ├── pages/                # Page components
│   │   ├── AdminPage.jsx     # Admin dashboard
│   │   ├── ConsultantPage.jsx # Consultant interface
│   │   └── LoginPage.jsx     # Login page
│   └── services/             # API services and utilities
│       └── api.js            # API client configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vercel.json               # Vercel deployment configuration
└── vite.config.js            # Vite build configuration
```

### Directory Descriptions

- **`src/components/`**: Reusable UI components that can be used across multiple pages
- **`src/pages/`**: Top-level page components that represent different routes
- **`src/context/`**: React Context providers for global state management
- **`src/services/`**: API integration and external service utilities
- **`src/assets/`**: Static files like images, fonts, and icons
- **`public/`**: Public assets served directly without processing

---

## 💻 Coding Standards

### General Principles

1. **Write Clean Code**: Code should be self-documenting and easy to understand
2. **DRY (Don't Repeat Yourself)**: Avoid code duplication
3. **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones
4. **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until it's needed
5. **Separation of Concerns**: Keep components focused on a single responsibility

### React Best Practices

#### Component Structure

```jsx
// 1. Imports
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// 2. Component Definition
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState(initialValue);

  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 5. Event Handlers
  const handleClick = () => {
    // Handler logic
  };

  // 6. Render
  return <div>{/* JSX */}</div>;
};

// 7. PropTypes
MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// 8. Default Props
MyComponent.defaultProps = {
  prop2: 0,
};

// 9. Export
export default MyComponent;
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: kebab-case or use Tailwind utilities

#### State Management

- Use `useState` for local component state
- Use Context API for global state (see `AuthContext.jsx`)
- Keep state as close to where it's used as possible
- Avoid prop drilling - use Context when passing props through multiple levels

#### Component Organization

- **One component per file** (except for small, tightly coupled components)
- **Group related files** in the same directory
- **Use index files** for cleaner imports when appropriate

### JavaScript Best Practices

```javascript
// ✅ Good: Use const/let, not var
const API_URL = "https://api.example.com";
let counter = 0;

// ✅ Good: Use arrow functions
const add = (a, b) => a + b;

// ✅ Good: Use template literals
const greeting = `Hello, ${name}!`;

// ✅ Good: Use destructuring
const { firstName, lastName } = user;
const [first, second] = array;

// ✅ Good: Use optional chaining
const userName = user?.profile?.name;

// ✅ Good: Use async/await instead of promises
const fetchData = async () => {
  try {
    const response = await api.get("/data");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// ✅ Good: Use meaningful variable names
const isUserAuthenticated = checkAuth();
const userList = getUsers();

// ❌ Bad: Single letter variables (except in loops)
const u = getUser();
const d = new Date();
```

### Error Handling

```javascript
// Always handle errors gracefully
try {
  const data = await fetchData();
  processData(data);
} catch (error) {
  console.error("Failed to fetch data:", error);
  // Show user-friendly error message
  showErrorNotification("Unable to load data. Please try again.");
}
```

---

## 🎨 Style Guide

### CSS and Tailwind

#### Tailwind Usage

```jsx
// ✅ Good: Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">Title</h2>
  <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
    Click Me
  </button>
</div>;

// ✅ Good: Extract repeated patterns into components
const Card = ({ children }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">{children}</div>
);

// ❌ Avoid: Inline styles (use Tailwind instead)
<div style={{ padding: "16px", backgroundColor: "white" }}>Content</div>;
```

#### Custom CSS

When Tailwind utilities aren't sufficient, use custom CSS in component-specific files:

```css
/* Component.css */
.custom-component {
  /* Custom styles that can't be achieved with Tailwind */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Use CSS variables for theming */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### Responsive Design

```jsx
// Use Tailwind's responsive prefixes
<div
  className="
  flex flex-col          /* Mobile: stack vertically */
  md:flex-row            /* Tablet: horizontal layout */
  lg:gap-8               /* Desktop: larger gaps */
  p-4 md:p-6 lg:p-8      /* Responsive padding */
"
>
  {/* Content */}
</div>
```

### Accessibility

```jsx
// ✅ Good: Include ARIA labels and semantic HTML
<button
  aria-label="Close dialog"
  onClick={handleClose}
  className="p-2 rounded hover:bg-gray-100"
>
  <CloseIcon />
</button>

<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ✅ Good: Use semantic HTML
<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

// ❌ Bad: Generic divs everywhere
<div>
  <div>
    <div>Title</div>
    <div>Content...</div>
  </div>
</div>
```

---

## 📝 Commit Guidelines

We follow the **Conventional Commits** specification for clear and meaningful commit messages.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type       | Description                           | Example                                   |
| ---------- | ------------------------------------- | ----------------------------------------- |
| `feat`     | New feature                           | `feat(auth): add OAuth login`             |
| `fix`      | Bug fix                               | `fix(navbar): resolve mobile menu toggle` |
| `docs`     | Documentation changes                 | `docs(readme): update setup instructions` |
| `style`    | Code style changes (formatting, etc.) | `style(components): format with prettier` |
| `refactor` | Code refactoring                      | `refactor(api): simplify error handling`  |
| `perf`     | Performance improvements              | `perf(images): lazy load hero images`     |
| `test`     | Adding or updating tests              | `test(auth): add login flow tests`        |
| `chore`    | Maintenance tasks                     | `chore(deps): update dependencies`        |
| `ci`       | CI/CD changes                         | `ci(github): add automated testing`       |
| `build`    | Build system changes                  | `build(vite): optimize bundle size`       |
| `revert`   | Revert a previous commit              | `revert: revert feat(auth) commit`        |

### Scope

The scope should be the name of the affected module or feature:

- `auth`
- `navbar`
- `admin`
- `consultant`
- `api`
- `ui`

### Subject

- Use imperative, present tense: "add" not "added" or "adds"
- Don't capitalize the first letter
- No period (.) at the end
- Keep it under 50 characters

### Body (Optional)

- Explain **what** and **why**, not **how**
- Wrap at 72 characters
- Separate from subject with a blank line

### Footer (Optional)

- Reference issues: `Closes #123` or `Fixes #456`
- Note breaking changes: `BREAKING CHANGE: description`

### Examples

```bash
# Simple commit
feat(auth): add password reset functionality

# Commit with body
fix(navbar): resolve mobile menu not closing

The mobile menu was staying open after navigation due to missing
state reset. Added cleanup in useEffect to fix the issue.

# Commit with footer
feat(api): integrate new analytics endpoint

Closes #234

# Breaking change
refactor(auth): change authentication flow

BREAKING CHANGE: AuthContext now requires a provider wrapper
at the app root. Update your App.jsx accordingly.
```

### Commit Best Practices

1. **Make atomic commits**: Each commit should represent a single logical change
2. **Commit often**: Small, frequent commits are better than large, infrequent ones
3. **Test before committing**: Ensure your code works before committing
4. **Don't commit generated files**: Keep commits focused on source code
5. **Use meaningful messages**: Future you (and others) will thank you

---

## 🔄 Pull Request Process

### 1. Addressing an Issue

Before raising a Pull Request, please ensure you are working on a valid issue.

1.  **Find an Issue**:
    - Browse the [Issues tab](https://github.com/alumnx-ai-labs/agrigpt-frontend/issues).
    - Look for labels like `good first issue` or `help wanted` if you're new.
2.  **Request Assignment**:
    - Comment on the issue: "I would like to work on this issue."
    - **Wait until you are assigned** the issue by a maintainer before starting work. This prevents multiple people from working on the same thing.

### 2. Contribution Workflow

#### For External Contributors (Forking Workflow)

If you are not a core team member, please use the Fork & Pull model:

1.  **Fork the Project**: Click the "Fork" button on the top right of the repo page.
2.  **Clone Your Fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/agrigpt-frontend.git
    cd agrigpt-frontend
    ```
3.  **Add Upstream Remote**:
    ```bash
    git remote add upstream https://github.com/alumnx-ai-labs/agrigpt-frontend.git
    ```
4.  **Create a Branch**:

    ```bash
    # Sync with upstream first
    git fetch upstream
    git checkout main
    git merge upstream/main

    # Create your feature branch
    git checkout -b type/your-feature-name
    # Example: git checkout -b fix/login-validation
    ```

5.  **Make Changes**: Write your code and fix the issue.
6.  **Commit Changes**: Follow the [Commit Guidelines](#-commit-guidelines).
7.  **Push to Your Fork**:
    ```bash
    git push origin type/your-feature-name
    ```
8.  **Open PR**: Create a Pull Request from your fork against the `upstream` repository's `main` branch.
9.  **Link Issue**: In the **PR description**, **you must link the issue** using a supported keyword (e.g., `Fixes #42`, `Closes #42`, `Resolves #42`). This ensures the issue is automatically closed when the PR is merged.

    - **`Fixes #<issue_number>`**: Indicates that the changes in the PR address and resolve the specified issue.
    - **`Closes #<issue_number>`**: Similar to `Fixes`, this keyword also signifies that the PR's merge will close the linked issue.
    - **`Resolves #<issue_number>`**: Another keyword with the same effect, communicating that the PR provides a solution for the referenced issue.

#### For Internal Contributors

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/alumnx-ai-labs/agrigpt-frontend.git
    ```
2.  **Create a Branch**:
    ```bash
    git checkout -b type/your-feature-name
    ```
3.  **Push Changes**:
    ```bash
    git push origin type/your-feature-name
    ```
4.  **Create Pull Request**.

### 3. Before Submitting Your PR

Ensure you have completed the following:

1.  **Sync with upstream** (for forks) or main:
    ```bash
    git fetch upstream
    git rebase upstream/main
    ```
2.  **Run linting**:
    ```bash
    npm run lint
    ```
3.  **Test your changes**:
    ```bash
    npm run dev
    # Manually test all affected features
    ```
4.  **Build successfully**:
    ```bash
    npm run build
    ```

### PR Title Format

Follow the same format as commit messages:

```
<type>(<scope>): <description>
```

Example: `feat(admin): add user management dashboard`

### PR Description Template

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Related Issues

Closes #(issue number)

## Changes Made

- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Testing

Describe the tests you ran to verify your changes:

- [ ] Test 1
- [ ] Test 2

## Checklist

- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have tested my changes locally
- [ ] Any dependent changes have been merged and published

## Additional Notes

Any additional information that reviewers should know.
```

### Review Process

1. **Automated Checks**: Your PR must pass all automated checks (linting, build)
2. **Code Review**: At least one maintainer must review and approve your PR
3. **Address Feedback**: Respond to review comments and make requested changes
4. **Squash Commits**: Maintainers may ask you to squash commits before merging
5. **Merge**: Once approved, a maintainer will merge your PR

### PR Best Practices

- **Keep PRs small**: Easier to review and less likely to introduce bugs
- **One feature per PR**: Don't mix multiple unrelated changes
- **Update your branch**: Regularly sync with the main branch
- **Respond promptly**: Address review comments in a timely manner
- **Be respectful**: Treat reviewers with respect and professionalism

---

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues**: Your issue might already be reported
2. **Check documentation**: The answer might be in the docs
3. **Reproduce the bug**: Ensure you can consistently reproduce the issue

### Issue Types

#### Bug Report Template

```markdown
## Bug Description

A clear and concise description of the bug.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Screenshots

If applicable, add screenshots to help explain the problem.

## Environment

- OS: [e.g., Windows 10, macOS 12.0, Ubuntu 22.04]
- Browser: [e.g., Chrome 120, Firefox 121, Safari 17]
- Node Version: [e.g., 18.17.0]
- npm Version: [e.g., 9.6.7]

## Additional Context

Any other context about the problem.

## Possible Solution (Optional)

If you have ideas on how to fix the issue.
```

#### Feature Request Template

```markdown
## Feature Description

A clear and concise description of the feature you'd like.

## Problem Statement

Describe the problem this feature would solve.

## Proposed Solution

Describe how you envision this feature working.

## Alternatives Considered

Describe any alternative solutions or features you've considered.

## Additional Context

Add any other context, mockups, or screenshots about the feature request.

## Would you like to work on this?

- [ ] Yes, I'd like to implement this feature
- [ ] No, just suggesting
```

#### Question Template

```markdown
## Question

What would you like to know?

## Context

Provide context about what you're trying to achieve.

## What I've Tried

Describe what you've already attempted.

## Additional Information

Any other relevant information.
```

### Issue Labels

| Label              | Description                                |
| ------------------ | ------------------------------------------ |
| `bug`              | Something isn't working                    |
| `enhancement`      | New feature or request                     |
| `documentation`    | Improvements or additions to documentation |
| `good first issue` | Good for newcomers                         |
| `help wanted`      | Extra attention is needed                  |
| `question`         | Further information is requested           |
| `wontfix`          | This will not be worked on                 |
| `duplicate`        | This issue already exists                  |
| `priority: high`   | High priority issue                        |
| `priority: low`    | Low priority issue                         |

---

## 🧪 Testing

### Manual Testing

Since this project doesn't currently have automated tests, thorough manual testing is crucial:

1. **Test all affected features**: Don't just test the happy path
2. **Test edge cases**: What happens with empty inputs, very long inputs, etc.?
3. **Test on multiple browsers**: Chrome, Firefox, Safari, Edge
4. **Test responsive design**: Mobile, tablet, desktop viewports
5. **Test accessibility**: Keyboard navigation, screen readers

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Works in Chrome, Firefox, and Safari
- [ ] Keyboard navigation works
- [ ] No broken links or images
- [ ] Loading states are handled
- [ ] Error states are handled
- [ ] Forms validate correctly
- [ ] API calls succeed and fail gracefully

### Future: Automated Testing

We plan to add automated testing in the future. Contributions to set up testing infrastructure are welcome!

Potential testing tools:

- **Unit Testing**: Vitest
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright or Cypress

---

## 📚 Documentation

### Code Documentation

```javascript
/**
 * Fetches user data from the API
 * @param {string} userId - The unique identifier for the user
 * @returns {Promise<Object>} User data object
 * @throws {Error} If the API request fails
 */
const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};
```

### Component Documentation

```jsx
/**
 * UserCard component displays user information in a card format
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - User's full name
 * @param {string} props.email - User's email address
 * @param {string} [props.avatar] - URL to user's avatar image (optional)
 * @param {Function} props.onEdit - Callback function when edit button is clicked
 *
 * @example
 * <UserCard
 *   name="John Doe"
 *   email="john@example.com"
 *   avatar="/images/john.jpg"
 *   onEdit={handleEdit}
 * />
 */
const UserCard = ({ name, email, avatar, onEdit }) => {
  // Component implementation
};
```

### README Updates

When adding new features, update the README.md with:

- Feature description
- Usage examples
- Configuration options
- Screenshots or GIFs

---

## 👥 Community

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion (if enabled)
- **Email**: Contact maintainers directly for sensitive issues

### Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- GitHub's contributor graph

### Maintainers

Current project maintainers:

- **[Maintainer Name]** - [@github-username](https://github.com/username)

---

## 📄 License

By contributing to AgriGPT Frontend, you agree that your contributions will be licensed under the same license as the project (see LICENSE file in the repository root).

---

## 🙏 Thank You!

Thank you for taking the time to contribute to AgriGPT Frontend! Your efforts help make this project better for everyone in the agricultural technology community.

If you have any questions or need clarification on anything in this guide, please don't hesitate to ask by opening an issue or reaching out to the maintainers.

**Happy Coding! 🌾💻**
