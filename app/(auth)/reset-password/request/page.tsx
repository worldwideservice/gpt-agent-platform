import type { Metadata } from 'next'

import { RequestForm } from './RequestForm'

export const metadata: Metadata = {
 title: 'Сброс пароля',
  description: 'Получите ссылку для сброса пароля T11',
}

const ResetPasswordRequestPage = () => {
 return <RequestForm />
}

export default ResetPasswordRequestPage
