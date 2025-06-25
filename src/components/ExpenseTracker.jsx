// src/components/ExpenseTracker.jsx
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import styles from "../styles/ExpenseTracker.module.css";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ExpenseForm from "./ExpenseForm";
import CategoryGrid from "./CategoryGrid";
import ExpensesList from "./ExpensesList";
import AccountForm from "./AccountForm";
import AccountsList from "./AccountsList";
import TransferForm from "./TransferForm";
import TransfersList from "./TransfersList";
import BudgetAllocationForm from "./BudgetAllocationForm";
import BudgetAllocationsList from "./BudgetAllocationsList";
import {
  addAccount,
  updateAccount,
  deleteAccount,
  addTransfer,
  deleteTransfer,
  addBudgetAllocation,
  updateBudgetAllocation,
  deleteBudgetAllocation,
} from "../firebase/firebaseService";

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
];

const ExpenseTracker = () => {
  const { currentUser, logout } = useAuth();
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [savedReports, setSavedReports] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  // New state for account management
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [budgetAllocations, setBudgetAllocations] = useState([]);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [activeTab, setActiveTab] = useState("expenses"); // expenses, accounts, transfers, allocations

  // Generate and memoize colors for categories
  const categoryColors = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      acc[category] = generatePastelColor();
      return acc;
    }, {});
  }, []);

  // Load user profile, expenses, reports, accounts, transfers, and allocations from Firebase
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get user profile data
      const userProfileRef = doc(db, "users", currentUser.uid);
      const unsubscribeProfile = onSnapshot(
        userProfileRef,
        (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data());
            setTotal(doc.data().totalBudget || 0);
          } else {
            // Create a new user profile document if it doesn't exist
            setDoc(userProfileRef, {
              email: currentUser.email,
              totalBudget: 0,
              createdAt: Timestamp.now(),
            }).catch((error) => {
              console.error("Error creating user profile:", error);
              setError("Failed to create user profile");
            });
            setUserProfile({ email: currentUser.email, totalBudget: 0 });
            setTotal(0);
          }
        },
        (error) => {
          console.error("Error loading user profile:", error);
          setError("Failed to load user profile");
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
            expensesList.push({
              id: doc.id,
              ...doc.data(),
              amount: parseFloat(doc.data().amount),
            });
          });
          setExpenses(expensesList);
        },
        (error) => {
          console.error("Error loading expenses:", error);
          setError("Failed to load expenses");
        }
      );

      // Get saved reports
      const reportsRef = collection(db, "users", currentUser.uid, "reports");
      const reportsQuery = query(reportsRef, orderBy("exportDate", "desc"));
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
          setSavedReports(reportsList);
        },
        (error) => {
          console.error("Error loading reports:", error);
          setError("Failed to load reports");
        }
      );

      // Get accounts
      const accountsRef = collection(db, "users", currentUser.uid, "accounts");
      const accountsQuery = query(accountsRef, orderBy("createdAt", "desc"));
      const unsubscribeAccounts = onSnapshot(
        accountsQuery,
        (snapshot) => {
          const accountsList = [];
          snapshot.forEach((doc) => {
            accountsList.push({
              id: doc.id,
              ...doc.data(),
              balance: parseFloat(doc.data().balance) || 0,
            });
          });
          setAccounts(accountsList);
        },
        (error) => {
          console.error("Error loading accounts:", error);
          setError("Failed to load accounts");
        }
      );

      // Get transfers
      const transfersRef = collection(db, "users", currentUser.uid, "transfers");
      const transfersQuery = query(transfersRef, orderBy("date", "desc"));
      const unsubscribeTransfers = onSnapshot(
        transfersQuery,
        (snapshot) => {
          const transfersList = [];
          snapshot.forEach((doc) => {
            transfersList.push({
              id: doc.id,
              ...doc.data(),
              amount: parseFloat(doc.data().amount),
            });
          });
          setTransfers(transfersList);
        },
        (error) => {
          console.error("Error loading transfers:", error);
          setError("Failed to load transfers");
        }
      );

      // Get budget allocations
      const allocationsRef = collection(db, "users", currentUser.uid, "budgetAllocations");
      const allocationsQuery = query(allocationsRef, orderBy("createdAt", "desc"));
      const unsubscribeAllocations = onSnapshot(
        allocationsQuery,
        (snapshot) => {
          const allocationsList = [];
          snapshot.forEach((doc) => {
            allocationsList.push({
              id: doc.id,
              ...doc.data(),
              amount: parseFloat(doc.data().amount),
            });
          });
          setBudgetAllocations(allocationsList);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error loading budget allocations:", error);
          setError("Failed to load budget allocations");
          setIsLoading(false);
        }
      );

      // Cleanup subscriptions when component unmounts
      return () => {
        unsubscribeProfile();
        unsubscribeExpenses();
        unsubscribeReports();
        unsubscribeAccounts();
        unsubscribeTransfers();
        unsubscribeAllocations();
      };
    } catch (error) {
      console.error("Error setting up Firebase listeners:", error);
      setError("Failed to connect to database");
      setIsLoading(false);
    }
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

  const handleAddExpense = async (expenseData) => {
    if (!expenseData.name || !expenseData.amount || !currentUser) return;

    try {
      setError(null);
      const expensesRef = collection(db, "users", currentUser.uid, "expenses");
      await addDoc(expensesRef, {
        name: expenseData.name,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Please try again.");
    }
  };

  const deleteExpense = async (id) => {
    if (!currentUser) return;

    try {
      setError(null);
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
      setShowAccountForm(false);
    } catch (error) {
      console.error("Error managing account:", error);
      setError("Failed to manage account. Please try again.");
    }
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowAccountForm(true);
  };

  const handleDeleteAccount = async (accountId) => {
    if (!currentUser) return;

    const confirmed = confirm("Are you sure you want to delete this account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setError(null);
      await deleteAccount(currentUser.uid, accountId);
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again.");
    }
  };

  // Transfer management functions
  const handleAddTransfer = async (transferData) => {
    if (!currentUser) return;

    try {
      setError(null);
      await addTransfer(currentUser.uid, transferData);
      setShowTransferForm(false);
    } catch (error) {
      console.error("Error adding transfer:", error);
      setError("Failed to add transfer. Please try again.");
    }
  };

  const handleDeleteTransfer = async (transferId) => {
    if (!currentUser) return;

    const confirmed = confirm("Are you sure you want to delete this transfer?");
    if (!confirmed) return;

    try {
      setError(null);
      await deleteTransfer(currentUser.uid, transferId);
    } catch (error) {
      console.error("Error deleting transfer:", error);
      setError("Failed to delete transfer. Please try again.");
    }
  };

  // Budget allocation management functions
  const handleAddAllocation = async (allocationData) => {
    if (!currentUser) return;

    try {
      setError(null);
      if (editingAllocation) {
        await updateBudgetAllocation(currentUser.uid, editingAllocation.id, allocationData);
        setEditingAllocation(null);
      } else {
        await addBudgetAllocation(currentUser.uid, allocationData);
      }
      setShowAllocationForm(false);
    } catch (error) {
      console.error("Error managing budget allocation:", error);
      setError("Failed to manage budget allocation. Please try again.");
    }
  };

  const handleEditAllocation = (allocation) => {
    setEditingAllocation(allocation);
    setShowAllocationForm(true);
  };

  const handleDeleteAllocation = async (allocationId) => {
    if (!currentUser) return;

    const confirmed = confirm("Are you sure you want to delete this budget allocation?");
    if (!confirmed) return;

    try {
      setError(null);
      await deleteBudgetAllocation(currentUser.uid, allocationId);
    } catch (error) {
      console.error("Error deleting budget allocation:", error);
      setError("Failed to delete budget allocation. Please try again.");
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
      "Enter a name for this report:",
      `Budget Report ${new Date().toLocaleDateString()}`
    );
    if (!reportName) return;

    try {
      setError(null);
      const reportsRef = collection(db, "users", currentUser.uid, "reports");
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
      console.error("Error saving report:", error);
      setError("Failed to save report. Please try again.");
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

    const confirmed = confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

    try {
      setError(null);
      const reportRef = doc(db, "users", currentUser.uid, "reports", id);
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

            {/* Navigation Tabs */}
            <div className={styles.tabNavigation}>
              <button
                className={`${styles.tabButton} ${activeTab === "expenses" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("expenses")}
              >
                Expenses
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "accounts" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("accounts")}
              >
                Accounts
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "transfers" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("transfers")}
              >
                Transfers
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "allocations" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("allocations")}
              >
                Budget Allocations
              </button>
            </div>

            {/* Expenses Tab */}
            {activeTab === "expenses" && (
              <>
                <div className={styles.budgetSection}>
                  <label className={styles.label}>Starting Amount</label>
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                    className={`${styles.input} ${styles.nameInput}`}
                    placeholder="Enter your total amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className={styles.balanceCard}>
                  <div className={styles.balanceLabel}>Remaining Balance</div>
                  <div className={`${styles.balanceAmount} ${getRemainingBalance() < 0 ? styles.negativeBalance : ''}`}>
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
                  totalBudget={total}
                />

                <ExpensesList
                  expenses={expenses}
                  categoryColors={categoryColors}
                  onDeleteExpense={deleteExpense}
                />
              </>
            )}

            {/* Accounts Tab */}
            {activeTab === "accounts" && (
              <>
                <div className={styles.sectionActions}>
                  <button
                    onClick={() => setShowAccountForm(true)}
                    className={styles.button}
                  >
                    Add Account
                  </button>
                </div>

                {showAccountForm && (
                  <AccountForm
                    onAddAccount={handleAddAccount}
                    onCancel={() => {
                      setShowAccountForm(false);
                      setEditingAccount(null);
                    }}
                    editingAccount={editingAccount}
                  />
                )}

                <AccountsList
                  accounts={accounts}
                  onEditAccount={handleEditAccount}
                  onDeleteAccount={handleDeleteAccount}
                />
              </>
            )}

            {/* Transfers Tab */}
            {activeTab === "transfers" && (
              <>
                <div className={styles.sectionActions}>
                  <button
                    onClick={() => setShowTransferForm(true)}
                    className={styles.button}
                    disabled={accounts.length < 2}
                  >
                    Add Transfer
                  </button>
                  {accounts.length < 2 && (
                    <small className={styles.helperText}>
                      You need at least 2 accounts to make transfers
                    </small>
                  )}
                </div>

                {showTransferForm && (
                  <TransferForm
                    accounts={accounts}
                    onAddTransfer={handleAddTransfer}
                    onCancel={() => setShowTransferForm(false)}
                  />
                )}

                <TransfersList
                  transfers={transfers}
                  accounts={accounts}
                  onDeleteTransfer={handleDeleteTransfer}
                />
              </>
            )}

            {/* Budget Allocations Tab */}
            {activeTab === "allocations" && (
              <>
                <div className={styles.sectionActions}>
                  <button
                    onClick={() => setShowAllocationForm(true)}
                    className={styles.button}
                    disabled={accounts.length === 0}
                  >
                    Add Budget Allocation
                  </button>
                  {accounts.length === 0 && (
                    <small className={styles.helperText}>
                      You need to create accounts first
                    </small>
                  )}
                </div>

                {showAllocationForm && (
                  <BudgetAllocationForm
                    accounts={accounts}
                    onAddAllocation={handleAddAllocation}
                    onCancel={() => {
                      setShowAllocationForm(false);
                      setEditingAllocation(null);
                    }}
                    editingAllocation={editingAllocation}
                  />
                )}

                <BudgetAllocationsList
                  allocations={budgetAllocations}
                  accounts={accounts}
                  onEditAllocation={handleEditAllocation}
                  onDeleteAllocation={handleDeleteAllocation}
                />
              </>
            )}
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

export default ExpenseTracker;
