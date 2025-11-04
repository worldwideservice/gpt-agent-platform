import type { Metadata } from 'next'

import { RegisterClient } from './RegisterClient'

export const metadata: Metadata = {
  title: 'Регистрация в T11',
 description: 'Создайте учетную запись для работы с AI-агентами и интеграциями',
}

const RegisterPage = () => {
 return <RegisterClient />
}

export default RegisterPage



