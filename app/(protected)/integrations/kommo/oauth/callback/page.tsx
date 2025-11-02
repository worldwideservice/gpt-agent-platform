import Script from 'next/script'

import { backendFetch } from '@/lib/backend/client'

interface PageProps {
  searchParams: {
    code?: string
    state?: string
    error?: string
  }
}

interface OAuthResult {
  success: boolean
  error?: string
  connection?: unknown
}

const finalizeOAuth = async ({ code, state, error }: PageProps['searchParams']): Promise<OAuthResult> => {
  if (error) {
    return {
      success: false,
      error,
    }
  }

  if (!code || !state) {
    return {
      success: false,
      error: 'Missing OAuth parameters',
    }
  }

  try {
    const response = await backendFetch<{ success: boolean; connection?: unknown; error?: string }>(
      '/kommo/oauth/callback',
      {
        method: 'POST',
        body: JSON.stringify({
          state,
          code,
        }),
      },
    )

    return {
      success: response.success,
      error: response.error,
      connection: response.connection,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to finalize Kommo OAuth',
    }
  }
}

const KommoOAuthCallbackPage = async ({ searchParams }: PageProps) => {
  const result = await finalizeOAuth(searchParams)
  const payload = JSON.stringify({ type: 'kommo-oauth-result', result })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gray-50 p-6 text-center">
      <Script id="kommo-oauth-callback" strategy="afterInteractive">
        {`
          (function() {
            try {
              var payloadString = ${JSON.stringify(payload)};
              var message = typeof payloadString === 'string' ? JSON.parse(payloadString) : payloadString;
              window.opener && window.opener.postMessage(message, window.location.origin);
            } catch (error) {
              console.error('Failed to notify parent window', error);
            }
            setTimeout(function() { window.close(); }, 500);
          })();
        `}
      </Script>
      <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Завершение подключения Kommo</h1>
        <p className="mt-2 text-sm text-gray-600">
          {result.success
            ? 'Вы можете закрыть это окно. Настройка интеграции продолжится в основном приложении.'
            : `Произошла ошибка: ${result.error ?? 'неизвестная ошибка'}`}
        </p>
      </div>
    </div>
  )
}

export default KommoOAuthCallbackPage
