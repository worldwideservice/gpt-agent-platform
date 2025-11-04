import type { Metadata } from 'next'
import Link from 'next/link'

import { ConfirmForm } from './ConfirmForm'

import { findValidPasswordResetByToken } from '@/lib/repositories/passwordResets'
import { Card } from '@/components/ui/Card'

interface PageProps {
 params: {
 token: string
 }
}

export const metadata: Metadata = {
 title: 'Создание нового пароля',
  description: 'Задайте новый пароль для своей учётной записи T11',
}

const ResetPasswordConfirmPage = async ({ params }: PageProps) => {
 const { token } = params

 if (!token) {
 return (
 <Card className="w-full max-w-md p-6 text-center text-sm text-red-700">
 <p>Ссылка на сброс пароля некорректна. Попросите новую ссылку.</p>
 <Link href="/reset-password/request" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
 Запросить новую ссылку
 </Link>
 </Card>
 )
 }

 const resetEntry = await findValidPasswordResetByToken(token)

 if (!resetEntry) {
 return (
 <Card className="w-full max-w-md p-6 text-center text-sm text-red-700">
 <p>Ссылка на сброс пароля недействительна или истекла. Запросите новую ссылку.</p>
 <Link href="/reset-password/request" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
 Запросить новую ссылку
 </Link>
 </Card>
 )
 }

 return <ConfirmForm token={token} />
}

export default ResetPasswordConfirmPage
