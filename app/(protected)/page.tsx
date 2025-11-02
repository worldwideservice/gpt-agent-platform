import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function PlatformPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Платформа</h1>
        <p className="mt-2 text-sm text-slate-600">
          Добро пожаловать, {session.user.name || session.user.email}!
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-slate-600">
          Здесь будет ваша платформа. Вы можете начать создавать страницы и функциональность с нуля.
        </p>
      </div>
    </div>
  );
}
