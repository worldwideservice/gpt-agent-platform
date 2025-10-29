import Link from 'next/link'
import { Link2, Target } from 'lucide-react'

import { Button } from '@/components/ui/Button'

interface CalloutPipelinesProps {
  agentId: string
}

export const CalloutPipelines = ({ agentId }: CalloutPipelinesProps) => {
  return (
    <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-900">Настройте воронки и этапы</h3>
            <p className="text-sm text-primary-700">
              Определите, на каких этапах и с какими условиями агент должен работать в CRM.
            </p>
          </div>
        </div>
        <Link href={`/agents/${agentId}/pipelines`}>
          <Button variant="outline" className="border-primary-300 bg-white text-primary-700 hover:bg-primary-100">
            <Link2 className="mr-2 h-4 w-4" /> Настроить воронки
          </Button>
        </Link>
      </div>
    </div>
  )
}



