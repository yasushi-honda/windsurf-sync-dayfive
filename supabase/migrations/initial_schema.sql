-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (利用者)
create table users (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  kana text not null,
  date_of_birth date not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  notes text
);

-- Staff table (職員)
create table staff (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  kana text not null,
  email text unique not null,
  role text not null check (role in ('admin', 'staff')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  last_login_at timestamp with time zone
);

-- Record Categories table (記録カテゴリ)
create table record_categories (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  color text,
  sort_order integer not null default 0
);

-- Record Tags table (記録タグ)
create table record_tags (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  color text
);

-- Records table (記録)
create table records (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid not null references users(id),
  staff_id uuid not null references staff(id),
  category_id uuid not null references record_categories(id),
  title text not null,
  content text not null,
  record_date date not null,
  tags uuid[] default array[]::uuid[],
  attachments text[] default array[]::text[],
  is_important boolean default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_users_name on users(name);
create index idx_users_kana on users(kana);
create index idx_staff_email on staff(email);
create index idx_records_user_id on records(user_id);
create index idx_records_staff_id on records(staff_id);
create index idx_records_category_id on records(category_id);
create index idx_records_record_date on records(record_date);

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table staff enable row level security;
alter table records enable row level security;
alter table record_categories enable row level security;
alter table record_tags enable row level security;
