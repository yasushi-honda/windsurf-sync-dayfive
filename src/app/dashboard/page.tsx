'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient, subscribeToAuthChanges, unsubscribeFromAuthChanges, checkSession } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

interface Record {
  id: string
  created_at: string
  users: { name: string } | null
  staff: { name: string } | null
  record_categories: { name: string } | null
}

export default function DashboardPage() {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)
  const router = useRouter()
  const supabase = useRef(createClient())

  const fetchRecords = useCallback(async (session: Session) => {
    if (!isMounted.current) return

    try {
      console.log('Fetching records...')
      // データの取得
      const { data, error: recordsError } = await supabase.current
        .from<Database['public']['Tables']['records']['Row']>('records')
        .select('*, users(name), staff(name), record_categories(name)')
        .order('created_at', { ascending: false })
        .limit(10)

      if (recordsError) throw recordsError

      if (isMounted.current) {
        console.log('Records loaded successfully:', data?.length || 0, 'records')
        setRecords(data || [])
      }
    } catch (error) {
      console.error('Error fetching records:', error)
      if (isMounted.current) {
        setError(error instanceof Error ? error.message : 'データの取得中にエラーが発生しました')
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    if (!isMounted.current) return

    console.log('Auth state changed in dashboard:', event, session ? 'with session' : 'no session')

    if (!session) {
      console.log('No session, redirecting to login...')
      router.replace('/login')
      return
    }

    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      await fetchRecords(session)
    }
  }, [fetchRecords, router])

  useEffect(() => {
    async function initializeDashboard() {
      try {
        const { session, error: sessionError } = await checkSession()
        if (sessionError) throw sessionError

        if (!session) {
          console.log('No session found, redirecting to login...')
          router.replace('/login')
          return
        }

        // セッションが存在する場合、データを取得
        await fetchRecords(session)

        // Auth状態の変更を監視
        subscribeToAuthChanges(handleAuthChange)
      } catch (error) {
        console.error('Error initializing dashboard:', error)
        if (isMounted.current) {
          setError('ダッシュボードの初期化中にエラーが発生しました')
          setLoading(false)
        }
      }
    }

    initializeDashboard()

    return () => {
      console.log('Cleaning up dashboard...')
      isMounted.current = false
      unsubscribeFromAuthChanges()
    }
  }, [fetchRecords, handleAuthChange, router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center">
            <div className="text-red-600">
              <h2 className="text-xl font-semibold mb-2">エラーが発生しました</h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                再試行
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">最近の記録</h1>
            <Link
              href="/records/new"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              新規記録
            </Link>
          </div>
          
          {records.length === 0 ? (
            <p className="text-gray-600 text-center py-8">記録がありません</p>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(record.created_at).toLocaleString('ja-JP')}
                      </p>
                      <p className="mt-1">
                        {record.users?.name || '未設定'} → {record.staff?.name || '未設定'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        カテゴリ: {record.record_categories?.name || '未設定'}
                      </p>
                    </div>
                    <Link
                      href={`/records/${record.id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      詳細
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
