import { redirect } from "next/navigation";

const KnowledgeBaseRedirectPage = () => {
  redirect("/knowledge-base/categories");
  return null;
};

export default KnowledgeBaseRedirectPage;
