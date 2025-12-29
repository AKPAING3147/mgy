# Admin Users Management Feature

## Overview
Admins can now view all users and delete their orders (collections) from dedicated user pages.

## New Routes

### 1. `/admin/users`
- Lists all registered users
- Shows user statistics (name, email, order count, join date)
- Click on "View Details" to see individual user information

### 2. `/admin/users/[id]`
- Displays detailed information about a specific user
- Shows all orders (collections) for that user
- Allows deletion of individual orders with confirmation dialog

## Features Added

### User Management Page
- **File**: `app/admin/users/page.tsx`
- View all registered customers
- See total order count per user
- Navigate to individual user details

### User Details Page
- **File**: `app/admin/users/[id]/page.tsx`
- Complete user information display
- List of all user orders with:
  - Order ID (clickable link to order details)
  - Items in each order
  - Order amount
  - Status badge
  - Created date
  - Delete button for each order

### Delete Order Component
- **File**: `components/admin/DeleteOrderButton.tsx`
- Client-side component with two-step confirmation
- Shows "Delete" button initially
- Confirms with "Confirm" and "Cancel" buttons
- Provides loading state during deletion
- Orders are soft-deleted (status set to "DELETED")

### Navigation
- Updated admin dashboard to make the "Customers" card clickable
- Clicking the Customers stat card navigates to `/admin/users`
- Hover effect added for better UX

## How to Use

1. **Go to Admin Dashboard**: Login as admin and visit `/admin`
2. **Click on Customers Card**: The blue "Customers" card is now clickable
3. **View All Users**: See the complete list of registered customers
4. **View User Details**: Click "View Details" on any user
5. **Delete Orders**: 
   - Click the "Delete" button next to any order
   - Confirm the deletion by clicking "Confirm"
   - Or cancel by clicking "Cancel"

## Technical Details

- Orders are **soft-deleted** (marked as "DELETED" status, not removed from database)
- Uses Next.js Server Actions for form handling
- Automatic page revalidation after deletion
- Type-safe with TypeScript
- Responsive design with Tailwind CSS
- Loading states included

## Security

- All user management routes are in `/admin` directory
- Requires admin authentication
- Server-side data fetching ensures security
- Confirmation dialog prevents accidental deletions
