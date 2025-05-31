import { AccountsProvider } from './context/Accounts/AccountsProvider';
import { TransactionsProvider } from './context/Transactions';
import { SelectedAccountProvider } from './context/SelectedAccount/SelectedAccountContext';
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './pages/Dashboard';
import { SignIn } from './pages/SignIn';

function App() {
  const { session } = useAuth();

  if (session) {
    return (
      <AccountsProvider>
        <TransactionsProvider>
          <SelectedAccountProvider>
            <Dashboard />
          </SelectedAccountProvider>
        </TransactionsProvider>
      </AccountsProvider>
    );
  }

  return <SignIn />;
}

export default App;
