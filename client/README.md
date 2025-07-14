# KYC Verification System - React Client

A modern React web application for KYC (Know Your Customer) verification with a complete user workflow.

## Features

- **User Registration**: Sign up with email, password, and phone number
- **Document Upload**: Drag and drop interface for ID document upload
- **Real-time Status**: Live updates of KYC verification status
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Workflow

1. **User Registration**: Users create an account with their details
2. **Document Upload**: Users upload identity documents for verification
3. **Verification Process**: Documents are sent to external API (2-20 seconds)
4. **Status Updates**: Real-time status updates with polling
5. **Access Control**: Verified users get access to all features

## KYC Status Flow

- **no_documents**: Initial state after registration
- **validating**: Document uploaded, verification in progress
- **valid**: Document verified successfully - full access granted
- **invalid**: Document verification failed - retry required

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- The KYC Mock Server running on port 3000

### Installation

1. Install dependencies:
```bash
cd client
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3001` (since the backend runs on port 3000).

### Building for Production

```bash
npm run build
```

## API Integration

The client connects to the KYC Mock Server API:

- `POST /api/users` - User registration
- `GET /api/users/:userId` - Get user information
- `POST /api/kyc/:userId` - Upload KYC documents
- `GET /api/kyc/:userId` - Get KYC status

## File Upload Requirements

- **Supported formats**: JPEG, PNG, JPG, PDF
- **Maximum size**: 5MB
- **Validation**: Files with "valid" in the name are approved

## Development

### Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── RegistrationForm.js
│   │   ├── DocumentUpload.js
│   │   ├── KycStatus.js
│   │   └── Dashboard.js
│   ├── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

### Key Components

- **RegistrationForm**: User sign-up with validation
- **DocumentUpload**: Drag-and-drop file upload with progress
- **KycStatus**: Real-time status display with polling
- **Dashboard**: Main interface with conditional rendering based on KYC status

## Testing

The application includes comprehensive error handling and user feedback:

- Form validation with real-time feedback
- Upload progress indicators
- Status polling every 3 seconds
- Error messages for failed operations
- Loading states for all async operations

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
