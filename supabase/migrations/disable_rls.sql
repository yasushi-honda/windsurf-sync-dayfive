-- RLSを一時的に無効化
ALTER TABLE memos DISABLE ROW LEVEL SECURITY;

-- 全てのユーザーに対して全ての操作を許可
GRANT ALL ON memos TO anon;
GRANT ALL ON memos TO authenticated;
