import Link from "next/link";
import { notFound } from "next/navigation";
import { displayAnswer } from "@/lib/export";
import { departmentLabel, majorLabel, questions } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Application } from "@/types/application";

const genderLabels = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
    prefer_not_to_say: "Không muốn trả lời",
} as const;

export default async function ApplicationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (error) throw new Error("Không thể tải đơn ứng tuyển");
    if (!data) notFound();

    const application = data as Application;
    const answers = new Map(
        application.answers.map((answer) => [answer.question_id, answer]),
    );
    const details = [
        ["Email", application.email],
        ["Số điện thoại", application.phone],
        ["Facebook", application.facebook_url],
        ["Mã sinh viên", application.student_id],
        ["Năm học", `Năm ${application.student_year}`],
        [
            "Ngày sinh",
            new Date(
                `${application.date_of_birth}T00:00:00`,
            ).toLocaleDateString("vi-VN"),
        ],
        ["Trường học", application.university],
        ["Ngành", majorLabel(application.major)],
        ["Ban chuyên môn", departmentLabel(application.department)],
        ["Giới tính", genderLabels[application.gender]],
        [
            "Ngày nộp",
            new Date(application.submitted_at).toLocaleString("vi-VN"),
        ],
        ["Trạng thái", application.status],
    ];

    return (
        <main className="mx-auto max-w-3xl p-4 sm:p-6">
            <Link href="/dashboard" className="text-sm underline">
                ← Quay lại danh sách
            </Link>
            <div className="mt-4 rounded border bg-white p-5">
                <h1 className="text-2xl font-bold">{application.full_name}</h1>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    {details.map(([label, value]) => (
                        <div key={label}>
                            <dt className="text-zinc-500">{label}</dt>
                            <dd className="wrap-break-word">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <section className="mt-4 rounded border bg-white p-5">
                <h2 className="text-lg font-semibold">Câu trả lời</h2>
                <div className="mt-4 space-y-5">
                    {questions.map((question) => (
                        <div key={question.id}>
                            <h3 className="font-medium">{question.label}</h3>
                            <p className="mt-1 whitespace-pre-wrap text-zinc-700">
                                {displayAnswer(
                                    question.id,
                                    answers.get(question.id),
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
