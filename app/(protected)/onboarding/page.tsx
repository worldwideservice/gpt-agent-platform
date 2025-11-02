import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getOnboardingState } from '@/lib/onboarding/server'

import { OnboardingClient } from './OnboardingClient'

export const metadata: Metadata = {
  title: 'Онбординг новой организации',
  description: 'Подключите CRM и настройте AI-агента для автоматизации коммуникаций',
}

const OnboardingPage = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  const state = await getOnboardingState(session.user.orgId)

  if (state.isCompleted) {
    redirect('/')
  }

  return <OnboardingClient initialState={state} />
}

export default OnboardingPage
