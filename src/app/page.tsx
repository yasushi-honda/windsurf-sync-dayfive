import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">介護記録アプリ</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            介護記録を管理するためのアプリケーションです。
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            ダッシュボードを開く
          </Link>
        </div>
      </div>
    </div>
  )
}
