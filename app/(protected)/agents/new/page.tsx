import { redirect } from 'next/navigation'

const NewAgentPage = () => {
  redirect('/agents/create')
  return null
}

export default NewAgentPage

