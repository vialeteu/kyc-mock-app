# KYC Mock Server

A simple mock API server for user registration with KYC (Know Your Customer) functionality. This server simulates a complete KYC workflow including user registration, document upload, and verification processes.

## Features

- **User Registration**: Register users with email, password, and phone number
- **Document Upload**: Upload ID documents (JPEG, PNG, JPG, PDF) for KYC verification
- **KYC Status Tracking**: Monitor KYC verification status with 4 different states
- **Mock Verification**: Simulates external API verification with realistic delays
- **File Management**: Secure file upload with size and type validation

## KYC Status Flow

1. **no_documents** - Initial status after user registration
2. **validating** - Status when documents are uploaded and being verified
3. **valid** - Documents have been verified successfully
4. **invalid** - Documents failed verification

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. User Registration
**POST** `/api/users`

Register a new user with email, password, and phone number.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "phone": "+1234567890",
    "kycStatus": "valid",
    "kycVerifiedAt": "2024-01-01T00:02:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get User by ID
**GET** `/api/users/:userId`

Get user information by user ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "phone": "+1234567890",
    "kycStatus": "valid",
    "kycVerifiedAt": "2024-01-01T00:02:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Upload KYC Documents
**POST** `/api/kyc/:userId`

Upload ID documents for KYC verification. Uses multipart/form-data.

**Request:**
- `document` (file): ID document (JPEG, PNG, JPG, PDF, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully. Verification in progress.",
  "data": {
    "documentId": "uuid",
    "filename": "1704067200000-uuid.pdf",
    "status": "validating",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Get KYC Information
**GET** `/api/kyc/:userId`

Get the current KYC status and document information for a user.

**Response:**
```json
{
  "success": true,
  "data": {
    "kycStatus": "valid",
    "kycVerifiedAt": "2024-01-01T00:02:00.000Z",
    "documents": [
      {
        "id": "uuid",
        "filename": "1704067200000-uuid.pdf",
        "originalName": "passport.pdf",
        "status": "valid",
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## Usage Examples

### Using cURL

1. **Register a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

2. **Get user information:**
```bash
curl http://localhost:3000/api/users/USER_ID_HERE
```

3. **Upload a document:**
```bash
curl -X POST http://localhost:3000/api/kyc/USER_ID_HERE \
  -F "document=@/path/to/passport.pdf"
```

4. **Check KYC information:**
```bash
curl http://localhost:3000/api/kyc/USER_ID_HERE
```

## File Upload Requirements

- **Supported formats**: JPEG, PNG, JPG, PDF
- **Maximum file size**: 5MB
- **Field name**: `document`

## Mock Verification Process

The server simulates an external KYC verification API with the following characteristics:

- **Processing time**: Random delay between 2-20 seconds (simulated API delay)
- **Valid documents**: If a filename contains 'valid' then a document marked as valid
- **Background processing**: Verification happens asynchronously after upload

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `404` - Not Found (user not found)
- `409` - Conflict (user already exists)
- `500` - Internal Server Error

## Data Storage

This mock server uses in-memory storage (Map objects) for simplicity.
