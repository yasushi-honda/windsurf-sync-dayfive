'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: '',
    user: '',
    staff: '',
    date: '',
  })

  useEffect(() => {
    fetchRecords()
  }, [])

  async function fetchRecords() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('records')
        .select('*, users(name), staff(name), record_categories(name)')
        .order('record_date', { ascending: false })

      if (error) throw error

      setRecords(data || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter((record) => {
    return (
      (!filters.category || record.record_categories?.name.includes(filters.category)) &&
      (!filters.user || record.users?.name.includes(filters.user)) &&
      (!filters.staff || record.staff?.name.includes(filters.staff)) &&
      (!filters.date || record.record_date === filters.date)
    )
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="alert alert-error">
            <span>エラーが発生しました: {error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">記録一覧</h1>
          <Link
            href="/records/new"
            className="btn btn-primary"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            新規作成
          </Link>
        </div>

        {/* フィルター */}
        <div className="mt-8">
          <div className="card bg-white p-6 shadow">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">フィルター</h2>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <input
                type="text"
                placeholder="カテゴリで検索"
                className="input-primary"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              />
              <input
                type="text"
                placeholder="利用者名で検索"
                className="input-primary"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              />
              <input
                type="text"
                placeholder="スタッフ名で検索"
                className="input-primary"
                value={filters.staff}
                onChange={(e) => setFilters({ ...filters, staff: e.target.value })}
              />
              <input
                type="date"
                className="input-primary"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 記録一覧 */}
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecords.map((record) => (
              <div key={record.id} className="card card-hover bg-white shadow">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <h3 className="card-title text-gray-900">{record.title}</h3>
                    {record.is_important && (
                      <span className="badge badge-error">重要</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    記録日: {record.record_date}
                  </p>
                  <p className="text-sm text-gray-500">
                    利用者: {record.users?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    記録者: {record.staff?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    カテゴリ: {record.record_categories?.name}
                  </p>
                  <p className="mt-2 text-gray-600 line-clamp-3">{record.content}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">詳細を見る</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-500">該当する記録がありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
