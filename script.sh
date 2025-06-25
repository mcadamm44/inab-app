#!/bin/bash

# Base directory
BASE_DIR="./src"

# Create directories if they don't exist
mkdir -p "$BASE_DIR/components"
mkdir -p "$BASE_DIR/components/auth"

# Array of files to create
declare -A files
files=(
  ["$BASE_DIR/App.jsx"]="// src/App.jsx
import { useState } from \"react\";
import { useAuth } from \"./context/AuthContext\";
import LoginScreen from \"./components/auth/LoginScreen\";
import ExpenseTracker from \"./components/ExpenseTracker\";
import styles from \"./styles/ExpenseTracker.module.css\";

const App = () => {
  const { currentUser } = useAuth();
  
  // If no user is logged in, show the login screen
  if (!currentUser) {
    return <LoginScreen />;
  }
  
  // If user is logged in, show the expense tracker
  return <ExpenseTracker />;
};

export default App;"

  ["$BASE_DIR/components/auth/LoginScreen.jsx"]="// src/components/auth/LoginScreen.jsx
import { useState } from \"react\";
import { useAuth } from \"../../context/AuthContext\";
import LoginForm from \"./LoginForm\";
import SignupForm from \"./SignupForm\";
import styles from \"../../styles/Auth.module.css\";

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();

  return (
    <div className={styles.loginContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Expense Tracker</h1>
        <div className={styles.tabContainer}>
          <button
            className={\`\${styles.tabButton} \${isLogin ? styles.activeTab : \"\"}\`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={\`\${styles.tabButton} \${!isLogin ? styles.activeTab : \"\"}\`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        
        {isLogin ? (
          <LoginForm onLogin={login} />
        ) : (
          <SignupForm onSignup={signup} />
        )}
      </div>
    </div>
  );
};

export default LoginScreen;"

  ["$BASE_DIR/components/auth/SignupForm.jsx"]="// src/components/auth/SignupForm.jsx
import { useState } from \"react\";
import styles from \"../../styles/Auth.module.css\";

const SignupForm = ({ onSignup }) => {
  const [email, setEmail] = useState(\"\");
  const [password, setPassword] = useState(\"\");
  const [confirmPassword, setConfirmPassword] = useState(\"\");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(\"\");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (password !== confirmPassword) {
      setError(\"Passwords do not match\");
      return;
    }

    setLoading(true);
    setError(\"\");
    
    try {
      await onSignup(email, password);
    } catch (error) {
      console.error(\"Signup error:\", error);
      setError(error.message || \"Failed to create an account\");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor=\"signup-email\" className={styles.label}>
          Email
        </label>
        <input
          type=\"email\"
          id=\"signup-email\"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          placeholder=\"Enter your email\"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor=\"signup-password\" className={styles.label}>
          Password
        </label>
        <input
          type=\"password\"
          id=\"signup-password\"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          placeholder=\"Enter your password\"
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor=\"confirm-password\" className={styles.label}>
          Confirm Password
        </label>
        <input
          type=\"password\"
          id=\"confirm-password\"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          placeholder=\"Confirm your password\"
          required
        />
      </div>

      <button type=\"submit\" className={styles.submitButton} disabled={loading}>
        {loading ? \"Creating Account...\" : \"Sign Up\"}
      </button>
    </form>
  );
};

export default SignupForm;"

  ["$BASE_DIR/components/ExpenseTracker.jsx"]="// src/components/ExpenseTracker.jsx
import { useState, useMemo, useEffect } from \"react\";
import { Trash2, Save, Menu, X, LogOut, User } from \"lucide-react\";
import { useAuth } from \"../context/AuthContext\";
import { db } from \"../firebase/firebase\";
import styles from \"../styles/ExpenseTracker.module.css\";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
} from \"firebase/firestore\";
import Sidebar from \"./Sidebar\";
import Header from \"./Header\";
import ExpenseForm from \"./ExpenseForm\";
import CategoryGrid from \"./CategoryGrid\";
import ExpensesList from \"./ExpensesList\";

const CATEGORIES = [
  \"Food\",
  \"Transport\",
  \"Bills\",
  \"Entertainment\",
  \"Shopping\",
  \"Investments\",
  \"Savings\",
  \"Crypto\",
  \"Wants\",
  \"Hobbies\",
  \"Other\",
];

const ExpenseTracker = () => {
  const { currentUser, logout } = useAuth();
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [savedReports, setSavedReports] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Generate and memoize colors for categories
  const categoryColors = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      acc[category] = generatePastelColor();
      return acc;
    }, {});
  }, []);

  // Load user profile, expenses, and reports from Firebase
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Get user profile data
    const userProfileRef = doc(db, \"users\", currentUser.uid);
    const unsubscribeProfile = onSnapshot(userProfileRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data());
        setTotal(doc.data().totalBudget || 0);
      } else {
        // Create a new user profile document if it doesn't exist
        updateDoc(userProfileRef, {
          email: currentUser.email,
          totalBudget: 0,
          createdAt: Timestamp.now(),
        }).catch((error) =>
          console.error(\"Error creating user profile:\", error)
        );
        setUserProfile({ email: currentUser.email, totalBudget: 0 });
        setTotal(0);
      }
    });

    // Get user expenses
    const expensesRef = collection(db, \"users\", currentUser.uid, \"expenses\");
    const unsubscribeExpenses = onSnapshot(expensesRef, (snapshot) => {
      const expensesList = [];
      snapshot.forEach((doc) => {
        expensesList.push({
          id: doc.id,
          ...doc.data(),
          amount: parseFloat(doc.data().amount),
        });
      });
      setExpenses(expensesList);
    });

    // Get saved reports
    const reportsRef = collection(db, \"users\", currentUser.uid, \"reports\");
    const unsubscribeReports = onSnapshot(reportsRef, (snapshot) => {
      const reportsList = [];
      snapshot.forEach((doc) => {
        reportsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setSavedReports(reportsList);
      setIsLoading(false);
    });

    // Cleanup subscriptions when component unmounts
    return () => {
      unsubscribeProfile();
      unsubscribeExpenses();
      unsubscribeReports();
    };
  }, [currentUser]);

  // Update total budget in Firestore when it changes
  useEffect(() => {
    if (!currentUser || !userProfile) return;

    const userProfileRef = doc(db, \"users\", currentUser.uid);
    updateDoc(userProfileRef, { totalBudget: total }).catch((error) =>
      console.error(\"Error updating total budget:\", error)
    );
  }, [total, currentUser, userProfile]);

  const handleAddExpense = async (expenseData) => {
    if (!expenseData.name || !expenseData.amount || !currentUser) return;

    try {
      const expensesRef = collection(db, \"users\", currentUser.uid, \"expenses\");
      await addDoc(expensesRef, {
        name: expenseData.name,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(\"Error adding expense:\", error);
      alert(\"Failed to add expense. Please try again.\");
    }
  };

  const deleteExpense = async (id) => {
    if (!currentUser) return;

    try {
      const expenseRef = doc(db, \"users\", currentUser.uid, \"expenses\", id);
      await deleteDoc(expenseRef);
    } catch (error) {
      console.error(\"Error deleting expense:\", error);
      alert(\"Failed to delete expense. Please try again.\");
    }
  };

  const getRemainingBalance = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return total - totalExpenses;
  };

  const getCategoryTotal = (category) => {
    return expenses
      .filter((exp) => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const handleSave = async () => {
    if (!currentUser) return;

    const reportName = prompt(
      \"Enter a name for this report:\",
      \`Budget Report \${new Date().toLocaleDateString()}\`
    );
    if (!reportName) return;

    try {
      const reportsRef = collection(db, \"users\", currentUser.uid, \"reports\");
      await addDoc(reportsRef, {
        name: reportName,
        total,
        expenses: expenses.map((exp) => ({
          ...exp,
          amount: parseFloat(exp.amount),
        })),
        exportDate: Timestamp.now(),
      });

      // Open sidebar to show the saved report
      setIsSidebarOpen(true);
    } catch (error) {
      console.error(\"Error saving report:\", error);
      alert(\"Failed to save report. Please try again.\");
    }
  };

  // Load a report from the sidebar
  const loadReport = (report) => {
    setTotal(report.total);

    // We won't replace the actual expenses in Firestore
    // just visually load them for reference
    const reportExpenses = report.expenses.map((exp) => ({
      ...exp,
      isFromReport: true,
    }));

    setExpenses(reportExpenses);
    setIsSidebarOpen(false);
  };

  // Delete a report from the sidebar
  const deleteReport = async (id) => {
    if (!currentUser) return;

    const confirmed = confirm(\"Are you sure you want to delete this report?\");
    if (!confirmed) return;

    try {
      const reportRef = doc(db, \"users\", currentUser.uid, \"reports\", id);
      await deleteDoc(reportRef);
    } catch (error) {
      console.error(\"Error deleting report:\", error);
      alert(\"Failed to delete report. Please try again.\");
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.appContainer}>
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        reports={savedReports}
        onLoadReport={loadReport}
        onDeleteReport={deleteReport}
      />

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.card}>
            <Header 
              currentUser={currentUser}
              onToggleSidebar={() => setIsSidebarOpen(true)}
              onSave={handleSave}
              onLogout={logout}
            />

            <div>
              <label className={styles.label}>Starting Amount</label>
              <input
                type=\"number\"
                value={total}
                onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                className={\`\${styles.input} \${styles.nameInput}\`}
                placeholder=\"Enter your total amount\"
              />
            </div>

            <div className={styles.balanceCard}>
              <div className={styles.balanceLabel}>Remaining Balance</div>
              <div className={styles.balanceAmount}>
                €{getRemainingBalance().toFixed(2)}
              </div>
            </div>

            <ExpenseForm 
              onAddExpense={handleAddExpense}
              categories={CATEGORIES}
            />

            <CategoryGrid 
              categories={CATEGORIES}
              categoryColors={categoryColors}
              getCategoryTotal={getCategoryTotal}
            />

            <ExpensesList 
              expenses={expenses}
              categoryColors={categoryColors}
              onDeleteExpense={deleteExpense}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for generating pastel colors
const generatePastelColor = () => {
  // Generate random RGB values with a minimum brightness
  const min = 150; // Minimum brightness value
  const max = 230; // Maximum brightness value

  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);

  // Add some randomness to one channel to increase variation
  const randomChannel = Math.floor(Math.random() * 3);
  const channels = [r, g, b];
  channels[randomChannel] = Math.floor(Math.random() * (min - 100) + 100); // Allow one channel to be darker

  return \`rgb(\${channels[0]}, \${channels[1]}, \${channels[2]})\`;
};

export default ExpenseTracker;"

  ["$BASE_DIR/components/Header.jsx"]="// src/components/Header.jsx
import { Menu, Save, LogOut, User } from \"lucide-react\";
import styles from \"../styles/ExpenseTracker.module.css\";

const Header = ({ currentUser, onToggleSidebar, onSave, onLogout }) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        <button
          onClick={onToggleSidebar}
          className={styles.menuButton}
        >
          <Menu size={20} />
        </button>
        <h1 className={styles.title}>Expense Tracker (€)</h1>
      </div>
      <div className={styles.actions}>
        <div className={styles.userInfo}>
          {currentUser && (
            <div className={styles.userEmail}>
              <User size={16} />
              <span>{currentUser.email}</span>
            </div>
          )}
        </div>
        <button
          onClick={onSave}
          className={styles.actionButton}
          title=\"Save Budget Report\"
        >
          <span>
            <Save size={16} />
          </span>
        </button>
        <button
          onClick={onLogout}
          className={styles.actionButton}
          title=\"Logout\"
        >
          <span>
            <LogOut size={16} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;"

  ["$BASE_DIR/components/Sidebar.jsx"]="// src/components/Sidebar.jsx
import { X, Trash2 } from \"lucide-react\";
import styles from \"../styles/ExpenseTracker.module.css\";

const Sidebar = ({ isOpen, onClose, reports, onLoadReport, onDeleteReport }) => {
  return (
    <div className={\`\${styles.sidebar} \${isOpen ? styles.open : \"\"}\`}>
      <div className={styles.sidebarHeader}>
        <h2>Reports</h2>
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <X size={20} />
        </button>
      </div>

      {reports.length === 0 ? (
        <p className={styles.emptyReports}>No saved reports yet</p>
      ) : (
        <ul className={styles.reportsList}>
          {reports.map((report) => (
            <li key={report.id} className={styles.reportItem}>
              <div className={styles.reportInfo}>
                <p className={styles.reportName}>{report.name}</p>
                <p className={styles.reportDate}>
                  {report.exportDate.toDate().toLocaleDateString()}
                </p>
              </div>
              <div className={styles.reportActions}>
                <button
                  onClick={() => onLoadReport(report)}
                  className={styles.reportButton}
                  title=\"Load Report\"
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteReport(report.id)}
                  className={styles.reportButton}
                  title=\"Delete Report\"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;"

  ["$BASE_DIR/components/ExpenseForm.jsx"]="// src/components/ExpenseForm.jsx
import { useState } from \"react\";
import styles from \"../styles/ExpenseTracker.module.css\";

const ExpenseForm = ({ onAddExpense, categories }) => {
  const [expenseName, setExpenseName] = useState(\"\");
  const [expenseAmount, setExpenseAmount] = useState(\"\");
  const [expenseCategory, setExpenseCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;

    onAddExpense({
      name: expenseName,
      amount: expenseAmount,
      category: expenseCategory,
    });

    // Reset form
    setExpenseName(\"\");
    setExpenseAmount(\"\");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type=\"text\"
        value={expenseName}
        onChange={(e) => setExpenseName(e.target.value)}
        className={\`\${styles.input} \${styles.nameInput}\`}
        placeholder=\"Expense name\"
        required
      />
      <input
        type=\"number\"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
        className={\`\${styles.input} \${styles.amountInput}\`}
        placeholder=\"Amount\"
        required
        min=\"0\"
        step=\"0.01\"
      />
      <select
        value={expenseCategory}
        onChange={(e) => setExpenseCategory(e.target.value)}
        className={\`\${styles.input} \${styles.categoryInput}\`}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type=\"submit\" className={styles.button}>
        Add
      </button>
    </form>
  );
};

export default ExpenseForm;"

  ["$BASE_DIR/components/CategoryGrid.jsx"]="// src/components/CategoryGrid.jsx
import styles from \"../styles/ExpenseTracker.module.css\";

const CategoryGrid = ({ categories, categoryColors, getCategoryTotal }) => {
  return (
    <div className={styles.categoryTotals}>
      <h2 className={styles.categoryTitle}>Category Totals</h2>
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <div
            key={category}
            className={styles.categoryCard}
            style={{ backgroundColor: categoryColors[category] }}
          >
            <div className={styles.categoryName}>{category}</div>
            <div className={styles.categoryAmount}>
              €{getCategoryTotal(category).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;"

  ["$BASE_DIR/components/ExpensesList.jsx"]="// src/components/ExpensesList.jsx
import { Trash2 } from \"lucide-react\";
import styles from \"../styles/ExpenseTracker.module.css\";

const ExpensesList = ({ expenses, categoryColors, onDeleteExpense }) => {
  return (
    <div className={styles.expensesList}>
      <h2 className={styles.expensesTitle}>All Expenses</h2>
      {expenses.length === 0 ? (
        <div className={styles.emptyState}>No expenses added yet</div>
      ) : (
        expenses.map((expense) => (
          <div key={expense.id} className={styles.expenseItem}>
            <div>
              <span className={styles.expenseName}>{expense.name}</span>
              <span
                className={styles.expenseCategory}
                style={{
                  backgroundColor: categoryColors[expense.category],
                }}
              >
                {expense.category}
              </span>
              {expense.isFromReport && (
                <span className={styles.reportLabel}>From Report</span>
              )}
            </div>
            <div className={styles.expenseActions}>
              <span className={styles.expenseAmount}>
                €{expense.amount.toFixed(2)}
              </span>
              {!expense.isFromReport && (
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className={styles.deleteButton}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpensesList;"

  ["$BASE_DIR/styles/Auth.module.css"]="/* src/styles/Auth.module.css */
.loginContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.authCard {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 24px;
}

.authTitle {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
  font-size: 24px;
}

.tabContainer {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.tabButton {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.activeTab {
  color: #3498db;
  border-bottom: 2px solid #3498db;
  font-weight: bold;
}

.authForm {
  display: flex;
  flex-direction: column;
}

.formGroup {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #3498db;
  outline: none;
}

.submitButton {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.submitButton:hover {
  background-color: #2980b9;
}

.submitButton:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.errorMessage {
  background-color: #ffebee;
  color: #e53935;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}
"
)

# Loop through the files and create them if they don't exist
for file_path in "${!files[@]}"; do
  if [ ! -f "$file_path" ]; then
    echo "Creating $file_path"
    mkdir -p "$(dirname "$file_path")"
    echo "${files[$file_path]}" > "$file_path"
  else
    echo "File $file_path already exists, skipping"
  fi
done

echo "All missing files have been created"