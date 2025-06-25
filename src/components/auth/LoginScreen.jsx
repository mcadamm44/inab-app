import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import styles from "../../styles/Auth.module.css";

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();

  return (
    <div className={styles.loginContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>iNAB Expense Tracker</h1>
        <p className={styles.authSubtitle}>Track your expenses, manage your budget</p>
        
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${isLogin ? styles.activeTab : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.tabButton} ${!isLogin ? styles.activeTab : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        
        {isLogin ? (
          <LoginForm onLogin={login} />
        ) : (
          <SignupForm onSignup={signup} />
        )}
      </div>
    </div>
  );
};

export default LoginScreen; 