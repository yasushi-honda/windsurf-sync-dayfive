export type User = {
  id: string
  created_at: string
  name: string
  kana: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  status: 'active' | 'inactive'
  notes?: string
}

export type Staff = {
  id: string
  created_at: string
  name: string
  kana: string
  email: string
  role: 'admin' | 'staff'
  status: 'active' | 'inactive'
  last_login_at?: string
}

export type RecordCategory = {
  id: string
  created_at: string
  name: string
  description?: string
  color?: string
  sort_order: number
}

export type RecordTag = {
  id: string
  created_at: string
  name: string
  description?: string
  color?: string
}

export type Record = {
  id: string
  created_at: string
  user_id: string
  staff_id: string
  category_id: string
  title: string
  content: string
  record_date: string
  tags?: string[]
  attachments?: string[]
  is_important: boolean
  status: 'draft' | 'published'
  updated_at: string
}

export type Database = {
  users: User
  staff: Staff
  records: Record
  record_categories: RecordCategory
  record_tags: RecordTag
}
