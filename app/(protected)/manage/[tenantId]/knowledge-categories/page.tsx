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

  const categories = await getKnowledgeBaseCategories(session.user.orgId);

  return <CategoriesClient initialCategories={categories} />;
};

export default CategoriesPage;
