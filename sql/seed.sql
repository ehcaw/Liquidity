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

-- Wealthy users for demo purposes
INSERT INTO users (first_name, last_name, email, phone, role, street, city, state, zipcode, status)
VALUES
  ('Amara', 'Del Prato', 'amara.delprato@sjsu.edu', '5556789012', 'User', '1 Luxury Lane', 'New York', 'NY', '10001', 'Active'),
  ('Jisheng', 'Jiang', 'jisheng.jiang@sjsu.edu', '5557890123', 'User', '2 Wealth Way', 'Seattle', 'WA', '98101', 'Active'),
  ('Manas', 'Chougule', 'manas.chougule@sjsu.edu', '5558901234', 'User', '3 Prosperity Pkwy', 'Boston', 'MA', '02108', 'Active'),
  ('Michael', 'Chu', 'michael.chu@sjsu.edu', '5559012345', 'User', '4 Fortune Blvd', 'Chicago', 'IL', '60601', 'Active'),
  ('Miles', 'Thames', 'miles.thames@sjsu.edu', '5550123456', 'User', '5 Success St', 'Austin', 'TX', '78701', 'Active'),
  ('Ryan', 'Nguyen', 'ryan.nguyen@sjsu.edu', '5551230987', 'User', '6 Rich Ave', 'San Jose', 'CA', '95113', 'Active');

-- characters in Transformers and SpongeBob(personal preference if you read this and wants to add more tell me.)
INSERT INTO users (first_name, last_name, email, phone, role, street, city, state, zipcode, status)
VALUES
  ('Optimus', 'Prime', 'optimus.prime@autobots.com', '5551234567', 'Admin', '123 Cybertron Ave', 'San Francisco', 'CA', '94105', 'Active'),
  ('Megatron', 'Decepticon', 'megatron@decepticons.com', '5552345678', 'User', '456 Dark Moon St', 'Los Angeles', 'CA', '90001', 'Active'),
  ('Bumblebee', 'Autobot', 'bumblebee@autobots.com', '5553456789', 'User', '789 Yellow St', 'San Diego', 'CA', '92101', 'Active'),
  ('SpongeBob', 'SquarePants', 'spongebob@bikinibottom.com', '5554567890', 'User', '124 Pineapple St', 'Miami', 'FL', '33101', 'Active'),
  ('Patrick', 'Star', 'patrick@bikinibottom.com', '5555678901', 'User', '125 Rock St', 'Orlando', 'FL', '32801', 'Active');

-- Add users with different statuses for testing
INSERT INTO users (first_name, last_name, email, phone, role, street, city, state, zipcode, status)
VALUES
  ('Suspended', 'User', 'suspended@example.com', '5551112222', 'User', '100 Test St', 'Phoenix', 'AZ', '85001', 'Suspended'),
  ('Deleted', 'User', 'deleted@example.com', '5553334444', 'User', '200 Test St', 'Denver', 'CO', '80201', 'Deleted'),
  ('Locked', 'User', 'locked@example.com', '5555556666', 'User', '300 Test St', 'Portland', 'OR', '97201', 'Locked');

-- We don't have a system id, so for now we'll use a number instead, and we can write an API that automatically generates the UUID later.
-- And everyone = RICH, but with random money flows
-- Create accounts for Optimus Prime (user_id = 7)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('700000000001', 'Checking', 75000.00 + (random() * 30000)::numeric(10,2), 'Active', 7),
  ('700000000002', 'Savings', 150000.00 + (random() * 50000)::numeric(10,2), 'Active', 7);

-- Create accounts for Megatron (user_id = 8)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('800000000001', 'Checking', 50000.00 + (random() * 25000)::numeric(10,2), 'Active', 8),
  ('800000000002', 'Savings', 100000.00 + (random() * 40000)::numeric(10,2), 'Frozen', 8);

-- Create accounts for Bumblebee (user_id = 9)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('900000000001', 'Checking', 25000.00 + (random() * 20000)::numeric(10,2), 'Active', 9),
  ('900000000002', 'Savings', 45000.00 + (random() * 30000)::numeric(10,2), 'Active', 9);

-- Create accounts for SpongeBob (user_id = 10)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('100000000001', 'Checking', 15000.00 + (random() * 15000)::numeric(10,2), 'Active', 10),
  ('100000000002', 'Savings', 30000.00 + (random() * 25000)::numeric(10,2), 'Active', 10);

-- Create accounts for Patrick (user_id = 11)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('110000000001', 'Checking', 5000.00 - (random() * 2000)::numeric(10,2), 'Overdrawn', 11),
  ('110000000002', 'Savings', 10000.00 + (random() * 5000)::numeric(10,2), 'Active', 11);

-- Create accounts for wealthy users (high balances)
-- Amara Del Prato (user_id = 1)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('010000000001', 'Checking', 2500000.00 + (random() * 500000)::numeric(10,2), 'Active', 1),
  ('010000000002', 'Savings', 7500000.00 + (random() * 1000000)::numeric(10,2), 'Active', 1);

-- Jisheng Jiang (user_id = 2)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('020000000001', 'Checking', 3000000.00 + (random() * 600000)::numeric(10,2), 'Active', 2),
  ('020000000002', 'Savings', 8000000.00 + (random() * 1500000)::numeric(10,2), 'Active', 2);

-- Manas Chougule (user_id = 3)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('030000000001', 'Checking', 3500000.00 + (random() * 700000)::numeric(10,2), 'Active', 3),
  ('030000000002', 'Savings', 9000000.00 + (random() * 2000000)::numeric(10,2), 'Active', 3);

-- Michael Chu (user_id = 4)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('040000000001', 'Checking', 4000000.00 + (random() * 800000)::numeric(10,2), 'Active', 4),
  ('040000000002', 'Savings', 6000000.00 + (random() * 1200000)::numeric(10,2), 'Active', 4);

-- Miles Thames (user_id = 5)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('050000000001', 'Checking', 4500000.00 + (random() * 900000)::numeric(10,2), 'Active', 5),
  ('050000000002', 'Savings', 5500000.00 + (random() * 1100000)::numeric(10,2), 'Active', 5);

-- Ryan Nguyen (user_id = 6)
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('060000000001', 'Checking', 5000000.00 + (random() * 1000000)::numeric(10,2), 'Active', 6),
  ('060000000002', 'Savings', 5000000.00 + (random() * 1000000)::numeric(10,2), 'Active', 6);

-- Accounts with different statuses
INSERT INTO accounts (account_number, account_type, balance, status, user_id)
VALUES
  ('120000000001', 'Checking', 1000.00 + (random() * 500)::numeric(10,2), 'Pending', 12),
  ('130000000001', 'Checking', 2000.00 + (random() * 1000)::numeric(10,2), 'Closed', 13),
  ('140000000001', 'Checking', -100.00 - (random() * 200)::numeric(10,2), 'Overdrawn', 14);

-- Random transactions for each user (5-10 transactions per account)
-- Function to generate transactions for an account
DO $$
DECLARE
    acc RECORD;
    num_transactions INTEGER;
    trans_amount NUMERIC(10,2);
    trans_desc TEXT;
    trans_type transaction_type_enum;
    trans_status transaction_status_enum;
    curr_balance NUMERIC(10,2);
    i INTEGER;
    trans_id INTEGER;
BEGIN
    -- Get max transaction ID for continuation
    SELECT COALESCE(MAX(id), 0) INTO trans_id FROM transactions;
    
    -- Loop through all accounts
    FOR acc IN SELECT id, balance FROM accounts LOOP
        -- Random number of transactions (5-10)
        num_transactions := 5 + floor(random() * 6)::integer;
        curr_balance := 0; -- Start with 0 balance
        
        -- Create transactions for this account
        FOR i IN 1..num_transactions LOOP
            trans_id := trans_id + 1;
            
            -- Randomly decide transaction type
            CASE floor(random() * 4)::integer
                WHEN 0 THEN trans_type := 'Deposit';
                WHEN 1 THEN trans_type := 'Withdrawal';
                WHEN 2 THEN trans_type := 'Transfer';
                ELSE trans_type := 'Payment';
            END CASE;
            
            -- Determine amount based on type (positive for deposits, negative for others)
            IF acc.balance > 1000000 THEN -- Wealthy accounts
                IF trans_type = 'Deposit' THEN
                    trans_amount := (random() * 200000 + 50000)::numeric(10,2);
                ELSE
                    trans_amount := (random() * -100000 - 10000)::numeric(10,2);
                END IF;
            ELSE -- Regular accounts
                IF trans_type = 'Deposit' THEN
                    trans_amount := (random() * 10000 + 1000)::numeric(10,2);
                ELSE
                    trans_amount := (random() * -5000 - 500)::numeric(10,2);
                END IF;
            END IF;
            
            -- Generate description
            CASE floor(random() * 10)::integer
                WHEN 0 THEN trans_desc := 'Salary deposit';
                WHEN 1 THEN trans_desc := 'Grocery shopping';
                WHEN 2 THEN trans_desc := 'Online purchase';
                WHEN 3 THEN trans_desc := 'Utility bill payment';
                WHEN 4 THEN trans_desc := 'Restaurant payment';
                WHEN 5 THEN trans_desc := 'Investment return';
                WHEN 6 THEN trans_desc := 'Transfer between accounts';
                WHEN 7 THEN trans_desc := 'ATM withdrawal';
                WHEN 8 THEN trans_desc := 'Subscription payment';
                ELSE trans_desc := 'Miscellaneous transaction';
            END CASE;
            
            -- Decide status (mostly Complete, some Pending and Failed)
            CASE 
                WHEN random() < 0.85 THEN trans_status := 'Complete';
                WHEN random() < 0.95 THEN trans_status := 'Pending';
                ELSE trans_status := 'Failed';
            END CASE;
            
            -- Update running balance
            IF trans_status = 'Complete' THEN
                curr_balance := curr_balance + trans_amount;
            END IF;
            
            -- Insert transaction
            INSERT INTO transactions (id, amount, description, balance, status, transaction_type, account_id)
            VALUES (trans_id, trans_amount, trans_desc, curr_balance, trans_status, trans_type, acc.id);
            
            -- Create ledger entry for completed transactions
            IF trans_status = 'Complete' THEN
                INSERT INTO ledger (amount, description, entry_category, balance, account_id, transaction_id)
                VALUES (
                    trans_amount, 
                    trans_desc, 
                    CASE WHEN trans_amount > 0 THEN 'Credit' ELSE 'Debit' END,
                    curr_balance,
                    acc.id,
                    trans_id
                );
            END IF;
        END LOOP;
        
        -- Update account balance to match final transaction balance if transactions are complete
        UPDATE accounts 
        SET balance = (
            SELECT balance FROM transactions 
            WHERE account_id = acc.id AND status = 'Complete' 
            ORDER BY id DESC LIMIT 1
        )
        WHERE id = acc.id AND EXISTS (
            SELECT 1 FROM transactions 
            WHERE account_id = acc.id AND status = 'Complete'
        );
    END LOOP;
END $$;

-- Create random payment schedules
DO $$
DECLARE
    acc RECORD;
    frequency schedule_frequency_enum;
    day_of_week_val day_enum;
    day_of_month_val INTEGER;
    day_of_year_val DATE;
    amount NUMERIC(10,2);
    start_date DATE;
    end_date DATE;
    status_val schedule_status_enum;
BEGIN
    -- Loop through accounts
    FOR acc IN SELECT id, balance FROM accounts WHERE random() < 0.7 LOOP -- 70% of accounts have schedules
        -- Determine frequency
        CASE floor(random() * 5)::integer
            WHEN 0 THEN frequency := 'Daily';
            WHEN 1 THEN frequency := 'Weekly';
            WHEN 2 THEN frequency := 'Monthly';
            WHEN 3 THEN frequency := 'Annually';
            ELSE frequency := 'Once';
        END CASE;
        
        -- Set appropriate day values based on frequency
        day_of_week_val := NULL;
        day_of_month_val := NULL;
        day_of_year_val := NULL;
        
        IF frequency = 'Weekly' THEN
            CASE floor(random() * 7)::integer
                WHEN 0 THEN day_of_week_val := 'Monday';
                WHEN 1 THEN day_of_week_val := 'Tuesday';
                WHEN 2 THEN day_of_week_val := 'Wednesday';
                WHEN 3 THEN day_of_week_val := 'Thursday';
                WHEN 4 THEN day_of_week_val := 'Friday';
                WHEN 5 THEN day_of_week_val := 'Saturday';
                ELSE day_of_week_val := 'Sunday';
            END CASE;
        ELSIF frequency = 'Monthly' THEN
            day_of_month_val := 1 + floor(random() * 28)::integer;
        ELSIF frequency IN ('Annually', 'Once') THEN
            day_of_year_val := current_date + (floor(random() * 365)::integer || ' days')::interval;
        END IF;
        
        -- Determine amount based on account balance
        IF acc.balance > 1000000 THEN -- Wealthy accounts
            amount := (5000 + random() * 20000)::numeric(10,2);
        ELSE -- Regular accounts
            amount := (100 + random() * 1000)::numeric(10,2);
        END IF;
        
        -- Set dates
        start_date := current_date - (floor(random() * 180)::integer || ' days')::interval;
        
        IF frequency = 'Once' THEN
            end_date := start_date;
        ELSE
            end_date := start_date + (365 + floor(random() * 730)::integer || ' days')::interval;
        END IF;
        
        -- Set status
        IF random() < 0.9 THEN
            status_val := 'Active';
        ELSE
            status_val := 'Paused';
        END IF;
        
        -- Insert payment schedule
        INSERT INTO payment_schedule (
            amount, start_date, end_date, status, frequency, 
            day_of_week, day_of_month, day_of_year, account_id
        )
        VALUES (
            amount, start_date, end_date, status_val, frequency,
            day_of_week_val, day_of_month_val, day_of_year_val, acc.id
        );
    END LOOP;
END $$;