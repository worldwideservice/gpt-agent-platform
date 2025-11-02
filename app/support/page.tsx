import type { Metadata } from "next";

import { SupportContent } from "@/components/support/SupportContent";

export const metadata: Metadata = {
  title: "Поддержка GPT Agent",
  description: "Найдите руководства, ответы и контакты команды поддержки GPT Agent",
};

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SupportContent variant="public" />
      </div>
    </div>
  );
};

export default SupportPage;
