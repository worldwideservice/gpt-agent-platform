import type { Metadata } from 'next'

import { LoginClient } from './LoginClient'

export const metadata: Metadata = {
  title: 'Вход в GPT Agent',
  description: 'Авторизуйтесь, чтобы управлять AI-агентами и интеграциями',
}

const LoginPage = () => {
  return <LoginClient />
}

export default LoginPage





