# Bank Management System

A comprehensive banking application built with NestJS backend and React frontend, providing dual-portal architecture for both customers and administrators.

## 🏗️ Architecture Overview

The system implements a dual-portal design with separate interfaces for customers and bank administrators:

- **Customer Portal**: Account management, transactions, loan applications
- **Administrative Portal**: Employee management, loan processing, system analytics

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS with TypeScript [1](#3-0) 
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with bcrypt password hashing
- **Scheduling**: @nestjs/schedule for automated tasks
- **Validation**: class-validator and class-transformer

### Frontend
- **Framework**: React 19.1.0 with Vite [2](#3-1) 
- **Routing**: React Router DOM 7.5.3
- **Styling**: Tailwind CSS 4.1.8
- **UI Components**: Material-UI, Lucide React icons
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form
- **HTTP Client**: Axios

## 🚀 Features

### Customer Portal
- **Dashboard**: Account overview with carousel-style account cards [3](#3-2) 
- **Account Management**: View account details and transaction history [4](#3-3) 
- **Money Transfer**: Inter-account and cross-branch transfers [5](#3-4) 
- **Loan Applications**: Apply for loans and track payment schedules
- **Real-time Notifications**: System alerts and transaction updates

### Administrative Portal
- **Dashboard Analytics**: Real-time metrics and data visualization [6](#3-5) 
- **Account Management**: Create, edit, and manage customer accounts [7](#3-6) 
- **Employee Management**: Staff administration with role-based access [8](#3-7) 
- **Loan Processing**: Approve/reject loan applications and manage payments [9](#3-8) 
- **Branch Management**: Multi-branch operations and reporting [10](#3-9) 
- **Transaction Monitoring**: System-wide transaction oversight

## 📁 Project Structure

```
Bank_Management_System/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── admin/          # Administrative modules
│   │   ├── user/           # Customer-facing services
│   │   ├── core/           # Shared entities and utilities
│   │   └── main.ts         # Application entry point
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Admin/      # Admin portal components
│   │   │   ├── Customer/   # Customer portal components
│   │   │   └── Layouts/    # Shared layout components
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main application component
│   └── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
# Configure database connection in .env
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Authentication & Security

The system implements role-based access control with protected routes [11](#3-10) :
- **Customer Routes**: Basic authentication required
- **Admin Routes**: Administrative privileges required
- **Password Security**: bcrypt hashing for secure password storage

## 📊 Key Backend Services

### Dashboard Service
Provides real-time analytics and system metrics using complex database aggregations [12](#3-11) 

### Loan Management
Automated loan processing with payment schedule generation and business logic calculations [13](#3-12) 

### User Services
Customer-facing operations including account management, transfers, and notifications [14](#3-13) 

## 🎨 Frontend Architecture

The frontend uses a modular component architecture with:
- **Layout Components**: Consistent navigation and structure
- **Protected Routes**: Authentication-based access control
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Local state with hooks and context

## 🔄 API Integration

RESTful API endpoints following standard conventions:
- `GET /api/user/{id}/accounts` - Customer account data
- `GET /api/admin/dashboard` - Administrative analytics
- `POST /api/user/transfer` - Money transfer operations
- `GET /api/admin/loans` - Loan management

## 📈 Monitoring & Analytics

The system includes comprehensive monitoring through:
- Real-time dashboard metrics
- Transaction volume tracking
- Account status distribution
- Branch performance analytics

## 🚀 Deployment

The application is designed for containerized deployment with separate frontend and backend services. Database migrations and environment configuration should be handled during deployment setup.

## Notes

This Bank Management System demonstrates enterprise-level architecture with proper separation of concerns, comprehensive error handling, and scalable design patterns. The dual-portal approach ensures appropriate access control while maintaining a unified codebase.
