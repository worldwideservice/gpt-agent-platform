import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { ArticlesClient } from "./_components/ArticlesClient";

import { auth } from "@/auth";
import {
  getKnowledgeBaseArticles,
  getKnowledgeBaseCategories,
} from "@/lib/repositories/knowledge-base";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Статьи базы знаний",
  description: "Управление статьями базы знаний",
};

interface ArticlesPageProps {
  params: Promise<{ tenantId: string }>;
}

const ArticlesPage = async ({ params }: ArticlesPageProps) => {
  const resolvedParams = await params;
  const session = await auth();
  
  if (!session?.user?.orgId) {
    redirect("/login");
  }

  try {
    const [articlesResult, categoriesResult] = await Promise.all([
      getKnowledgeBaseArticles(session.user.orgId),
      getKnowledgeBaseCategories(session.user.orgId),
    ]);
    const articles = articlesResult;
    const categories = categoriesResult.map((cat) => ({
      id: cat.id,
      name: cat.name,
    }));

    return <ArticlesClient initialArticles={articles} categories={categories} />;
  } catch (error) {
    console.error("Failed to load knowledge items", error);
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">
            Не удалось загрузить статьи. Попробуйте обновить страницу.
          </p>
        </div>
      </div>
    );
  }
};

export default ArticlesPage;
