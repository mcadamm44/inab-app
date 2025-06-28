// src/components/AllocationTracker.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  doc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { 
  addExpense, 
  addCategory, 
  deleteCategory,
  getCategories,
  addAccount,
  updateAccount,
  deleteAccount,
  addDebt,
  updateDebt,
  deleteDebt
} from "../firebase/firebaseService";
import Header from "./Header";
import FinancialDashboard from "./FinancialDashboard";
import Sidebar from "./Sidebar";
import styles from "../styles/ExpenseTracker.module.css";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health & Fitness",
  "Travel",
  "Education",
  "Other",
];

const AllocationTracker = () => {
  const { currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [categoryColors, setCategoryColors] = useState({});
  const [editingAccount, setEditingAccount] = useState(null);
  const [debts, setDebts] = useState([]);
  const [editingDebt, setEditingDebt] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Load user profile, expenses, reports, accounts, and categories from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        // Get user profile
        const userProfileRef = doc(db, "users", currentUser.uid);
        const unsubscribeProfile = onSnapshot(
          userProfileRef,
          (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setUserProfile(data);
              setTotal(data.totalBudget || 0);
            }
          },
          (error) => {
            console.error("Error loading user profile:", error);
            setError("Failed to load user profile");
          }
        );

        // Get accounts
        const accountsRef = collection(db, "users", currentUser.uid, "accounts");
        const unsubscribeAccounts = onSnapshot(
          accountsRef,
          (snapshot) => {
            const accountsList = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              accountsList.push({
                id: doc.id,
                ...data,
                balance: parseFloat(data.balance) || 0,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
              });
            });
            setAccounts(accountsList);
          },
          (error) => {
            console.error("Error loading accounts:", error);
            setError("Failed to load accounts");
          }
        );

        // Get debts
        const debtsRef = collection(db, "users", currentUser.uid, "debts");
        const unsubscribeDebts = onSnapshot(
          debtsRef,
          (snapshot) => {
            const debtsList = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              debtsList.push({
                id: doc.id,
                ...data,
                amount: parseFloat(data.amount) || 0,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
              });
            });
            setDebts(debtsList);
          },
          (error) => {
            console.error("Error loading debts:", error);
            setError("Failed to load debts");
          }
        );

        // Get categories
        try {
          const categoriesRef = collection(db, "users", currentUser.uid, "categories");
          const unsubscribeCategories = onSnapshot(
            categoriesRef,
            (snapshot) => {
              const categoriesList = [];
              const colors = {};
              snapshot.forEach((doc) => {
                const data = doc.data();
                categoriesList.push(data.name);
                colors[data.name] = data.color || generatePastelColor();
              });
              setCategoryNames(categoriesList);
              setCategoryColors(colors);
            },
            (error) => {
              console.error("Error loading categories:", error);
              setError("Failed to load categories");
              // Fallback to default categories
              console.log("Falling back to default categories:", CATEGORIES);
              setCategoryNames(CATEGORIES);
              
              // Generate fallback colors
              const colors = {};
              CATEGORIES.forEach(category => {
                colors[category] = generatePastelColor();
              });
              setCategoryColors(colors);
            }
          );

          // Get user expenses with ordering
          const expensesRef = collection(db, "users", currentUser.uid, "expenses");
          const expensesQuery = query(expensesRef, orderBy("createdAt", "desc"));
          const unsubscribeExpenses = onSnapshot(
            expensesQuery,
            (snapshot) => {
              const expensesList = [];
              snapshot.forEach((doc) => {
                const data = doc.data();
                expensesList.push({
                  id: doc.id,
                  ...data,
                  amount: parseFloat(data.amount) || 0,
                  date: data.date?.toDate ? data.date.toDate() : new Date(data.date || Date.now()),
                  createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
                });
              });
              setExpenses(expensesList);
            },
            (error) => {
              console.error("Error loading expenses:", error);
              setError("Failed to load expenses");
            }
          );

          // Get financial reports
          const reportsRef = collection(db, "users", currentUser.uid, "financialReports");
          const reportsQuery = query(reportsRef, orderBy("month", "desc"));
          const unsubscribeReports = onSnapshot(
            reportsQuery,
            (snapshot) => {
              const reportsList = [];
              snapshot.forEach((doc) => {
                reportsList.push({
                  id: doc.id,
                  ...doc.data(),
                });
              });
              console.log('Loaded financial reports:', reportsList.length);
              setSavedReports(reportsList);
            },
            (error) => {
              console.error("Error loading reports:", error);
              console.error("Error details:", {
                code: error.code,
                message: error.message,
                userId: currentUser.uid,
                collection: 'financialReports'
              });
              setError("Failed to load reports");
            }
          );

          setIsLoading(false);

          return () => {
            unsubscribeProfile();
            unsubscribeExpenses();
            unsubscribeReports();
            unsubscribeAccounts();
            unsubscribeDebts();
            unsubscribeCategories();
          };
        } catch (error) {
          console.error("Error loading data:", error);
          setError("Failed to load data");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data");
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // Update total budget in Firestore when it changes
  useEffect(() => {
    if (!currentUser || !userProfile) return;

    const userProfileRef = doc(db, "users", currentUser.uid);
    updateDoc(userProfileRef, { totalBudget: total }).catch((error) => {
      console.error("Error updating total budget:", error);
      setError("Failed to update budget");
    });
  }, [total, currentUser, userProfile]);

  const handleAddExpenseToCategory = (expenseData) => {
    if (expenseData.id) {
      // This is an update to an existing expense
      handleUpdateExpense(expenseData);
    } else {
      // This is a new expense
      handleAddExpense(expenseData);
    }
  };

  const handleAddExpense = async (expenseData) => {
    if (!expenseData.name || !expenseData.amount || !currentUser) return;

    try {
      setError(null);
      
      // Check if this is an allocation to an account or debt
      if (expenseData.category.startsWith('Account: ')) {
        // Extract account name from category
        const accountName = expenseData.category.replace('Account: ', '');
        const account = accounts.find(acc => acc.name === accountName);
        
        if (account) {
          // Update account balance
          const newBalance = account.balance + expenseData.amount;
          const accountRef = doc(db, "users", currentUser.uid, "accounts", account.id);
          await updateDoc(accountRef, {
            balance: newBalance,
            updatedAt: Timestamp.now(),
          });
        }
      } else if (expenseData.category.startsWith('Debt: ')) {
        // Extract debt name from category
        const debtName = expenseData.category.replace('Debt: ', '');
        const debt = debts.find(d => d.name === debtName);
        
        if (debt) {
          // Update debt amount (reduce the debt)
          const newAmount = Math.max(0, debt.amount - expenseData.amount);
          const debtRef = doc(db, "users", currentUser.uid, "debts", debt.id);
          await updateDoc(debtRef, {
            amount: newAmount,
            updatedAt: Timestamp.now(),
            // If debt is fully paid, update status
            status: newAmount === 0 ? "Paid Off" : debt.status,
          });
        }
      }
      
      // Add the expense/allocation
      await addExpense(currentUser.uid, expenseData);
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Please try again.");
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    if (!expenseData.name || !expenseData.amount || !currentUser) return;

    try {
      setError(null);
      
      // Get the original expense to calculate the difference
      const originalExpense = expenses.find(exp => exp.id === expenseData.id);
      if (!originalExpense) return;
      
      const amountDifference = expenseData.amount - originalExpense.amount;
      
      // Check if this is an allocation to an account or debt
      if (expenseData.category.startsWith('Account: ')) {
        // Extract account name from category
        const accountName = expenseData.category.replace('Account: ', '');
        const account = accounts.find(acc => acc.name === accountName);
        
        if (account) {
          // Update account balance with the difference
          const newBalance = account.balance + amountDifference;
          const accountRef = doc(db, "users", currentUser.uid, "accounts", account.id);
          await updateDoc(accountRef, {
            balance: newBalance,
            updatedAt: Timestamp.now(),
          });
        }
      } else if (expenseData.category.startsWith('Debt: ')) {
        // Extract debt name from category
        const debtName = expenseData.category.replace('Debt: ', '');
        const debt = debts.find(d => d.name === debtName);
        
        if (debt) {
          // Update debt amount with the difference (reduce the debt)
          const newAmount = Math.max(0, debt.amount - amountDifference);
          const debtRef = doc(db, "users", currentUser.uid, "debts", debt.id);
          await updateDoc(debtRef, {
            amount: newAmount,
            updatedAt: Timestamp.now(),
            // If debt is fully paid, update status
            status: newAmount === 0 ? "Paid Off" : debt.status,
          });
        }
      }
      
      // Update the expense/allocation
      const expenseRef = doc(db, "users", currentUser.uid, "expenses", expenseData.id);
      await updateDoc(expenseRef, {
        name: expenseData.name,
        amount: expenseData.amount,
        category: expenseData.category,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      setError("Failed to update expense. Please try again.");
    }
  };

  const handleAddCategory = async (categoryName) => {
    if (!categoryName.trim() || categoryNames.includes(categoryName)) return;
    
    try {
      setError(null);
      const newColor = generatePastelColor();
      await addCategory(currentUser.uid, { 
        name: categoryName.trim(),
        color: newColor
      });
      setCategoryNames(prev => [categoryName.trim(), ...prev]);
      setCategoryColors(prev => ({
        ...prev,
        [categoryName.trim()]: newColor
      }));
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!currentUser) return;

    try {
      setError(null);
      
      // First, delete all expenses in this category
      const expensesToDelete = expenses.filter(exp => exp.category === categoryName);
      for (const expense of expensesToDelete) {
        await deleteExpense(expense.id);
      }
      
      // Then delete the category from Firebase
      // Note: We need to find the category document ID first
      const userCategories = await getCategories(currentUser.uid);
      const categoryToDelete = userCategories.find(cat => cat.name === categoryName);
      
      if (categoryToDelete) {
        await deleteCategory(currentUser.uid, categoryToDelete.id);
      }
      
      // Update local state
      setCategoryNames(prev => prev.filter(cat => cat !== categoryName));
      setCategoryColors(prev => {
        const newColors = { ...prev };
        delete newColors[categoryName];
        return newColors;
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category. Please try again.");
    }
  };

  const deleteExpense = async (id) => {
    if (!currentUser) return;

    try {
      setError(null);
      
      // Get the expense to check if it's an allocation to an account or debt
      const expenseToDelete = expenses.find(exp => exp.id === id);
      if (expenseToDelete) {
        // Check if this is an allocation to an account or debt
        if (expenseToDelete.category.startsWith('Account: ')) {
          // Extract account name from category
          const accountName = expenseToDelete.category.replace('Account: ', '');
          const account = accounts.find(acc => acc.name === accountName);
          
          if (account) {
            // Reverse the account balance change
            const newBalance = account.balance - expenseToDelete.amount;
            const accountRef = doc(db, "users", currentUser.uid, "accounts", account.id);
            await updateDoc(accountRef, {
              balance: newBalance,
              updatedAt: Timestamp.now(),
            });
          }
        } else if (expenseToDelete.category.startsWith('Debt: ')) {
          // Extract debt name from category
          const debtName = expenseToDelete.category.replace('Debt: ', '');
          const debt = debts.find(d => d.name === debtName);
          
          if (debt) {
            // Reverse the debt amount change (add back to debt)
            const newAmount = debt.amount + expenseToDelete.amount;
            const debtRef = doc(db, "users", currentUser.uid, "debts", debt.id);
            await updateDoc(debtRef, {
              amount: newAmount,
              updatedAt: Timestamp.now(),
              // If debt was paid off and we're adding back, set status to Active
              status: newAmount > 0 ? "Active" : debt.status,
            });
          }
        }
      }
      
      // Delete the expense/allocation
      const expenseRef = doc(db, "users", currentUser.uid, "expenses", id);
      await deleteDoc(expenseRef);
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError("Failed to delete expense. Please try again.");
    }
  };

  // Account management functions
  const handleAddAccount = async (accountData) => {
    if (!currentUser) return;

    try {
      setError(null);
      if (editingAccount) {
        await updateAccount(currentUser.uid, editingAccount.id, accountData);
        setEditingAccount(null);
      } else {
        await addAccount(currentUser.uid, accountData);
      }
    } catch (error) {
      console.error("Error managing account:", error);
      setError("Failed to manage account. Please try again.");
    }
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
  };

  const handleDeleteAccount = async (accountId) => {
    if (!currentUser) return;

    const confirmed = confirm("Are you sure you want to delete this account?");
    if (!confirmed) return;

    try {
      setError(null);
      await deleteAccount(currentUser.uid, accountId);
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again.");
    }
  };

  // Debt/Loan management functions
  const handleAddDebt = async (debtData) => {
    if (!currentUser) return;

    try {
      setError(null);
      if (editingDebt) {
        await updateDebt(currentUser.uid, editingDebt.id, debtData);
        setEditingDebt(null);
      } else {
        await addDebt(currentUser.uid, debtData);
      }
    } catch (error) {
      console.error("Error managing debt:", error);
      setError("Failed to manage debt. Please try again.");
    }
  };

  const handleEditDebt = (debt) => {
    setEditingDebt(debt);
  };

  const handleDeleteDebt = async (debtId) => {
    if (!currentUser) return;

    const confirmed = confirm("Are you sure you want to delete this debt/loan?");
    if (!confirmed) return;

    try {
      setError(null);
      await deleteDebt(currentUser.uid, debtId);
    } catch (error) {
      console.error("Error deleting debt:", error);
      setError("Failed to delete debt. Please try again.");
    }
  };

  const getRemainingBalance = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return total - totalExpenses;
  };

  const handleSave = async () => {
    if (!currentUser) return;

    const reportName = prompt(
      "Enter a name for this report:",
      `Financial Report ${new Date().toLocaleDateString()}`
    );
    if (!reportName) return;

    try {
      setError(null);
      const reportsRef = collection(db, "users", currentUser.uid, "financialReports");
      await addDoc(reportsRef, {
        name: reportName,
        month: new Date().toISOString().slice(0, 7),
        type: 'custom',
        total,
        expenses: expenses.map((exp) => ({
          ...exp,
          amount: parseFloat(exp.amount),
        })),
        createdAt: Timestamp.now(),
      });

      // Open sidebar to show the saved report
      setIsSidebarOpen(true);
    } catch (error) {
      console.error("Error saving report:", error);
      setError("Failed to save report. Please try again.");
    }
  };

  // Load a report from the sidebar
  const loadReport = (report) => {
    setTotal(report.total || 0);

    // We won't replace the actual expenses in Firestore
    // just visually load them for reference
    const reportExpenses = report.expenses ? report.expenses.map((exp) => ({
      ...exp,
      isFromReport: true,
    })) : [];

    setExpenses(reportExpenses);
    setIsSidebarOpen(false);
  };

  // Delete a report from the sidebar
  const deleteReport = async (id) => {
    if (!currentUser) return;

    const confirmed = confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

    try {
      setError(null);
      const reportRef = doc(db, "users", currentUser.uid, "financialReports", id);
      await deleteDoc(reportRef);
    } catch (error) {
      console.error("Error deleting report:", error);
      setError("Failed to delete report. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your expense tracker...</p>
      </div>
    );
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
          {/* Main Content Area */}
          <div className={styles.mainContentArea}>
            <div className={styles.card}>
              {error && (
                <div className={styles.errorBanner}>
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className={styles.errorClose}
                  >
                    ×
                  </button>
                </div>
              )}

              <Header
                currentUser={currentUser}
                onToggleSidebar={() => setIsSidebarOpen(true)}
                onSave={handleSave}
                onLogout={logout}
              />

              <FinancialDashboard
                total={total}
                expenses={expenses}
                accounts={accounts}
                debts={debts}
                categoryNames={categoryNames}
                categoryColors={categoryColors}
                onAddExpense={handleAddExpenseToCategory}
                onDeleteExpense={deleteExpense}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddAccount={handleAddAccount}
                onEditAccount={handleEditAccount}
                onDeleteAccount={handleDeleteAccount}
                onAddDebt={handleAddDebt}
                onEditDebt={handleEditDebt}
                onDeleteDebt={handleDeleteDebt}
                getRemainingBalance={getRemainingBalance}
                setTotal={setTotal}
              />
            </div>
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

  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
};

export default AllocationTracker;
