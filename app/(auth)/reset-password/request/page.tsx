import type { Metadata } from 'next'

import { RequestForm } from './RequestForm'

export const metadata: Metadata = {
  title: 'Сброс пароля',
  description: 'Получите ссылку для сброса пароля GPT Agent',
}

const ResetPasswordRequestPage = () => {
  return <RequestForm />
}

export default ResetPasswordRequestPage
