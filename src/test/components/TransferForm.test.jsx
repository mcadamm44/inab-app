import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TransferForm from '../../components/TransferForm'

describe('TransferForm', () => {
  const mockAccounts = [
    { id: 'account1', name: 'Checking Account', balance: 1000, type: 'Checking' },
    { id: 'account2', name: 'Savings Account', balance: 5000, type: 'Savings' },
    { id: 'account3', name: 'Crypto Wallet', balance: 2500, type: 'Crypto' }
  ]
  
  const mockOnAddTransfer = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Transfer Between Accounts')).toBeInTheDocument()
    expect(screen.getByLabelText('From Account')).toBeInTheDocument()
    expect(screen.getByLabelText('To Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Description (Optional)')).toBeInTheDocument()
  })

  it('shows accounts in select dropdowns', () => {
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    mockAccounts.forEach(account => {
      expect(screen.getByText(`${account.name} (€${account.balance.toFixed(2)})`)).toBeInTheDocument()
    })
  })

  it('submits form with correct data', async () => {
    const user = userEvent.setup()
    
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    // Fill in form fields
    await user.selectOptions(screen.getByLabelText('From Account'), 'account1')
    await user.selectOptions(screen.getByLabelText('To Account'), 'account2')
    await user.type(screen.getByLabelText('Amount'), '500')
    await user.type(screen.getByLabelText('Description (Optional)'), 'Monthly savings transfer')

    // Submit form
    await user.click(screen.getByText('Transfer'))

    expect(mockOnAddTransfer).toHaveBeenCalledWith({
      fromAccount: 'account1',
      toAccount: 'account2',
      amount: 500,
      date: expect.any(String),
      description: 'Monthly savings transfer'
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    // Try to submit without filling required fields
    await user.click(screen.getByText('Transfer'))

    expect(mockOnAddTransfer).not.toHaveBeenCalled()
  })

  it('prevents transfer to same account', async () => {
    const user = userEvent.setup()
    
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    // Select same account for both from and to
    await user.selectOptions(screen.getByLabelText('From Account'), 'account1')
    await user.selectOptions(screen.getByLabelText('To Account'), 'account1')
    await user.type(screen.getByLabelText('Amount'), '500')
    await user.click(screen.getByText('Transfer'))

    expect(mockOnAddTransfer).not.toHaveBeenCalled()
  })

  it('handles cancel button', async () => {
    const user = userEvent.setup()
    
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    await user.click(screen.getByText('Cancel'))

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    // Fill and submit form
    await user.selectOptions(screen.getByLabelText('From Account'), 'account1')
    await user.selectOptions(screen.getByLabelText('To Account'), 'account2')
    await user.type(screen.getByLabelText('Amount'), '500')
    await user.click(screen.getByText('Transfer'))

    // Check that form is reset
    expect(screen.getByLabelText('From Account')).toHaveValue('')
    expect(screen.getByLabelText('To Account')).toHaveValue('')
    expect(screen.getByLabelText('Amount')).toHaveValue('')
  })

  it('sets current date as default', () => {
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    const dateInput = screen.getByLabelText('Date')
    const today = new Date().toISOString().split('T')[0]
    expect(dateInput).toHaveValue(today)
  })

  it('handles amount with decimals', async () => {
    const user = userEvent.setup()
    
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    await user.selectOptions(screen.getByLabelText('From Account'), 'account1')
    await user.selectOptions(screen.getByLabelText('To Account'), 'account2')
    await user.type(screen.getByLabelText('Amount'), '500.75')
    await user.click(screen.getByText('Transfer'))

    expect(mockOnAddTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 500.75
      })
    )
  })

  it('validates minimum amount', async () => {
    const user = userEvent.setup()
    
    render(
      <TransferForm 
        accounts={mockAccounts}
        onAddTransfer={mockOnAddTransfer}
        onCancel={mockOnCancel}
      />
    )

    await user.selectOptions(screen.getByLabelText('From Account'), 'account1')
    await user.selectOptions(screen.getByLabelText('To Account'), 'account2')
    await user.type(screen.getByLabelText('Amount'), '0')
    await user.click(screen.getByText('Transfer'))

    expect(mockOnAddTransfer).not.toHaveBeenCalled()
  })
}) 