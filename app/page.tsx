import { LandingPageClient } from './LandingPageClient'

// Force dynamic rendering for landing page
export const dynamic = 'force-dynamic'

export default function LandingPage() {
  return <LandingPageClient />
}