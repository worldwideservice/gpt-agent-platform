'use client'

import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, CheckCircle, AlertCircle, Loader2, Send, RefreshCw } from 'lucide-react'

import { KwidButton, KwidInput, KwidTextarea, KwidSelect } from '@/components/kwid'

import type { CrmConnectionRow } from '@/types/supabase'

interface KommoSetupProps {
  connection: CrmConnectionRow | null
  onConnectionEstablished: (connection: CrmConnectionRow | null) => void
  onError: (error: string) => void
}

interface KommoConnectionStatus {
  success: boolean
  connection: CrmConnectionRow | null
  error?: string
}

type CrmSyncState = {
  status: 'queued' | 'running' | 'completed' | 'failed'
  requestedAt: string | null
  startedAt: string | null
  completedAt: string | null
  failedAt: string | null
  pipelinesCount: number
  stagesCount: number
  pipelinesPreview: Array<{
    externalId: string
    name: string
    stages: string[]
  }>
  error: string | null
}

interface CrmStatus {
  provider: string
  credentialsConfigured: boolean
  connectionConfigured: boolean
  credentials: {
    clientId: string
    redirectUri: string | null
    updatedAt: string | null
  } | null
  connection: CrmConnectionRow | null
  sync: CrmSyncState | null
}

interface StatusResponse {
  success: boolean
  status: CrmStatus
  error?: string
}

export const KommoSetup = ({ connection, onConnectionEstablished, onError }: KommoSetupProps) => {
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [redirectUri, setRedirectUri] = useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    return `${window.location.origin}/integrations/kommo/oauth/callback`
  })
  const [baseDomain, setBaseDomain] = useState('')
  const [savingCredentials, setSavingCredentials] = useState(false)
  const [startingOAuth, setStartingOAuth] = useState(false)
  const [credentialsSaved, setCredentialsSaved] = useState(false)
  const [status, setStatus] = useState<KommoConnectionStatus | null>(null)
  const [crmStatus, setCrmStatus] = useState<CrmStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [messageDealId, setMessageDealId] = useState('')
  const [messageChannel, setMessageChannel] = useState<'email' | 'chat'>('chat')
  const [messageSubject, setMessageSubject] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [messageError, setMessageError] = useState<string | null>(null)
  const [messageSuccess, setMessageSuccess] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const updateFromStatus = useCallback((data: StatusResponse) => {
    setCrmStatus(data.status)
    setStatus({ success: data.status.connectionConfigured, connection: data.status.connection ?? null })
    if (data.status.connection?.base_domain) {
      setBaseDomain(data.status.connection.base_domain)
    }
    setCredentialsSaved(data.status.credentialsConfigured)
  }, [])

  const fetchStatus = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/integrations/kommo/status', { cache: 'no-store' })
      const data = (await response.json()) as StatusResponse

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Не удалось получить статус интеграции')
      }

      updateFromStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка статуса Kommo')
    } finally {
      setIsLoading(false)
    }
  }, [updateFromStatus])

  useEffect(() => {
    if (connection?.base_domain) {
      setBaseDomain(connection.base_domain)
    }

    if (connection) {
      setStatus({ success: true, connection })
      setCredentialsSaved(true)
    } else {
      setStatus({ success: false, connection: null })
    }
  }, [connection])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data?.type === 'kommo-oauth-result') {
        const { result } = event.data as { result: KommoConnectionStatus }
        setStatus(result)

        if (result.success && result.connection) {
          onConnectionEstablished(result.connection)
          void fetchStatus()
        } else if (!result.success) {
          onError(result.error ?? 'Ошибка подключения Kommo')
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [fetchStatus, onConnectionEstablished, onError])

  useEffect(() => {
    void fetchStatus()
  }, [fetchStatus])

  const handleSaveCredentials = async () => {
    if (!clientId.trim() || !clientSecret.trim() || !redirectUri.trim()) {
      onError('Заполните Client ID, Client Secret и Redirect URI')
      return
    }

    setSavingCredentials(true)

    try {
      const response = await fetch('/api/integrations/kommo/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, clientSecret, redirectUri }),
      })

      const data = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Не удалось сохранить данные')
      }

      setCredentialsSaved(true)
      await fetchStatus()
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : 'Не удалось сохранить учетные данные Kommo'
      onError(message)
      setStatus({ success: false, connection: null, error: message })
    } finally {
      setSavingCredentials(false)
    }
  }

  const handleStartOAuth = async () => {
    if (!baseDomain.trim()) {
      onError('Укажите домен вашего Kommo аккаунта')
      return
    }

    setStartingOAuth(true)

    try {
      const response = await fetch('/api/integrations/kommo/oauth/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ baseDomain: baseDomain.trim() }),
      })

      const data = (await response.json()) as { success: boolean; authUrl?: string; state?: string; error?: string }

      if (!response.ok || !data.success || !data.authUrl) {
        throw new Error(data.error ?? 'Не удалось получить ссылку авторизации')
      }

      window.open(data.authUrl, 'kommo-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes')
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : 'Не удалось запустить авторизацию в Kommo'
      onError(message)
      setStatus({ success: false, connection: null, error: message })
    } finally {
      setStartingOAuth(false)
    }
  }

  const handleSyncPipelines = async () => {
    setIsSyncing(true)
    setMessageSuccess(false)

    try {
      const response = await fetch('/api/integrations/kommo/sync/pipelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId: connection?.id, baseDomain: connection?.base_domain }),
      })

      const data = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Не удалось запустить синхронизацию Kommo')
      }

      onConnectionEstablished(connection)
      await fetchStatus()
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : 'Не удалось синхронизировать Kommo'
      onError(message)
      setStatus({ success: false, connection, error: message })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSendTestMessage = async () => {
    setMessageError(null)
    setMessageSuccess(false)

    if (!messageDealId.trim() || !messageBody.trim()) {
      setMessageError('Укажите ID сделки и текст сообщения')
      return
    }

    if (messageChannel === 'email' && !messageSubject.trim()) {
      setMessageError('Укажите тему письма для email-канала')
      return
    }

    setIsSendingMessage(true)

    try {
      const response = await fetch('/api/integrations/kommo/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId: messageDealId.trim(),
          channel: messageChannel,
          message: {
            subject: messageChannel === 'email' ? messageSubject.trim() : undefined,
            body: messageBody.trim(),
          },
        }),
      })

      const data = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Не удалось отправить сообщение')
      }

      setMessageSuccess(true)
      setMessageBody('')
      if (messageChannel === 'email') {
        setMessageSubject('')
      }
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : 'Не удалось отправить сообщение'
      setMessageError(message)
    } finally {
      setIsSendingMessage(false)
    }
  }

  const pipelines = crmStatus?.sync?.pipelinesPreview ?? []
  const pipelinesCount = crmStatus?.sync?.pipelinesCount ?? pipelines.length
  const syncedAt = crmStatus?.sync?.completedAt ?? connection?.updated_at ?? null
  const syncStatus = crmStatus?.sync?.status ?? (connection ? 'completed' : 'queued')
  const syncError = crmStatus?.sync?.error ?? null

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
          <span className="text-lg font-bold text-gray-600 dark:text-gray-300">K</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kommo CRM</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Безопасное подключение через OAuth 2.0</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">1. Укажите учетные данные приложения</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Настройте приложение в Kommo и сохраните Client ID, Client Secret и Redirect URI.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <KwidInput placeholder="Client ID" value={clientId} onChange={(event) => setClientId(event.target.value)} />
            <KwidInput
              placeholder="Client Secret"
              type="password"
              value={clientSecret}
              onChange={(event) => setClientSecret(event.target.value)}
            />
          </div>
          <KwidInput
            placeholder="Redirect URI"
            value={redirectUri}
            onChange={(event) => setRedirectUri(event.target.value)}
          />

          <KwidButton onClick={handleSaveCredentials} disabled={savingCredentials} variant="primary" className="min-w-[160px]">
            {savingCredentials ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
              </>
            ) : credentialsSaved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Сохранено
              </>
            ) : (
              'Сохранить'
            )}
          </KwidButton>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-4 dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">2. Авторизация в Kommo</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Укажите домен вашего Kommo (например, <code className="text-gray-700 dark:text-gray-300">example.amocrm.ru</code>) и выполните авторизацию в новом окне.
            </p>
          </div>

          <KwidInput
            placeholder="base domain (например, example.amocrm.ru)"
            value={baseDomain}
            onChange={(event) => setBaseDomain(event.target.value)}
          />

          <KwidButton onClick={handleStartOAuth} disabled={startingOAuth || !credentialsSaved} variant="primary" className="min-w-[160px]">
            {startingOAuth ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Перенаправление...
              </>
            ) : (
              <>
                Подключить <ExternalLink className="ml-2 h-4 w-4" />
              </>
            )}
          </KwidButton>
        </div>

        {status && (
          <div
            className={`flex items-center space-x-2 rounded-lg border p-3 text-sm ${
              status.success
                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
            }`}
          >
            {status.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>
              {status.success && status.connection
                ? syncStatus === 'completed'
                  ? 'Kommo успешно подключена'
                  : syncStatus === 'running'
                    ? 'Синхронизация Kommo выполняется'
                    : syncStatus === 'failed'
                      ? `Синхронизация завершилась с ошибкой: ${syncError ?? 'неизвестная ошибка'}`
                      : 'Kommo ожидает синхронизации'
                : status.error ?? 'Kommo ещё не подключена'}
            </span>
          </div>
        )}

        <div className="space-y-4 border border-gray-200 rounded-lg p-4 dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">3. Синхронизация воронок</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Обновите список воронок и стадий Kommo для дальнейшей настройки агентов.</p>
          </div>

          <KwidButton
            onClick={handleSyncPipelines}
            disabled={isSyncing || !connection}
            className="min-w-[200px]"
            variant="outline"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Синхронизация...
              </>
            ) : (
              <>
                Синхронизировать воронки <RefreshCw className="ml-2 h-4 w-4" />
              </>
            )}
          </KwidButton>
        </div>

        <div className="space-y-4 border border-gray-200 rounded-lg p-4 dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">4. Тестовое сообщение</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Отправьте сообщение в Kommo, чтобы проверить доступ к сделкам.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <KwidInput
              placeholder="ID сделки"
              value={messageDealId}
              onChange={(event) => setMessageDealId(event.target.value)}
            />
            <KwidSelect
              options={[
                { value: 'chat', label: 'Чат / заметка' },
                { value: 'email', label: 'Email' },
              ]}
              value={messageChannel}
              onChange={(value) => setMessageChannel(value as 'email' | 'chat')}
            />
          </div>

          {messageChannel === 'email' && (
            <KwidInput
              placeholder="Тема письма"
              value={messageSubject}
              onChange={(event) => setMessageSubject(event.target.value)}
            />
          )}

          <KwidTextarea
            placeholder="Текст сообщения"
            value={messageBody}
            onChange={(event) => setMessageBody(event.target.value)}
            rows={4}
          />

          {messageError && <p className="text-sm text-red-600 dark:text-red-400">{messageError}</p>}
          {messageSuccess && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              Сообщение успешно отправлено и учтено в статистике.
            </div>
          )}

          <KwidButton
            onClick={handleSendTestMessage}
            disabled={isSendingMessage || !connection}
            variant="primary"
            className="min-w-[200px]"
          >
            {isSendingMessage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Отправка...
              </>
            ) : (
              <>
                Отправить сообщение <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </KwidButton>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Текущий статус интеграции</h4>

          {isLoading ? (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Загрузка статуса...</p>
          ) : error ? (
            <div className="mt-4 flex items-start space-x-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
              <AlertCircle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Не удалось получить статус Kommo</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : status?.connection ? (
            <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Домен:</span> {status.connection.base_domain}
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Последняя синхронизация:</span> {syncedAt ?? '—'}
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Воронок синхронизировано:</span> {pipelinesCount}
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Статус:</span>{' '}
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {syncStatus === 'completed'
                    ? 'подключено'
                    : syncStatus === 'running'
                      ? 'синхронизация'
                      : syncStatus === 'failed'
                        ? 'ошибка'
                        : 'в очереди'}
                </span>
              </div>
              {syncError && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                  <p className="text-sm font-medium">Ошибка синхронизации</p>
                  <p className="text-sm">{syncError}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Интеграция с Kommo ещё не настроена.</p>
          )}
        </div>
      </div>
    </div>
  )
}
