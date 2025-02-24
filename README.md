# iNAB: Simple Expense Tracker

A lightweight expense tracking application built with React and Vite that lets you:
- Track expenses with categories
- View your remaining balance
- See spending totals by category
- Add and delete expenses

## Setup Instructions

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn

### Running the Application

1. Start the development server
```bash
npm run dev
```

2. Open your browser and go to:
```
http://localhost:5173
```

## Features

- **Budget Tracking**: Enter your starting amount and see the remaining balance
- **Categorized Expenses**: Assign categories to each expense
- **Category Totals**: View spending totals by category with color-coded cards
- **Expense Management**: Add new expenses and delete existing ones

## Project Structure

```
inab/
├── src/
│   ├── App.jsx              # Main application component
│   ├── styles/
│   │   └── ExpenseTracker.module.css  # Styles for the application
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── vite.config.js           # Vite configuration
├── package.json             # Project dependencies and scripts
└── index.html               # HTML template
```

## Customization

- Edit the `CATEGORIES` array in `App.jsx` to modify expense categories
- Adjust the color generation function for different pastel colors
- Modify the CSS in `ExpenseTracker.module.css` to change the visual style