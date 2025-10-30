import CategoryPage from '../[id]/page'

const NewCategoryPage = () => {
  return <CategoryPage params={Promise.resolve({ id: 'new' })} />
}

export default NewCategoryPage









