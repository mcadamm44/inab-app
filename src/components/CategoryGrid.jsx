// src/components/CategoryGrid.jsx
import PropTypes from "prop-types";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import styles from "../styles/ExpenseTracker.module.css";

const CategoryGrid = ({ categories, categoryColors, getCategoryTotal, totalBudget = 0 }) => {
  const { formatCurrency } = useCurrency();

  const getCategoryPercentage = (categoryTotal) => {
    if (totalBudget === 0) return 0;
    return Math.min((categoryTotal / totalBudget) * 100, 100);
  };

  const sortedCategories = categories
    .map(category => ({
      name: category,
      total: getCategoryTotal(category),
      percentage: getCategoryPercentage(getCategoryTotal(category))
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className={styles.categorySection}>
      <h2 className={styles.categoryTitle}>Spending by Category</h2>
      <div className={styles.categoryGrid}>
        {sortedCategories.map(({ name, total, percentage }) => (
          <div
            key={name}
            className={styles.categoryCard}
            style={{ borderLeftColor: categoryColors[name] }}
          >
            <div className={styles.categoryHeader}>
              <div className={styles.categoryName}>{name}</div>
              <div className={styles.categoryIcon}>
                {total > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
            </div>
            <div className={styles.categoryAmount}>
              {formatCurrency(total)}
            </div>
            {totalBudget > 0 && (
              <div className={styles.categoryProgress}>
                <div 
                  className={styles.progressBar}
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: categoryColors[name]
                  }}
                />
                <span className={styles.progressText}>
                  {percentage.toFixed(1)}% of budget
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

CategoryGrid.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  categoryColors: PropTypes.object.isRequired,
  getCategoryTotal: PropTypes.func.isRequired,
  totalBudget: PropTypes.number,
};

export default CategoryGrid;
