import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('records')
      .select('*, users(name), staff(name), record_categories(name)')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching records:', error)
      return NextResponse.json(
        { error: 'データの取得中にエラーが発生しました。' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました。' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('records')
      .insert([body])
      .select()

    if (error) {
      console.error('Error creating record:', error)
      return NextResponse.json(
        { error: 'レコードの作成中にエラーが発生しました。' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました。' },
      { status: 500 }
    )
  }
}
