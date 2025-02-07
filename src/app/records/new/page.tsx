import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import RecordForm from '@/components/records/RecordForm'

export default async function NewRecordPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const [
    { data: users },
    { data: categories },
    { data: tags }
  ] = await Promise.all([
    supabase.from('users').select('id, name'),
    supabase.from('record_categories').select('id, name'),
    supabase.from('record_tags').select('id, name')
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">新規記録作成</h1>
        <div className="mt-8">
          <div className="card bg-white p-6 shadow">
            <RecordForm
              users={users || []}
              categories={categories || []}
              tags={tags || []}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
