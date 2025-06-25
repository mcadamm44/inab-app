import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import styles from "../../styles/Auth.module.css";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");
    
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor="login-email" className={styles.label}>
          Email
        </label>
        <div className={styles.inputWrapper}>
          <Mail className={styles.inputIcon} />
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="login-password" className={styles.label}>
          Password
        </label>
        <div className={styles.inputWrapper}>
          <Lock className={styles.inputIcon} />
          <input
            type={showPassword ? "text" : "password"}
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm; 