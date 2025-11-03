'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { Button } from '@/components/ui'

export function LandingPageClient() {
 const router = useRouter()
 const { data: session, status } = useSession()

 useEffect(() => {
 // If user is authenticated, redirect to /manage/[tenantId]
 if (status === 'authenticated' && session?.user) {
 console.log('User authenticated, getting tenant-id...')
 
 // Получаем tenant-id через API
 fetch('/api/auth/get-tenant-redirect')
 .then(res => res.json())
 .then(data => {
 if (data.success && data.tenantId) {
 console.log('Tenant-id received, redirecting to /manage/' + data.tenantId)
 router.replace(`/manage/${data.tenantId}`)
 } else {
 // Если не удалось получить tenant-id, редиректим на вход
 console.log('No tenant-id, redirecting to /login')
 router.replace('/login')
 }
 })
 .catch(error => {
 console.error('Error getting tenant-id:', error)
 router.replace('/login')
 })
 }
 }, [session, status, router])

 if (status === 'loading') {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <p>Загрузка...</p>
 </div>
 )
 }

 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="text-center">
 <h1 className="text-4xl font-bold mb-8">GPT Agent</h1>
 <div className="flex gap-4 justify-center">
 <Link href="/login">
 <Button>Войти</Button>
 </Link>
 <Link href="/register">
 <Button>Регистрация</Button>
 </Link>
 </div>
 </div>
 </div>
 )
}
