import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })

  // テストデータの作成
  try {
    // 1. カテゴリの作成
    const { data: category } = await supabase
      .from('record_categories')
      .insert({ name: '日常記録', description: '日々の様子を記録' })
      .select()
      .single()

    // 2. タグの作成
    const { data: tag } = await supabase
      .from('record_tags')
      .insert({ name: '食事', description: '食事に関する記録' })
      .select()
      .single()

    // 3. 利用者の作成
    const { data: user } = await supabase
      .from('users')
      .insert({
        name: 'テスト利用者',
        kana: 'テストリヨウシャ',
        date_of_birth: '1990-01-01',
        gender: 'other'
      })
      .select()
      .single()

    // 4. 職員の作成
    const { data: staff } = await supabase
      .from('staff')
      .insert({
        name: 'テスト職員',
        kana: 'テストショクイン',
        email: 'test@example.com',
        role: 'staff'
      })
      .select()
      .single()

    // 5. 記録の作成
    const { data: record } = await supabase
      .from('records')
      .insert({
        user_id: user?.id,
        staff_id: staff?.id,
        category_id: category?.id,
        title: 'テスト記録',
        content: 'これはテスト用の記録です。',
        record_date: new Date().toISOString().split('T')[0],
        tags: tag ? [tag.id] : [],
        is_important: true
      })
      .select()
      .single()

    return NextResponse.json({
      message: 'テストデータを作成しました',
      data: {
        category,
        tag,
        user,
        staff,
        record
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'テストデータの作成に失敗しました' },
      { status: 500 }
    )
  }
}
