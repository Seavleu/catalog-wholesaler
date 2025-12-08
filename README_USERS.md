# User Management Guide

## Overview

All users are stored in the Supabase database. There are no hardcoded credentials in the codebase.

## Default Users

The application requires three user roles:

1. **Admin** - Full access to manage products and users
2. **Manager** - Can manage products
3. **User** - Regular customer access

## Setting Up Users

### Initial Setup

Run the seed script to ensure all required users exist:

```bash
npx tsx scripts/seedSupabaseUsers.ts
```

This script will:
- Check if users with each role already exist
- Create missing users with random passwords
- Display credentials for newly created users
- Show existing users (passwords not shown for security)

### User Credentials

**Important:** Passwords are only displayed when users are first created. For existing users:
- Use the Supabase dashboard to reset passwords
- Or use the admin panel to create new users

### Default User Configuration

- **Admin**: `admin@meymeysport.com` (email login)
- **Manager**: `manager@meymeysport.com` (email login)
- **User**: Phone number login (placeholder: `+855123456789` - update with real number)

### Updating User Phone Numbers

The default "user" role uses a placeholder phone number. Update it via:
1. Supabase Dashboard → Authentication → Users
2. Admin Panel → User Management (if logged in as admin)

## Creating New Users

### Via Admin Panel

1. Log in as admin
2. Go to Admin → Users tab
3. Fill in user details:
   - Phone number (for regular users)
   - Email (for admin/manager)
   - Full name
   - Role
   - Password (optional - random password generated if not provided)
4. Click "បង្កើត" (Create)

### Via API

```bash
POST /api/users
Content-Type: application/json

{
  "phone": "+855123456789",
  "full_name": "New User",
  "role": "user",
  "password": "optional-password"
}
```

## Login

- **Admins/Managers**: Use email address
- **Regular Users**: Use phone number (E.164 format: +855XXXXXXXXX)

## Security Notes

- All passwords are stored securely in Supabase Auth
- No passwords are hardcoded in the codebase
- Random passwords are generated for new users if not provided
- Use strong passwords for production environments

