'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const recordSchema = z.object({
  user_id: z.string().uuid(),
  category_id: z.string().uuid(),
  title: z.string().min(1, '必須項目です'),
  content: z.string().min(1, '必須項目です'),
  record_date: z.string(),
  tags: z.array(z.string().uuid()).optional(),
  is_important: z.boolean().default(false),
})

type RecordFormData = z.infer<typeof recordSchema>

interface RecordFormProps {
  users: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  tags: { id: string; name: string }[]
}

export default function RecordForm({ users, categories, tags }: RecordFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
  })

  const onSubmit = async (data: RecordFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('認証エラー')

      const { error } = await supabase.from('records').insert({
        ...data,
        staff_id: user.id,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('エラーが発生しました')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          利用者
        </label>
        <select
          {...register('user_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.user_id && (
          <p className="mt-1 text-sm text-red-600">{errors.user_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          カテゴリ
        </label>
        <select
          {...register('category_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          内容
        </label>
        <textarea
          {...register('content')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          記録日
        </label>
        <input
          type="date"
          {...register('record_date')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.record_date && (
          <p className="mt-1 text-sm text-red-600">{errors.record_date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          タグ
        </label>
        <select
          multiple
          {...register('tags')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('is_important')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-700">
          重要
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  )
}
