import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountForm from '../../components/AccountForm'

describe('AccountForm', () => {
  const mockOnAddAccount = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Add New Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Account Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Account Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Current Balance')).toBeInTheDocument()
    expect(screen.getByLabelText('Description (Optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Account Color')).toBeInTheDocument()
  })

  it('shows account types in select dropdown', () => {
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    const accountTypes = [
      'Checking',
      'Savings', 
      'Investment',
      'Crypto',
      'Credit Card',
      'Cash',
      'Other'
    ]

    accountTypes.forEach(type => {
      expect(screen.getByText(type)).toBeInTheDocument()
    })
  })

  it('submits form with correct data', async () => {
    const user = userEvent.setup()
    
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    // Fill in form fields
    await user.type(screen.getByLabelText('Account Name'), 'Test Account')
    await user.selectOptions(screen.getByLabelText('Account Type'), 'Savings')
    await user.type(screen.getByLabelText('Current Balance'), '1000')
    await user.type(screen.getByLabelText('Description (Optional)'), 'Test description')

    // Submit form
    await user.click(screen.getByText('Add Account'))

    expect(mockOnAddAccount).toHaveBeenCalledWith({
      name: 'Test Account',
      type: 'Savings',
      balance: 1000,
      description: 'Test description',
      color: expect.any(String)
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    // Try to submit without filling required fields
    await user.click(screen.getByText('Add Account'))

    expect(mockOnAddAccount).not.toHaveBeenCalled()
  })

  it('handles cancel button', async () => {
    const user = userEvent.setup()
    
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    await user.click(screen.getByText('Cancel'))

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    // Fill and submit form
    await user.type(screen.getByLabelText('Account Name'), 'Test Account')
    await user.type(screen.getByLabelText('Current Balance'), '1000')
    await user.click(screen.getByText('Add Account'))

    // Check that form is reset
    expect(screen.getByLabelText('Account Name')).toHaveValue('')
    expect(screen.getByLabelText('Current Balance')).toHaveValue(null)
  })

  it('renders in edit mode when editingAccount is provided', () => {
    const editingAccount = {
      id: 'test-id',
      name: 'Existing Account',
      type: 'Checking',
      balance: 500,
      description: 'Existing description',
      color: '#FF0000'
    }

    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
        editingAccount={editingAccount}
      />
    )

    expect(screen.getByText('Edit Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Account Name')).toHaveValue('Existing Account')
    expect(screen.getByLabelText('Current Balance')).toHaveValue(500)
    expect(screen.getByLabelText('Description (Optional)')).toHaveValue('Existing description')
  })

  it('handles color picker interaction', async () => {
    const user = userEvent.setup()
    
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    const colorPicker = screen.getByLabelText('Account Color')
    expect(colorPicker).toBeInTheDocument()
    
    // Color picker should have a default value
    expect(colorPicker).toHaveValue()
  })

  it('handles balance input with decimals', async () => {
    const user = userEvent.setup()
    
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    await user.type(screen.getByLabelText('Account Name'), 'Test Account')
    await user.type(screen.getByLabelText('Current Balance'), '1000.50')
    await user.click(screen.getByText('Add Account'))

    expect(mockOnAddAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        balance: 1000.5
      })
    )
  })

  it('handles zero balance', async () => {
    const user = userEvent.setup()
    
    render(
      <AccountForm 
        onAddAccount={mockOnAddAccount}
        onCancel={mockOnCancel}
      />
    )

    await user.type(screen.getByLabelText('Account Name'), 'Test Account')
    await user.type(screen.getByLabelText('Current Balance'), '0')
    await user.click(screen.getByText('Add Account'))

    expect(mockOnAddAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        balance: 0
      })
    )
  })
}) 