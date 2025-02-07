-- 既存のテーブルを削除
drop table if exists memos;

-- メモテーブルを再作成（user_idをオプションに）
create table memos (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    title text not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSを一時的に無効化
alter table memos disable row level security;

-- 全てのユーザーに対して全ての操作を許可
grant all on memos to anon;
grant all on memos to authenticated;
