'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'

type RecordFormData = {
  user_id: string
  staff_id: string
  category_id: string
  title: string
  content: string
  record_date: string
  is_important: boolean
}

export default function RecordForm() {
  const [users, setUsers] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecordFormData>()

  useEffect(() => {
    fetchFormData()
  }, [])

  async function fetchFormData() {
    try {
      const [usersData, staffData, categoriesData] = await Promise.all([
        supabase.from('users').select('id, name').eq('status', 'active'),
        supabase.from('staff').select('id, name').eq('status', 'active'),
        supabase.from('record_categories').select('id, name'),
      ])

      if (usersData.error) throw usersData.error
      if (staffData.error) throw staffData.error
      if (categoriesData.error) throw categoriesData.error

      setUsers(usersData.data || [])
      setStaff(staffData.data || [])
      setCategories(categoriesData.data || [])
    } catch (error: any) {
      setError(error.message)
    }
  }

  const onSubmit = async (data: RecordFormData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const { error } = await supabase.from('records').insert([data])

      if (error) throw error

      setSuccess(true)
      reset()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>記録を作成しました</span>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">利用者</span>
          </label>
          <select
            {...register('user_id', { required: '利用者を選択してください' })}
            className="select-primary"
          >
            <option value="">選択してください</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.user_id && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.user_id.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">記録者</span>
          </label>
          <select
            {...register('staff_id', { required: '記録者を選択してください' })}
            className="select-primary"
          >
            <option value="">選択してください</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.staff_id && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.staff_id.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">カテゴリ</span>
          </label>
          <select
            {...register('category_id', { required: 'カテゴリを選択してください' })}
            className="select-primary"
          >
            <option value="">選択してください</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.category_id.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">タイトル</span>
          </label>
          <input
            type="text"
            {...register('title', { required: 'タイトルを入力してください' })}
            className="input-primary"
            placeholder="タイトルを入力"
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.title.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">内容</span>
          </label>
          <textarea
            {...register('content', { required: '内容を入力してください' })}
            className="textarea textarea-bordered min-h-[200px] w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="内容を入力"
          />
          {errors.content && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.content.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">記録日</span>
          </label>
          <input
            type="date"
            {...register('record_date', { required: '記録日を選択してください' })}
            className="input-primary"
          />
          {errors.record_date && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.record_date.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">重要</span>
            <input
              type="checkbox"
              {...register('is_important')}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>

        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                保存中...
              </>
            ) : (
              '保存'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
