import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { CategoriesClient } from "./_components/CategoriesClient";

import { auth } from "@/auth";
import { getKnowledgeBaseCategories } from "@/lib/repositories/knowledge-base";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Категории базы знаний",
  description: "Управление категориями базы знаний",
};

interface CategoriesPageProps {
  params: Promise<{ tenantId: string }>;
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const resolvedParams = await params;
  const session = await auth();
  
  if (!session?.user?.orgId) {
    redirect("/login");
  }

  try {
    const categories = await getKnowledgeBaseCategories(session.user.orgId);
    return <CategoriesClient initialCategories={categories} />;
  } catch (error) {
    console.error("Failed to load knowledge categories", error);
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">
            Не удалось загрузить категории. Попробуйте обновить страницу.
          </p>
        </div>
      </div>
    );
  }
};

export default CategoriesPage;
