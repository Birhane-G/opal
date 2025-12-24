# Opal SACCO - Portal & API Documentation

A comprehensive role-based access control system for SACCOS (Savings and Credit Cooperative Society) to manage members, savings, loans, and financial transactions.

## System Overview

The Opal SACCO system provides:

- **Role-Based Authentication** - 7 different roles with specific permissions
- **Member Management** - Register, profile management, and member data
- **Savings Module** - Track savings accounts, deposits, and withdrawals
- **Loan Management** - Apply, process, approve, and manage loans
- **Financial Transactions** - Record all deposits, withdrawals, and loan transactions
- **Audit & Reporting** - Complete audit trails and financial reports
- **Row-Level Security** - Database-level access control

## User Roles

### 1. Admin/Super Admin

- Full system access
- Create/modify roles and permissions
- Manage all users
- System configuration
- Audit trail access

### 2. Manager

- View all customer accounts
- Approve large loans
- Generate financial reports
- Staff management (limited)

### 3. Customer Service Officer (CSO)

- Register new members
- Process deposits/withdrawals
- Update customer information
- Process loan applications

### 4. Cashier/Teller

- Process daily transactions
- Receive savings deposits
- Process loan repayments
- Issue receipts

### 5. Credit Officer

- Process loan applications
- Credit assessment
- Loan approval (within limits)
- Loan portfolio management

### 6. Member/Customer

- View own account balance
- Check transaction history
- Apply for loans online
- Update personal info
- Download statements

### 7. Auditor

- View-only access to all financial data
- Generate audit reports
- Export capabilities

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install

# or

yarn install
\`\`\`

### 2. Environment Variables

Add these to your Vercel project environment variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Set Up Database

Run the database schema script in Supabase SQL editor:

\`\`\`bash

# Copy content from scripts/001_Opal_schema.sql

# Paste into Supabase SQL editor and execute

\`\`\`

Alternatively, you can run it programmatically:

\`\`\`bash
npm run setup:db
\`\`\`

### 4. Create Initial Admin User

Use the Supabase Auth interface to create an admin account, then update their role:

\`\`\`sql
UPDATE users SET role = 'admin' WHERE email = 'admin@Opal.sacco';
\`\`\`

## API Routes

### Authentication

- `POST /api/auth/register` - Register new member
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Member Management

- `GET /api/members/profile` - Get current user profile
- `PUT /api/members/profile` - Update profile
- `GET /api/members/savings` - Get savings accounts
- `GET /api/members/transactions` - Get transaction history

### Loan Management

- `POST /api/loans/apply` - Apply for loan
- `GET /api/loans/pending` - Get pending loan applications
- `PUT /api/loans/:id/approve` - Approve loan (Manager/Credit Officer)

## File Structure

\`\`\`
app/
├── auth/
│ ├── login/
│ ├── register/
│ └── callback/
├── dashboard/
│ ├── admin/
│ ├── manager/
│ ├── cso/
│ ├── cashier/
│ ├── credit-officer/
│ ├── auditor/
│ └── member/
├── admin/
├── manager/
├── cso/
├── cashier/
├── credit-officer/
├── member/
├── api/
│ ├── auth/
│ ├── members/
│ └── loans/
├── layout.tsx
├── page.tsx
└── globals.css

lib/
├── supabase/
│ ├── client.ts
│ ├── server.ts
│ └── proxy.ts
├── auth.ts
└── utils/

scripts/
├── 001_Opal_schema.sql
└── seed-data.sql

public/
components/
├── ui/
└── ...
\`\`\`

## Key Features

### 1. Role-Based Dashboards

Each role has a dedicated dashboard with role-specific actions and data.

### 2. Member Registration

- Collect personal information
- Generate unique member numbers
- Assign share accounts
- Automatic member profile creation

### 3. Loan Application Workflow

- Members can apply online
- CSO can process initial applications
- Credit Officers perform credit assessment
- Managers approve loans
- Cashiers disburse funds

### 4. Transaction Recording

- All deposits/withdrawals tracked
- Automatic balance updates
- Receipt generation capability
- Daily reconciliation

### 5. Security Features

- Row-Level Security (RLS) at database level
- Role-based access control
- Secure password hashing
- Activity logging
- Audit trails

## Database Schema

### Main Tables

- `users` - System users (extends Supabase auth)
- `members` - Member/customer profiles
- `savings_accounts` - Savings account records
- `transactions` - All financial transactions
- `loans` - Loan applications and records
- `loan_repayments` - Repayment schedules
- `audit_logs` - Audit trail
- `activity_logs` - Activity logging

## Deployment

### Deploy to Vercel

\`\`\`bash
git push origin main

# or connect GitHub repository to Vercel

\`\`\`

The system will automatically deploy with your Supabase integration.

### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing

### Test Accounts

After setup, create test accounts for each role:

\`\`\`sql
-- Admin user
INSERT INTO users (id, email, full_name, role, is_active)
VALUES ('uuid_here', 'admin@Opal.sacco', 'Admin User', 'admin', true);

-- Manager
INSERT INTO users (id, email, full_name, role, is_active)
VALUES ('uuid_here', 'manager@Opal.sacco', 'Manager User', 'manager', true);

-- CSO
INSERT INTO users (id, email, full_name, role, is_active)
VALUES ('uuid_here', 'cso@Opal.sacco', 'CSO User', 'cso', true);
\`\`\`

## Troubleshooting

### Login Issues

- Verify environment variables are set in Vercel
- Check Supabase URL and Key are correct
- Clear browser cookies/cache

### Database Errors

- Ensure RLS policies are enabled
- Check that all tables exist in Supabase
- Verify user has correct role in `users` table

### Permission Denied

- Check user role matches dashboard route
- Verify RLS policies in database
- Check Supabase anon key permissions

## Next Steps

1. **Create admin user** in Supabase
2. **Run database schema** from SQL script
3. **Set environment variables** in Vercel
4. **Deploy** to production
5. **Create staff users** via admin dashboard
6. **Start registering members**

## Support & Maintenance

For issues:

1. Check browser console for errors
2. Verify Supabase connection status
3. Check user role in database
4. Review audit logs for activity

## Security Notes

- Always use HTTPS in production
- Keep Supabase keys secure
- Regularly audit access logs
- Implement 2FA for admin accounts
- Regular database backups
- Monitor for suspicious activity

---

**Opal SACCO Management System**
Version 1.0 | Built with Next.js, Supabase, and TypeScript
