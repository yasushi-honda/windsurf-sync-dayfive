-- 既存のテーブルを削除
drop table if exists memos;

-- メモテーブルを再作成（user_idを完全に削除）
create table memos (
    id uuid default gen_random_uuid() primary key,
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

-- 更新日時を自動的に更新する関数とトリガーを作成
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_memos_updated_at
    before update on memos
    for each row
    execute function update_updated_at_column();
