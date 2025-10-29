'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Bot, Check, Database, Loader2, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'
import { useToast } from '@/components/ui/toast-context'
import { cn } from '@/lib/utils'

import type { OnboardingState } from '@/lib/onboarding/server'

interface OnboardingStep {
  id: 'crm' | 'agent' | 'summary'
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const steps: OnboardingStep[] = [
  {
    id: 'crm',
    title: 'Подключение CRM',
    description: 'Выберите CRM-систему и синхронизируйте воронки, контакты и сделки',
    icon: Database,
  },
  {
    id: 'agent',
    title: 'Настройка AI-агента',
    description: 'Определите цели, модель и каналы взаимодействия для вашего агента',
    icon: Bot,
  },
  {
    id: 'summary',
    title: 'Готово к запуску',
    description: 'Проверьте настройки и запустите агента в работу',
    icon: Sparkles,
  },
]

const crmProviders = [{ value: 'kommo', label: 'Kommo (бывш. amoCRM)' }]

const agentModels = [
  { value: 'gpt-4o-mini', label: 'GPT-4o mini (рекомендовано)' },
  { value: 'gpt-4o', label: 'GPT-4o (premium)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
]

const agentChannels = [
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'crm', label: 'Задачи внутри CRM' },
]

const schedules = [
  { value: 'business', label: 'Пн-Пт, 09:00-18:00' },
  { value: 'extended', label: 'Каждый день, 08:00-22:00' },
  { value: '24/7', label: 'Круглосуточно' },
]

interface OnboardingClientProps {
  initialState: OnboardingState
}

type OnboardingCrmState = OnboardingState['crm']
type OnboardingAgentState = OnboardingState['agent']

type CrmFormState = {
  provider: string
  clientId: string
  clientSecret: string
  redirectUri: string
  baseDomain: string
  testSync: boolean
}

type AgentFormState = {
  name: string
  model: string
  goal: string
  channels: string[]
  schedule: string
}

const normalizeDomain = (domain: string) => {
  const trimmed = domain.trim()

  if (!trimmed) {
    return ''
  }

  if (trimmed.includes('.')) {
    return trimmed
  }

  return `${trimmed}.amocrm.ru`
}

const determineStep = (crm: OnboardingCrmState, agent: OnboardingAgentState | null) => {
  const crmReady =
    crm.credentialsConfigured && crm.connectionConfigured && crm.sync?.status === 'completed'

  if (!crmReady) {
    return 0
  }

  if (!agent) {
    return 1
  }

  return 2
}

export const OnboardingClient = ({ initialState }: OnboardingClientProps) => {
  const router = useRouter()
  const { push: pushToast } = useToast()

  const [crmStatus, setCrmStatus] = useState<OnboardingCrmState>(initialState.crm)
  const [agentState, setAgentState] = useState<OnboardingAgentState>(initialState.agent)
  const [crmForm, setCrmForm] = useState<CrmFormState>(() => {
    return {
      provider: initialState.crm.provider,
      clientId: initialState.crm.credentials?.clientId ?? '',
      clientSecret: '',
      redirectUri: initialState.crm.credentials?.redirectUri ?? '',
      baseDomain: initialState.crm.connection?.baseDomain ?? '',
      testSync: true,
    }
  })
  const [agentForm, setAgentForm] = useState<AgentFormState>(() => {
    return {
      name: initialState.agent?.name ?? 'AI Менеджер продаж',
      model: initialState.agent?.defaultModel ?? 'gpt-4o-mini',
      goal:
        initialState.agent?.status === 'active'
          ? initialState.agent?.name ?? ''
          : 'Вести диалог с лидами, квалифицировать и передавать менеджеру на финальную сделку',
      channels: ['email', 'crm'],
      schedule: 'business',
    }
  })
  const [currentStep, setCurrentStep] = useState<number>(() => determineStep(initialState.crm, initialState.agent))
  const [isSavingCredentials, setIsSavingCredentials] = useState(false)
  const [isAwaitingOAuth, setIsAwaitingOAuth] = useState(false)
  const [isPollingSync, setIsPollingSync] = useState(false)
  const [crmError, setCrmError] = useState<string | null>(null)
  const [agentError, setAgentError] = useState<string | null>(null)
  const [isSavingAgent, setIsSavingAgent] = useState(false)
  const [isLaunchingAgent, setIsLaunchingAgent] = useState(false)

  useEffect(() => {
    if (!crmForm.redirectUri && typeof window !== 'undefined') {
      setCrmForm((prev) => ({ ...prev, redirectUri: `${window.location.origin}/integrations/kommo/oauth/callback` }))
    }
  }, [crmForm.redirectUri])

  useEffect(() => {
    if (agentState) {
      setAgentForm((prev) => ({
        ...prev,
        name: agentState.name,
        model: agentState.defaultModel ?? prev.model,
      }))
    }
  }, [agentState])

  useEffect(() => {
    const step = determineStep(crmStatus, agentState)
    setCurrentStep(step)
  }, [agentState, crmStatus])

  const providerLabel = useMemo(() => {
    const provider = crmProviders.find((item) => item.value === crmForm.provider)
    return provider?.label ?? 'CRM'
  }, [crmForm.provider])

  const completedStepIds = useMemo(() => {
    const ids: Array<OnboardingStep['id']> = []

    if (crmStatus.credentialsConfigured && crmStatus.connectionConfigured && crmStatus.sync?.status === 'completed') {
      ids.push('crm')
    }

    if (agentState) {
      ids.push('agent')
    }

    return ids
  }, [agentState, crmStatus])

  const progress = useMemo(() => {
    const step = determineStep(crmStatus, agentState)
    return (step / (steps.length - 1)) * 100
  }, [agentState, crmStatus])

  const refreshOnboardingState = useCallback(async () => {
    const response = await fetch('/api/onboarding/status', { cache: 'no-store' })
    const data = (await response.json()) as { success: boolean; state: OnboardingState; error?: string }

    if (!response.ok || !data.success) {
      throw new Error(data.error ?? 'Не удалось получить статус онбординга')
    }

    setCrmStatus(data.state.crm)
    setAgentState(data.state.agent)

    setCrmForm((prev) => ({
      ...prev,
      clientId: data.state.crm.credentials?.clientId ?? prev.clientId,
      redirectUri: data.state.crm.credentials?.redirectUri ?? prev.redirectUri,
      baseDomain: data.state.crm.connection?.baseDomain ?? prev.baseDomain,
    }))

    return data.state
  }, [])

  const showErrorToast = useCallback(
    (title: string, description?: string) => {
      pushToast({ title, description, variant: 'error' })
    },
    [pushToast],
  )

  const showSuccessToast = useCallback(
    (title: string, description?: string) => {
      pushToast({ title, description, variant: 'success' })
    },
    [pushToast],
  )

  const pollCrmSync = useCallback(async () => {
    setIsPollingSync(true)

    try {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const state = await refreshOnboardingState()
        const syncStatus = state.crm.sync?.status

        if (syncStatus === 'completed') {
          showSuccessToast('CRM подключена', 'Данные Kommo успешно синхронизированы')
          return state
        }

        if (syncStatus === 'failed') {
          throw new Error(state.crm.sync?.error ?? 'Синхронизация завершилась с ошибкой')
        }

        await new Promise((resolve) => {
          setTimeout(resolve, 1500)
        })
      }

      throw new Error('Синхронизация занимает слишком много времени, попробуйте позже')
    } finally {
      setIsPollingSync(false)
      setIsAwaitingOAuth(false)
    }
  }, [refreshOnboardingState, showSuccessToast])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data?.type === 'kommo-oauth-result') {
        const { result } = event.data as { result: { success: boolean; error?: string } }

        if (result.success) {
          setIsAwaitingOAuth(false)
          void pollCrmSync().catch((error) => {
            const message = error instanceof Error ? error.message : 'Не удалось завершить синхронизацию CRM'
            setCrmError(message)
            showErrorToast('Ошибка синхронизации CRM', message)
          })
        } else {
          const message = result.error ?? 'Не удалось подключить Kommo, попробуйте снова'
          setIsAwaitingOAuth(false)
          setCrmError(message)
          showErrorToast('Ошибка подключения CRM', message)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [pollCrmSync, showErrorToast])

  const handleConnectCrm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCrmError(null)

    const { clientId, clientSecret, redirectUri, baseDomain } = crmForm

    if (!clientId.trim() || !clientSecret.trim() || !redirectUri.trim() || !baseDomain.trim()) {
      const message = 'Заполните Client ID, Client Secret, Redirect URI и домен CRM'
      setCrmError(message)
      showErrorToast('Ошибка подключения CRM', message)
      return
    }

    setIsSavingCredentials(true)

    try {
      const saveResponse = await fetch('/api/integrations/kommo/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
          redirectUri: redirectUri.trim(),
        }),
      })

      const saveData = (await saveResponse.json()) as { success: boolean; error?: string }

      if (!saveResponse.ok || !saveData.success) {
        throw new Error(saveData.error ?? 'Не удалось сохранить учетные данные')
      }

      const oauthResponse = await fetch('/api/integrations/kommo/oauth/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ baseDomain: normalizeDomain(baseDomain) }),
      })

      const oauthData = (await oauthResponse.json()) as { success: boolean; authUrl?: string; error?: string }

      if (!oauthResponse.ok || !oauthData.success || !oauthData.authUrl) {
        throw new Error(oauthData.error ?? 'Не удалось получить ссылку авторизации')
      }

      setIsAwaitingOAuth(true)
      window.open(oauthData.authUrl, 'kommo-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось подключить Kommo'
      setCrmError(message)
      setIsAwaitingOAuth(false)
      showErrorToast('Ошибка подключения CRM', message)
    } finally {
      setIsSavingCredentials(false)
    }
  }

  const handleAgentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAgentError(null)

    if (!agentForm.name.trim()) {
      const message = 'Укажите имя агента'
      setAgentError(message)
      showErrorToast('Ошибка сохранения агента', message)
      return
    }

    if (!agentForm.goal.trim()) {
      const message = 'Опишите задачи агента'
      setAgentError(message)
      showErrorToast('Ошибка сохранения агента', message)
      return
    }

    setIsSavingAgent(true)

    try {
      const response = await fetch('/api/onboarding/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentForm),
      })

      const data = (await response.json()) as { success: boolean; state?: OnboardingState; error?: string }

      if (!response.ok || !data.success || !data.state) {
        throw new Error(data.error ?? 'Не удалось сохранить агента')
      }

      setCrmStatus(data.state.crm)
      setAgentState(data.state.agent)
      setCurrentStep(2)
      showSuccessToast('Агент готов к работе', 'AI-агент активирован и может принимать обращения')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось сохранить агента'
      setAgentError(message)
      showErrorToast('Ошибка сохранения агента', message)
    } finally {
      setIsSavingAgent(false)
    }
  }

  const handleLaunchAgent = async () => {
    setIsLaunchingAgent(true)

    try {
      const state = await refreshOnboardingState()

      if (state.isCompleted) {
        showSuccessToast('Онбординг завершён', 'Перенаправляем в рабочий дашборд')
        router.push('/')
      } else {
        showErrorToast('Онбординг не завершён', 'Заполните все шаги перед запуском агента')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось обновить состояние онбординга'
      showErrorToast('Ошибка запуска агента', message)
    } finally {
      setIsLaunchingAgent(false)
    }
  }

  const toggleChannel = (channel: string) => {
    setAgentForm((prev) => {
      const isActive = prev.channels.includes(channel)

      return {
        ...prev,
        channels: isActive ? prev.channels.filter((item) => item !== channel) : [...prev.channels, channel],
      }
    })
  }

  const syncStatus = crmStatus.sync?.status ?? 'queued'
  const syncDescription = (() => {
    switch (syncStatus) {
      case 'running':
        return 'Синхронизация данных Kommo выполняется...'
      case 'completed':
        return 'CRM подключена и данные синхронизированы'
      case 'failed':
        return `Ошибка синхронизации: ${crmStatus.sync?.error ?? 'неизвестная ошибка'}`
      default:
        return 'Настройте подключение CRM, чтобы перейти к следующему шагу'
    }
  })()

  const renderCrmSummary = () => {
    return (
      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <span className="font-medium text-gray-900">Провайдер:</span> {providerLabel}
        </div>
        <div>
          <span className="font-medium text-gray-900">Домен:</span> {crmStatus.connection?.baseDomain ?? '—'}
        </div>
        <div>
          <span className="font-medium text-gray-900">Статус синхронизации:</span>{' '}
          {crmStatus.sync?.status ?? 'queued'}
        </div>
        <div>
          <span className="font-medium text-gray-900">Количество воронок:</span> {crmStatus.sync?.pipelinesCount ?? 0}
        </div>
        {crmStatus.sync?.completedAt && (
          <div>
            <span className="font-medium text-gray-900">Завершено:</span> {crmStatus.sync.completedAt}
          </div>
        )}
        {crmStatus.sync?.pipelinesPreview?.length ? (
          <div className="space-y-2">
            <span className="font-medium text-gray-900">Воронки:</span>
            <ul className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3">
              {crmStatus.sync.pipelinesPreview.map((pipeline) => {
                return (
                  <li key={pipeline.externalId} className="text-xs text-gray-600">
                    <span className="font-medium text-gray-900">{pipeline.name}</span>
                    {pipeline.stages.length > 0 ? ` — ${pipeline.stages.join(', ')}` : null}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>
    )
  }

  const renderAgentSummary = () => {
    return (
      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <span className="font-medium text-gray-900">Название агента:</span> {agentState?.name ?? agentForm.name}
        </div>
        <div>
          <span className="font-medium text-gray-900">Модель:</span> {agentState?.defaultModel ?? agentForm.model}
        </div>
        <div>
          <span className="font-medium text-gray-900">Каналы:</span> {(agentForm.channels || []).join(', ')}
        </div>
        <div>
          <span className="font-medium text-gray-900">Расписание:</span> {agentForm.schedule}
        </div>
      </div>
    )
  }

  const renderStepContent = (stepId: OnboardingStep['id']) => {
    const crmReady = crmStatus.credentialsConfigured && crmStatus.connectionConfigured

    switch (stepId) {
      case 'crm':
        return (
          <form className="space-y-6" onSubmit={handleConnectCrm}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="crm-provider">
                CRM система
              </label>
              <Select
                id="crm-provider"
                value={crmForm.provider}
                onChange={(event) =>
                  setCrmForm((prev) => ({
                    ...prev,
                    provider: event.target.value,
                  }))
                }
                options={crmProviders}
                required
                disabled
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="crm-client-id">
                  Client ID / Integration ID
                </label>
                <Input
                  id="crm-client-id"
                  placeholder="XXXXXXXXXXXXXX"
                  value={crmForm.clientId}
                  onChange={(event) => setCrmForm((prev) => ({ ...prev, clientId: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="crm-client-secret">
                  Client Secret / OAuth Secret
                </label>
                <Input
                  id="crm-client-secret"
                  placeholder="••••••••••••••"
                  type="password"
                  value={crmForm.clientSecret}
                  onChange={(event) => setCrmForm((prev) => ({ ...prev, clientSecret: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="crm-redirect-uri">
                  Redirect URI
                </label>
                <Input
                  id="crm-redirect-uri"
                  placeholder="https://app.example.com/integrations/kommo/oauth/callback"
                  value={crmForm.redirectUri}
                  onChange={(event) => setCrmForm((prev) => ({ ...prev, redirectUri: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="crm-base-domain">
                  Домен CRM
                </label>
                <Input
                  id="crm-base-domain"
                  placeholder="example.amocrm.ru"
                  value={crmForm.baseDomain}
                  onChange={(event) => setCrmForm((prev) => ({ ...prev, baseDomain: event.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
              <div>
                <p className="font-medium text-gray-900">Тестовая синхронизация данных</p>
                <p className="text-sm text-gray-600">
                  Выгрузим только 20 последних сделок и контактов, чтобы проверить корректность работы интеграции.
                </p>
              </div>
              <Toggle
                aria-label="Тестовая синхронизация"
                pressed={crmForm.testSync}
                onPressedChange={(value) => setCrmForm((prev) => ({ ...prev, testSync: value }))}
              >
                {crmForm.testSync ? 'Включено' : 'Выключено'}
              </Toggle>
            </div>

            {crmError && <p className="text-sm text-red-600">{crmError}</p>}

            <div className="flex items-center justify-end space-x-3">
              <Button type="submit" disabled={isSavingCredentials || isAwaitingOAuth || isPollingSync || crmReady}>
                {isSavingCredentials ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                  </>
                ) : isAwaitingOAuth || isPollingSync ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ожидаем подтверждение...
                  </>
                ) : crmReady ? (
                  'CRM подключена'
                ) : (
                  'Подключить CRM'
                )}
                {!crmReady && !isSavingCredentials && !isAwaitingOAuth && !isPollingSync ? (
                  <ArrowRight className="ml-2 h-4 w-4" />
                ) : null}
              </Button>
            </div>

            {crmStatus.sync && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
                <p className="font-medium text-gray-900">Статус синхронизации: {crmStatus.sync.status}</p>
                <p className="text-sm text-gray-600">{syncDescription}</p>
              </div>
            )}
          </form>
        )
      case 'agent':
        return (
          <form className="space-y-6" onSubmit={handleAgentSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="agent-name">
                  Название агента
                </label>
                <Input
                  id="agent-name"
                  placeholder="AI менеджер"
                  value={agentForm.name}
                  onChange={(event) => setAgentForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="agent-model">
                  Модель LLM
                </label>
                <Select
                  id="agent-model"
                  value={agentForm.model}
                  onChange={(event) => setAgentForm((prev) => ({ ...prev, model: event.target.value }))}
                  options={agentModels}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="agent-goal">
                Основная задача агента
              </label>
              <Textarea
                id="agent-goal"
                rows={4}
                value={agentForm.goal}
                onChange={(event) => setAgentForm((prev) => ({ ...prev, goal: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Каналы коммуникации</p>
              <div className="flex flex-wrap gap-2">
                {agentChannels.map((channel) => {
                  const isActive = agentForm.channels.includes(channel.value)
                  return (
                    <Badge
                      key={channel.value}
                      variant={isActive ? 'default' : 'outline'}
                      className="cursor-pointer select-none"
                      onClick={() => toggleChannel(channel.value)}
                    >
                      {channel.label}
                    </Badge>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="agent-schedule">
                Расписание
              </label>
              <Select
                id="agent-schedule"
                value={agentForm.schedule}
                onChange={(event) => setAgentForm((prev) => ({ ...prev, schedule: event.target.value }))}
                options={schedules}
                required
              />
            </div>

            {agentError && <p className="text-sm text-red-600">{agentError}</p>}

            <div className="flex items-center justify-between">
              <Button type="button" variant="secondary" onClick={() => setCurrentStep(0)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Назад
              </Button>
              <Button type="submit" disabled={isSavingAgent}>
                {isSavingAgent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохраняем...
                  </>
                ) : (
                  <>
                    Сохранить настройки <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h3 className="text-base font-semibold text-green-900">CRM успешно подключена</h3>
              <p className="mt-1 text-sm text-green-700">{syncDescription}</p>
            </div>

            <Card className="space-y-4 p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">CRM система</p>
                <p className="text-lg font-semibold text-gray-900">{providerLabel}</p>
                <p className="text-sm text-gray-500">Поддомен: {crmStatus.connection?.baseDomain ?? '—'}</p>
              </div>

              {renderCrmSummary()}

              <div className="pt-2">
                <p className="text-sm font-medium text-gray-600">AI агент</p>
                {renderAgentSummary()}
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button type="button" variant="secondary" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Назад
              </Button>
              <Button type="button" onClick={handleLaunchAgent} disabled={isLaunchingAgent}>
                {isLaunchingAgent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Перенаправляем...
                  </>
                ) : (
                  <>
                    Запустить агента
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const currentStepConfig = steps[currentStep]
  const CurrentStepIcon = currentStepConfig.icon

  return (
    <div className="mx-auto max-w-5xl space-y-10 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Добро пожаловать! Настроим систему за 3 шага</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Сначала подключим CRM и заберём данные о клиентах, затем настроим AI-агента и определим, что он будет делать.
          После этого останется запустить агента в работу — всё это займёт не больше 5 минут.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit divide-y divide-gray-100 p-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Прогресс</p>
            <p className="text-lg font-semibold text-gray-900">{currentStep + 1} / {steps.length}</p>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <nav className="space-y-2 pt-6">
            {steps.map((step, index) => {
              const isActive = index === currentStep
              const isCompleted = completedStepIds.includes(step.id)

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (isCompleted || index === currentStep) {
                      setCurrentStep(index)
                    }
                  }}
                  className={cn(
                    'w-full rounded-lg px-4 py-3 text-left transition-colors',
                    'border border-transparent hover:border-primary-200',
                    isActive && 'border-primary-200 bg-primary-50',
                    !isActive && 'bg-white',
                    isCompleted && !isActive && 'border-emerald-200 bg-emerald-50',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold',
                          isActive ? 'border-primary-400 text-primary-600' : 'border-gray-200 text-gray-500',
                          isCompleted && 'border-emerald-300 bg-emerald-100 text-emerald-600',
                        )}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                    <step.icon className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              )
            })}
          </nav>
        </Card>

        <Card className="space-y-6 p-8">
          <div>
            <div className="flex items-center space-x-3">
              <CurrentStepIcon className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">{currentStepConfig.title}</h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">{currentStepConfig.description}</p>
          </div>

          {renderStepContent(currentStepConfig.id)}
        </Card>
      </div>
    </div>
  )
}
