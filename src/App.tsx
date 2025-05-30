import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { User } from 'firebase/auth';

// Components
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Context
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow">
              {currentUser ? <Dashboard /> : <AuthPage />}
            </main>
            <Footer />
          </div>
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;