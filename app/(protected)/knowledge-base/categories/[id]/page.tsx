import { redirect } from 'next/navigation'

import { CategoryForm } from './_components/CategoryForm'

import { auth } from '@/auth'
import { getKnowledgeBaseCategories, getKnowledgeBaseCategoryById } from '@/lib/repositories/knowledge-base'

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

  const categories = await getKnowledgeBaseCategories(session.user.orgId)

  return (
    <CategoryForm
      categoryId={id}
      initialCategory={category}
      categories={categories}
    />
  )
}

export default CategoryPage
