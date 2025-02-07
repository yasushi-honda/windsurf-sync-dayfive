"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memos, setMemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const { data, error } = await supabase
          .from("memos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setMemos(data);
      } catch (error) {
        console.error("Error fetching memos:", error);
      }
    };

    fetchMemos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("memos")
        .insert([{ title, content, created_at: new Date().toISOString() }])
        .select();

      if (error) throw error;

      if (data) {
        setMemos([...data, ...memos]);
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error inserting memo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">メモアプリ</h1>
          <ThemeToggle />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground"
            >
              タイトル
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-foreground shadow-sm focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-foreground"
            >
              内容
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-foreground shadow-sm focus:ring-2 focus:ring-primary min-h-[150px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "保存中..." : "保存"}
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">メモ一覧</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {memos.map((memo) => (
              <div
                key={memo.id}
                className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <h3 className="text-lg font-medium mb-2">{memo.title}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {memo.content}
                </p>
                <time className="text-sm text-muted-foreground mt-2 block">
                  {new Date(memo.created_at).toLocaleString("ja-JP")}
                </time>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
