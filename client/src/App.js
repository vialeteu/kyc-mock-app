import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleRegistrationSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="App">
      {!currentUser ? (
        <div className="container">
          <div className="header">
            <h1>KYC Verification System</h1>
            <p>Complete your identity verification to access all features</p>
          </div>
          
          <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
        </div>
      ) : (
        <div>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ color: 'white', margin: 0 }}>KYC Verification System</h2>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
          
          <Dashboard userId={currentUser.userId} />
        </div>
      )}
    </div>
  );
}

export default App; 