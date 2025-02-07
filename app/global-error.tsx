'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">予期せぬエラーが発生しました</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow hover:opacity-90 transition-opacity"
            >
              もう一度試す
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
