 # KYC Verification System

A complete KYC (Know Your Customer) verification system with a React frontend and Node.js backend API. This system simulates a real-world KYC workflow including user registration, document upload, verification, and access control.

## 🏗️ Project Structure

```
kyc-mock-app/
├── server/                 # Backend API Server
│   ├── server.js          # Main server file
│   ├── package.json       # Server dependencies
│   └── uploads/           # Document upload directory
├── client/                # React Frontend Application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api.js         # API integration
│   │   └── ...
│   ├── package.json       # Client dependencies
│   └── ...
└── README.md              # This file
```

## 🚀 Features

### Backend API Server
- **User Registration**: Create accounts with email, password, and phone
- **Document Upload**: Secure file upload with validation
- **KYC Verification**: Mock external API verification (2-20 seconds)
- **Status Tracking**: Real-time KYC status monitoring
- **File Management**: Secure document storage and retrieval

### React Frontend
- **Modern UI**: Beautiful gradient design with responsive layout
- **Drag & Drop**: Intuitive document upload interface
- **Real-time Updates**: Live status polling and updates
- **Access Control**: Conditional features based on verification status
- **Error Handling**: Comprehensive error messages and validation

## 🔄 KYC Workflow

1. **User Registration** → User creates account with email, password, phone
2. **Document Upload** → User uploads ID document via drag & drop
3. **Verification Process** → System sends document to external API (2-20 seconds)
4. **Status Updates** → Real-time status monitoring with polling
5. **Access Control** → Verified users get access to all features
6. **Retry Mechanism** → Invalid documents allow re-upload

### KYC Status Flow
- **no_documents** → Initial state after registration
- **validating** → Document uploaded, verification in progress
- **valid** → Document verified successfully - full access granted
- **invalid** → Document verification failed - retry required

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React app:**
   ```bash
   npm start
   ```

   The client will run on `http://localhost:3001`

## 📡 API Endpoints

### User Management
- `POST /api/users` - User registration
- `GET /api/users/:userId` - Get user information

### KYC Operations
- `POST /api/kyc/:userId` - Upload KYC documents
- `GET /api/kyc/:userId` - Get KYC status and documents

### Example Usage

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

**Upload a document:**
```bash
curl -X POST http://localhost:3000/api/kyc/USER_ID_HERE \
  -F "document=@/path/to/passport.pdf"
```

**Check KYC status:**
```bash
curl http://localhost:3000/api/kyc/USER_ID_HERE
```

## 🎯 Testing the System

### 1. Start Both Services
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

### 2. Test the Workflow
1. **Open** `http://localhost:3001` in your browser
2. **Register** with email, password, and phone
3. **Upload** a document (files with "valid" in name are approved)
4. **Wait** for verification (2-20 seconds)
5. **Access** features once verified

### 3. Test Different Scenarios
- **Valid Document**: Upload file with "valid" in filename
- **Invalid Document**: Upload file without "valid" in filename
- **Status Updates**: Watch real-time status changes
- **Error Handling**: Test with invalid inputs

## 🔧 Configuration

### Backend Configuration
- **Port**: 3000 (configurable via PORT environment variable)
- **File Upload**: Max 5MB, supports JPEG, PNG, PDF
- **Verification Delay**: Random 2-20 seconds
- **Document Validation**: Files with "valid" in name are approved

### Frontend Configuration
- **API URL**: `http://localhost:3000/api` (configurable via REACT_APP_API_URL)
- **Polling Interval**: 3 seconds for status updates
- **File Types**: JPEG, PNG, PDF with 5MB limit

## 📁 File Structure Details

### Backend (`server/`)
```
server/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
└── uploads/              # Document storage (auto-created)
```

### Frontend (`client/`)
```
client/
├── public/
│   └── index.html        # Main HTML file
├── src/
│   ├── components/
│   │   ├── RegistrationForm.js
│   │   ├── DocumentUpload.js
│   │   ├── KycStatus.js
│   │   └── Dashboard.js
│   ├── api.js            # API integration
│   ├── App.js            # Main React component
│   ├── index.js          # React entry point
│   └── index.css         # Styling
└── package.json          # Client dependencies
```

## 🚨 Important Notes

### Security Considerations
- This is a **mock system** for development/testing
- Passwords are hashed but stored in memory
- File uploads are stored locally
- No production security measures implemented

### Development Features
- **Hot Reload**: Both frontend and backend support live reload
- **Error Logging**: Comprehensive error handling and logging
- **Status Polling**: Real-time updates every 3 seconds
- **File Validation**: Type and size validation on upload

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 3000 is available
- Ensure all dependencies are installed
- Check Node.js version (v14+)

**Frontend can't connect to backend:**
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify API endpoints

**File upload fails:**
- Check file size (max 5MB)
- Verify file type (JPEG, PNG, PDF)
- Ensure uploads directory exists

**Status not updating:**
- Check browser console for errors
- Verify polling is working (every 3 seconds)
- Check network connectivity