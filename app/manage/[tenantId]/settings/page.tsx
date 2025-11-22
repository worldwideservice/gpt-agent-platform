import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Switch } from '@/components/ui'
import { PageBreadcrumbs } from '@/components/layout/PageBreadcrumbs'

interface SettingsPageProps {
  params: {
    tenantId: string
  }
}

export default function SettingsPage({ params }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <PageBreadcrumbs />

      <header>
        <p className="text-sm uppercase text-primary">Настройки</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Workspace настройки</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Управляйте базовыми параметрами workspace <span className="font-mono">{params.tenantId}</span>.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Общие</CardTitle>
            <CardDescription>Настройка имени и URL workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-500">
            <Label htmlFor="workspace-name">Название</Label>
            <Input id="workspace-name" disabled placeholder="World Wide Services" />
            <Label htmlFor="workspace-slug">Slug</Label>
            <Input id="workspace-slug" disabled placeholder="1000373-worldwideservices" />
            <p className="text-xs">
              Изменение данных появится после реализации формы и Supabase API.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Фичи</CardTitle>
            <CardDescription>Временный переключатель для будущих feature-flag.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Бета-функции</p>
                <p className="text-xs text-gray-500">
                  Управление через Supabase таблицу feature_flags (скоро).
                </p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Режим отладки</p>
                <p className="text-xs text-gray-500">
                  Будет доступен для QA и DevOps, когда появится настройка в env.
                </p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
