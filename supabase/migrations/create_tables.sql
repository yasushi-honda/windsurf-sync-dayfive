-- ユーザーテーブルの作成
create table users (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- メモテーブルの作成
create table memos (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references users(id) on delete cascade not null,
    title text not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) の設定
alter table users enable row level security;
alter table memos enable row level security;

-- ユーザーテーブルのポリシー設定
create policy "Users can only access their own data."
    on users for all
    using (auth.uid() = id);

-- メモテーブルのポリシー設定
create policy "Users can only access their own memos."
    on memos for all
    using (auth.uid() = user_id);

-- 更新日時を自動的に更新する関数
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- トリガーの設定
create trigger update_users_updated_at
    before update on users
    for each row
    execute function update_updated_at_column();

create trigger update_memos_updated_at
    before update on memos
    for each row
    execute function update_updated_at_column();
