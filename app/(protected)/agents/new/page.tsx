import AgentEditPage from '../[id]/page'

const NewAgentPage = async () => {
  return <AgentEditPage params={Promise.resolve({ id: 'new' })} />
}

export default NewAgentPage

