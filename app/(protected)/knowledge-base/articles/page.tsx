import { redirect } from "next/navigation";

import { ArticlesClient } from "./_components/ArticlesClient";

import { auth } from "@/auth";
import {
  getKnowledgeBaseArticles,
  getKnowledgeBaseCategories,
} from "@/lib/repositories/knowledge-base";

const ArticlesPage = async () => {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const [articles, categories] = await Promise.all([
    getKnowledgeBaseArticles(session.user.orgId),
    getKnowledgeBaseCategories(session.user.orgId),
  ]);

  return (
    <ArticlesClient
      initialArticles={articles}
      categories={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
    />
  );
};

export default ArticlesPage;
