import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Firebase
vi.mock('../firebase/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com'
    },
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn()
  },
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    onSnapshot: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    where: vi.fn(),
    Timestamp: {
      now: () => ({ toDate: () => new Date() }),
      fromDate: (date) => ({ toDate: () => date })
    }
  }
}))

// Mock Firebase service functions
vi.mock('../firebase/firebaseService', () => ({
  addExpense: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
  getExpenses: vi.fn(),
  addAccount: vi.fn(),
  updateAccount: vi.fn(),
  deleteAccount: vi.fn(),
  getAccounts: vi.fn(),
  addTransfer: vi.fn(),
  getTransfers: vi.fn(),
  deleteTransfer: vi.fn(),
  addBudgetAllocation: vi.fn(),
  getBudgetAllocations: vi.fn(),
  updateBudgetAllocation: vi.fn(),
  deleteBudgetAllocation: vi.fn()
}))

// Mock CSS modules
vi.mock('*.module.css', () => ({
  default: new Proxy({}, {
    get: () => 'mock-class-name'
  })
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}) 