# Admin Authentication System

## Setup Instructions

### 1. Create Admin Account

Visit: **http://localhost:3000/admin/setup**

Default credentials (you can change these):
- Email: `admin@eternity.com`
- Password: `admin123`
- Name: `Admin`

### 2. Login to Admin Dashboard

Visit: **http://localhost:3000/admin/login**

Use the credentials you created in step 1.

### 3. Access Dashboard

After successful login, you'll be redirected to: **http://localhost:3000/admin**

## Features

### ✅ Authentication System
- Secure login with bcrypt password hashing
- HTTP-only session cookies
- Auto-redirect to login if not authenticated
- Logout functionality

### ✅ Advanced Dashboard
- **Real-time Statistics**:
  - Total Revenue
  - Total Orders
  - Pending Payment Reviews
  - Total Customers
  - Weekly Revenue Tracking

- **Recent Orders Table**:
  - Order details with status
  - Payment slip verification
  - Customer information
  - Quick actions

- **Quick Stats Cards**:
  - Product catalog count
  - Approved orders
  - Average order value

### ✅ Admin Actions
- Manage Products (Add/Delete)
- View Payment Slips
- Approve/Reject Payments
- Track Order Status
- Logout

## Routes

- `/admin/setup` - First-time admin account creation
- `/admin/login` - Admin login page
- `/admin` - Dashboard (requires auth)
- `/admin/products` - Product management (requires auth)
- `/admin/products/new` - Add new product (requires auth)

## API Endpoints

- `POST /api/auth/setup` - Create admin account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

## Default Admin Credentials

For demo purposes:
- **Email**: admin@eternity.com
- **Password**: admin123

**⚠️ IMPORTANT**: Change these in production!
