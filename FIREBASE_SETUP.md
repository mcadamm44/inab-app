# Firebase Setup Guide

This guide will help you set up Firebase deployment for your INAB app with GitHub Actions.

## Prerequisites

1. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. **Firebase CLI**: Install Firebase CLI locally for testing
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "inab-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Services
1. **Authentication**: Go to Authentication → Sign-in method → Enable Email/Password
2. **Firestore Database**: Go to Firestore Database → Create database → Start in test mode

### 1.3 Get Project Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register app and copy the configuration

## Step 2: Local Firebase Setup

### 2.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2.2 Login to Firebase
```bash
firebase login
```

### 2.3 Initialize Firebase (Optional for local development)
```bash
firebase init
```
- Select Firestore and Hosting
- Use existing project
- Select your project

### 2.4 Update .firebaserc
Replace `your-firebase-project-id` in `.firebaserc` with your actual project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 3: GitHub Secrets Setup

### 3.1 Required Secrets
Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### Firebase Configuration
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Firebase CLI Deployment
```
FIREBASE_TOKEN=your_firebase_token
FIREBASE_PROJECT_ID=your_project_id
```

### 3.2 Get Firebase Token
```bash
firebase login:ci
```
This will open a browser window. After authentication, copy the token and add it as `FIREBASE_TOKEN` secret.

## Step 4: Environment Variables

### 4.1 Create .env file
Create a `.env` file in your project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 5: Test Local Deployment

### 5.1 Test Firebase Rules
```bash
firebase deploy --only firestore:rules
```

### 5.2 Test Firebase Indexes
```bash
firebase deploy --only firestore:indexes
```

## Step 6: CI/CD Pipeline

### 6.1 Workflow Files
The following workflow files are already configured:

- `.github/workflows/test.yml` - Runs tests on PRs and pushes
- `.github/workflows/deploy.yml` - Deploys to GitHub Pages and Firebase
- `.github/workflows/firebase-deploy.yml` - Deploys Firebase rules only

### 6.2 Automatic Deployment
- **On Push to Main**: Deploys to GitHub Pages and Firebase
- **On Firestore Rules Change**: Deploys only Firebase rules
- **On Pull Request**: Runs tests only

## Step 7: Security Rules

### 7.1 Current Rules
The `firestore.rules` file contains secure rules that:
- Allow authenticated users to access only their data
- Prevent unauthorized access to other users' data
- Enable CRUD operations on user's own collections

### 7.2 Customize Rules
Edit `firestore.rules` to add custom security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Add your custom rules here
  }
}
```

## Step 8: Monitoring

### 8.1 Firebase Console
Monitor your app in Firebase Console:
- **Authentication**: User sign-ups and sign-ins
- **Firestore**: Database usage and performance
- **Hosting**: Website analytics and performance

### 8.2 GitHub Actions
Monitor deployments in GitHub:
- Go to Actions tab in your repository
- View workflow runs and logs
- Check for deployment status

## Troubleshooting

### Common Issues

#### 1. "Not in a Firebase app directory"
**Solution**: Ensure `firebase.json` exists in your project root.

#### 2. "Missing or insufficient permissions"
**Solution**: 
- Check Firestore rules are deployed
- Verify user authentication
- Check Firebase project configuration

#### 3. "Firebase token expired"
**Solution**: Generate a new token with `firebase login:ci`

#### 4. "Project not found"
**Solution**: 
- Verify `FIREBASE_PROJECT_ID` secret is correct
- Check project exists in Firebase Console
- Ensure you have access to the project

### Debug Commands

#### Test Firebase Connection
```bash
firebase projects:list
```

#### Check Rules Syntax
```bash
firebase deploy --only firestore:rules --dry-run
```

#### View Deployment Logs
```bash
firebase deploy --debug
```

## Best Practices

### 1. Security
- Never commit Firebase tokens or API keys
- Use environment variables for sensitive data
- Regularly rotate Firebase tokens
- Review and update security rules

### 2. Development
- Test rules locally before deployment
- Use Firebase emulators for development
- Keep Firebase CLI updated
- Monitor usage and costs

### 3. Deployment
- Use staging environment for testing
- Deploy rules incrementally
- Monitor deployment logs
- Set up alerts for failures

## Support

If you encounter issues:
1. Check Firebase Console for errors
2. Review GitHub Actions logs
3. Verify all secrets are set correctly
4. Test locally with Firebase CLI
5. Check Firebase documentation

For additional help, open an issue in the repository or contact the development team. 