import { Toggle } from '@/components/ui/Toggle'

interface StageCardProps {
  name: string
}

export const StageCard = ({ name }: StageCardProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-900">{name}</p>
        <Toggle checked onChange={() => undefined} aria-label={`Активность этапа ${name}`} />
      </div>
      <p className="text-sm text-slate-500">
        Когда агент понимает, что это клиент по продукту {name}, автоматически переводит сделку на подходящий этап и
        назначает задачу.
      </p>
    </div>
  )
}



