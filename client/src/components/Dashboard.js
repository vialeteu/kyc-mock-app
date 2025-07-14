import React, { useState, useEffect } from 'react';
import { getUserById } from '../api';
import DocumentUpload from './DocumentUpload';
import KycStatus from './KycStatus';

const Dashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [kycStatus, setKycStatus] = useState('no_documents');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(userId);
        if (response.success) {
          setUser(response.data);
          setKycStatus(response.data.kycStatus);
        }
      } catch (err) {
        setError(err.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUploadSuccess = (uploadData) => {
    setKycStatus('validating');
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleStatusChange = (newStatus) => {
    setKycStatus(newStatus);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (kycStatus) {
      case 'valid':
        return (
          <div className="card">
            <h2>🎉 Welcome to Your Dashboard!</h2>
            <div className="alert alert-success">
              <p><strong>KYC Verification Complete!</strong></p>
              <p>Your identity has been verified successfully. You now have access to all features.</p>
            </div>
            
            <div className="card">
              <h3>💳 Send Payments</h3>
              <p>You can now send payments to other users.</p>
              <button className="btn btn-success">Send Payment</button>
            </div>
          </div>
        );

      case 'invalid':
        return (
          <div className="card">
            <h2>❌ Document Verification Failed</h2>
            <div className="alert alert-error">
              <p>Your document was not verified. Please upload a new document.</p>
              <p><strong>Tip:</strong> Make sure your filename contains the word "valid" for successful verification.</p>
            </div>
            
            <DocumentUpload 
              userId={userId}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        );

      case 'validating':
        return (
          <div className="card">
            <h2>⏳ Document Under Verification</h2>
            <div className="alert alert-info">
              <p>Your document is being verified. This may take up to 20 seconds.</p>
              <p>Please wait while we process your document...</p>
            </div>
            
            <div className="loading">
              <div className="spinner"></div>
              <p>Verifying your document...</p>
            </div>
          </div>
        );

      default: // no_documents
        return (
          <div className="card">
            <h2>📋 Complete Your KYC Verification</h2>
            <p>To access all features, please upload a valid identity document for verification.</p>
            
            <DocumentUpload 
              userId={userId}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        );
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome, {user?.email}!</h1>
        <p>Complete your KYC verification to access all features</p>
      </div>

      <div className="dashboard">
        <div>
          {renderContent()}
        </div>
        
        <div>
          <KycStatus 
            userId={userId}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 