import Link from "next/link";
import { useTenantId } from "@/hooks/useTenantId";
import { Link2, Target } from "lucide-react";

import { KwidButton } from "@/components/kwid";

interface CalloutPipelinesProps {
  agentId: string;
}

export const CalloutPipelines = ({ agentId }: CalloutPipelinesProps) => {
  const tenantId = useTenantId();
  return (
    <div className="rounded-xl border border-custom-200 bg-custom-50/60 p-6 dark:border-custom-800 dark:bg-custom-900/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-custom-100 text-custom-600 dark:bg-custom-900/20 dark:text-custom-400">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-custom-900 dark:text-custom-100">
              Настройте воронки и этапы
            </h3>
            <p className="text-sm text-custom-700 dark:text-custom-300">
              Определите, на каких этапах и с какими условиями агент должен
              работать в CRM.
            </p>
          </div>
        </div>
        <Link
          href={
            tenantId
              ? `/manage/${tenantId}/ai-agents/${agentId}/pipelines`
              : `/agents/${agentId}/pipelines`
          }
        >
          <KwidButton
            variant="outline"
            size="md"
            className="border-custom-300 bg-white text-custom-700 hover:bg-custom-100 dark:border-custom-700 dark:bg-gray-800 dark:text-custom-300 dark:hover:bg-custom-900/20"
          >
            <Link2 className="mr-2 h-4 w-4" /> Настроить воронки
          </KwidButton>
        </Link>
      </div>
    </div>
  );
};
