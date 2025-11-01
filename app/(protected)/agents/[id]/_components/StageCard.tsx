import { KwidSwitch } from "@/components/kwid";

interface StageCardProps {
  name: string;
}

export const StageCard = ({ name }: StageCardProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-900 dark:text-white">{name}</p>
        <KwidSwitch
          checked
          onCheckedChange={() => undefined}
          aria-label={`Активность этапа ${name}`}
        />
      </div>
      <p className="text-sm text-slate-500 dark:text-gray-400">
        Когда агент понимает, что это клиент по продукту {name}, автоматически
        переводит сделку на подходящий этап и назначает задачу.
      </p>
    </div>
  );
};
