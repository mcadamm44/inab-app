# iNAB: Enhanced Expense Tracker

A modern, feature-rich expense tracking application built with React, Firebase, and Vite that helps you manage your budget effectively.

## ✨ Features

### 🔐 Authentication & Security
- **Secure User Authentication**: Firebase Authentication with email/password
- **User Registration**: Easy signup process with validation
- **Password Security**: Password visibility toggle and strength validation
- **Session Management**: Automatic login state persistence

### 💰 Budget Management
- **Starting Budget**: Set your initial budget amount
- **Real-time Balance**: See remaining balance with visual indicators
- **Negative Balance Warning**: Visual alerts when spending exceeds budget
- **Category-based Tracking**: Organize expenses into customizable categories

### 📊 Expense Tracking
- **Add Expenses**: Quick expense entry with name, amount, and category
- **Category Management**: 11 predefined categories (Food, Transport, Bills, etc.)
- **Visual Categories**: Color-coded category cards with spending totals
- **Progress Indicators**: See percentage of budget used per category
- **Date Tracking**: Automatic timestamp for all expenses
- **Expense History**: Complete list with sorting and filtering

### 📈 Analytics & Reports
- **Category Breakdown**: Visual spending analysis by category
- **Budget Reports**: Save and load budget snapshots
- **Export Functionality**: Generate downloadable reports
- **Historical Data**: Access previous budget states

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design with smooth animations
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages and recovery
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or newer)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd inab-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
inab-app/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginScreen.jsx      # Main authentication screen
│   │   │   ├── LoginForm.jsx        # Login form component
│   │   │   └── SignupForm.jsx       # Registration form component
│   │   ├── ExpenseTracker.jsx       # Main expense tracking component
│   │   ├── ExpenseForm.jsx          # Add expense form
│   │   ├── ExpensesList.jsx         # Display expenses list
│   │   ├── CategoryGrid.jsx         # Category breakdown cards
│   │   ├── Header.jsx               # Application header
│   │   └── Sidebar.jsx              # Reports sidebar
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── firebase/
│   │   └── firebase.js              # Firebase configuration
│   ├── styles/
│   │   ├── Auth.module.css          # Authentication styles
│   │   └── ExpenseTracker.module.css # Main application styles
│   ├── App.jsx                      # Main application component
│   └── main.jsx                     # Application entry point
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

## 🛠️ Technologies Used

- **Frontend**: React 19, Vite
- **Styling**: CSS Modules, Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adaptive layout with touch-friendly controls
- **Mobile**: Streamlined interface with mobile-optimized forms

## 🔧 Customization

### Adding New Categories
Edit the `CATEGORIES` array in `src/components/ExpenseTracker.jsx`:
```javascript
const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Shopping",
  "Investments",
  "Savings",
  "Crypto",
  "Wants",
  "Hobbies",
  "Other",
  "Your New Category" // Add your custom category
];
```

### Styling Customization
- Modify `src/styles/ExpenseTracker.module.css` for main application styles
- Modify `src/styles/Auth.module.css` for authentication styles
- Colors are automatically generated for categories

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## 🔒 Security Features

- **Firebase Security Rules**: Configure Firestore security rules
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Firebase handles CSRF protection

## 📊 Data Structure

### User Profile
```javascript
{
  email: "user@example.com",
  totalBudget: 1000,
  createdAt: Timestamp
}
```

### Expense
```javascript
{
  name: "Grocery Shopping",
  amount: 50.00,
  category: "Food",
  createdAt: Timestamp
}
```

### Report
```javascript
{
  name: "Monthly Budget Report",
  total: 1000,
  expenses: [...],
  exportDate: Timestamp
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🎯 Roadmap

- [ ] Data export to CSV/PDF
- [ ] Budget goals and alerts
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and charts
- [ ] Expense sharing between users

---

**Built with ❤️ using React and Firebase**