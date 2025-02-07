import './globals.css'

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
      <body className="h-full">{children}</body>
    </html>
  )
}
