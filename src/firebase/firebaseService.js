// src/firebase/firebaseService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  Timestamp,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

// EXPENSES

// Get expenses collection reference
const getExpensesRef = (userId) => {
  return collection(db, "users", userId, "expenses");
};

// Add a new expense
export const addExpense = async (userId, expenseData) => {
  try {
    const expenseWithTimestamp = {
      ...expenseData,
      date: expenseData.date ? Timestamp.fromDate(new Date(expenseData.date)) : Timestamp.now(),
      createdAt: Timestamp.now(),
      userId,
    };
    const docRef = await addDoc(getExpensesRef(userId), expenseWithTimestamp);
    return {
      id: docRef.id,
      ...expenseData,
      date: expenseData.date ? new Date(expenseData.date) : new Date(),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding expense: ", error);
    throw error;
  }
};

// Update an expense
export const updateExpense = async (userId, expenseId, expenseData) => {
  try {
    const expenseRef = doc(db, "users", userId, "expenses", expenseId);
    const expenseWithTimestamp = {
      ...expenseData,
      date:
        expenseData.date instanceof Date
          ? Timestamp.fromDate(expenseData.date)
          : Timestamp.fromDate(new Date(expenseData.date)),
      updatedAt: Timestamp.now(),
    };
    await updateDoc(expenseRef, expenseWithTimestamp);
    return {
      id: expenseId,
      ...expenseData,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error updating expense: ", error);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (userId, expenseId) => {
  try {
    const expenseRef = doc(db, "users", userId, "expenses", expenseId);
    await deleteDoc(expenseRef);
    return expenseId;
  } catch (error) {
    console.error("Error deleting expense: ", error);
    throw error;
  }
};

// Get all expenses for a user
export const getExpenses = async (userId, filters = {}) => {
  try {
    const expensesRef = getExpensesRef(userId);
    let q = expensesRef;

    const constraints = [];
    if (filters.startDate) {
      constraints.push(
        where("date", ">=", Timestamp.fromDate(new Date(filters.startDate)))
      );
    }
    if (filters.endDate) {
      constraints.push(
        where("date", "<=", Timestamp.fromDate(new Date(filters.endDate)))
      );
    }
    if (filters.category) {
      constraints.push(where("category", "==", filters.category));
    }

    constraints.push(orderBy("date", "desc"));

    if (constraints.length > 0) {
      q = query(expensesRef, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    const expenses = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        id: doc.id,
        ...data,
        amount: Number(data.amount),
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    return expenses;
  } catch (error) {
    console.error("Error getting expenses: ", error);
    throw error;
  }
};

// CATEGORIES

// Get categories collection reference
const getCategoriesRef = (userId) => {
  return collection(db, "users", userId, "categories");
};

// Add a new category
export const addCategory = async (userId, categoryData) => {
  try {
    const docRef = await addDoc(getCategoriesRef(userId), {
      ...categoryData,
      color: categoryData.color || generatePastelColor(),
      createdAt: Timestamp.now(),
      userId,
    });
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error("Error adding category: ", error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (userId, categoryId, categoryData) => {
  try {
    const categoryRef = doc(db, "users", userId, "categories", categoryId);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: Timestamp.now(),
    });
    return { id: categoryId, ...categoryData };
  } catch (error) {
    console.error("Error updating category: ", error);
    throw error;
  }
};

// Get all categories for a user
export const getCategories = async (userId) => {
  try {
    const querySnapshot = await getDocs(getCategoriesRef(userId));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return categories;
  } catch (error) {
    console.error("Error getting categories: ", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (userId, categoryId) => {
  try {
    const categoryRef = doc(db, "users", userId, "categories", categoryId);
    await deleteDoc(categoryRef);
    return categoryId;
  } catch (error) {
    console.error("Error deleting category: ", error);
    throw error;
  }
};

// Helper function to generate pastel colors
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 20) + 70; // 70-90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// FINANCIAL REPORTS (Consolidated from Reports + Snapshots)

// Get financial reports collection reference
const getFinancialReportsRef = (userId) => {
  return collection(db, "users", userId, "financialReports");
};

// Add a new financial report
export const addFinancialReport = async (userId, reportData) => {
  try {
    const reportWithTimestamp = {
      ...reportData,
      month: reportData.month || new Date().toISOString().slice(0, 7), // YYYY-MM format
      createdAt: Timestamp.now(),
      userId,
    };
    const docRef = await addDoc(getFinancialReportsRef(userId), reportWithTimestamp);
    return {
      id: docRef.id,
      ...reportData,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding financial report: ", error);
    throw error;
  }
};

// Get all financial reports for a user
export const getFinancialReports = async (userId, filters = {}) => {
  try {
    console.log('Getting financial reports for user:', userId, 'with filters:', filters);
    const reportsRef = getFinancialReportsRef(userId);
    let q = reportsRef;

    const constraints = [];
    if (filters.startMonth) {
      constraints.push(where("month", ">=", filters.startMonth));
    }
    if (filters.endMonth) {
      constraints.push(where("month", "<=", filters.endMonth));
    }
    if (filters.type) {
      constraints.push(where("type", "==", filters.type));
    }

    constraints.push(orderBy("month", "desc"));

    if (constraints.length > 0) {
      q = query(reportsRef, ...constraints);
    }

    console.log('Executing query with constraints:', constraints.length);
    const querySnapshot = await getDocs(q);
    const reports = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    console.log('Successfully loaded', reports.length, 'financial reports');
    return reports;
  } catch (error) {
    console.error("Error getting financial reports: ", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      userId: userId,
      filters: filters
    });
    throw error;
  }
};

// Get the latest financial report
export const getLatestFinancialReport = async (userId) => {
  try {
    const reportsRef = getFinancialReportsRef(userId);
    const q = query(reportsRef, orderBy("month", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error getting latest financial report: ", error);
    throw error;
  }
};

// Update a financial report
export const updateFinancialReport = async (userId, reportId, reportData) => {
  try {
    const reportRef = doc(db, "users", userId, "financialReports", reportId);
    const reportWithTimestamp = {
      ...reportData,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(reportRef, reportWithTimestamp);
    return {
      id: reportId,
      ...reportData,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error updating financial report: ", error);
    throw error;
  }
};

// Delete a financial report
export const deleteFinancialReport = async (userId, reportId) => {
  try {
    const reportRef = doc(db, "users", userId, "financialReports", reportId);
    await deleteDoc(reportRef);
    return reportId;
  } catch (error) {
    console.error("Error deleting financial report: ", error);
    throw error;
  }
};

// Create a comprehensive financial report from current data
export const createFinancialReport = async (userId, type = 'monthly', customName = null) => {
  try {
    console.log('Creating financial report for user:', userId, 'type:', type);
    
    // Get all current data
    const accounts = await getAccounts(userId);
    const debts = await getDebts(userId);
    const expenses = await getExpenses(userId);
    const categories = await getCategories(userId);
    
    console.log('Retrieved data:', {
      accountsCount: accounts.length,
      debtsCount: debts.length,
      expensesCount: expenses.length,
      categoriesCount: categories.length
    });
    
    // Calculate totals with safety checks
    const totalAssets = accounts.reduce((sum, account) => {
      const balance = Number(account.balance) || 0;
      return sum + balance;
    }, 0);
    
    const totalDebts = debts
      .filter(debt => debt.isDebt === true)
      .reduce((sum, debt) => {
        const amount = Number(debt.amount) || 0;
        return sum + amount;
      }, 0);
    
    const totalLoans = debts
      .filter(debt => debt.isDebt === false)
      .reduce((sum, debt) => {
        const amount = Number(debt.amount) || 0;
        return sum + amount;
      }, 0);
    
    const netWorth = totalAssets - totalDebts + totalLoans;
    
    console.log('Calculated totals:', {
      totalAssets,
      totalDebts,
      totalLoans,
      netWorth
    });
    
    // Calculate monthly expenses by category
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(expense => {
      if (!expense.date) return false;
      const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
      return expenseDate.toISOString().slice(0, 7) === currentMonth;
    });
    
    const expensesByCategory = {};
    monthlyExpenses.forEach(expense => {
      const category = expense.category || 'Uncategorized';
      const amount = Number(expense.amount) || 0;
      if (!expensesByCategory[category]) {
        expensesByCategory[category] = 0;
      }
      expensesByCategory[category] += amount;
    });
    
    console.log('Monthly expenses by category:', expensesByCategory);
    
    // Create report data with safety checks
    const reportData = {
      month: currentMonth,
      type: type, // 'monthly', 'quarterly', 'annual', 'custom'
      name: customName || `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      accounts: accounts.map(account => ({
        id: account.id || '',
        name: account.name || '',
        type: account.type || '',
        balance: Number(account.balance) || 0,
      })),
      debts: debts.map(debt => ({
        id: debt.id || '',
        name: debt.name || '',
        type: debt.type || '',
        amount: Number(debt.amount) || 0,
        isDebt: Boolean(debt.isDebt),
        status: debt.status || 'Active',
      })),
      expensesByCategory,
      totals: {
        totalAssets: Number(totalAssets) || 0,
        totalDebts: Number(totalDebts) || 0,
        totalLoans: Number(totalLoans) || 0,
        netWorth: Number(netWorth) || 0,
        monthlyExpenses: monthlyExpenses.reduce((sum, expense) => {
          const amount = Number(expense.amount) || 0;
          return sum + amount;
        }, 0),
      },
      metadata: {
        accountCount: accounts.length || 0,
        debtCount: debts.length || 0,
        expenseCount: monthlyExpenses.length || 0,
        categoryCount: categories.length || 0,
      }
    };
    
    console.log('Report data prepared:', reportData);
    
    return await addFinancialReport(userId, reportData);
  } catch (error) {
    console.error("Error creating financial report: ", error);
    throw error;
  }
};

// Create a custom report with specific data
export const createCustomReport = async (userId, reportName, customData) => {
  try {
    const reportData = {
      month: new Date().toISOString().slice(0, 7),
      type: 'custom',
      name: reportName,
      ...customData,
    };
    
    return await addFinancialReport(userId, reportData);
  } catch (error) {
    console.error("Error creating custom report: ", error);
    throw error;
  }
};

// Load a specific report with all details
export const loadFinancialReport = async (userId, reportId) => {
  try {
    const reportRef = doc(db, "users", userId, "financialReports", reportId);
    const reportSnap = await getDoc(reportRef);

    if (!reportSnap.exists()) {
      throw new Error("Financial report not found");
    }

    const reportData = reportSnap.data();
    return {
      id: reportSnap.id,
      ...reportData,
      createdAt: reportData.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error loading financial report: ", error);
    throw error;
  }
};

// ACCOUNTS

// Get accounts collection reference
const getAccountsRef = (userId) => {
  return collection(db, "users", userId, "accounts");
};

// Add a new account
export const addAccount = async (userId, accountData) => {
  try {
    const accountWithTimestamp = {
      ...accountData,
      balance: parseFloat(accountData.balance) || 0,
      createdAt: Timestamp.now(),
      userId,
    };
    const docRef = await addDoc(getAccountsRef(userId), accountWithTimestamp);
    return {
      id: docRef.id,
      ...accountData,
      balance: parseFloat(accountData.balance) || 0,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding account: ", error);
    throw error;
  }
};

// Update an account
export const updateAccount = async (userId, accountId, accountData) => {
  try {
    const accountRef = doc(db, "users", userId, "accounts", accountId);
    const accountWithTimestamp = {
      ...accountData,
      balance: parseFloat(accountData.balance) || 0,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(accountRef, accountWithTimestamp);
    return {
      id: accountId,
      ...accountData,
      balance: parseFloat(accountData.balance) || 0,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error updating account: ", error);
    throw error;
  }
};

// Delete an account
export const deleteAccount = async (userId, accountId) => {
  try {
    const accountRef = doc(db, "users", userId, "accounts", accountId);
    await deleteDoc(accountRef);
    return accountId;
  } catch (error) {
    console.error("Error deleting account: ", error);
    throw error;
  }
};

// Get all accounts for a user
export const getAccounts = async (userId) => {
  try {
    const querySnapshot = await getDocs(getAccountsRef(userId));
    const accounts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      accounts.push({
        id: doc.id,
        ...data,
        balance: Number(data.balance) || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    return accounts;
  } catch (error) {
    console.error("Error getting accounts: ", error);
    throw error;
  }
};

// TRANSFERS

// Get transfers collection reference
const getTransfersRef = (userId) => {
  return collection(db, "users", userId, "transfers");
};

// Add a new transfer
export const addTransfer = async (userId, transferData) => {
  try {
    const transferWithTimestamp = {
      ...transferData,
      amount: parseFloat(transferData.amount),
      date: Timestamp.fromDate(new Date(transferData.date)),
      createdAt: Timestamp.now(),
      userId,
    };
    const docRef = await addDoc(getTransfersRef(userId), transferWithTimestamp);
    return {
      id: docRef.id,
      ...transferData,
      amount: parseFloat(transferData.amount),
      date: new Date(transferData.date),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding transfer: ", error);
    throw error;
  }
};

// Get all transfers for a user
export const getTransfers = async (userId, filters = {}) => {
  try {
    const transfersRef = getTransfersRef(userId);
    let q = transfersRef;

    const constraints = [];
    if (filters.startDate) {
      constraints.push(
        where("date", ">=", Timestamp.fromDate(new Date(filters.startDate)))
      );
    }
    if (filters.endDate) {
      constraints.push(
        where("date", "<=", Timestamp.fromDate(new Date(filters.endDate)))
      );
    }
    if (filters.fromAccount) {
      constraints.push(where("fromAccount", "==", filters.fromAccount));
    }
    if (filters.toAccount) {
      constraints.push(where("toAccount", "==", filters.toAccount));
    }

    constraints.push(orderBy("date", "desc"));

    if (constraints.length > 0) {
      q = query(transfersRef, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    const transfers = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transfers.push({
        id: doc.id,
        ...data,
        amount: Number(data.amount),
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    return transfers;
  } catch (error) {
    console.error("Error getting transfers: ", error);
    throw error;
  }
};

// Delete a transfer
export const deleteTransfer = async (userId, transferId) => {
  try {
    const transferRef = doc(db, "users", userId, "transfers", transferId);
    await deleteDoc(transferRef);
    return transferId;
  } catch (error) {
    console.error("Error deleting transfer: ", error);
    throw error;
  }
};

// BUDGET ALLOCATIONS

// Get budget allocations collection reference
const getBudgetAllocationsRef = (userId) => {
  return collection(db, "users", userId, "budgetAllocations");
};

// Add a new budget allocation
export const addBudgetAllocation = async (userId, allocationData) => {
  try {
    const allocationWithTimestamp = {
      ...allocationData,
      amount: parseFloat(allocationData.amount),
      month: allocationData.month, // Format: "YYYY-MM"
      createdAt: Timestamp.now(),
      userId,
    };
    const docRef = await addDoc(getBudgetAllocationsRef(userId), allocationWithTimestamp);
    return {
      id: docRef.id,
      ...allocationData,
      amount: parseFloat(allocationData.amount),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding budget allocation: ", error);
    throw error;
  }
};

// Get budget allocations for a user
export const getBudgetAllocations = async (userId, month = null) => {
  try {
    const allocationsRef = getBudgetAllocationsRef(userId);
    let q = allocationsRef;

    if (month) {
      q = query(allocationsRef, where("month", "==", month));
    }

    const querySnapshot = await getDocs(q);
    const allocations = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allocations.push({
        id: doc.id,
        ...data,
        amount: Number(data.amount),
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    return allocations;
  } catch (error) {
    console.error("Error getting budget allocations: ", error);
    throw error;
  }
};

// Update a budget allocation
export const updateBudgetAllocation = async (userId, allocationId, allocationData) => {
  try {
    const allocationRef = doc(db, "users", userId, "budgetAllocations", allocationId);
    const allocationWithTimestamp = {
      ...allocationData,
      amount: parseFloat(allocationData.amount),
      updatedAt: Timestamp.now(),
    };
    await updateDoc(allocationRef, allocationWithTimestamp);
    return {
      id: allocationId,
      ...allocationData,
      amount: parseFloat(allocationData.amount),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error updating budget allocation: ", error);
    throw error;
  }
};

// Delete a budget allocation
export const deleteBudgetAllocation = async (userId, allocationId) => {
  try {
    const allocationRef = doc(db, "users", userId, "budgetAllocations", allocationId);
    await deleteDoc(allocationRef);
    return allocationId;
  } catch (error) {
    console.error("Error deleting budget allocation: ", error);
    throw error;
  }
};

// DEBTS/LOANS

// Get debts collection reference
const getDebtsRef = (userId) => {
  return collection(db, "users", userId, "debts");
};

// Add a new debt/loan
export const addDebt = async (userId, debtData) => {
  try {
    const debtWithTimestamp = {
      ...debtData,
      createdAt: Timestamp.now(),
      userId,
    };
    const docRef = await addDoc(getDebtsRef(userId), debtWithTimestamp);
    return {
      id: docRef.id,
      ...debtData,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding debt: ", error);
    throw error;
  }
};

// Update a debt/loan
export const updateDebt = async (userId, debtId, debtData) => {
  try {
    const debtRef = doc(db, "users", userId, "debts", debtId);
    const debtWithTimestamp = {
      ...debtData,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(debtRef, debtWithTimestamp);
    return {
      id: debtId,
      ...debtData,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error updating debt: ", error);
    throw error;
  }
};

// Delete a debt/loan
export const deleteDebt = async (userId, debtId) => {
  try {
    const debtRef = doc(db, "users", userId, "debts", debtId);
    await deleteDoc(debtRef);
    return debtId;
  } catch (error) {
    console.error("Error deleting debt: ", error);
    throw error;
  }
};

// Get all debts/loans for a user
export const getDebts = async (userId) => {
  try {
    const querySnapshot = await getDocs(getDebtsRef(userId));
    const debts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      debts.push({
        id: doc.id,
        ...data,
        amount: Number(data.amount) || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    return debts;
  } catch (error) {
    console.error("Error getting debts: ", error);
    throw error;
  }
};

// Populate database with sample data
export const populateSampleData = async (userId) => {
  try {
    console.log('Starting to populate sample data for user:', userId);
    
    // First, clear all existing data
    console.log('Clearing existing data...');
    
    // Get all existing data
    const existingCategories = await getCategories(userId);
    const existingAccounts = await getAccounts(userId);
    const existingDebts = await getDebts(userId);
    const existingExpenses = await getExpenses(userId);
    
    // Delete all existing categories
    for (const category of existingCategories) {
      await deleteCategory(userId, category.id);
    }
    
    // Delete all existing accounts
    for (const account of existingAccounts) {
      await deleteAccount(userId, account.id);
    }
    
    // Delete all existing debts
    for (const debt of existingDebts) {
      await deleteDebt(userId, debt.id);
    }
    
    // Delete all existing expenses
    for (const expense of existingExpenses) {
      await deleteExpense(userId, expense.id);
    }
    
    console.log('Existing data cleared successfully');
    
    // Sample categories
    const sampleCategories = [
      { name: 'Food & Dining', color: '#FF6B6B' },
      { name: 'Transportation', color: '#4ECDC4' },
      { name: 'Housing', color: '#45B7D1' },
      { name: 'Entertainment', color: '#96CEB4' },
      { name: 'Shopping', color: '#FFEAA7' },
      { name: 'Healthcare', color: '#DDA0DD' },
      { name: 'Utilities', color: '#98D8C8' },
      { name: 'Education', color: '#F7DC6F' }
    ];

    // Sample accounts
    const sampleAccounts = [
      { name: 'Checking Account', type: 'Checking', balance: 5000 },
      { name: 'Savings Account', type: 'Savings', balance: 15000 },
      { name: 'Credit Card', type: 'Credit', balance: -1200 },
      { name: 'Investment Portfolio', type: 'Investment', balance: 25000 }
    ];

    // Sample debts
    const sampleDebts = [
      { name: 'Student Loan', type: 'Student Loan', amount: 25000, isDebt: true, status: 'Active' },
      { name: 'Car Loan', type: 'Auto Loan', amount: 15000, isDebt: true, status: 'Active' },
      { name: 'Credit Card Debt', type: 'Credit Card', amount: 3000, isDebt: true, status: 'Active' }
    ];

    // Sample expenses (last 3 months)
    const sampleExpenses = [
      // Current month
      { amount: 450, category: 'Food & Dining', description: 'Grocery shopping', name: 'Grocery shopping', date: new Date() },
      { amount: 85, category: 'Food & Dining', description: 'Restaurant dinner', name: 'Restaurant dinner', date: new Date() },
      { amount: 120, category: 'Transportation', description: 'Gas and parking', name: 'Gas and parking', date: new Date() },
      { amount: 65, category: 'Transportation', description: 'Public transport', name: 'Public transport', date: new Date() },
      { amount: 1800, category: 'Housing', description: 'Rent payment', name: 'Rent payment', date: new Date() },
      { amount: 120, category: 'Housing', description: 'Electricity bill', name: 'Electricity bill', date: new Date() },
      { amount: 85, category: 'Housing', description: 'Internet service', name: 'Internet service', date: new Date() },
      { amount: 45, category: 'Housing', description: 'Home maintenance', name: 'Home maintenance', date: new Date() },
      { amount: 80, category: 'Entertainment', description: 'Movie night', name: 'Movie night', date: new Date() },
      { amount: 120, category: 'Entertainment', description: 'Concert tickets', name: 'Concert tickets', date: new Date() },
      { amount: 200, category: 'Shopping', description: 'Clothing', name: 'Clothing', date: new Date() },
      { amount: 150, category: 'Shopping', description: 'Electronics', name: 'Electronics', date: new Date() },
      { amount: 150, category: 'Healthcare', description: 'Doctor visit', name: 'Doctor visit', date: new Date() },
      { amount: 75, category: 'Healthcare', description: 'Pharmacy', name: 'Pharmacy', date: new Date() },
      { amount: 95, category: 'Utilities', description: 'Water bill', name: 'Water bill', date: new Date() },
      { amount: 60, category: 'Utilities', description: 'Gas bill', name: 'Gas bill', date: new Date() },
      { amount: 200, category: 'Education', description: 'Online course', name: 'Online course', date: new Date() },
      
      // Last month
      { amount: 420, category: 'Food & Dining', description: 'Grocery shopping', name: 'Grocery shopping', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 95, category: 'Food & Dining', description: 'Takeout meals', name: 'Takeout meals', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 110, category: 'Transportation', description: 'Gas and parking', name: 'Gas and parking', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 70, category: 'Transportation', description: 'Car maintenance', name: 'Car maintenance', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 1800, category: 'Housing', description: 'Rent payment', name: 'Rent payment', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 115, category: 'Housing', description: 'Electricity bill', name: 'Electricity bill', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 85, category: 'Housing', description: 'Internet service', name: 'Internet service', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 60, category: 'Entertainment', description: 'Restaurant', name: 'Restaurant', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 90, category: 'Entertainment', description: 'Gym membership', name: 'Gym membership', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 300, category: 'Shopping', description: 'Electronics', name: 'Electronics', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 180, category: 'Shopping', description: 'Home decor', name: 'Home decor', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 120, category: 'Healthcare', description: 'Dental checkup', name: 'Dental checkup', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 90, category: 'Utilities', description: 'Water bill', name: 'Water bill', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { amount: 150, category: 'Education', description: 'Books and materials', name: 'Books and materials', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      
      // Two months ago
      { amount: 480, category: 'Food & Dining', description: 'Grocery shopping', name: 'Grocery shopping', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 75, category: 'Food & Dining', description: 'Coffee shops', name: 'Coffee shops', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 130, category: 'Transportation', description: 'Gas and parking', name: 'Gas and parking', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 55, category: 'Transportation', description: 'Public transport', name: 'Public transport', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 1800, category: 'Housing', description: 'Rent payment', name: 'Rent payment', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 125, category: 'Housing', description: 'Electricity bill', name: 'Electricity bill', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 85, category: 'Housing', description: 'Internet service', name: 'Internet service', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 100, category: 'Entertainment', description: 'Concert tickets', name: 'Concert tickets', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 45, category: 'Entertainment', description: 'Streaming services', name: 'Streaming services', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 250, category: 'Shopping', description: 'Home goods', name: 'Home goods', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 140, category: 'Shopping', description: 'Clothing', name: 'Clothing', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 95, category: 'Healthcare', description: 'Pharmacy', name: 'Pharmacy', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 85, category: 'Utilities', description: 'Gas bill', name: 'Gas bill', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { amount: 180, category: 'Education', description: 'Workshop fee', name: 'Workshop fee', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
    ];

    console.log('Adding new sample data...');

    // Add categories
    const categoryIds = {};
    for (const category of sampleCategories) {
      const addedCategory = await addCategory(userId, category);
      categoryIds[category.name] = addedCategory.id;
    }

    // Add accounts
    for (const account of sampleAccounts) {
      await addAccount(userId, account);
    }

    // Add debts
    for (const debt of sampleDebts) {
      await addDebt(userId, debt);
    }

    // Add expenses
    for (const expense of sampleExpenses) {
      await addExpense(userId, expense);
    }

    // Create a financial report (with error handling)
    try {
      await createFinancialReport(userId);
      console.log('Financial report created successfully');
    } catch (reportError) {
      console.warn('Failed to create financial report, but sample data was added:', reportError);
      // Continue with the process even if report fails
    }

    console.log('Sample data populated successfully');

    return {
      categories: sampleCategories.length,
      accounts: sampleAccounts.length,
      debts: sampleDebts.length,
      expenses: sampleExpenses.length
    };
  } catch (error) {
    console.error("Error populating sample data: ", error);
    throw error;
  }
};
