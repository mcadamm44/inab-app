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
- Node.js (v14 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd inab-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Add your Firebase configuration to `src/firebase/firebase.js`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

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
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by YNAB (You Need A Budget)
- Built with modern React patterns and best practices
- Designed for optimal user experience and financial management