import React, { useState, useEffect } from 'react';
import { getKycInfo } from '../api';

const KycStatus = ({ userId, onStatusChange }) => {
  const [kycInfo, setKycInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchKycInfo = async () => {
    try {
      const response = await getKycInfo(userId);
      if (response.success) {
        setKycInfo(response.data);
        onStatusChange(response.data.kycStatus);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch KYC status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycInfo();
    
    // Poll for status updates every 3 seconds
    const interval = setInterval(fetchKycInfo, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading KYC status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'no_documents':
        return 'No documents uploaded';
      case 'validating':
        return 'Document under verification';
      case 'valid':
        return 'Document verified successfully';
      case 'invalid':
        return 'Document verification failed';
      default:
        return 'Unknown status';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'no_documents':
        return 'waiting';
      case 'validating':
        return 'validating';
      case 'valid':
        return 'valid';
      case 'invalid':
        return 'invalid';
      default:
        return 'waiting';
    }
  };

  return (
    <div className="card">
      <h2>KYC Verification Status</h2>
      
      <div className={`status ${getStatusClass(kycInfo.kycStatus)}`}>
        {getStatusText(kycInfo.kycStatus)}
      </div>

      {kycInfo.kycVerifiedAt && (
        <div className="alert alert-success">
          <p><strong>Verified on:</strong> {new Date(kycInfo.kycVerifiedAt).toLocaleString()}</p>
        </div>
      )}

      {kycInfo.documents && kycInfo.documents.length > 0 && (
        <div>
          <h3>Uploaded Documents</h3>
          {kycInfo.documents.map((doc) => (
            <div key={doc.id} className="alert alert-info">
              <p><strong>File:</strong> {doc.originalName}</p>
              <p><strong>Status:</strong> {doc.status}</p>
              <p><strong>Uploaded:</strong> {new Date(doc.uploadedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {kycInfo.kycStatus === 'invalid' && (
        <div className="alert alert-error">
          <p>Your document was not verified. Please upload a new document with "valid" in the filename.</p>
        </div>
      )}
    </div>
  );
};

export default KycStatus; 