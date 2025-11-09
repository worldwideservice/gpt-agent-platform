import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui'
import { Database, Upload, FileText, Folder, Search, ArrowRight, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'База знаний — TON 18',
  description: 'Руководство по работе с базой знаний для обучения AI-агентов',
}

export default function KnowledgeBasePage() {
  const sections = [
    {
      icon: Upload,
      title: 'Загрузка файлов',
      description: 'Как загружать документы в базу знаний',
      content: [
        'Перейдите в раздел "База знаний" в настройках агента',
        'Нажмите "Загрузить файл"',
        'Выберите поддерживаемые форматы:',
        '  • PDF документы',
        '  • Текстовые файлы (.txt, .md)',
        '  • Word документы (.docx)',
        '  • Excel таблицы (.xlsx)',
        'Файлы автоматически индексируются и становятся доступными для агента',
        'Максимальный размер файла: 10 МБ',
      ],
    },
    {
      icon: FileText,
      title: 'Создание статей',
      description: 'Создание текстовых статей в базе знаний',
      content: [
        'Нажмите "Создать статью" в разделе базы знаний',
        'Заполните заголовок и содержание статьи',
        'Используйте форматирование для лучшей структуры:',
        '  • Заголовки и подзаголовки',
        '  • Списки и нумерация',
        '  • Выделение важной информации',
        'Добавьте теги для категоризации',
        'Сохраните статью',
      ],
    },
    {
      icon: Folder,
      title: 'Организация по категориям',
      description: 'Структурирование базы знаний',
      content: [
        'Создавайте категории для группировки информации',
        'Например: "Продукты", "Услуги", "FAQ", "Политики"',
        'Перемещайте статьи и файлы между категориями',
        'Используйте вложенные категории для сложной структуры',
        'Это помогает агенту быстрее находить нужную информацию',
      ],
    },
    {
      icon: Search,
      title: 'Векторный поиск',
      description: 'Как работает поиск в базе знаний',
      content: [
        'Платформа использует векторный поиск для точных ответов',
        'Агент автоматически находит релевантную информацию',
        'Поиск работает по смыслу, а не по ключевым словам',
        'Чем больше информации в базе знаний, тем точнее ответы',
        'Регулярно обновляйте базу знаний для актуальности',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Database className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            База знаний
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Обучайте ваших AI-агентов, загружая файлы и создавая статьи. Автоматическая индексация и векторный поиск для точных ответов.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Best Practices */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 mb-16">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              <CardTitle className="text-xl">Лучшие практики</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span>Загружайте актуальную и проверенную информацию</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span>Используйте четкую структуру и форматирование</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span>Регулярно обновляйте информацию в базе знаний</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span>Группируйте связанную информацию по категориям</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link href="/docs/agents">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Настройка агентов
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost" className="w-full sm:w-auto">
              Вернуться к документации
            </Button>
          </Link>
          <Link href="/docs/integrations">
            <Button variant="outline" className="w-full sm:w-auto">
              Интеграции
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-950 transition-colors mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4 lg:col-span-3 flex flex-col">
              <div className="mb-5">
                <Logo showTagline />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed mt-2">
                create infinity — Платформа для создания и автоматизации работы с AI-агентами
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:col-span-8 lg:col-span-9 sm:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Продукт</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Возможности
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Тарифы
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Аккаунт</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Войти
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Зарегистрироваться
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Поддержка</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Помощь
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Документация
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} TON 18. Все права защищены.
              </p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Политика конфиденциальности
                </Link>
                <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Условия использования
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

