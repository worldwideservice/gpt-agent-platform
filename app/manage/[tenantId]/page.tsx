interface ManageTenantPageProps {
  params: Promise<{
    tenantId: string
  }>
}

export default async function ManageTenantPage({ params }: ManageTenantPageProps) {
  const { tenantId } = await params

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Добро пожаловать</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Workspace: <span className="font-mono">{tenantId}</span>
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
          Платформа находится в разработке
        </p>
      </div>
    </div>
  )
}
