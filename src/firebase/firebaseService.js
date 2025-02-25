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
      date: Timestamp.fromDate(new Date(expenseData.date)),
      createdAt: Timestamp.now(),
      userId,
    };
    const docRef = await addDoc(getExpensesRef(userId), expenseWithTimestamp);
    return {
      id: docRef.id,
      ...expenseData,
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
      createdAt: Timestamp.now(),
      userId,
    });
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error("Error adding category: ", error);
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

// REPORTS

// Get reports collection reference
const getReportsRef = (userId) => {
  return collection(db, "users", userId, "reports");
};

// Add a new report
export const addReport = async (userId, reportData) => {
  try {
    const reportWithTimestamp = {
      ...reportData,
      exportDate: Timestamp.fromDate(new Date(reportData.exportDate)),
      createdAt: Timestamp.now(),
      userId,
    };
    const docRef = await addDoc(getReportsRef(userId), reportWithTimestamp);
    return {
      id: docRef.id,
      ...reportData,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding report: ", error);
    throw error;
  }
};

// Get all reports for a user
export const getReports = async (userId) => {
  try {
    const q = query(getReportsRef(userId), orderBy("exportDate", "desc"));
    const querySnapshot = await getDocs(q);
    const reports = [];
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return reports;
  } catch (error) {
    console.error("Error getting reports: ", error);
    throw error;
  }
};

// Delete a report
export const deleteReport = async (userId, reportId) => {
  try {
    const reportRef = doc(db, "users", userId, "reports", reportId);
    await deleteDoc(reportRef);
    return reportId;
  } catch (error) {
    console.error("Error deleting report: ", error);
    throw error;
  }
};

// Load a report with all associated expenses
export const loadReport = async (userId, reportId) => {
  try {
    // Get the report document
    const reportRef = doc(db, "users", userId, "reports", reportId);
    const reportSnap = await getDoc(reportRef);

    if (!reportSnap.exists()) {
      throw new Error("Report not found");
    }

    const reportData = reportSnap.data();

    // If the report contains expense IDs, fetch those expenses
    let expenses = [];
    if (reportData.expenses && Array.isArray(reportData.expenses)) {
      // For reports that store the full expense objects directly
      if (typeof reportData.expenses[0] === "object") {
        expenses = reportData.expenses.map((exp) => ({
          ...exp,
          date:
            exp.date instanceof Timestamp
              ? exp.date.toDate()
              : new Date(exp.date),
          amount: Number(exp.amount),
        }));
      } else {
        // For reports that store just the expense IDs
        const expensesPromises = reportData.expenses.map(async (expenseId) => {
          const expenseDoc = await getDoc(
            doc(db, "users", userId, "expenses", expenseId)
          );
          if (expenseDoc.exists()) {
            const expData = expenseDoc.data();
            return {
              id: expenseDoc.id,
              ...expData,
              amount: Number(expData.amount),
              date: expData.date?.toDate() || new Date(),
            };
          }
          return null;
        });

        // Wait for all expense docs to be fetched
        const fetchedExpenses = await Promise.all(expensesPromises);
        expenses = fetchedExpenses.filter((exp) => exp !== null);
      }
    }

    return {
      id: reportSnap.id,
      total: reportData.total,
      name: reportData.name,
      exportDate:
        reportData.exportDate instanceof Timestamp
          ? reportData.exportDate.toDate()
          : new Date(reportData.exportDate),
      expenses,
    };
  } catch (error) {
    console.error("Error loading report: ", error);
    throw error;
  }
};
