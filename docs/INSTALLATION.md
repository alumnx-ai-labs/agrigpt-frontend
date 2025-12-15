# AgriGPT Frontend - Installation Guide

> **🔗 Related Repository**: For the backend setup, see [AgriGPT Backend RAG](https://github.com/alumnx-ai-labs/agrigpt-backend-rag)

This comprehensive guide will walk you through setting up the AgriGPT Frontend on your local machine. Whether you're using Linux, Windows, or macOS, this guide has you covered - even if you're completely new to Git and GitHub!

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Git and GitHub Basics](#-git-and-github-basics)
3. [Installing Node.js](#-installing-nodejs)
4. [Getting the Code](#-getting-the-code)
5. [Setting Up the Project](#-setting-up-the-project)
6. [Environment Configuration](#-environment-configuration)
7. [Installing Dependencies](#-installing-dependencies)
8. [Running the Application](#-running-the-application)
9. [Troubleshooting](#-troubleshooting)
10. [Next Steps](#-next-steps)

---

## ✅ Prerequisites

Before you begin, you'll need:

- A computer running **Linux**, **Windows**, or **macOS**
- An internet connection
- Basic familiarity with using the command line/terminal
- A text editor (we recommend [VS Code](https://code.visualstudio.com/))

---

## 🔰 Git and GitHub Basics

### What is Git?

Git is a version control system that helps track changes in your code. GitHub is a platform that hosts Git repositories online.

### Installing Git

#### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# Fedora
sudo dnf install git

# Arch Linux
sudo pacman -S git
```

#### Windows

1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer
3. Use default settings (recommended for beginners)
4. Open "Git Bash" from the Start menu to use Git

#### macOS

```bash
# Using Homebrew (recommended)
brew install git

# Or download from https://git-scm.com/download/mac
```

### Verify Git Installation

Open your terminal/command prompt and run:

```bash
git --version
```

You should see output like `git version 2.x.x`

### Configure Git (First Time Only)

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"
```

### Understanding GitHub

- **Repository (Repo)**: A project folder containing all files and their history
- **Clone**: Download a copy of a repository to your computer
- **Fork**: Create your own copy of someone else's repository on GitHub
- **Commit**: Save changes to your local repository
- **Push**: Upload your local changes to GitHub
- **Pull**: Download changes from GitHub to your local repository

---

## 📦 Installing Node.js

Node.js is required to run the AgriGPT Frontend. You need **Node.js v18.0.0 or higher**.

### Linux

#### Option 1: Using NodeSource (Recommended)

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Option 2: Using Package Manager

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# Arch Linux
sudo pacman -S nodejs npm
```

### Windows

#### Option 1: Using Installer (Recommended for Beginners)

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Check "Automatically install necessary tools" during installation
5. Restart your computer after installation

#### Option 2: Using Chocolatey

```powershell
# Open PowerShell as Administrator
choco install nodejs-lts
```

#### Verify Installation (Windows)

Open Command Prompt or PowerShell:

```cmd
node --version
npm --version
```

### macOS

#### Option 1: Using Homebrew (Recommended)

```bash
# Install Homebrew if you haven't already
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

#### Option 2: Using Installer

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS** version for macOS
3. Run the `.pkg` installer
4. Follow the installation wizard

### Troubleshooting Node.js Installation

**Issue**: `node: command not found`

**Solution**:

- Restart your terminal/command prompt
- On Windows, restart your computer
- Verify Node.js is in your PATH environment variable

**Issue**: Permission errors on Linux/macOS

**Solution**:

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 💻 Getting the Code

### Option 1: Clone the Repository (Recommended)

This is the simplest way to get started:

```bash
# Navigate to where you want to store the project
cd ~/Documents  # Linux/macOS
cd C:\Users\YourName\Documents  # Windows

# Clone the repository
git clone https://github.com/alumnx-ai-labs/agrigpt-frontend.git

# Navigate into the project folder
cd agrigpt-frontend
```

### Option 2: Fork and Clone (For Contributors)

If you plan to contribute to the project:

1. **Fork the Repository**:

   - Go to [github.com/alumnx-ai-labs/agrigpt-frontend](https://github.com/alumnx-ai-labs/agrigpt-frontend)
   - Click the "Fork" button in the top-right corner
   - This creates a copy under your GitHub account

2. **Clone Your Fork**:

   ```bash
   # Replace YOUR_USERNAME with your GitHub username
   git clone https://github.com/YOUR_USERNAME/agrigpt-frontend.git
   cd agrigpt-frontend
   ```

3. **Add Upstream Remote**:

   ```bash
   # This allows you to sync with the original repository
   git remote add upstream https://github.com/alumnx-ai-labs/agrigpt-frontend.git

   # Verify remotes
   git remote -v
   ```

### Option 3: Download ZIP

If you don't want to use Git:

1. Go to [github.com/alumnx-ai-labs/agrigpt-frontend](https://github.com/alumnx-ai-labs/agrigpt-frontend)
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your desired location
5. Open terminal/command prompt in that folder

---

## 🔧 Setting Up the Project

### Understanding the Project Structure

```
agrigpt-frontend/
├── src/                  # Source code
├── public/               # Static files
├── docs/                 # Documentation
├── package.json          # Project dependencies
├── .env.example          # Environment variables template
└── README.md             # Project overview
```

---

## 🔐 Environment Configuration

The application needs environment variables to connect to the backend API.

### Step 1: Create Environment File

#### Linux/macOS

```bash
# Copy the example file
cp .env.example .env
```

#### Windows (Command Prompt)

```cmd
copy .env.example .env
```

#### Windows (PowerShell)

```powershell
Copy-Item .env.example .env
```

### Step 2: Edit Environment Variables

Open the `.env` file in your text editor:

```bash
# Linux/macOS
nano .env
# or
code .env  # If you have VS Code

# Windows
notepad .env
# or
code .env  # If you have VS Code
```

### Step 3: Configure Variables

For **local development**, your `.env` should look like:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Optional: Environment identifier
VITE_ENVIRONMENT=development
```

For **production** (when deploying), use:

```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-api-url.com

# Environment identifier
VITE_ENVIRONMENT=production
```

### Environment Variables Explained

| Variable            | Description                 | Example                       |
| ------------------- | --------------------------- | ----------------------------- |
| `VITE_API_BASE_URL` | Backend API endpoint URL    | `http://localhost:8000`       |
| `VITE_ENVIRONMENT`  | Environment name (optional) | `development` or `production` |

> **⚠️ Important**:
>
> - Never commit your `.env` file to Git (it's already in `.gitignore`)
> - All Vite environment variables must start with `VITE_`
> - Make sure the backend is running on the URL you specify

---

## 📥 Installing Dependencies

Now we'll install all the required packages for the project.

### Install All Dependencies

```bash
npm install
```

This command will:

- Read `package.json` to see what packages are needed
- Download all packages from the npm registry
- Install them in the `node_modules` folder
- Create/update `package-lock.json` to lock versions

### What Gets Installed?

The main dependencies include:

- **React 19.2.0** - UI framework
- **Vite 7.2.4** - Build tool
- **TailwindCSS 3.4.18** - CSS framework
- **React Router DOM 7.10.1** - Routing
- **Axios 1.13.2** - HTTP client
- **React Icons 5.5.0** - Icon library

### Installation Time

- First install: 2-5 minutes (depending on internet speed)
- Subsequent installs: Much faster (uses cache)

### Troubleshooting Installation

**Issue**: `npm: command not found`

**Solution**: Node.js/npm not installed properly. Revisit [Installing Node.js](#-installing-nodejs)

**Issue**: `EACCES: permission denied` (Linux/macOS)

**Solution**:

```bash
# Don't use sudo! Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then try again
npm install
```

**Issue**: `network timeout` or `ETIMEDOUT`

**Solution**:

```bash
# Increase timeout
npm install --timeout=60000

# Or use a different registry
npm install --registry=https://registry.npmjs.org/
```

**Issue**: `Unsupported engine` error

**Solution**: Your Node.js version is too old. Update to v18 or higher.

---

## 🚀 Running the Application

### Start Development Server

```bash
npm run dev
```

You should see output like:

```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:5173**
3. You should see the AgriGPT Frontend interface!

### Development Server Features

- **Hot Module Replacement (HMR)**: Changes appear instantly without full reload
- **Fast Refresh**: React components update without losing state
- **Error Overlay**: Errors appear directly in the browser

### Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

### Other Useful Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🔍 Troubleshooting

### Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:

```bash
# Option 1: Kill the process using the port
# Linux/macOS
lsof -ti:5173 | xargs kill -9

# Windows (PowerShell as Admin)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Option 2: Use a different port
npm run dev -- --port 3000
```

### Cannot Connect to Backend

**Error**: Network errors or "Failed to fetch"

**Solution**:

1. Verify backend is running (should be at `http://localhost:8000`)
2. Check `VITE_API_BASE_URL` in `.env` matches backend URL
3. Ensure no firewall blocking the connection
4. Check browser console for CORS errors

### Module Not Found Errors

**Error**: `Cannot find module 'xyz'`

**Solution**:

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json  # Linux/macOS
# or
rmdir /s node_modules & del package-lock.json  # Windows

npm install
```

### Blank Page After Starting

**Solution**:

1. Check browser console for errors (F12)
2. Verify `.env` file exists and is configured
3. Clear browser cache
4. Try incognito/private browsing mode

### Git Issues

**Error**: `fatal: not a git repository`

**Solution**: You're not in the project directory. Navigate to it:

```bash
cd path/to/agrigpt-frontend
```

**Error**: `Permission denied (publickey)`

**Solution**: Set up SSH keys or use HTTPS URL instead:

```bash
git clone https://github.com/alumnx-ai-labs/agrigpt-frontend.git
```

### Platform-Specific Issues

#### Linux

- **Issue**: Permission errors
- **Solution**: Never use `sudo` with npm. Fix permissions as shown above.

#### Windows

- **Issue**: Long path errors
- **Solution**: Enable long paths:
  ```powershell
  # Run as Administrator
  New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
  ```

#### macOS

- **Issue**: Xcode command line tools required
- **Solution**:
  ```bash
  xcode-select --install
  ```

---

## 🎯 Next Steps

Congratulations! You've successfully set up the AgriGPT Frontend. Here's what to do next:

### 1. Set Up the Backend

The frontend needs the backend to function. Follow the installation guide for the backend:

- [AgriGPT Backend RAG Installation Guide](https://github.com/alumnx-ai-labs/agrigpt-backend-rag/blob/main/docs/INSTALLATION.md)

### 2. Explore the Code

- **`src/pages/`** - Different pages of the application
- **`src/components/`** - Reusable UI components
- **`src/services/api.js`** - API communication logic
- **`src/context/`** - Global state management

### 3. Read the Documentation

- [README.md](../README.md) - Project overview and features
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute to the project

### 4. Start Contributing

If you want to contribute:

1. Read the [Contributing Guide](./CONTRIBUTING.md)
2. Look for issues labeled `good first issue`
3. Fork the repository and create a branch
4. Make your changes and submit a pull request

### 5. Join the Community

- Report bugs or request features via [GitHub Issues](https://github.com/alumnx-ai-labs/agrigpt-frontend/issues)
- Star the repository if you find it useful!

---

## 📚 Additional Resources

### Learning Resources

- **React**: [react.dev](https://react.dev/)
- **Vite**: [vitejs.dev](https://vitejs.dev/)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com/)
- **Git**: [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub**: [docs.github.com](https://docs.github.com/)

### Command Reference

```bash
# Git commands
git clone <url>           # Clone a repository
git pull                  # Update your local repository
git status                # Check status of changes
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push                  # Push to remote repository

# npm commands
npm install               # Install dependencies
npm run dev               # Start development server
npm run build             # Build for production
npm run preview           # Preview production build
npm run lint              # Check code quality
```

---

## 🆘 Getting Help

If you're stuck:

1. **Check this guide** - Search for your issue in the Troubleshooting section
2. **Search existing issues** - Someone might have had the same problem
3. **Ask for help** - Create a new issue with:
   - Your operating system
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Error messages (full text)
   - Steps you've already tried

---

**Made with ❤️ by the AgriGPT Team**

[⬆ Back to Top](#agrigpt-frontend---installation-guide)
