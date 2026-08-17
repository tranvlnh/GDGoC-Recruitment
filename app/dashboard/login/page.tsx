import { LoginForm } from "@/components/dashboard/login-form";

export default async function DashboardLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/dashboard") ? next : undefined;
  return <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-4"><LoginForm nextPath={nextPath} /></main>;
}
