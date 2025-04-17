create type user_role_enum as enum('User', 'Admin');
create type user_status_enum as enum('Active', 'Suspended', 'Deleted', 'Locked');
create type account_type_enum as enum('Savings', 'Checking');
create type account_status_enum as enum('Active', 'Frozen', 'Closed', 'Pending', 'Overdrawn');
create type transaction_status_enum as enum('Complete', 'Pending', 'Failed');
create type transaction_type_enum as enum('Withdrawal', 'Deposit', 'Transfer', 'Payment', 'Check Deposit');
create type schedule_frequency_enum as enum('Daily', 'Weekly', 'Monthly', 'Annually', 'Once');
create type schedule_status_enum as enum('Active', 'Paused');
create type day_enum as enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
create type ledger_category_enum as enum('Credit', 'Debit');
create type transaction_sums as (
    change_1_day NUMERIC(10, 2),
    change_1_week NUMERIC(10, 2),
    change_1_month NUMERIC(10, 2),
    change_3_months NUMERIC(10, 2),
    change_1_year NUMERIC(10, 2),
    change_all_time NUMERIC(10, 2)
);
create type daily_balance as (
  date date,
  balance numeric(10, 2)
);

create table states (
  code char(2),
  name varchar(50) not null,
  primary key(code)
);

create table users (
  id serial,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  first_name varchar(50) not null,
  last_name varchar(50) not null,
  email varchar(50) not null unique,
  phone char(10) not null,
  role user_role_enum not null default 'User',
  street text not null,
  city text not null,
  state char(2) not null,
  zipcode char(5) not null,
  status user_status_enum not null default 'Active',
  primary key(id),
  foreign key(state) references states(code) on update cascade
);

create table accounts (
  id serial,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  account_number char(12) not null unique check (account_number ~ '^[0-9]{12}$'),
  name varchar(50) not null,
  account_type account_type_enum not null,
  balance numeric(10, 2) not null default 0.00,
  status account_status_enum not null default 'Active',
  user_id int not null,
  primary key(id),
  foreign key(user_id) references users(id) on update cascade
);

create table transactions (
  id serial,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  amount numeric(10, 2) not null,
  description text not null,
  balance numeric(10, 2) not null,
  status transaction_status_enum not null default 'Pending',
  transaction_type transaction_type_enum not null,
  account_id int not null,
  primary key(id),
  foreign key(account_id) references accounts(id) on update cascade on delete cascade
);

create table payment_schedule (
  id serial,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  amount numeric(10, 2) not null,
  start_date date not null,
  end_date date not null,
  status schedule_status_enum not null default 'Active',
  frequency schedule_frequency_enum not null,
  day_of_week day_enum,
  day_of_month smallint,
  day_of_year date,
  account_id int not null,
  primary key(id),
  foreign key(account_id) references accounts(id) on update cascade on delete cascade,
  check (start_date <= end_date),
  check (day_of_month is null or day_of_month between 1 and 31),
  check (frequency != 'Weekly' or day_of_week is not null),
  check (frequency != 'Monthly' or day_of_month is not null),
  check (frequency not in ('Annually', 'Once') or day_of_year is not null)
);

create table ledger (
  id serial,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  amount numeric(10, 2) not null,
  description text not null,
  entry_category ledger_category_enum not null,
  balance numeric(10, 2) not null,
  account_id int not null,
  transaction_id int not null,
  primary key(id),
  foreign key(account_id) references accounts(id) on update cascade on delete cascade,
  foreign key(transaction_id) references transactions(id) on update cascade on delete cascade
);


-- Functions
create or replace function get_total_balance(uid int)
returns numeric(10, 2)
as $$
declare total_balance numeric(10, 2);
begin
  select coalesce(sum(balance)::numeric(10, 2), 0.00) into total_balance
  from accounts
  group by user_id
  having user_id=uid;

  return total_balance;
end;
$$
language plpgsql
stable
;

create or replace function get_balance_change(uid int)
returns transaction_sums
as
    $$
declare stats transaction_sums;
begin
  select
    sum(case when t.created_at >= NOW() - INTERVAL '1 day' then amount else 0 end) as change_1_day,
    sum(case when t.created_at >= NOW() - INTERVAL '1 week' then amount else 0 end) as change_1_week,
    sum(case when t.created_at >= NOW() - INTERVAL '1 month' then amount else 0 end) as change_1_month,
    sum(case when t.created_at >= NOW() - INTERVAL '3 months' then amount else 0 end) as change_3_months,
    sum(case when t.created_at >= NOW() - INTERVAL '1 year' then amount else 0 end) as change_1_year,
    sum(amount) as change_all_time into stats
  from transactions t
  inner join accounts a on a.id=t.account_id
  group by user_id
  having user_id=uid;

  return stats;
end;
$$
language plpgsql
stable
;

create or replace function get_user_transactions(uid int)
returns setof transactions
as $$
begin
  return query
    select t.*
    from accounts a
    inner join transactions t on t.account_id=a.id
    where a.user_id=uid;
end;
$$
language plpgsql
stable
;

create or replace function get_account_balance_change(an char(12))
returns transaction_sums
as
    $$
declare stats transaction_sums;
begin
  select
    sum(case when t.created_at >= NOW() - INTERVAL '1 day' then amount else 0 end) as change_1_day,
    sum(case when t.created_at >= NOW() - INTERVAL '1 week' then amount else 0 end) as change_1_week,
    sum(case when t.created_at >= NOW() - INTERVAL '1 month' then amount else 0 end) as change_1_month,
    sum(case when t.created_at >= NOW() - INTERVAL '3 months' then amount else 0 end) as change_3_months,
    sum(case when t.created_at >= NOW() - INTERVAL '1 year' then amount else 0 end) as change_1_year,
    sum(amount) as change_all_time into stats
  from transactions t
  inner join accounts a on t.account_id=a.id
  where a.account_number=an
  group by a.account_number;

  return stats;
end;
$$
language plpgsql
stable
;

create or replace function get_account_transactions(an char(12))
returns setof transactions
as $$
begin
  return query
    select t.*
    from accounts a
    inner join transactions t on t.account_id=a.id
    where a.account_number=an;
end;
$$
language plpgsql
stable
;

create or replace function get_daily_balance(aid int)
returns setof daily_balance
as $$
begin
  return query
    select date(created_at) as date, balance
    from transactions
    where created_at in (
        select max(created_at)
        from transactions
        where account_id = aid
        group by date(created_at)
    )
    order by date;
end;
$$
language plpgsql
stable
;

<<<<<<< HEAD
CREATE OR REPLACE FUNCTION transfer_funds(
  p_from_account CHAR(12),
  p_to_account CHAR(12),
  p_amount NUMERIC(10,2)
) RETURNS void AS $$
DECLARE
  v_from_balance NUMERIC(10,2);
  v_to_balance NUMERIC(10,2);
BEGIN
  BEGIN
    IF p_from_account IS NOT NULL THEN
      SELECT balance INTO v_from_balance
      FROM accounts
      WHERE account_number = p_from_account
      FOR UPDATE;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'From account % not found', p_from_account;
      END IF;

      IF v_from_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient funds in account %', p_from_account;
      END IF;

      UPDATE accounts
      SET balance = balance - p_amount
      WHERE account_number = p_from_account;
    END IF;

    SELECT balance INTO v_to_balance
    FROM accounts
    WHERE account_number = p_to_account
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'To account % not found', p_to_account;
    END IF;

    UPDATE accounts
    SET balance = balance + p_amount
    WHERE account_number = p_to_account;

  EXCEPTION WHEN OTHERS THEN
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql;

insert into storage.buckets (id, name, public) values ('checks', 'checks', false);

create policy "View own checks" on storage.objects for select to authenticated using ( (select auth.uid() ) = owner_id::uuid);
create policy "Insert own checks" on storage.objects for insert to authenticated
with check (bucket_id = 'checks' and (storage.foldername(name))[1] = (select auth.uid()::text));

create table inserted_checks (
    id TEXT PRIMARY KEY,
    inserted_at TIMESTAMP DEFAULT NOW(),
    check_name text not null,
    amount numeric not null,
    check_date text not null
);

CREATE OR REPLACE FUNCTION deposit_funds(
  p_account_number CHAR(12),
  p_amount NUMERIC(10,2)
) RETURNS void AS $$
BEGIN
  IF p_amount <= 0 THEN
      RAISE EXCEPTION 'Deposit amount must be positive.';
  END IF;

  UPDATE accounts
  SET balance = balance + p_amount
  WHERE account_number = p_account_number;

  IF NOT FOUND THEN
      RAISE EXCEPTION 'Account % not found.', p_account_number;
  END IF;

  -- maybe add into transactions heres

END;
$$ LANGUAGE plpgsql;


create or replace function admin_get_total_bank_balance()
returns decimal(15,2)
as $$
declare
  v_total decimal(15,2);
begin
  select sum(balance) into v_total
  from accounts
  where status = 'Active';

  return coalesce(v_total, 0.00);
end;
$$
language plpgsql
stable
;

create or replace function admin_count_pending_transactions()
returns integer
as $$
begin
  return (select count(*) from transactions where status = 'Pending');
end;
$$
language plpgsql
stable
;

create or replace function admin_count_active_accounts()
returns integer
as $$
begin
  return (select count(*) from accounts where status = 'Active');
end;
$$
language plpgsql
stable
;

create or replace function admin_count_new_accounts()
returns integer
as $$
begin
  return (select count(*) from accounts where created_at >= (current_date - interval '30 days'));
end;
$$
language plpgsql
stable
;

create or replace function admin_count_total_transactions()
returns integer
as $$
begin
  return (select count(*) from transactions);
end;
$$
language plpgsql
stable
;

CREATE OR REPLACE FUNCTION admin_account_report(
  p_min_balance numeric(10,2) DEFAULT NULL,
  p_max_balance numeric(10,2) DEFAULT NULL,
  p_date_from timestamp DEFAULT NULL,
  p_date_to timestamp DEFAULT NULL,
  p_zip_codes char(5)[] DEFAULT NULL,
  p_state_code char(2) DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_statuses account_status_enum[] DEFAULT NULL
)
RETURNS TABLE (
  account_id int,
  customer_name text,
  account_type account_type_enum,
  balance numeric(10,2),
  account_status account_status_enum,
  user_status user_status_enum,
  zip_code char(5),
  city text,
  state_code char(2),
  created_date timestamp
) AS $$
BEGIN 
  RETURN QUERY
  SELECT
    a.id AS account_id,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    a.account_type,
    a.balance,
    a.status AS account_status,
    u.status AS user_status,
    u.zipcode AS zip_code,
    u.city,
    u.state AS state_code,
    a.created_at as created_date
  FROM accounts a
  JOIN users u ON a.user_id = u.id
  WHERE
    (p_min_balance IS NULL OR a.balance >= p_min_balance)
    AND (p_max_balance IS NULL OR a.balance <= p_max_balance)
    AND (p_date_from IS NULL OR a.created_at >= p_date_from)
    AND (p_date_to IS NULL OR a.created_at <= p_date_to)
    AND (p_zip_codes IS NULL OR u.zipcode = ANY(p_zip_codes))
    AND (p_state_code IS NULL OR u.state = p_state_code)
    AND (p_city IS NULL OR u.city ILIKE p_city)
    AND (p_statuses IS NULL OR a.status = ANY(p_statuses))
  ORDER BY a.balance DESC;
END;
$$ LANGUAGE plpgsql STABLE;
