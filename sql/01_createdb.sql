create type user_role_enum as enum('User', 'Admin');
create type user_status_enum as enum('Active', 'Suspended', 'Deleted', 'Locked');
create type account_type_enum as enum('Savings', 'Checking');
create type account_status_enum as enum('Active', 'Frozen', 'Closed', 'Pending', 'Overdrawn');
create type transaction_status_enum as enum('Complete', 'Pending', 'Failed');
create type transaction_type_enum as enum('Withdrawal', 'Deposit', 'Transfer', 'Payment');
create type schedule_frequency_enum as enum('Daily', 'Weekly', 'Monthly', 'Annually', 'Once');
create type schedule_status_enum as enum('Active', 'Paused');
create type day_enum as enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
create type ledger_category_enum as enum('Credit', 'Debit');

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
  account_type account_type_enum not null,
  balance numeric(10, 2) not null default 0.00,
  status account_status_enum not null default 'Pending',
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
