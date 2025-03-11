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

-- Insert users with specific creation dates
INSERT INTO users (first_name, last_name, email, phone, role, street, city, state, zipcode, status, created_at)
VALUES
  ('Optimus', 'Prime', 'optimus.prime@autobots.com', '5551234567', 'Admin'::user_role_enum, '123 Cybertron Ave', 'San Francisco', 'CA', '94105', 'Active'::user_status_enum, '2024-01-01'::timestamp),
  ('Megatron', 'Decepticon', 'megatron@decepticons.com', '5552345678', 'User'::user_role_enum, '456 Dark Moon St', 'Los Angeles', 'CA', '90001', 'Active'::user_status_enum, '2024-01-02'::timestamp),
  ('Bumblebee', 'Autobot', 'bumblebee@autobots.com', '5553456789', 'User'::user_role_enum, '789 Yellow St', 'San Diego', 'CA', '92101', 'Active'::user_status_enum, '2024-01-03'::timestamp),
  ('SpongeBob', 'SquarePants', 'spongebob@bikinibottom.com', '5554567890', 'User'::user_role_enum, '124 Pineapple St', 'Miami', 'FL', '33101', 'Active'::user_status_enum, '2024-01-04'::timestamp),
  ('Patrick', 'Star', 'patrick@bikinibottom.com', '5555678901', 'User'::user_role_enum, '125 Rock St', 'Orlando', 'FL', '32801', 'Active'::user_status_enum, '2024-01-05'::timestamp),
  ('Sandy', 'Cheeks', 'sandy@bikinibottom.com', '5556789012', 'User'::user_role_enum, '126 Dome St', 'Tampa', 'FL', '33602', 'Active'::user_status_enum, '2024-01-06'::timestamp),
  ('Squidward', 'Tentacles', 'squidward@bikinibottom.com', '5557890123', 'User'::user_role_enum, '127 Tiki St', 'Key West', 'FL', '33040', 'Active'::user_status_enum, '2024-01-07'::timestamp),
  ('Eugene', 'Krabs', 'mrkrebs@krustykrebs.com', '5558901234', 'User'::user_role_enum, '128 Krusty Lane', 'Jacksonville', 'FL', '32099', 'Active'::user_status_enum, '2024-01-08'::timestamp),
  ('Amara', 'Del Prato', 'amara.delprato@sjsu.edu', '5559012345', 'User'::user_role_enum, '1 Luxury Lane', 'New York', 'NY', '10001', 'Active'::user_status_enum, '2024-01-09'::timestamp),
  ('Jisheng', 'Jiang', 'jisheng.jiang@sjsu.edu', '5550123456', 'User'::user_role_enum, '2 Wealth Way', 'Seattle', 'WA', '98101', 'Active'::user_status_enum, '2024-01-10'::timestamp),
  ('Manas', 'Chougule', 'manas.chougule@sjsu.edu', '5551230987', 'User'::user_role_enum, '3 Prosperity Pkwy', 'Boston', 'MA', '02108', 'Active'::user_status_enum, '2024-01-11'::timestamp),
  ('Michael', 'Chu', 'michael.chu@sjsu.edu', '5552341098', 'User'::user_role_enum, '4 Fortune Blvd', 'Chicago', 'IL', '60601', 'Active'::user_status_enum, '2024-01-12'::timestamp),
  ('Miles', 'Thames', 'miles.thames@sjsu.edu', '5553452109', 'User'::user_role_enum, '5 Success St', 'Austin', 'TX', '78701', 'Active'::user_status_enum, '2024-01-13'::timestamp),
  ('Ryan', 'Nguyen', 'ryan.nguyen@sjsu.edu', '5554563210', 'User'::user_role_enum, '6 Rich Ave', 'San Jose', 'CA', '95113', 'Active'::user_status_enum, '2024-01-14'::timestamp),
  ('Suspended', 'User', 'suspended@example.com', '5551111111', 'User'::user_role_enum, '1 Suspended St', 'Miami', 'FL', '33101', 'Suspended'::user_status_enum, '2024-01-15'::timestamp),
  ('Locked', 'User', 'locked@example.com', '5552222222', 'User'::user_role_enum, '2 Locked St', 'Boston', 'MA', '02108', 'Locked'::user_status_enum, '2024-01-16'::timestamp),
  ('Deleted', 'User', 'deleted@example.com', '5553333333', 'User'::user_role_enum, '3 Deleted St', 'Seattle', 'WA', '98101', 'Deleted'::user_status_enum, '2024-01-17'::timestamp);

-- Insert accounts with high initial balances
DO $$
DECLARE
  i INTEGER;
  account_number CHAR(12);
  account_type account_type_enum;
  balance NUMERIC(10,2);
  account_status account_status_enum;
  created_date TIMESTAMP;
  user_id INTEGER;
BEGIN
  -- Loop through all users
  FOR user_id IN 1..17 LOOP
    -- Skip deleted users
    IF user_id = 17 THEN 
      CONTINUE;
    END IF;
    
    -- Account creation dates after user creation
    created_date := '2024-01-01'::timestamp + user_id * INTERVAL '2 day';
    
    -- Create checking account
    account_number := LPAD(user_id::text || '01', 12, '0');
    account_type := 'Checking'::account_type_enum;
    
    -- Higher balances for wealthy users
    IF user_id BETWEEN 9 AND 14 THEN 
      balance := 10000000 + (user_id * 500000);
    ELSE
      balance := 1000000 + (user_id * 100000);
    END IF;
    
    -- Account status (mostly active)
    IF user_id IN (15, 16) THEN
      account_status := 'Frozen'::account_status_enum;
    ELSE 
      account_status := 'Active'::account_status_enum;
    END IF;
    
    -- Insert checking account
    INSERT INTO accounts (account_number, account_type, balance, status, user_id, created_at)
    VALUES (account_number, account_type, balance, account_status, user_id, created_date);
    
    -- Create savings account
    account_number := LPAD(user_id::text || '02', 12, '0');
    account_type := 'Savings'::account_type_enum;
    
    -- Higher balances for savings
    IF user_id BETWEEN 9 AND 14 THEN 
      balance := 20000000 + (user_id * 1000000);
    ELSE
      balance := 2000000 + (user_id * 200000);
    END IF;
    
    -- Account status (some variety)
    IF user_id = 16 THEN
      account_status := 'Pending'::account_status_enum;
    ELSE 
      account_status := 'Active'::account_status_enum;
    END IF;
    
    -- Insert savings account (created a few days after checking)
    INSERT INTO accounts (account_number, account_type, balance, status, user_id, created_at)
    VALUES (account_number, account_type, balance, account_status, user_id, created_date + INTERVAL '3 day');
  END LOOP;
END $$;

-- Create transactions with random amounts
DO $$
DECLARE
  account_rec RECORD;
  trans_amount NUMERIC(10,2);
  current_balance NUMERIC(10,2);
  trans_type transaction_type_enum;
  trans_status transaction_status_enum;
  trans_desc TEXT;
  trans_date TIMESTAMP;
  trans_id INTEGER;
  ledger_type ledger_category_enum;
  num_transactions INTEGER;
  i INTEGER;
  descriptions TEXT[] := ARRAY[
    'Salary deposit', 
    'Investment return', 
    'Property purchase', 
    'Utility payment', 
    'Vehicle purchase',
    'Insurance premium',
    'Interbank transfer',
    'Loan payment',
    'Dividend payment',
    'Miscellaneous transaction'
  ];
BEGIN
  -- For each active account
  FOR account_rec IN SELECT id, account_type, balance, created_at FROM accounts WHERE status = 'Active'::account_status_enum LOOP
    -- Get initial balance for this account
    current_balance := account_rec.balance;
    
    -- Determine number of transactions (10-20 per account)
    num_transactions := 10 + floor(random() * 11);
    
    -- Create transactions for this account
    FOR i IN 1..num_transactions LOOP
      -- Randomly select transaction type
      CASE floor(random() * 4)
        WHEN 0 THEN trans_type := 'Deposit'::transaction_type_enum;
        WHEN 1 THEN trans_type := 'Withdrawal'::transaction_type_enum;
        WHEN 2 THEN trans_type := 'Transfer'::transaction_type_enum;
        ELSE trans_type := 'Payment'::transaction_type_enum;
      END CASE;
      
      -- Random transaction amount
      IF account_rec.account_type = 'Checking'::account_type_enum THEN
        IF trans_type = 'Deposit'::transaction_type_enum THEN
          trans_amount := 10000 + (random() * 490000);
          ledger_type := 'Credit'::ledger_category_enum;
        ELSE
          trans_amount := -1 * (10000 + (random() * 490000));
          ledger_type := 'Debit'::ledger_category_enum;
        END IF;
      ELSE
        -- Higher amounts for Savings accounts
        IF trans_type = 'Deposit'::transaction_type_enum THEN
          trans_amount := 50000 + (random() * 950000);
          ledger_type := 'Credit'::ledger_category_enum;
        ELSE
          trans_amount := -1 * (50000 + (random() * 950000));
          ledger_type := 'Debit'::ledger_category_enum;
        END IF;
      END IF;
      
      -- Ensure balance stays above 1 million
      IF current_balance + trans_amount < 1000000 THEN
        -- Adjust withdrawal to maintain minimum balance
        trans_amount := -1 * (current_balance - 1000000);
      END IF;
      
      -- Update running balance
      current_balance := current_balance + trans_amount;
      
      -- Random transaction status (mostly complete)
      IF random() < 0.9 THEN
        trans_status := 'Complete'::transaction_status_enum;
      ELSIF random() < 0.5 THEN
        trans_status := 'Pending'::transaction_status_enum;
      ELSE
        trans_status := 'Failed'::transaction_status_enum;
      END IF;
      
      -- Random description
      trans_desc := descriptions[1 + floor(random() * 10)];
      
      -- Transaction date after account creation
      trans_date := account_rec.created_at + (random() * 30 + i * 2) * INTERVAL '1 day';
      
      -- Insert transaction
      INSERT INTO transactions (
        amount, 
        description, 
        balance, 
        status, 
        transaction_type, 
        account_id, 
        created_at
      )
      VALUES (
        ABS(trans_amount),
        trans_desc,
        current_balance,
        trans_status,
        trans_type,
        account_rec.id,
        trans_date
      ) RETURNING id INTO trans_id;
      
      -- Create ledger entry for this transaction
      INSERT INTO ledger (
        amount,
        description,
        entry_category,
        balance,
        account_id,
        transaction_id,
        created_at
      )
      VALUES (
        ABS(trans_amount),
        trans_desc,
        ledger_type,
        current_balance,
        account_rec.id,
        trans_id,
        trans_date
      );
    END LOOP;
    
    -- Update account with final balance
    UPDATE accounts SET balance = current_balance WHERE id = account_rec.id;
  END LOOP;
END $$;

-- Create payment schedules
DO $$
DECLARE
  account_rec RECORD;
  payment_amount NUMERIC(10,2);
  start_date DATE;
  end_date DATE;
  payment_frequency schedule_frequency_enum;
  payment_status schedule_status_enum;
  day_val day_enum;
  day_num INTEGER;
  yearly_date DATE;
  frequency_types schedule_frequency_enum[] := ARRAY[
    'Daily'::schedule_frequency_enum,
    'Weekly'::schedule_frequency_enum,
    'Monthly'::schedule_frequency_enum,
    'Annually'::schedule_frequency_enum,
    'Once'::schedule_frequency_enum
  ];
  day_types day_enum[] := ARRAY[
    'Monday'::day_enum,
    'Tuesday'::day_enum,
    'Wednesday'::day_enum,
    'Thursday'::day_enum,
    'Friday'::day_enum,
    'Saturday'::day_enum,
    'Sunday'::day_enum
  ];
BEGIN
  -- For active accounts with 70% chance of having a payment schedule
  FOR account_rec IN 
    SELECT id, account_type, balance, created_at FROM accounts 
    WHERE status = 'Active'::account_status_enum AND random() < 0.7
  LOOP
    -- Random payment frequency
    payment_frequency := frequency_types[1 + floor(random() * 5)];
    
    -- Random amount based on account balance
    IF account_rec.balance > 10000000 THEN
      payment_amount := 10000 + (random() * 90000);
    ELSE
      payment_amount := 1000 + (random() * 9000);
    END IF;
    
    -- Start date after account creation
    start_date := (account_rec.created_at + (10 + random() * 20) * INTERVAL '1 day')::DATE;
    
    -- End date based on frequency
    IF payment_frequency = 'Once'::schedule_frequency_enum THEN
      end_date := start_date;
    ELSE
      end_date := start_date + (30 + random() * 335)::INTEGER * INTERVAL '1 day';
    END IF;
    
    -- Payment status (mostly active)
    IF random() < 0.9 THEN
      payment_status := 'Active'::schedule_status_enum;
    ELSE
      payment_status := 'Paused'::schedule_status_enum;
    END IF;
    
    -- Initialize day values
    day_val := NULL;
    day_num := NULL;
    yearly_date := NULL;
    
    -- Set specific day values based on frequency
    IF payment_frequency = 'Weekly'::schedule_frequency_enum THEN
      day_val := day_types[1 + floor(random() * 7)];
    ELSIF payment_frequency = 'Monthly'::schedule_frequency_enum THEN
      day_num := 1 + floor(random() * 28);
    ELSIF payment_frequency IN ('Annually'::schedule_frequency_enum, 'Once'::schedule_frequency_enum) THEN
      yearly_date := ('2024-01-01'::date + floor(random() * 365) * INTERVAL '1 day')::date;
    END IF;
    
    -- Insert payment schedule
    INSERT INTO payment_schedule (
      amount,
      start_date,
      end_date,
      status,
      frequency,
      day_of_week,
      day_of_month,
      day_of_year,
      account_id,
      created_at
    )
    VALUES (
      payment_amount,
      start_date,
      end_date,
      payment_status,
      payment_frequency,
      day_val,
      day_num,
      yearly_date,
      account_rec.id,
      account_rec.created_at + (5 + random() * 10) * INTERVAL '1 day'
    );
  END LOOP;
END $$;