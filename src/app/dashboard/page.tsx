'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { CalendarIcon, UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecords()
  }, [])

  async function fetchRecords() {
    try {
      const { data, error } = await supabase
        .from('records')
        .select('*, users(name), staff(name), record_categories(name)')
        .order('created_at', { ascending: false })

      if (error) throw error

      setRecords(data || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // 日付ごとの記録数を集計
  const recordsByDate = records.reduce((acc: { [key: string]: number }, record) => {
    const date = record.record_date
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(recordsByDate).slice(-7),
    datasets: [
      {
        label: '記録数',
        data: Object.keys(recordsByDate).slice(-7).map(date => recordsByDate[date]),
        backgroundColor: '#4F46E5',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '過去7日間の記録数',
      },
    },
  }

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
        <h1 className="text-2xl font-semibold text-gray-900">ダッシュボード</h1>
        
        {/* 統計カード */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card bg-white shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <DocumentTextIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">総記録数</p>
                  <p className="text-2xl font-semibold text-gray-900">{records.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="rounded-full bg-secondary/10 p-3">
                  <UserIcon className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">本日の記録数</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {records.filter(r => r.record_date === new Date().toISOString().split('T')[0]).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="rounded-full bg-accent/10 p-3">
                  <CalendarIcon className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">重要記録数</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {records.filter(r => r.is_important).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* グラフ */}
        <div className="mt-8">
          <div className="card bg-white p-6 shadow">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* 最新の記録 */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">最新の記録</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {records.slice(0, 6).map((record) => (
              <div key={record.id} className="card card-hover bg-white shadow">
                <div className="card-body">
                  <h3 className="card-title text-gray-900">{record.title}</h3>
                  <p className="text-sm text-gray-500">
                    利用者: {record.users?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    記録者: {record.staff?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    カテゴリ: {record.record_categories?.name}
                  </p>
                  <p className="mt-2 text-gray-600 line-clamp-2">{record.content}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">詳細を見る</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
