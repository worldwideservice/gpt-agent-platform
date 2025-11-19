'use client'

import { useEffect, useState } from 'react'
import { initializePaddle, Paddle } from '@paddle/paddle-js'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Check } from 'lucide-react'

interface PricingClientProps {
  tenantId: string
  userEmail: string
}

export function PricingClient({ tenantId, userEmail }: PricingClientProps) {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined)
  const { toast } = useToast()

  // 1. Инициализация Paddle при загрузке страницы
  useEffect(() => {
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'production' ? 'production' : 'sandbox',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!, // Client-side token
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          toast({ title: "Оплата прошла успешно!", description: "Обновите страницу через минуту." })
          setTimeout(() => window.location.reload(), 2000)
        }
      }
    }).then(setPaddle)
  }, [toast])

  // 2. Функция открытия окна оплаты
  const openCheckout = (priceId: string) => {
    if (!paddle) return

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { orgId: tenantId } // Критически важно для привязки!
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
      {/* Карточка тарифа */}
      <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-all bg-card">
        <h3 className="text-xl font-bold">Pro Plan</h3>
        <div className="my-4 text-3xl font-bold">$29 <span className="text-sm font-normal text-muted-foreground">/мес</span></div>
        <ul className="space-y-3 mb-6">
          <li className="flex gap-2"><Check className="w-5 h-5 text-green-500" /> Неограниченные агенты</li>
          <li className="flex gap-2"><Check className="w-5 h-5 text-green-500" /> База знаний (PDF, Web)</li>
          <li className="flex gap-2"><Check className="w-5 h-5 text-green-500" /> Интеграция с CRM</li>
        </ul>
        <Button
          className="w-full"
          onClick={() => openCheckout("pri_01jk...")} // Вставьте ваш Paddle Price ID
          disabled={!paddle}
        >
          {!paddle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Выбрать тариф'}
        </Button>
      </div>
    </div>
  )
}
