-- Opal SACCO Database Schema

-- Enable UUID and ENUM extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role types enum
CREATE TYPE role_type AS ENUM ('admin', 'manager', 'cso', 'cashier', 'credit_officer', 'auditor', 'member');

-- Transaction type enum
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'loan_disbursement', 'loan_repayment', 'interest', 'fee');

-- Loan status enum
CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'rejected', 'disbursed', 'ongoing', 'completed', 'defaulted', 'written_off');

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role role_type NOT NULL DEFAULT 'member',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Members table (for customers/members)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  member_number TEXT UNIQUE NOT NULL,
  national_id TEXT UNIQUE,
  date_of_birth DATE,
  address TEXT,
  next_of_kin TEXT,
  next_of_kin_phone TEXT,
  employment_status TEXT,
  membership_status TEXT DEFAULT 'active',
  share_capital DECIMAL(12, 2) DEFAULT 0,
  shares_held INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Savings accounts table
CREATE TABLE IF NOT EXISTS savings_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE NOT NULL,
  account_type TEXT DEFAULT 'mandatory', -- mandatory, voluntary, fixed
  balance DECIMAL(12, 2) DEFAULT 0,
  monthly_target DECIMAL(12, 2) DEFAULT 0,
  accumulated_interest DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  account_id UUID REFERENCES savings_accounts(id),
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  balance_after DECIMAL(12, 2),
  reference_number TEXT UNIQUE,
  description TEXT,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  loan_number TEXT UNIQUE NOT NULL,
  loan_amount DECIMAL(12, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) DEFAULT 10.0,
  loan_period INTEGER NOT NULL, -- in months
  status loan_status DEFAULT 'pending',
  applied_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  disbursed_by UUID REFERENCES users(id),
  disbursed_at TIMESTAMP WITH TIME ZONE,
  repayment_status TEXT DEFAULT 'active', -- active, completed, defaulted
  total_repaid DECIMAL(12, 2) DEFAULT 0,
  next_payment_date DATE,
  arrears_amount DECIMAL(12, 2) DEFAULT 0,
  purpose TEXT,
  collateral_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan repayment schedule
CREATE TABLE IF NOT EXISTS loan_repayments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount_due DECIMAL(12, 2) NOT NULL,
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  paid_date DATE,
  status TEXT DEFAULT 'pending', -- pending, paid, partially_paid, overdue, waived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  changes JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_repayments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'::role_type);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Members table
CREATE POLICY "Members can view own profile" ON members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin'::role_type, 'manager'::role_type, 'cso'::role_type)
  );

CREATE POLICY "Staff can view all members" ON members
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin'::role_type, 'manager'::role_type, 'cso'::role_type, 'cashier'::role_type, 'credit_officer'::role_type, 'auditor'::role_type)
  );

-- RLS Policies for Savings Accounts
CREATE POLICY "Members can view own savings" ON savings_accounts
  FOR SELECT USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid()) OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin'::role_type, 'manager'::role_type, 'cashier'::role_type)
  );

-- RLS Policies for Transactions
CREATE POLICY "Members can view own transactions" ON transactions
  FOR SELECT USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid()) OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin'::role_type, 'manager'::role_type, 'cso'::role_type, 'cashier'::role_type, 'auditor'::role_type)
  );

-- RLS Policies for Loans
CREATE POLICY "Members can view own loans" ON loans
  FOR SELECT USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid()) OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin'::role_type, 'manager'::role_type, 'credit_officer'::role_type, 'auditor'::role_type)
  );

-- Create indexes for performance
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_member_number ON members(member_number);
CREATE INDEX idx_savings_accounts_member_id ON savings_accounts(member_id);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loan_repayments_loan_id ON loan_repayments(loan_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);

DROP POLICY IF EXISTS "Users can view own profile" ON users;

DROP POLICY IF EXISTS "Admins can view all users" ON users;

DROP POLICY IF EXISTS "Managers can view all users" ON users;

-- Create a helper function to check user role
CREATE OR REPLACE FUNCTION public.check_user_role(target_role role_type DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_role role_type;
BEGIN
  -- Get current user's role from JWT claims (fast, no recursion)
  SELECT (auth.jwt() ->> 'role')::role_type INTO current_user_role;
  
  -- If no target role specified, just check if user is authenticated
  IF target_role IS NULL THEN
    RETURN current_user_role IS NOT NULL;
  END IF;
  
  -- Check specific role
  RETURN current_user_role = target_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now update your policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all users (using the function)
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (public.check_user_role('admin'));

-- Or allow multiple roles
CREATE POLICY "Staff can view users" ON users
  FOR SELECT USING (
    public.check_user_role('admin') OR 
    public.check_user_role('manager') OR
    public.check_user_role('cso')
  );

DROP POLICY IF EXISTS "Allow server-side queries" ON users;
  -- Drop the problematic policy first
DROP POLICY IF EXISTS "Users can view their own data" ON users;

DROP POLICY IF EXISTS "Allow server-side queries" ON users;
  -- Drop the problematic policy first
DROP POLICY IF EXISTS "Users can view their own data" ON users;

DROP POLICY IF EXISTS "Users can view own profile" ON users;

DROP POLICY IF EXISTS "Admins can view all users" ON users;

DROP POLICY IF EXISTS "Managers can view all users" ON users;

-- Create new policies without recursion
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Managers can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'manager')
    )
  );

  