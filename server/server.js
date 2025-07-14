const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image and PDF files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and PDF files are allowed.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// In-memory storage (in production, use a database)
const users = new Map();
const kycDocuments = new Map();

// KYC Status Enum
const KYC_STATUS = {
  NO_DOCUMENTS: 'no_documents',
  VALIDATING: 'validating',
  VALID: 'valid',
  INVALID: 'invalid'
};

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate phone number (basic validation)
function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Helper function to validate password strength
function isValidPassword(password) {
  return password && password.length >= 6;
}

// Mock external KYC verification API
async function verifyDocumentsWithExternalAPI(userId, file) {
    // Simulate API call delay with random time between 2-20 seconds
    const randomDelay = Math.floor(Math.random() * (20000 - 2000 + 1)) + 2000;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    
    // Mock verification logic - check if filename contains 'valid'
    const isValid = file.originalname.toLowerCase().includes('valid');
    
    return {
      success: true,
      isValid: isValid,
      message: isValid ? 'Documents verified successfully' : 'Documents verification failed',
      verificationId: uuidv4()
    };
}

// Routes

// 1. User Registration
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    // Validation
    if (!email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and phone number are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Check if user already exists by email
    if (users.has(email)) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if phone number is already used by another user
    const existingUserWithPhone = Array.from(users.values()).find(user => user.phone === phone);
    if (existingUserWithPhone) {
      return res.status(409).json({
        success: false,
        message: 'Phone number is already registered by another user'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      phone,
      kycStatus: KYC_STATUS.NO_DOCUMENTS,
      kycVerifiedAt: null,
      createdAt: new Date().toISOString()
    };

    users.set(email, user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        kycStatus: KYC_STATUS.NO_DOCUMENTS,
        kycVerifiedAt: null
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// 2. Get User by ID
app.get('/api/users/:userId', (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = Array.from(users.values()).find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          kycStatus: user.kycStatus,
          kycVerifiedAt: user.kycVerifiedAt,
          createdAt: user.createdAt
        }
      });
  
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

// 3. Upload KYC Documents
app.post('/api/kyc/:userId', upload.single('document'), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Document file is required'
      });
    }

    // Check if user exists
    const user = Array.from(users.values()).find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if KYC is already completed
    if (user.kycStatus === KYC_STATUS.VALID) {
      return res.status(400).json({
        success: false,
        message: 'KYC is already completed for this user'
      });
    }

    // Store document information
    const documentId = uuidv4();
    const documentInfo = {
      id: documentId,
      userId: user.id,
      email: user.email,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      uploadedAt: new Date().toISOString(),
      status: KYC_STATUS.VALIDATING
    };

    kycDocuments.set(documentId, documentInfo);

    // Update user KYC status
    user.kycStatus = KYC_STATUS.VALIDATING;
    users.set(user.email, user);

    // Start verification process in background
    verifyDocumentsWithExternalAPI(user.id, req.file)
      .then(async (verificationResult) => {
        const document = kycDocuments.get(documentId);
        const updatedUser = users.get(user.email);
        
        if (verificationResult.isValid) {
          document.status = KYC_STATUS.VALID;
          updatedUser.kycStatus = KYC_STATUS.VALID;
          updatedUser.kycVerifiedAt = new Date().toISOString();
        } else {
          document.status = KYC_STATUS.INVALID;
          updatedUser.kycStatus = KYC_STATUS.INVALID;
        }
        
        kycDocuments.set(documentId, document);
        users.set(user.email, updatedUser);
        
        console.log(`KYC verification completed for user ${user.email}: ${verificationResult.isValid ? 'VALID' : 'INVALID'}`);
      })
      .catch(error => {
        console.error('KYC verification error:', error);
        const document = kycDocuments.get(documentId);
        const updatedUser = users.get(user.email);
        
        document.status = KYC_STATUS.INVALID;
        updatedUser.kycStatus = KYC_STATUS.INVALID;
        
        kycDocuments.set(documentId, document);
        users.set(user.email, updatedUser);
      });

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully. Verification in progress.',
      data: {
        documentId: documentInfo.id,
        filename: documentInfo.filename,
        status: documentInfo.status,
        uploadedAt: documentInfo.uploadedAt
      }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// 4. Get User KYC Information
app.get('/api/kyc/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const user = Array.from(users.values()).find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find user's documents
    const userDocuments = Array.from(kycDocuments.values())
      .filter(doc => doc.userId === userId)
      .map(doc => ({
        id: doc.id,
        filename: doc.filename,
        originalName: doc.originalName,
        status: doc.status,
        uploadedAt: doc.uploadedAt
      }));

    res.status(200).json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        kycVerifiedAt: user.kycVerifiedAt,
        documents: userDocuments
      }
    });

  } catch (error) {
    console.error('KYC information error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`KYC Mock Server running on port ${PORT}`);
}); 