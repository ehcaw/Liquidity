-- States data
INSERT INTO states (code, name) VALUES
  ('AL', 'Alabama'),
  ('AK', 'Alaska'),
  ('AZ', 'Arizona'),
  ('AR', 'Arkansas'),
  ('CA', 'California'),
  ('CO', 'Colorado'),
  ('CT', 'Connecticut'),
  ('DE', 'Delaware'),
  ('FL', 'Florida'),
  ('GA', 'Georgia'),
  ('HI', 'Hawaii'),
  ('ID', 'Idaho'),
  ('IL', 'Illinois'),
  ('IN', 'Indiana'),
  ('IA', 'Iowa'),
  ('KS', 'Kansas'),
  ('KY', 'Kentucky'),
  ('LA', 'Louisiana'),
  ('ME', 'Maine'),
  ('MD', 'Maryland'),
  ('MA', 'Massachusetts'),
  ('MI', 'Michigan'),
  ('MN', 'Minnesota'),
  ('MS', 'Mississippi'),
  ('MO', 'Missouri'),
  ('MT', 'Montana'),
  ('NE', 'Nebraska'),
  ('NV', 'Nevada'),
  ('NH', 'New Hampshire'),
  ('NJ', 'New Jersey'),
  ('NM', 'New Mexico'),
  ('NY', 'New York'),
  ('NC', 'North Carolina'),
  ('ND', 'North Dakota'),
  ('OH', 'Ohio'),
  ('OK', 'Oklahoma'),
  ('OR', 'Oregon'),
  ('PA', 'Pennsylvania'),
  ('RI', 'Rhode Island'),
  ('SC', 'South Carolina'),
  ('SD', 'South Dakota'),
  ('TN', 'Tennessee'),
  ('TX', 'Texas'),
  ('UT', 'Utah'),
  ('VT', 'Vermont'),
  ('VA', 'Virginia'),
  ('WA', 'Washington'),
  ('WV', 'West Virginia'),
  ('WI', 'Wisconsin'),
  ('WY', 'Wyoming');

-- Transformers and SpongeBob characters
INSERT INTO users (first_name, last_name, email, phone, role, street, city, state, zipcode, status)
VALUES
  ('Optimus', 'Prime', 'optimus.prime@autobots.com', '5551234567', 'Admin', '123 Cybertron Ave', 'San Francisco', 'CA', '94105', 'Active'),
  ('Megatron', 'Decepticon', 'megatron@decepticons.com', '5552345678', 'User', '456 Dark Moon St', 'Los Angeles', 'CA', '90001', 'Active'),
  ('Bumblebee', 'Autobot', 'bumblebee@autobots.com', '5553456789', 'User', '789 Yellow St', 'San Diego', 'CA', '92101', 'Active'),
  ('SpongeBob', 'SquarePants', 'spongebob@bikinibottom.com', '5554567890', 'User', '124 Pineapple St', 'Miami', 'FL', '33101', 'Active'),
  ('Patrick', 'Star', 'patrick@bikinibottom.com', '5555678901', 'User', '125 Rock St', 'Orlando', 'FL', '32801', 'Active');

-- Wealthy users for demo purposes
INSERT INTO users (first_name, last_name, email, phone, role, street, city, state, zipcode, status)
VALUES
  ('Amara', 'Del Prato', 'amara.delprato@example.com', '5556789012', 'User', '1 Luxury Lane', 'New York', 'NY', '10001', 'Active'),
  ('Jisheng', 'Jiang', 'jisheng.jiang@example.com', '5557890123', 'User', '2 Wealth Way', 'Seattle', 'WA', '98101', 'Active'),
  ('Manas', 'Chougule', 'manas.chougule@example.com', '5558901234', 'User', '3 Prosperity Pkwy', 'Boston', 'MA', '02108', 'Active'),
  ('Michael', 'Chu', 'michael.chu@example.com', '5559012345', 'User', '4 Fortune Blvd', 'Chicago', 'IL', '60601', 'Active'),
  ('Miles', 'Thames', 'miles.thames@example.com', '5550123456', 'User', '5 Success St', 'Austin', 'TX', '78701', 'Active'),
  ('Ryan', 'Nguyen', 'ryan.nguyen@example.com', '5551230987', 'User', '6 Opulence Ave', 'San Jose', 'CA', '95113', 'Active');

-- Create sample bank accounts for users
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
SELECT 
  LPAD(FLOOR(RANDOM() * 1000000000000)::TEXT, 12, '0'), -- Generate random 12-digit account number
  CASE WHEN random() < 0.5 THEN 'Savings'::account_type_enum ELSE 'Checking'::account_type_enum END, -- Random account type
  -- High balances for wealthy users, normal balances for characters
  CASE 
    WHEN u.first_name IN ('Amara', 'Jisheng', 'Manas', 'Michael', 'Miles', 'Ryan') THEN 
      (random() * 9000000 + 1000000)::numeric(10,2) -- $1M to $10M for wealthy users
    ELSE 
      (random() * 90000 + 10000)::numeric(10,2) -- $10k to $100k for character users
  END,
  'Active'::account_status_enum,
  u.id
FROM users u;

-- Add a second account for each user
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
SELECT 
  LPAD(FLOOR(RANDOM() * 1000000000000)::TEXT, 12, '0'), -- Generate random 12-digit account number
  CASE WHEN a.account_type = 'Savings' THEN 'Checking'::account_type_enum ELSE 'Savings'::account_type_enum END, -- Opposite account type
  -- High balances for wealthy users, normal balances for characters
  CASE 
    WHEN u.first_name IN ('Amara', 'Jisheng', 'Manas', 'Michael', 'Miles', 'Ryan') THEN 
      (random() * 9000000 + 1000000)::numeric(10,2) -- $1M to $10M for wealthy users
    ELSE 
      (random() * 90000 + 10000)::numeric(10,2) -- $10k to $100k for character users
  END,
  'Active'::account_status_enum,
  u.id
FROM users u
JOIN accounts a ON u.id = a.user_id
GROUP BY u.id, a.account_type;

-- Create sample transactions for each account
INSERT INTO transactions (amount, description, balance, status, transaction_type, account_id)
SELECT
  CASE 
    WHEN random() < 0.5 THEN (random() * 1000)::numeric(10,2) -- deposit
    ELSE (random() * -500)::numeric(10,2) -- withdrawal
  END,
  CASE WHEN random() < 0.25 THEN 'Grocery shopping'
       WHEN random() < 0.5 THEN 'Restaurant payment'
       WHEN random() < 0.75 THEN 'Utility bill'
       ELSE 'Paycheck deposit'
  END,
  accounts.balance, -- Current balance, would need updating in a real scenario
  'Complete'::transaction_status_enum,
  CASE 
    WHEN random() < 0.25 THEN 'Withdrawal'::transaction_type_enum
    WHEN random() < 0.5 THEN 'Deposit'::transaction_type_enum
    WHEN random() < 0.75 THEN 'Transfer'::transaction_type_enum
    ELSE 'Payment'::transaction_type_enum
  END,
  accounts.id
FROM accounts
CROSS JOIN generate_series(1, 5); -- 5 transactions per account

-- Create payment schedules for some accounts (recurring payments)
INSERT INTO payment_schedule (amount, start_date, end_date, status, frequency, day_of_week, day_of_month, account_id)
SELECT
  (random() * 500 + 100)::numeric(10,2), -- Amount between 100 and 600
  (CURRENT_DATE - INTERVAL '1 month')::date, -- Started a month ago
  (CURRENT_DATE + INTERVAL '1 year')::date, -- Ends a year from now
  'Active'::schedule_status_enum,
  CASE 
    WHEN random() < 0.33 THEN 'Weekly'::schedule_frequency_enum
    WHEN random() < 0.66 THEN 'Monthly'::schedule_frequency_enum
    ELSE 'Annually'::schedule_frequency_enum
  END,
  CASE WHEN random() < 0.33 THEN 'Monday'::day_enum
       WHEN random() < 0.66 THEN 'Wednesday'::day_enum
       ELSE 'Friday'::day_enum
  END,
  (FLOOR(random() * 28) + 1)::smallint, -- Day of month between 1 and 28
  accounts.id
FROM accounts
WHERE random() < 0.5; -- Only for about half of the accounts

-- Create ledger entries for completed transactions
INSERT INTO ledger (amount, description, entry_category, balance, account_id, transaction_id)
SELECT
  transactions.amount,
  transactions.description,
  CASE WHEN transactions.amount > 0 THEN 'Credit'::ledger_category_enum ELSE 'Debit'::ledger_category_enum END,
  transactions.balance,
  transactions.account_id,
  transactions.id
FROM transactions
WHERE transactions.status = 'Complete';