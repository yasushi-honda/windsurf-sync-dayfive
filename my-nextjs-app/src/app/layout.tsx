import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '記録アプリ',
  description: '利用者の記録を管理するアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full bg-gray-100">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
