import { redirect } from 'next/navigation'

import { CategoryForm } from './_components/CategoryForm'

import { auth } from '@/auth'
import { getKnowledgeBaseCategoryById } from '@/lib/repositories/knowledge-base'

interface CategoryPageProps {
  params: Promise<{
    id: string
  }>
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  let category = null

  if (id !== 'new') {
    try {
      category = await getKnowledgeBaseCategoryById(id, session.user.orgId)
      
      if (!category) {
        redirect('/knowledge-base/categories')
      }
    } catch (error) {
      console.error('Failed to load category', error)
      redirect('/knowledge-base/categories')
    }
  }

  return <CategoryForm categoryId={id} initialCategory={category} />
}

export default CategoryPage
