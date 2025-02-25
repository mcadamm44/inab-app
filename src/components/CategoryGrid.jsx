// src/components/CategoryGrid.jsx
import styles from "../styles/ExpenseTracker.module.css";

const CategoryGrid = ({ categories, categoryColors, getCategoryTotal }) => {
  return (
    <div className={styles.categoryTotals}>
      <h2 className={styles.categoryTitle}>Category Totals</h2>
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
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
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
