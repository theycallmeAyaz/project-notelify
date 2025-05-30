import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Moon, Sun, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-surface shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="ml-2 text-xl font-bold text-foreground">Notelify</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-neutral-light/10 text-neutral"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                <div className="hidden md:flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {currentUser.displayName 
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex btn btn-outline"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>

                <button className="md:hidden p-2 rounded-full hover:bg-neutral-light/10 text-neutral">
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;