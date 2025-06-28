import { useAuth } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext.jsx";
import { ThemeProvider } from './context/ThemeContext';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import LoginScreen from "./components/auth/LoginScreen";
import AllocationTracker from "./components/AllocationTracker";
import './App.css';

const AppContent = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return <AllocationTracker />;
};

const App = () => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <CurrencyProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </CurrencyProvider>
    </NextThemesProvider>
  );
};

export default App;
