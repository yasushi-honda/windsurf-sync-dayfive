'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const supabase = createClient()
      
      // セッションの確認
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      try {
        // データの取得
        const { data, error } = await supabase
          .from('records')
          .select('*, users(name), staff(name), record_categories(name)')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setRecords(data || [])
      } catch (error) {
        console.error('Error loading records:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router])

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-xl">読み込み中...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">記録一覧</h1>
            <Link
              href="/records/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              新規記録
            </Link>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {records.map((record) => (
                <li key={record.id}>
                  <Link href={`/records/${record.id}`}>
                    <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {record.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            {record.is_important && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                重要
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              利用者: {record.users?.name}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              スタッフ: {record.staff?.name}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(record.record_date).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
