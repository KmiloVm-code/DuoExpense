-- Create the database (if necessary, execute before creating tables)
CREATE DATABASE finance;
\c finance;

-- Create ENUM type for financial transactions
CREATE TYPE TransactionType AS ENUM ('income', 'expense', 'savings');

-- Users table
CREATE TABLE UserAccount (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  failed_attempts INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Categories table
CREATE TABLE Category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  parent_category_id INT REFERENCES Category(category_id) ON DELETE SET NULL
);

-- Payment methods table
CREATE TABLE PaymentMethod (
  payment_method_id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Credit cards table
CREATE TABLE CreditCard (
  card_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES UserAccount(user_id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  bank VARCHAR(50),
  credit_limit DECIMAL(10, 2),
  expiration_date VARCHAR(5) NOT NULL -- Format: MM/YY
);

-- Budget table
CREATE TABLE Budget (
  budget_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES UserAccount(user_id) ON DELETE CASCADE,
  category_id INT REFERENCES Category(category_id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  period VARCHAR(20) NOT NULL, -- Example: 'monthly', 'annual'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  UNIQUE (user_id, category_id, start_date, end_date)
);

-- Financial transactions table
CREATE TABLE FinancialTransaction (
  transaction_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES UserAccount(user_id) ON DELETE CASCADE,
  category_id INT REFERENCES Category(category_id) ON DELETE SET NULL,
  payment_method_id INT REFERENCES PaymentMethod(payment_method_id) ON DELETE SET NULL,
  card_id INT REFERENCES CreditCard(card_id) ON DELETE SET NULL,
  type TransactionType NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  transaction_date TIMESTAMP DEFAULT now(),
  recurring_transaction_id INT DEFAULT NULL
);

-- Activity log table
CREATE TABLE ActivityLog (
  log_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES UserAccount(user_id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  log_date TIMESTAMP DEFAULT now()
);

-- Indexes to improve performance
CREATE INDEX idx_log_user_date ON ActivityLog (user_id, log_date);
CREATE INDEX idx_budget_user_category ON Budget (user_id, category_id);
CREATE INDEX idx_transaction_user_date ON FinancialTransaction (user_id, transaction_date);

-- Updated Trigger to prevent transaction date update on modifications other than transaction_date
CREATE OR REPLACE FUNCTION update_transaction_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_date IS NULL THEN
    NEW.transaction_date := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_transaction
BEFORE UPDATE ON FinancialTransaction
FOR EACH ROW
EXECUTE FUNCTION update_transaction_date();

-- Materialized view for user balance per month
CREATE MATERIALIZED VIEW MonthlyBalance AS
SELECT 
  user_id, 
  date_trunc('month', transaction_date) AS month, 
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
  SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END) AS total_savings,
  (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) -
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) -
    SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END)) AS balance
FROM FinancialTransaction
GROUP BY user_id, month;

-- Function to calculate current user balance
CREATE OR REPLACE FUNCTION get_current_balance(user_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount WHEN type = 'savings' THEN amount ELSE -amount END), 0)
  INTO current_balance
  FROM FinancialTransaction
  WHERE user_id = user_id_param;

  RETURN current_balance;
END;
$$ LANGUAGE plpgsql;

-- Function to get balance in a date range
CREATE OR REPLACE FUNCTION get_balance_in_range(
  user_id_param UUID,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (total_income DECIMAL, total_expenses DECIMAL, total_savings DECIMAL, balance DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
    COALESCE(SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END), 0) AS total_savings,
    (COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END), 0)) AS balance
    FROM FinancialTransaction
    WHERE user_id = user_id_param 
    AND transaction_date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically log financial transactions
CREATE OR REPLACE FUNCTION log_transaction()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ActivityLog (user_id, action)
  VALUES (NEW.user_id, 'New financial transaction recorded with amount ' || NEW.amount);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_transaction
AFTER INSERT ON FinancialTransaction
FOR EACH ROW
EXECUTE FUNCTION log_transaction();

CREATE OR REPLACE FUNCTION get_budget_summary(
    user_id_param UUID,
    start_date_param DATE,
    end_date_param DATE
)
RETURNS TABLE (
    category VARCHAR,
    budgeted DECIMAL,
    spent DECIMAL,
    difference DECIMAL,
    usage_percentage DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.name AS category,
        b.amount AS budgeted,
        COALESCE(SUM(ft.amount), 0) AS spent,
        COALESCE(SUM(ft.amount), 0) - b.amount AS difference,
        CASE 
            WHEN b.amount = 0 THEN 0
            ELSE ROUND((COALESCE(SUM(ft.amount), 0) / b.amount) * 100, 2)
        END AS usage_percentage
    FROM budget b
    JOIN category c ON b.category_id = c.category_id
    LEFT JOIN financialtransaction ft 
        ON ft.category_id = b.category_id
        AND ft.user_id = b.user_id
        AND ft.type = 'expense'
        AND ft.transaction_date BETWEEN start_date_param AND end_date_param
    WHERE b.user_id = user_id_param
    AND b.start_date <= end_date_param
    AND b.end_date >= start_date_param
    GROUP BY c.name, b.amount;
END;
$$ LANGUAGE plpgsql;