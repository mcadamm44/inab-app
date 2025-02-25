# Expense Tracker Technical Documentation

## Overview

The Expense Tracker is a modern React application that helps users track and manage their expenses with features for categorization, saving reports, and visualizing spending patterns. This document details the technical components and architecture of the application.

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | Frontend UI library |
| Vite | 6.1.0 | Build tool and development server |
| Tailwind CSS | 4.0.8 | Utility-first CSS framework |
| Lucide React | 0.475.0 | Icon library |

### Supporting Libraries

* **@radix-ui/react-slot**: 1.1.2 - Utility for component composition
* **class-variance-authority**: 0.7.1 - For building type-safe UI components with variants
* **clsx**: 2.1.1 - Utility for conditionally joining class names
* **autoprefixer**: 10.4.20 - PostCSS plugin for CSS vendor prefixing
* **postcss**: 8.5.3 - Tool for transforming CSS with JavaScript plugins

### Development Tools

* **ESLint**: 9.19.0 - Code linting
* **TypeScript**: Via @types/react and @types/react-dom - Type definitions

## Project Structure

```
my-expense-tracker/
├── src/
│   ├── App.jsx               # Main application component
│   ├── index.jsx             # Entry point for React application
│   ├── index.css             # Global CSS styles
│   └── styles/
│       └── ExpenseTracker.module.css  # Component-specific styles
├── public/                   # Static assets
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── package.json              # Project dependencies and scripts
```

## Component Architecture

### App Component

The main `App` component serves as the container for the entire application and maintains all state. It follows a functional component approach with React Hooks for state management.

#### Key State Variables

| State Variable | Type | Purpose |
|----------------|------|---------|
| total | number | Holds the starting amount |
| expenses | array | Stores all expense entries |
| expenseName | string | Temporary storage for input field |
| expenseAmount | string | Temporary storage for input field |
| expenseCategory | string | Currently selected category |
| savedReports | array | List of saved budget reports |
| isSidebarOpen | boolean | Controls sidebar visibility |

### Key Features

#### 1. Expense Management

The core functionality allows users to:
- Add expenses with a name, amount, and category
- View all expenses in a list
- Delete individual expenses
- See the remaining balance

```javascript
const handleAddExpense = (e) => {
  e.preventDefault();
  if (!expenseName || !expenseAmount) return;

  const newExpense = {
    id: Date.now(),
    name: expenseName,
    amount: parseFloat(expenseAmount),
    category: expenseCategory,
  };

  setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  setExpenseName("");
  setExpenseAmount("");
};
```

#### 2. Category Visualization

Expenses are organized into predefined categories with:
- Auto-generated pastel colors for visual distinction
- Category totals displayed in a grid format
- Color-coded category tags on each expense item

```javascript
const categoryColors = useMemo(() => {
  return CATEGORIES.reduce((acc, category) => {
    acc[category] = generatePastelColor();
    return acc;
  }, {});
}, []);
```

#### 3. Report Management

The application implements persistent storage with:
- Save functionality to localStorage
- Sidebar interface for accessing saved reports
- Load and delete operations for managing reports

```javascript
const handleSave = () => {
  const reportName = prompt("Enter a name for this report:", 
    `Budget Report ${new Date().toLocaleDateString()}`);
  if (!reportName) return;

  const data = {
    name: reportName,
    total,
    expenses,
    exportDate: new Date().toISOString(),
  };

  // Save to localStorage
  const updatedReports = [...savedReports, data];
  setSavedReports(updatedReports);
  localStorage.setItem("inab-reports", JSON.stringify(updatedReports));
  
  // Open sidebar to show the saved report
  setIsSidebarOpen(true);
};
```

## User Interface Components

### 1. Main Card

Contains the primary application interface with:
- Header with title and save button
- Starting amount input
- Remaining balance display
- Expense entry form

### 2. Category Grid

Displays spending by category with:
- Color-coded cards for each category
- Total amount spent per category
- Responsive grid layout

### 3. Expenses List

Shows all recorded expenses with:
- Individual expense items with name, category, and amount
- Delete button for each expense
- Empty state message when no expenses exist

### 4. Sidebar

Provides access to saved reports with:
- Toggle button for opening/closing
- List of saved reports with date
- Load and delete actions for each report

## Data Flow

1. **User Input → State**: Form inputs update React state variables
2. **State → UI**: State changes trigger UI re-renders via React
3. **Calculations**: Functions like `getRemainingBalance()` and `getCategoryTotal()` derive values from expense data
4. **Persistence → localStorage**: Reports are saved to and loaded from browser localStorage

## Styling Implementation

The application uses CSS Modules for component-specific styling with:
- Scoped class names to prevent style conflicts
- Dynamic styling with inline style objects for category colors
- Responsive design considerations

```javascript
<div
  key={category}
  className={styles.categoryCard}
  style={{ backgroundColor: categoryColors[category] }}
>
  <div className={styles.categoryName}>{category}</div>
  <div className={styles.categoryAmount}>
    €{getCategoryTotal(category).toFixed(2)}
  </div>
</div>
```

## Build and Deployment

### Development

```bash
# Start development server
npm run dev
```

The Vite development server offers:
- Hot Module Replacement (HMR) for fast updates
- Source maps for debugging
- Optimized build times

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The production build process:
1. Transpiles JSX with Babel via Vite
2. Processes CSS with PostCSS and Autoprefixer
3. Optimizes and bundles assets
4. Generates production-ready files in the `dist` directory

## Performance Considerations

### Optimizations

1. **Memoization**: `useMemo` for category colors prevents unnecessary recalculation
2. **Event Delegation**: React's event system efficiently handles UI interactions
3. **Local Storage**: Data persistence without requiring a backend server

## Future Enhancements

Potential areas for improvement:

1. **Data Export**: Add functionality to export data in CSV/PDF formats
2. **Data Visualization**: Implement charts and graphs for spending analysis
3. **Budget Planning**: Add features for setting and tracking budgets by category
4. **Authentication**: Add user accounts for multi-device synchronization
5. **Progressive Web App**: Implement service workers for offline functionality

## Conclusion

The Expense Tracker application demonstrates effective use of modern React patterns and hooks for state management. The component architecture promotes reusability, while the styling approach maintains a clean separation of concerns.