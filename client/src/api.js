import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User registration
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user' };
  }
};

// Upload KYC document
export const uploadKycDocument = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('document', file);

    const response = await api.post(`/kyc/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Upload failed' };
  }
};

// Get KYC information
export const getKycInfo = async (userId) => {
  try {
    const response = await api.get(`/kyc/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get KYC info' };
  }
};

export default api; 