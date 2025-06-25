import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExpenseTracker from '../../components/ExpenseTracker'
import { AuthContext } from '../../context/AuthContext'

// Mock the AuthContext
const mockAuthContext = {
  currentUser: {
    uid: 'test-user-id',
    email: 'test@example.com'
  },
  logout: vi.fn()
}

// Mock Firebase onSnapshot
const mockOnSnapshot = vi.fn()
const mockUnsubscribe = vi.fn()

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: mockOnSnapshot.mockReturnValue(mockUnsubscribe),
  query: vi.fn(),
  orderBy: vi.fn(),
  Timestamp: {
    now: () => ({ toDate: () => new Date() })
  }
}))

const renderWithAuth = (component) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      {component}
    </AuthContext.Provider>
  )
}

describe('ExpenseTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockOnSnapshot.mockImplementation((ref, callback) => {
      // Simulate successful data loading
      callback({
        exists: () => true,
        data: () => ({
          email: 'test@example.com',
          totalBudget: 1000,
          createdAt: { toDate: () => new Date() }
        })
      })
      return mockUnsubscribe
    })
  })

  it('renders loading state initially', () => {
    mockOnSnapshot.mockImplementation(() => mockUnsubscribe)
    
    renderWithAuth(<ExpenseTracker />)
    
    expect(screen.getByText('Loading your expense tracker...')).toBeInTheDocument()
  })

  it('renders main interface after loading', async () => {
    renderWithAuth(<ExpenseTracker />)
    
    await waitFor(() => {
      expect(screen.getByText('Expenses')).toBeInTheDocument()
      expect(screen.getByText('Accounts')).toBeInTheDocument()
      expect(screen.getByText('Transfers')).toBeInTheDocument()
      expect(screen.getByText('Budget Allocations')).toBeInTheDocument()
    })
  })

  it('shows expenses tab by default', async () => {
    renderWithAuth(<ExpenseTracker />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Starting Amount')).toBeInTheDocument()
      expect(screen.getByText('Remaining Balance')).toBeInTheDocument()
    })
  })

  it('switches to accounts tab when clicked', async () => {
    const user = userEvent.setup()
    renderWithAuth(<ExpenseTracker />)
    
    await waitFor(() => {
      expect(screen.getByText('Accounts')).toBeInTheDocument()
    })
    
    const accountsTab = screen.getByText('Accounts')
    await user.click(accountsTab)
    
    expect(screen.getByText('Add Account')).toBeInTheDocument()
  })

  it('switches to transfers tab when clicked', async () => {
    const user = userEvent.setup()
    renderWithAuth(<ExpenseTracker />)
    
    await waitFor(() => {
      expect(screen.getByText('Transfers')).toBeInTheDocument()
    })
    
    const transfersTab = screen.getByText('Transfers')
    await user.click(transfersTab)
    
    expect(screen.getByText('Add Transfer')).toBeInTheDocument()
  })

  it('switches to budget allocations tab when clicked', async () => {
    const user = userEvent.setup()
    renderWithAuth(<ExpenseTracker />)
    
    await waitFor(() => {
      expect(screen.getByText('Budget Allocations')).toBeInTheDocument()
    })
    
    const allocationsTab = screen.getByText('Budget Allocations')
    await user.click(allocationsTab)
    
    expect(screen.getByText('Add Budget Allocation')).toBeInTheDocument()
  })

  it('shows error message when Firebase operations fail', async () => {
    mockOnSnapshot.mockImplementation((ref, callback, errorCallback) => {
      errorCallback(new Error('Firebase error'))
      return mockUnsubscribe
    })
    
    renderWithAuth(<ExpenseTracker />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load user profile')).toBeInTheDocument()
    })
  })

  it('calculates remaining balance correctly', async () => {
    renderWithAuth(<ExpenseTracker />)
    
    await waitFor(() => {
      const balanceElement = screen.getByText('€1000.00')
      expect(balanceElement).toBeInTheDocument()
    })
  })

  it('handles negative balance display', async () => {
    mockOnSnapshot.mockImplementation((ref, callback) => {
      callback({
        exists: () => true,
        data: () => ({
          email: 'test@example.com',
          totalBudget: 500,
          createdAt: { toDate: () => new Date() }
        })
      })
      return mockUnsubscribe
    })
    
    renderWithAuth(<ExpenseTracker />)
    
    await waitFor(() => {
      const balanceElement = screen.getByText('€500.00')
      expect(balanceElement).toBeInTheDocument()
    })
  })
}) 