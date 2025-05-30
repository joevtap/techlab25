import { AccountsProvider } from './context/Accounts/AccountsProvider';
import { ModalsProvider } from './context/Modals/ModalsProvider';
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './pages/Dashboard';
import { SignIn } from './pages/SignIn';

function App() {
  const { session } = useAuth();

  if (session) {
    return (
      <AccountsProvider>
        <ModalsProvider>
          <Dashboard />
        </ModalsProvider>
      </AccountsProvider>
    );
  }

  return <SignIn />;
}

export default App;
