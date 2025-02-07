import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import RecordForm from '@/components/RecordForm'

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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">新規記録作成</h1>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <RecordForm
                users={users || []}
                categories={categories || []}
                tags={tags || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
