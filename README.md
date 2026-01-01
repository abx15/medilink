# MedLink - Digital Health Records & Emergency QR Access System

A production-ready MERN application for managing digital health records with emergency QR code access.

## 📁 Project Structure

```
medilink/
├── client/          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── server/          # Node.js + Express Backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    ├── .env
    ├── server.js
    └── package.json
```

## 🚀 Tech Stack

- **Frontend**: React, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas-ready)
- **Authentication**: JWT
- **OTP & Notifications**: Twilio (SMS + WhatsApp), Nodemailer (Email)
- **File Uploads**: Cloudinary
- **QR Codes**: Token-based secure QR generation

## ✨ Features

### Three-Role Authentication System

- **Users (Patients)**: OTP-verified registration, self-reporting, health card generation
- **Doctors**: Credential submission, admin approval required, medical record verification
- **Admins**: Doctor approval workflow, system oversight, audit logs

### Core Functionality

- ✅ Dual OTP verification (SMS + Email)
- ✅ Digital Health Card generation (Aadhaar/Ayushman style)
- ✅ QR-based emergency access (real-time data)
- ✅ Medical record management with versioning
- ✅ Doctor verification workflow
- ✅ Comprehensive notification system
- ✅ Audit logging for all critical actions

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

   - MongoDB connection string
   - JWT secret
   - Twilio credentials (for SMS/WhatsApp)
   - SMTP credentials (for email)
   - Cloudinary credentials (for file uploads)

5. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
TWILIO_WHATSAPP_NUMBER=your-twilio-whatsapp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
QR_ENCRYPTION_KEY=your-encryption-key
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

## 📡 API Documentation

### Authentication Routes

- `POST /api/auth/register/user` - User registration
- `POST /api/auth/register/doctor` - Doctor registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/doctor` - Doctor login
- `POST /api/auth/login/admin` - Admin login

### User Routes (Protected)

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/medical-history` - Add medical history
- `GET /api/user/health-card` - Get digital health card
- `POST /api/user/regenerate-qr` - Regenerate QR code

### Doctor Routes (Protected, Approved Only)

- `GET /api/doctor/patients` - Get patients
- `POST /api/doctor/verify-disease` - Verify disease
- `POST /api/doctor/add-prescription` - Add prescription

### Admin Routes (Protected)

- `GET /api/admin/pending-doctors` - Get pending approvals
- `POST /api/admin/approve-doctor/:id` - Approve doctor
- `GET /api/admin/audit-logs` - View audit logs

### Public Routes

- `POST /api/emergency/scan-qr` - Emergency QR scan (no auth)

## 🚀 Deployment

### MongoDB Atlas

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string and update `MONGODB_URI` in `.env`

### Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get credentials from dashboard and update `.env`

### Twilio

1. Create account at [Twilio](https://www.twilio.com/)
2. Get Account SID, Auth Token, and phone numbers
3. Enable WhatsApp sandbox for testing

### Email (Gmail)

1. Enable 2-factor authentication on Gmail
2. Generate App Password
3. Use app password in `SMTP_PASSWORD`

## 🎯 Hackathon Highlights

- ✅ Production-ready architecture
- ✅ Complete role-based access control
- ✅ Real-time data consistency
- ✅ Secure QR token system
- ✅ Comprehensive notification system
- ✅ Full audit trail
- ✅ Scalable MongoDB design
- ✅ Modern React UI with Tailwind CSS

## 📝 License

ISC

## 👥 Contributors

MedLink Development Team
