import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function RecordPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: record } = await supabase
    .from('records')
    .select(`
      *,
      users (name),
      staff (name),
      record_categories (name)
    `)
    .eq('id', id)
    .single()

  if (!record) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">記録詳細</h1>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800"
            >
              ← 一覧に戻る
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {record.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                記録日: {new Date(record.record_date).toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">利用者</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {record.users.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">記録者</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {record.staff.name}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {record.record_categories.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">内容</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                    {record.content}
                  </dd>
                </div>
                {record.is_important && (
                  <div className="bg-red-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-red-500">重要フラグ</dt>
                    <dd className="mt-1 text-sm text-red-900 sm:col-span-2 sm:mt-0">
                      この記録は重要としてマークされています
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
