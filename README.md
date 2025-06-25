# INAB - Intelligent Budget Tracker

A comprehensive expense tracking application with YNAB-like functionality, built with React, Firebase, and Tailwind CSS.

## Features

### Core Functionality
- **Expense Tracking**: Add, edit, and delete expenses with categories and dates
- **Multiple Accounts**: Manage different account types (Checking, Savings, Investment, Crypto, etc.)
- **Account Balance Tracking**: Real-time balance updates across all accounts
- **Transfers**: Move money between accounts with detailed tracking
- **Budget Allocations**: Set monthly budget targets for each account
- **User Authentication**: Secure login and registration system

### Account Types Supported
- Checking Accounts
- Savings Accounts
- Investment Accounts
- Cryptocurrency Wallets
- Credit Cards
- Cash
- Other

### Advanced Features
- Real-time data synchronization with Firebase
- Responsive design for mobile and desktop
- Dark/light theme support
- Data export capabilities
- Comprehensive reporting

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/inab-app.git
cd inab-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase configuration to environment variables

4. Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Start the development server:
```bash
npm run dev
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **Service Tests**: Test Firebase service functions
- **Mock Setup**: Comprehensive Firebase mocking for reliable tests

### Test Coverage
The test suite covers:
- Component rendering and user interactions
- Form validation and submission
- Firebase service operations
- Error handling and edge cases
- Data transformations and calculations

## CI/CD Pipeline

### GitHub Actions Workflows

1. **Test Workflow** (`.github/workflows/test.yml`)
   - Runs on push to main and pull requests
   - Executes linting, tests, and build checks
   - Uploads coverage reports to Codecov
   - Ensures code quality before deployment

2. **Deploy Workflow** (`.github/workflows/deploy.yml`)
   - Deploys to GitHub Pages on main branch pushes
   - Builds and publishes the application

### Required Secrets
Set these secrets in your GitHub repository:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Firebase Setup

### Manual Firebase Rules Deployment
Since we've simplified the CI/CD pipeline, you'll need to deploy Firebase rules manually:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```

4. Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Firestore Security Rules
The `firestore.rules` file contains secure rules that:
- Allow authenticated users to access only their data
- Prevent unauthorized access to other users' data
- Enable CRUD operations on user's own collections

## Usage

### Adding Accounts
1. Navigate to the "Accounts" tab
2. Click "Add Account"
3. Fill in account details:
   - Name (required)
   - Type (required)
   - Current Balance (required)
   - Description (optional)
   - Color (optional)
4. Click "Add Account"

### Managing Transfers
1. Go to the "Transfers" tab
2. Click "Add Transfer"
3. Select source and destination accounts
4. Enter amount and optional description
5. Choose transfer date
6. Click "Transfer"

### Setting Budget Allocations
1. Navigate to "Budget Allocations"
2. Click "Add Budget Allocation"
3. Select account and month
4. Set allocation amount
5. Add optional description
6. Click "Add Allocation"

### Tracking Expenses
1. Use the main "Expenses" tab
2. Add expenses with categories and amounts
3. View remaining balance updates
4. Monitor spending patterns

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run the test suite: `npm test`
6. Commit your changes: `git commit -am 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.