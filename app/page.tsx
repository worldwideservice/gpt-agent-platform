import { LandingPageClient } from './LandingPageClient'

// Force dynamic rendering for landing page
export const dynamic = 'force-dynamic'

/**
 * Главная страница (Landing Page)
 * Всегда публичная - не редиректит авторизованных пользователей
 * Пользователь сам выбирает: войти, зарегистрироваться или восстановить пароль
 */
export default async function LandingPage() {
  return <LandingPageClient />
}
