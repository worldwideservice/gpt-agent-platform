"use client";

import { useEffect } from "react";

import { KwidButton } from "@/components/kwid";

interface AgentsErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const AgentsError = ({ error, reset }: AgentsErrorBoundaryProps) => {
  useEffect(() => {
    // Silent error logging
  }, [error]);

  return (
    <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      <div>
        <h2 className="text-lg font-semibold">
          Произошла ошибка загрузки агентов
        </h2>
        <p className="mt-2 text-sm">
          Попробуйте обновить страницу или повторите попытку позже. Если ошибка
          повторяется, обратитесь к администратору.
        </p>
      </div>
      <KwidButton variant="danger" onClick={reset} className="w-fit">
        Попробовать снова
      </KwidButton>
    </div>
  );
};

export default AgentsError;
