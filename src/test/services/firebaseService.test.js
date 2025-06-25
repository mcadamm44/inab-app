import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  addAccount,
  updateAccount,
  deleteAccount,
  getAccounts,
  addTransfer,
  getTransfers,
  deleteTransfer,
  addBudgetAllocation,
  getBudgetAllocations,
  updateBudgetAllocation,
  deleteBudgetAllocation
} from '../../firebase/firebaseService'

// Mock Firebase Firestore
const mockAddDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockDeleteDoc = vi.fn()
const mockGetDocs = vi.fn()
const mockCollection = vi.fn()
const mockDoc = vi.fn()
const mockQuery = vi.fn()
const mockOrderBy = vi.fn()
const mockWhere = vi.fn()
const mockTimestamp = {
  now: vi.fn(() => ({ toDate: () => new Date() })),
  fromDate: vi.fn((date) => ({ toDate: () => date }))
}

vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  doc: mockDoc,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  getDocs: mockGetDocs,
  query: mockQuery,
  orderBy: mockOrderBy,
  where: mockWhere,
  Timestamp: mockTimestamp
}))

describe('Firebase Service Functions', () => {
  const testUserId = 'test-user-id'
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Account Management', () => {
    it('adds an account successfully', async () => {
      const accountData = {
        name: 'Test Account',
        type: 'Savings',
        balance: 1000,
        description: 'Test description',
        color: '#FF0000'
      }

      const mockDocRef = { id: 'account-id' }
      mockAddDoc.mockResolvedValue(mockDocRef)

      const result = await addAccount(testUserId, accountData)

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...accountData,
          balance: 1000,
          createdAt: expect.anything(),
          userId: testUserId
        })
      )

      expect(result).toEqual({
        id: 'account-id',
        ...accountData,
        balance: 1000,
        createdAt: expect.any(Date)
      })
    })

    it('updates an account successfully', async () => {
      const accountId = 'account-id'
      const accountData = {
        name: 'Updated Account',
        balance: 2000
      }

      mockUpdateDoc.mockResolvedValue()

      const result = await updateAccount(testUserId, accountId, accountData)

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...accountData,
          balance: 2000,
          updatedAt: expect.anything()
        })
      )

      expect(result).toEqual({
        id: accountId,
        ...accountData,
        balance: 2000,
        updatedAt: expect.any(Date)
      })
    })

    it('deletes an account successfully', async () => {
      const accountId = 'account-id'
      mockDeleteDoc.mockResolvedValue()

      const result = await deleteAccount(testUserId, accountId)

      expect(mockDeleteDoc).toHaveBeenCalledWith(expect.anything())
      expect(result).toBe(accountId)
    })

    it('gets all accounts successfully', async () => {
      const mockAccounts = [
        { id: 'account1', name: 'Account 1', balance: 1000 },
        { id: 'account2', name: 'Account 2', balance: 2000 }
      ]

      const mockQuerySnapshot = {
        forEach: (callback) => {
          mockAccounts.forEach((account, index) => {
            callback({
              id: account.id,
              data: () => account
            })
          })
        }
      }

      mockGetDocs.mockResolvedValue(mockQuerySnapshot)

      const result = await getAccounts(testUserId)

      expect(result).toEqual([
        { id: 'account1', name: 'Account 1', balance: 1000, createdAt: expect.any(Date) },
        { id: 'account2', name: 'Account 2', balance: 2000, createdAt: expect.any(Date) }
      ])
    })
  })

  describe('Transfer Management', () => {
    it('adds a transfer successfully', async () => {
      const transferData = {
        fromAccount: 'account1',
        toAccount: 'account2',
        amount: 500,
        date: '2024-01-01',
        description: 'Test transfer'
      }

      const mockDocRef = { id: 'transfer-id' }
      mockAddDoc.mockResolvedValue(mockDocRef)

      const result = await addTransfer(testUserId, transferData)

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...transferData,
          amount: 500,
          date: expect.anything(),
          createdAt: expect.anything(),
          userId: testUserId
        })
      )

      expect(result).toEqual({
        id: 'transfer-id',
        ...transferData,
        amount: 500,
        date: expect.any(Date),
        createdAt: expect.any(Date)
      })
    })

    it('gets transfers with filters', async () => {
      const filters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        fromAccount: 'account1'
      }

      const mockTransfers = [
        { id: 'transfer1', fromAccount: 'account1', amount: 500 }
      ]

      const mockQuerySnapshot = {
        forEach: (callback) => {
          mockTransfers.forEach((transfer) => {
            callback({
              id: transfer.id,
              data: () => transfer
            })
          })
        }
      }

      mockGetDocs.mockResolvedValue(mockQuerySnapshot)

      const result = await getTransfers(testUserId, filters)

      expect(result).toEqual([
        { id: 'transfer1', fromAccount: 'account1', amount: 500, date: expect.any(Date), createdAt: expect.any(Date) }
      ])
    })

    it('deletes a transfer successfully', async () => {
      const transferId = 'transfer-id'
      mockDeleteDoc.mockResolvedValue()

      const result = await deleteTransfer(testUserId, transferId)

      expect(mockDeleteDoc).toHaveBeenCalledWith(expect.anything())
      expect(result).toBe(transferId)
    })
  })

  describe('Budget Allocation Management', () => {
    it('adds a budget allocation successfully', async () => {
      const allocationData = {
        accountId: 'account1',
        amount: 1000,
        month: '2024-01',
        description: 'Monthly savings'
      }

      const mockDocRef = { id: 'allocation-id' }
      mockAddDoc.mockResolvedValue(mockDocRef)

      const result = await addBudgetAllocation(testUserId, allocationData)

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...allocationData,
          amount: 1000,
          createdAt: expect.anything(),
          userId: testUserId
        })
      )

      expect(result).toEqual({
        id: 'allocation-id',
        ...allocationData,
        amount: 1000,
        createdAt: expect.any(Date)
      })
    })

    it('gets budget allocations for specific month', async () => {
      const month = '2024-01'
      const mockAllocations = [
        { id: 'allocation1', accountId: 'account1', amount: 1000, month: '2024-01' }
      ]

      const mockQuerySnapshot = {
        forEach: (callback) => {
          mockAllocations.forEach((allocation) => {
            callback({
              id: allocation.id,
              data: () => allocation
            })
          })
        }
      }

      mockGetDocs.mockResolvedValue(mockQuerySnapshot)

      const result = await getBudgetAllocations(testUserId, month)

      expect(result).toEqual([
        { id: 'allocation1', accountId: 'account1', amount: 1000, month: '2024-01', createdAt: expect.any(Date) }
      ])
    })

    it('updates a budget allocation successfully', async () => {
      const allocationId = 'allocation-id'
      const allocationData = {
        amount: 1500,
        description: 'Updated allocation'
      }

      mockUpdateDoc.mockResolvedValue()

      const result = await updateBudgetAllocation(testUserId, allocationId, allocationData)

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...allocationData,
          amount: 1500,
          updatedAt: expect.anything()
        })
      )

      expect(result).toEqual({
        id: allocationId,
        ...allocationData,
        amount: 1500,
        updatedAt: expect.any(Date)
      })
    })

    it('deletes a budget allocation successfully', async () => {
      const allocationId = 'allocation-id'
      mockDeleteDoc.mockResolvedValue()

      const result = await deleteBudgetAllocation(testUserId, allocationId)

      expect(mockDeleteDoc).toHaveBeenCalledWith(expect.anything())
      expect(result).toBe(allocationId)
    })
  })

  describe('Error Handling', () => {
    it('handles Firebase errors gracefully', async () => {
      const error = new Error('Firebase error')
      mockAddDoc.mockRejectedValue(error)

      await expect(addAccount(testUserId, { name: 'Test' })).rejects.toThrow('Firebase error')
    })

    it('handles missing data gracefully', async () => {
      const accountData = { name: 'Test Account' }
      const mockDocRef = { id: 'account-id' }
      mockAddDoc.mockResolvedValue(mockDocRef)

      const result = await addAccount(testUserId, accountData)

      expect(result.balance).toBe(0)
    })
  })
}) 