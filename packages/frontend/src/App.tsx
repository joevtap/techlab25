import { AccountsProvider } from './context/Accounts/AccountsProvider';
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './pages/Dashboard';
import { SignIn } from './pages/SignIn';

function App() {
  const { session } = useAuth();

  if (session) {
    return (
      <AccountsProvider>
        <Dashboard />
      </AccountsProvider>
    );
  }

  return <SignIn />;
}

export default App;
