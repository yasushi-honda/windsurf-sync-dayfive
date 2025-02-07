-- 既存のポリシーを削除
drop policy if exists "Users can only access their own memos." on memos;

-- 新しいポリシーを作成（一時的に全てのアクセスを許可）
create policy "Allow anonymous access"
    on memos for all
    using (true)
    with check (true);
