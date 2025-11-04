import type { Metadata } from 'next'

import { LoginClient } from './LoginClient'

// Prevent static generation
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Вход в T11',
 description: 'Авторизуйтесь, чтобы управлять AI-агентами и интеграциями',
}

const LoginPage = () => {
 return <LoginClient />
}

export default LoginPage





