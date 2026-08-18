import { LoginForm } from "@/components/dashboard/login-form";

export default async function DashboardLoginPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>;
}) {
    const { next } = await searchParams;
    const nextPath = next?.startsWith("/dashboard") ? next : undefined;
    return (
        <main className="relative flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4 overflow-hidden">
            {/* Background subtle glowing circles */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-red-100/50 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-50/40 blur-3xl" />

            <div className="relative z-10 w-full flex justify-center">
                <LoginForm nextPath={nextPath} />
            </div>
        </main>
    );
}
