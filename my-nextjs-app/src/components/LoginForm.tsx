'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { SupabaseClient } from '@supabase/supabase-js'

interface LoginFormProps {
  supabaseClient: SupabaseClient
}

export default function LoginForm({ supabaseClient }: LoginFormProps) {
  return (
    <div className="mt-8">
      <Auth
        supabaseClient={supabaseClient}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: 'メールアドレス',
              password_label: 'パスワード',
              button_label: 'ログイン',
            },
          },
        }}
      />
    </div>
  )
}
