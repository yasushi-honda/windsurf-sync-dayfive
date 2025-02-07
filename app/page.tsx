'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase/client'

interface Memo {
  id: string
  title: string
  content: string
  created_at: string
}

export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 初期化時にSupabase接続テスト
    const testConnection = async () => {
      try {
        console.log('Supabase接続テスト中...')
        const { data, error } = await supabase
          .from('memos')
          .select('count')
          .single()

        if (error) {
          console.error('接続テストエラー:', error)
          throw error
        }

        console.log('接続テスト成功:', data)
        fetchMemos()
      } catch (err: any) {
        console.error('接続テストエラー詳細:', err)
        setError(`データベース接続エラー: ${err.message || '不明なエラー'}`)
      }
    }

    testConnection()
  }, [])

  const fetchMemos = async () => {
    try {
      console.log('メモを取得中...')
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('メモ取得エラーの詳細:', error)
        throw error
      }
      
      console.log('取得したメモ:', data)
      setMemos(data || [])
      setError(null)
    } catch (err: any) {
      console.error('メモの取得エラー:', err)
      setError(`メモの取得に失敗しました: ${err.message || '不明なエラー'}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const newMemo = {
        title,
        content,
        created_at: new Date().toISOString()
      }
      console.log('保存するメモ:', newMemo)

      // メモの保存を試みる前にテーブルの存在確認
      const { error: tableCheckError } = await supabase
        .from('memos')
        .select('count')
        .single()

      if (tableCheckError) {
        console.error('テーブル確認エラー:', tableCheckError)
        throw new Error('メモテーブルにアクセスできません')
      }

      const { data, error } = await supabase
        .from('memos')
        .insert([newMemo])
        .select()
      
      if (error) {
        console.error('メモ保存エラーの詳細:', error)
        throw error
      }

      console.log('保存されたメモ:', data)
      setTitle('')
      setContent('')
      await fetchMemos()
    } catch (err: any) {
      console.error('メモの保存エラー:', err)
      setError(`メモの保存に失敗しました: ${err.message || '不明なエラー'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">メモアプリ</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block mb-2">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isLoading ? '保存中...' : '保存'}
        </button>
      </form>

      <div className="grid gap-4">
        {memos.map((memo) => (
          <div key={memo.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{memo.title}</h2>
            <p className="mt-2 whitespace-pre-wrap">{memo.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(memo.created_at).toLocaleString('ja-JP')}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
