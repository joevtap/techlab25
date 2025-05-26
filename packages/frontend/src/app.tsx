import { useAuth } from './hooks/useAuth';
import { DashboardContainer } from './pages/placeholder';
import { SignIn } from './pages/SignIn';

function App() {
  const { session } = useAuth();

  if (session) {
    return <DashboardContainer />;
  }

  return <SignIn />;
}

export default App;
