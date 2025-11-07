"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ChevronDownIcon, InfoIcon, CheckCircleIcon } from "./icons"

export function GettingStartedContent() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="getting-started" />

        {/* Left Sidebar - Documentation Navigation */}
        <aside className="w-[280px] border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4">
            <div className="mb-6">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 mb-4">
                <span className="text-sm font-medium text-gray-900">Начало работы</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <nav className="space-y-1">
              <NavSection title="Агент ИИ" defaultOpen>
                <NavItem active>Начало работы</NavItem>
                <NavItem>Создать агента ИИ</NavItem>
                <NavItem>Настройки агента</NavItem>
              </NavSection>

              <NavSection title="Триггеры">
                <NavItem>Триггеры</NavItem>
              </NavSection>

              <NavSection title="База знаний">
                <NavItem>Добавить данные</NavItem>
              </NavSection>

              <NavSection title="Интеграции" />

              <NavSection title="Komno CRM">
                <NavItem>Настройка интеграции с Komno</NavItem>
              </NavSection>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto max-w-4xl px-8 py-12">
            <h1 className="mb-8 text-4xl font-bold text-gray-900">Начало работы</h1>

            <p className="mb-12 text-gray-600">
              Чтобы начать, просто выберите, в каких воронках должен работать ваш Агент ИИ.
            </p>

            {/* Section: Выберите воронки */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Выберите воронки</h2>
              <p className="mb-6 text-gray-600">
                Чтобы начать использовать Агента ИИ, укажите, в каких воронках он должен работать:
              </p>

              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-gray-500">1.</span>
                  <div>
                    <p className="text-gray-900">Откройте настройки Агента ИИ</p>
                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D0%9D%D0%B0%D1%87%D0%B0%D0%BB%D0%BE-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B-GPT-%D0%90%D0%B3%D0%B5%D0%BD%D1%82-07-11-2025_20_23-yZN1k23bUQgqC938SRvtsew7kSGvjT.png"
                        alt="Настройки Агента ИИ"
                        className="w-full"
                      />
                    </div>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="text-gray-500">2.</span>
                  <p className="text-gray-900">Пролистайте до раздела «Настройки воронок»</p>
                </li>

                <li className="flex gap-4">
                  <span className="text-gray-500">3.</span>
                  <p className="text-gray-900">Выберите воронки и этапы сделок, где агент должен работать</p>
                </li>

                <li className="flex gap-4">
                  <span className="text-gray-500">4.</span>
                  <div className="flex-1">
                    <p className="mb-4 text-gray-900">Выберите режим работы:</p>

                    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                      <label className="flex items-start gap-3">
                        <input type="radio" name="mode" className="mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Вопросоответ</div>
                          <div className="text-sm text-gray-500">Управлять через отправленные сообщения</div>
                          <div className="mt-2 text-xs text-gray-400">
                            Отключение не будет отправлять не сообщения. Ваш агенты к нему общаться сообщения для
                            проверять к успехе из новин
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3">
                        <input type="radio" name="mode" className="mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Настройка корзины</div>
                          <div className="text-sm text-gray-500">
                            Агент будет отвечать за сделку, в которых агент должен работать
                          </div>
                        </div>
                      </label>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="mb-2 text-sm font-medium text-gray-900">Режим</div>
                        <div className="flex gap-2">
                          <button className="rounded-lg border-2 border-red-500 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
                            Агент
                          </button>
                          <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Агент
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ol>
            </section>

            <p className="mb-6 text-gray-600">Нажмите «Сохранить», чтобы применить настройки</p>

            <p className="mb-6 text-gray-900">
              Ваш Агент ИИ будет отвечать только на сообщения в активированных воронках.
            </p>

            {/* Info Box */}
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <InfoIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="mb-2 font-semibold text-blue-900">Рекомендуемая настройка</div>
                  <p className="text-sm text-blue-800">
                    Для тестирования создайте тестовую воронку в Komno и предоставьте доступ Агенту ИИ только к этой
                    воронке. Это позволит безопасно тестировать Агента ИИ, не влияя на другие процессы.
                  </p>
                </div>
              </div>
            </div>

            {/* Success Box */}
            <div className="mb-12 rounded-lg border border-pink-200 bg-pink-50 p-4">
              <div className="flex gap-3">
                <CheckCircleIcon className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="mb-2 font-semibold text-pink-900">Готово!</div>
                  <p className="text-sm text-pink-800">
                    Ваш Агент ИИ готов к работе и будет автоматически отвечать на сообщения в выбранных воронках.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Следующие шаги</h2>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-blue-600">1.</span>
                  <div>
                    <a href="#" className="font-medium text-blue-600 hover:underline">
                      Настройте Агента ИИ
                    </a>
                    . Настройте тон, стиль и поведение Агента ИИ под задачи вашего бизнеса.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600">2.</span>
                  <div>
                    <a href="#" className="font-medium text-blue-600 hover:underline">
                      Добавьте информацию в базу знаний
                    </a>
                    . Добавьте информацию о вашем бизнесе, чтобы Агент ИИ стал умнее и полезнее.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600">3.</span>
                  <div>
                    <a href="#" className="font-medium text-blue-600 hover:underline">
                      Изучите настройки ответов
                    </a>
                    . Узнайте, когда и как Агент ИИ должен отправлять сообщения.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600">4.</span>
                  <div>
                    <a href="#" className="font-medium text-blue-600 hover:underline">
                      Настройте интеграцию с Komno
                    </a>
                    . Определите, как Агент ИИ взаимодействует с Komno.
                  </div>
                </li>
              </ol>
            </section>

            {/* What's Next */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Что дальше?</h2>
              <p className="mb-6 text-gray-600">
                Это только начало! Мы выпустили первую версию и уже работаем над новыми функциями и дополнительными
                инструментами, которые скоро будут доступны:
              </p>
              <p className="mb-6 text-gray-600">Будем рады вашей обратной связи.</p>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <InfoIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="mb-3 font-semibold text-blue-900">🔗 Поддержка</div>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          + WhatsApp
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          + Telegram
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          + hello@supergood.com
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          + Delfi
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom CTA */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <div className="mb-4 text-sm text-gray-500">Следующий</div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Создать агента ИИ
              </Button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="w-[240px] border-l border-gray-200 bg-white p-6 overflow-y-auto">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">На этой странице</h3>
          <nav className="space-y-2">
            <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">
              Обзор
            </a>
            <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">
              Выберите воронки
            </a>
            <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">
              Следующие шаги
            </a>
            <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">
              Что дальше?
            </a>
          </nav>
        </aside>
      </div>
    </div>
  )
}

function NavSection({
  title,
  children,
  defaultOpen = false,
}: { title: string; children?: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <div className="mb-2">
      <button className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
        <span>{title}</span>
        <ChevronDownIcon className="h-3 w-3 text-gray-400" />
      </button>
      {children && <div className="ml-2 mt-1 space-y-0.5">{children}</div>}
    </div>
  )
}

function NavItem({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href="#"
      className={`block rounded px-2 py-1.5 text-sm ${
        active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </a>
  )
}
