import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PageBreadcrumbs } from '@/components/layout/PageBreadcrumbs'
import { ProfileSection } from '@/components/features/account-settings/ProfileSection'
import { SecuritySection } from '@/components/features/account-settings/SecuritySection'
import { GeneralSettingsSection } from '@/components/features/account-settings/GeneralSettingsSection'
import { ApiKeysSection } from '@/components/features/account-settings/ApiKeysSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * Страница настроек аккаунта пользователя
 * URL: /account/settings
 *
 * Согласно KWID и Master Roadmap:
 * - Профиль (имя, email)
 * - Безопасность (смена пароля)
 * - Общие настройки (переключатели)
 * - API ключи
 */
export default async function AccountSettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Загружаем профиль пользователя на сервере
  const profileResponse = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/user/profile`,
    {
      headers: {
        cookie: `authjs.session-token=${session.user.id}`, // Mock для SSR
      },
      cache: 'no-store',
    }
  ).catch(() => null)

  const profileData = profileResponse?.ok
    ? await profileResponse.json()
    : {
        firstName: session.user.name?.split(' ')[0] || 'Admin',
        lastName: session.user.name?.split(' ')[1] || 'User',
        email: session.user.email || 'admin@example.com',
      }

  return (
    <div className="space-y-6 pb-16">
      <PageBreadcrumbs />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Настройки аккаунта</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Управляйте настройками вашего профиля, безопасностью и интеграциями
        </p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="api-keys">API Ключи</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSection initialData={profileData} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySection />
        </TabsContent>

        <TabsContent value="general" className="mt-6">
          <GeneralSettingsSection />
        </TabsContent>

        <TabsContent value="api-keys" className="mt-6">
          <ApiKeysSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
