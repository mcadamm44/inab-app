# INAB - Intelligent Budget Tracker

A comprehensive expense tracking and budget management application inspired by YNAB (You Need A Budget), built with React, Firebase, and Tailwind CSS.

## Features

### 🏦 Account Management
- **Multiple Account Types**: Create and manage different types of accounts (Checking, Savings, Investment, Crypto, Credit Card, Cash, Other)
- **Balance Tracking**: Monitor real-time balances across all your accounts
- **Account Customization**: Add descriptions, custom colors, and account details
- **Total Balance Overview**: See your net worth across all accounts

### 💸 Expense Tracking
- **Categorized Expenses**: Track expenses across 11 predefined categories
- **Real-time Updates**: Instant synchronization with Firebase
- **Visual Progress**: See spending progress with color-coded category cards
- **Expense History**: Complete history of all transactions

### 🔄 Transfer Management
- **Inter-Account Transfers**: Move money between your accounts
- **Transfer History**: Track all transfers with dates and descriptions
- **Balance Updates**: Automatic balance updates when transfers are made

### 📊 Budget Allocations
- **Monthly Budget Goals**: Set monthly budget targets for each account
- **Goal Tracking**: Monitor progress towards your financial goals
- **Historical Allocations**: View past budget allocations by month
- **Flexible Planning**: Adjust allocations as your financial situation changes

### 📈 Reports & Analytics
- **Saved Reports**: Save and load budget reports for different time periods
- **Export Functionality**: Export your financial data for external analysis
- **Visual Insights**: Color-coded category breakdowns and progress bars

### 🔐 User Management
- **Secure Authentication**: Firebase Authentication with email/password
- **User Profiles**: Individual user accounts with separate data
- **Data Privacy**: Your financial data is private and secure

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
   - Includes Firebase rules deployment
   - Builds and publishes the application

3. **Firebase Deploy Workflow** (`.github/workflows/firebase-deploy.yml`)
   - Deploys Firestore security rules
   - Runs when `firestore.rules` is modified
   - Ensures security rules are always up to date

### Required Secrets
Set these secrets in your GitHub repository:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_TOKEN` (for Firebase CLI deployment)
- `FIREBASE_PROJECT_ID` (for Firebase CLI deployment)

## Usage

### Creating Accounts
1. Navigate to the "Accounts" tab
2. Click "Add Account"
3. Fill in account details (name, type, initial balance, description)
4. Choose a custom color for easy identification
5. Save your account

### Adding Expenses
1. Go to the "Expenses" tab
2. Set your starting budget amount
3. Add expenses with categories
4. Monitor your remaining balance and category spending

### Making Transfers
1. Navigate to the "Transfers" tab
2. Click "Add Transfer"
3. Select source and destination accounts
4. Enter amount and optional description
5. Complete the transfer

### Setting Budget Allocations
1. Go to the "Budget Allocations" tab
2. Click "Add Budget Allocation"
3. Select account and set monthly target
4. Add optional description
5. Save your allocation

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom modules
- **Backend**: Firebase (Authentication, Firestore)
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── ui/             # Reusable UI components
│   ├── AccountForm.jsx # Account creation/editing
│   ├── AccountsList.jsx # Account display
│   ├── TransferForm.jsx # Transfer creation
│   ├── TransfersList.jsx # Transfer display
│   ├── BudgetAllocationForm.jsx # Budget allocation form
│   ├── BudgetAllocationsList.jsx # Budget allocations display
│   └── ExpenseTracker.jsx # Main application component
├── context/
│   └── AuthContext.jsx # Authentication context
├── firebase/
│   ├── firebase.js     # Firebase configuration
│   └── firebaseService.js # Firebase service functions
├── styles/
│   └── ExpenseTracker.module.css # Component styles
└── App.jsx             # Root component
```

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

## Acknowledgments

- Inspired by YNAB (You Need A Budget)
- Built with modern React patterns and best practices
- Designed for optimal user experience and financial management

## Support

For support and questions, please open an issue on GitHub or contact the development team.