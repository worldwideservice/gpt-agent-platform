import ArticlePage from '../[id]/page'

const NewArticlePage = () => {
  return <ArticlePage params={Promise.resolve({ id: 'new' })} />
}

export default NewArticlePage



