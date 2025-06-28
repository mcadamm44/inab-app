import PropTypes from "prop-types";
import { useState } from "react";
import { Trash2, AlertCircle, Plus, Save, X } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext.jsx";
import styles from "../styles/ExpenseTracker.module.css";

const ExpensesByCategory = ({ 
  expenses, 
  categoryColors, 
  onDeleteExpense, 
  onAddExpense,
  categories,
  onAddCategory,
  onDeleteCategory,
  accounts = [],
  debts = []
}) => {
  const { formatCurrency } = useCurrency();
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpenseData, setNewExpenseData] = useState({ name: "", amount: "", category: "" });
  const [addingExpense, setAddingExpense] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingExpenseData, setEditingExpenseData] = useState({});

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {});

  // Calculate totals for each category
  const categoryTotals = {};
  categories.forEach(category => {
    categoryTotals[category] = expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
  });

  // Sort categories by total amount (highest first), then by name
  const sortedCategories = categories
    .sort((a, b) => {
      const aTotal = categoryTotals[a] || 0;
      const bTotal = categoryTotals[b] || 0;
      if (bTotal !== aTotal) return bTotal - aTotal;
      return a.localeCompare(b);
    })
    .filter(category => categoryTotals[category] > 0 || expensesByCategory[category]?.length > 0);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpenseToCategory = (category) => {
    setAddingExpense(category);
    setNewExpenseData({ name: "", amount: "", category });
  };

  const handleSaveNewExpense = () => {
    if (!newExpenseData.name.trim() || !newExpenseData.amount || parseFloat(newExpenseData.amount) <= 0) {
      return;
    }

    onAddExpense({
      name: newExpenseData.name.trim(),
      amount: parseFloat(newExpenseData.amount),
      category: newExpenseData.category,
    });

    setAddingExpense(null);
    setNewExpenseData({ name: "", amount: "", category: "" });
  };

  const handleCancelNewExpense = () => {
    setAddingExpense(null);
    setNewExpenseData({ name: "", amount: "", category: "" });
  };

  const handleSaveEditExpense = () => {
    if (!editingExpenseData.name.trim() || !editingExpenseData.amount || parseFloat(editingExpenseData.amount) <= 0) {
      return;
    }

    // Update the expense
    onAddExpense({
      id: editingExpense,
      name: editingExpenseData.name.trim(),
      amount: parseFloat(editingExpenseData.amount),
      category: editingExpenseData.category,
    });

    setEditingExpense(null);
    setEditingExpenseData({});
  };

  const handleCancelEditExpense = () => {
    setEditingExpense(null);
    setEditingExpenseData({});
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName("");
  };

  const handleDeleteCategory = (category) => {
    const expensesInCategory = expensesByCategory[category]?.length || 0;
    if (expensesInCategory > 0) {
      const confirmed = confirm(
        `This category has ${expensesInCategory} expense(s). Deleting it will also delete all expenses in this category. Are you sure you want to continue?`
      );
      if (!confirmed) return;
    }
    onDeleteCategory(category);
  };

  // Quick allocation handlers
  const handleQuickAccountAllocation = (account) => {
    const categoryName = `Account: ${account.name}`;
    setAddingExpense(categoryName);
    setNewExpenseData({ 
      name: `Deposit to ${account.name}`, 
      amount: "", 
      category: categoryName 
    });
  };

  const handleQuickDebtAllocation = (debt) => {
    const categoryName = `Debt: ${debt.name}`;
    setAddingExpense(categoryName);
    setNewExpenseData({ 
      name: `Payment to ${debt.name}`, 
      amount: "", 
      category: categoryName 
    });
  };

  // Direct allocation handlers (no categories)
  const handleDirectAccountAllocation = async (account, amount) => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    const categoryName = `Account: ${account.name}`;
    
    // Ensure the category exists
    if (!categories.includes(categoryName)) {
      await onAddCategory(categoryName);
    }
    
    await onAddExpense({
      name: `Deposit to ${account.name}`,
      amount: parseFloat(amount),
      category: categoryName,
    });
  };

  const handleDirectDebtAllocation = async (debt, amount) => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    const categoryName = `Debt: ${debt.name}`;
    
    // Ensure the category exists
    if (!categories.includes(categoryName)) {
      await onAddCategory(categoryName);
    }
    
    await onAddExpense({
      name: `Payment to ${debt.name}`,
      amount: parseFloat(amount),
      category: categoryName,
    });
  };

  const renderExpenseRow = (expense) => {
    if (editingExpense === expense.id) {
      return (
        <div className={styles.expenseItem}>
          <div className={styles.expenseInfo}>
            <input
              type="text"
              value={editingExpenseData.name}
              onChange={(e) => setEditingExpenseData({ ...editingExpenseData, name: e.target.value })}
              className={styles.expenseInput}
              placeholder="Expense name"
            />
            <select
              value={editingExpenseData.category}
              onChange={(e) => setEditingExpenseData({ ...editingExpenseData, category: e.target.value })}
              className={styles.expenseSelect}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.expenseActions}>
            <input
              type="number"
              value={editingExpenseData.amount}
              onChange={(e) => setEditingExpenseData({ ...editingExpenseData, amount: e.target.value })}
              className={styles.expenseAmountInput}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <button
              onClick={handleSaveEditExpense}
              className={styles.saveButton}
              title="Save changes"
            >
              <Save size={16} />
            </button>
            <button
              onClick={handleCancelEditExpense}
              className={styles.cancelButton}
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={expense.id} className={styles.expenseItem}>
        <input
          type="text"
          value={expense.name}
          onChange={(e) => {
            const newName = e.target.value;
            if (newName !== expense.name) {
              onAddExpense({
                id: expense.id,
                name: newName,
                amount: expense.amount,
                category: expense.category,
              });
            }
          }}
          className={styles.expenseInput}
          placeholder="Allocation name"
        />
        <input
          type="number"
          value={expense.amount}
          onChange={(e) => {
            const newAmount = parseFloat(e.target.value) || 0;
            if (newAmount !== expense.amount) {
              onAddExpense({
                id: expense.id,
                name: expense.name,
                amount: newAmount,
                category: expense.category,
              });
            }
          }}
          className={styles.expenseAmountInput}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
        <button
          onClick={() => onDeleteExpense(expense.id)}
          className={styles.deleteButton}
          title="Delete expense"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  };

  const renderCategoryGroup = (category) => {
    const isAccountCategory = category.startsWith('Account: ');
    const isDebtCategory = category.startsWith('Debt: ');
    const isSpecialCategory = isAccountCategory || isDebtCategory;
    
    return (
      <div key={category} className={styles.categoryExpenseGroup}>
        <div className={styles.categoryExpenseHeader}>
          <div className={styles.categoryExpenseTitle}>
            <span
              className={`${styles.categoryExpenseBadge} ${isSpecialCategory ? styles.specialCategoryBadge : ''}`}
              style={{
                backgroundColor: categoryColors[category],
                color: isSpecialCategory ? "white" : "#1f2937",
              }}
            >
              {isAccountCategory && "💰 "}
              {isDebtCategory && "💳 "}
              {category}
            </span>
            <span className={styles.categoryExpenseCount}>
              {expensesByCategory[category]?.length || 0} items
            </span>
          </div>
          {!isSpecialCategory && (
            <button
              onClick={() => handleDeleteCategory(category)}
              className={styles.deleteCategoryButton}
              title={`Delete ${category} category`}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        
        <div className={styles.categoryExpenseList}>
          {expensesByCategory[category]?.map((expense) => renderExpenseRow(expense))}
          
          {/* Add expense placeholder row */}
          {addingExpense === category ? (
            <div className={styles.expenseItem}>
              <div className={styles.expenseInfo}>
                <input
                  type="text"
                  value={newExpenseData.name}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, name: e.target.value })}
                  className={styles.expenseInput}
                  placeholder={isAccountCategory ? "Deposit description" : isDebtCategory ? "Payment description" : "Allocation name"}
                />
                <select
                  value={newExpenseData.category}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                  className={styles.expenseSelect}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.expenseActions}>
                <input
                  type="number"
                  value={newExpenseData.amount}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                  className={styles.expenseAmountInput}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <button
                  onClick={handleSaveNewExpense}
                  className={styles.saveButton}
                  title="Save expense"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={handleCancelNewExpense}
                  className={styles.cancelButton}
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className={styles.addExpensePlaceholder}
              onClick={() => handleAddExpenseToCategory(category)}
            >
              <div className={styles.addExpensePlaceholderContent}>
                <Plus size={16} />
                <span>
                  {isAccountCategory ? `Add deposit to ${category.replace('Account: ', '')}` :
                   isDebtCategory ? `Add payment to ${category.replace('Debt: ', '')}` :
                   `Add ${category} allocation`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.expensesSection}>
      <div className={styles.expensesHeader}>
        <h2 className={styles.expensesTitle}>Allocations by Category</h2>
        <div className={styles.expensesSummary}>
          <span className={styles.expensesCount}>
            {expenses.length} {expenses.length === 1 ? "allocation" : "allocations"}
          </span>
          <span className={styles.expensesTotal}>
            Total: {formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>

      {/* Add Category Section */}
      <div className={styles.addCategorySection}>
        <div className={styles.addCategoryForm}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className={styles.categoryInput}
            placeholder="New category name"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            className={styles.addCategoryButton}
            disabled={!newCategoryName.trim()}
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>
        
        {/* Quick Allocation Selectors */}
        {(() => {
          return (accounts.length > 0 || debts.length > 0);
        })() && (
          <div className={styles.quickAllocationSection}>
            <h4 className={styles.quickAllocationTitle}>Quick Allocations</h4>
            
            {/* Account Allocations */}
            {accounts.length > 0 && (
              <div className={styles.quickAllocationGroup}>
                <h5 className={styles.quickAllocationSubtitle}>💰 Account Deposits</h5>
                <div className={styles.quickAllocationButtons}>
                  {accounts.map(account => (
                    <div key={account.id} className={styles.quickAllocationItem}>
                      <button
                        onClick={() => handleQuickAccountAllocation(account)}
                        className={styles.quickAllocationButton}
                        style={{ backgroundColor: account.color || "#A7F3D0" }}
                      >
                        {account.name}
                      </button>
                      <input
                        type="number"
                        placeholder="Amount"
                        step="0.01"
                        min="0"
                        className={styles.quickAllocationInput}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleDirectAccountAllocation(account, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Debt Allocations */}
            {debts.filter(debt => debt.status === "Active" && debt.isDebt).length > 0 && (
              <div className={styles.quickAllocationGroup}>
                <h5 className={styles.quickAllocationSubtitle}>💳 Debt Payments</h5>
                <div className={styles.quickAllocationButtons}>
                  {debts
                    .filter(debt => debt.status === "Active" && debt.isDebt)
                    .map(debt => (
                      <div key={debt.id} className={styles.quickAllocationItem}>
                        <button
                          onClick={() => handleQuickDebtAllocation(debt)}
                          className={styles.quickAllocationButton}
                          style={{ backgroundColor: "#FECACA" }}
                        >
                          {debt.name}
                        </button>
                        <input
                          type="number"
                          placeholder="Amount"
                          step="0.01"
                          min="0"
                          className={styles.quickAllocationInput}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleDirectDebtAllocation(debt, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {expenses.length === 0 && categories.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle className={styles.emptyStateIcon} />
          <div className={styles.emptyStateText}>No categories available</div>
          <div className={styles.emptyStateSubtext}>
            Add a category first, then add allocations
          </div>
        </div>
      ) : (
        <div className={styles.expensesByCategoryContainer}>
          {/* Main content - expenses by category */}
          <div className={styles.expensesByCategoryMain}>
            {sortedCategories.map((category) => renderCategoryGroup(category))}
          </div>
        </div>
      )}
    </div>
  );
};

ExpensesByCategory.propTypes = {
  expenses: PropTypes.array.isRequired,
  categoryColors: PropTypes.object.isRequired,
  onDeleteExpense: PropTypes.func.isRequired,
  onAddExpense: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  onAddCategory: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  debts: PropTypes.array,
};

export default ExpensesByCategory; 