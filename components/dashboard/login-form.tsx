"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ nextPath }: { nextPath?: string }) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError("");
        const response = await fetch("/api/dashboard/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        setLoading(false);
        if (!response.ok) {
            const body = await response.json();
            setError(body.error ?? "Không thể đăng nhập");
            return;
        }
        router.replace(nextPath || "/dashboard");
        router.refresh();
    }

    return (
        <form
            onSubmit={submit}
            className="w-full max-w-sm space-y-4 rounded border bg-white p-6 shadow-sm"
        >
            <div>
                <h1 className="text-xl font-semibold">Dashboard GDGoC PTIT</h1>
                <p className="mt-1 text-sm text-zinc-600">
                    Đăng nhập để quản lý đơn tuyển thành viên.
                </p>
            </div>
            <label className="block text-sm font-medium">
                Mật khẩu
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="mt-1 w-full rounded border px-3 py-2"
                    autoFocus
                />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
                disabled={loading}
                className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
        </form>
    );
}
