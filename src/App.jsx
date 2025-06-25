import { useAuth } from "./context/AuthContext";
import LoginScreen from "./components/auth/LoginScreen";
import ExpenseTracker from "./components/ExpenseTracker";

const App = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return <ExpenseTracker />;
};

export default App;
