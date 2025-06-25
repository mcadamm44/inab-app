import { useAuth } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import LoginScreen from "./components/auth/LoginScreen";
import ExpenseTracker from "./components/ExpenseTracker";

const App = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <CurrencyProvider>
      <ExpenseTracker />
    </CurrencyProvider>
  );
};

export default App;
