import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { auth, db } from './firebase';

// Make Firebase available in window for setup script
window.auth = auth;
window.db = db;

function AppWrapper() {
  const { currentUser, userRole } = useAuth();

  // Show login if no user
  if (!currentUser) {
    return <Login />;
  }

  // Show main app if logged in
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  </React.StrictMode>
);
