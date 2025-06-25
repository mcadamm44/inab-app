import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import styles from "../../styles/Auth.module.css";

const SignupForm = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await onSignup(email, password);
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to create an account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor="signup-email" className={styles.label}>
          Email
        </label>
        <div className={styles.inputWrapper}>
          <Mail className={styles.inputIcon} />
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signup-password" className={styles.label}>
          Password
        </label>
        <div className={styles.inputWrapper}>
          <Lock className={styles.inputIcon} />
          <input
            type={showPassword ? "text" : "password"}
            id="signup-password"
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
      
      <div className={styles.formGroup}>
        <label htmlFor="confirm-password" className={styles.label}>
          Confirm Password
        </label>
        <div className={styles.inputWrapper}>
          <Lock className={styles.inputIcon} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm; 