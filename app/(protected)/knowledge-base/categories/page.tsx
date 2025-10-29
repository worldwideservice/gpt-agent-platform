import { redirect } from 'next/navigation'

import { CategoriesClient } from './_components/CategoriesClient'

import { auth } from '@/auth'
import { getKnowledgeBaseCategories } from '@/lib/repositories/knowledge-base'

const CategoriesPage = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  const categories = await getKnowledgeBaseCategories(session.user.orgId)

  return <CategoriesClient initialCategories={categories} />
}

export default CategoriesPage
