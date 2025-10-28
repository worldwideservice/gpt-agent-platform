'use client'

import { useState } from 'react'
import { Save, CreditCard } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { PricingPlan } from '@/types'

const currentPlan: PricingPlan = {
  id: '2',
  name: 'Профессиональный',
  price: 4990,
  currency: 'RUB',
  limits: {
    agents: 10,
    monthlyResponses: 50000,
    knowledgeBase: 1000,
  },
  features: [
    'До 10 AI-агентов',
    '50 000 ответов в месяц',
    '1000 статей в базе знаний',
    'Все интеграции',
    'Приоритетная поддержка',
  ],
}

const plans: PricingPlan[] = [
  {
    id: '1',
    name: 'Стартовый',
    price: 1990,
    currency: 'RUB',
    limits: {
      agents: 3,
      monthlyResponses: 10000,
      knowledgeBase: 100,
    },
    features: [
      'До 3 AI-агентов',
      '10 000 ответов в месяц',
      '100 статей в базе знаний',
      'Базовые интеграции',
      'Email поддержка',
    ],
  },
  currentPlan,
  {
    id: '3',
    name: 'Корпоративный',
    price: 9990,
    currency: 'RUB',
    limits: {
      agents: 999,
      monthlyResponses: 200000,
      knowledgeBase: 10000,
    },
    features: [
      'Неограниченное количество агентов',
      '200 000 ответов в месяц',
      '10 000 статей в базе знаний',
      'Все интеграции + кастомные',
      '24/7 поддержка',
      'Персональный менеджер',
    ],
  },
]

const AccountPage = () => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Аккаунт</h1>
        <p className="text-gray-600 mt-1">
          Управление настройками аккаунта и тарифным планом
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Настройки аккаунта
              </h3>
              <div className="space-y-4">
                <Input
                  label="Название компании"
                  defaultValue="World Wide Services"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Имя"
                    defaultValue="Администратор"
                  />
                  <Input
                    label="Фамилия"
                    defaultValue="Системы"
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  defaultValue="admin@worldwideservices.com"
                />
                <Input
                  label="Телефон"
                  type="tel"
                  defaultValue="+7 (999) 123-45-67"
                />
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Останавливать AI-агентов при ответе человека
                    </p>
                    <p className="text-sm text-gray-600">
                      Автоматически отключать агента, когда менеджер вступает в диалог
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Тарифные планы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const isCurrent = plan.id === currentPlan.id
                  return (
                    <div
                      key={plan.id}
                      className={`border-2 rounded-lg p-6 ${
                        isCurrent
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300 transition-colors'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        {isCurrent && <Badge variant="success">Текущий</Badge>}
                      </div>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {plan.price.toLocaleString('ru-RU')}
                        </span>
                        <span className="text-gray-600 ml-1">₽/мес</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <span className="text-primary-600 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={isCurrent ? 'secondary' : 'primary'}
                        className="w-full"
                        disabled={isCurrent}
                      >
                        {isCurrent ? 'Активен' : 'Выбрать'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Текущий план
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">План:</span>
                  <span className="font-medium text-gray-900">{currentPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Стоимость:</span>
                  <span className="font-medium text-gray-900">
                    {currentPlan.price.toLocaleString('ru-RU')} ₽/мес
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Использование:</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Агенты</span>
                        <span className="text-gray-900">8 / {currentPlan.limits.agents}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(8 / currentPlan.limits.agents) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Ответы в месяц</span>
                        <span className="text-gray-900">
                          {(45230).toLocaleString('ru-RU')} / {currentPlan.limits.monthlyResponses.toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(45230 / currentPlan.limits.monthlyResponses) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Способ оплаты
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Следующий платёж
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Дата:</span>
                  <span className="font-medium text-gray-900">15 ноября 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Сумма:</span>
                  <span className="font-medium text-gray-900">4 990 ₽</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Автоматическое продление подписки. Вы можете отменить в любой момент.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AccountPage

