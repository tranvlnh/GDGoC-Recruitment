import { departmentLabel, majorLabel, questions } from "@/lib/config";
import type { Application, Answer } from "@/types/application";

function escapeCsv(value: string | number | null | undefined) {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function answerLabel(questionId: string, answer: Answer | undefined) {
    if (!answer) return "";
    const question = questions.find((item) => item.id === questionId);
    if (!question)
        return Array.isArray(answer.value)
            ? answer.value.join(", ")
            : answer.value;
    if (question.type === "essay")
        return typeof answer.value === "string"
            ? answer.value
            : answer.value.join(", ");
    const values = Array.isArray(answer.value) ? answer.value : [answer.value];
    return values
        .map(
            (value) =>
                question.options.find((option) => option.id === value)?.label ??
                value,
        )
        .join(", ");
}

export function applicationsToCsv(applications: Application[]) {
    const headers = [
        "ID",
        "Họ và tên",
        "Email",
        "Số điện thoại",
        "Facebook",
        "Năm học",
        "Mã sinh viên",
        "Ngày sinh",
        "Trường học",
        "Ngành",
        "Ban chuyên môn",
        "Giới tính",
        "Ngày nộp",
        "Trạng thái",
        ...questions.map((question) => question.label),
    ];
    const rows = applications.map((application) => {
        const answers = new Map(
            (application.answers ?? []).map((answer) => [
                answer.question_id,
                answer,
            ]),
        );
        return [
            application.id,
            application.full_name,
            application.email,
            application.phone,
            application.facebook_url,
            application.student_year,
            application.student_id,
            application.date_of_birth,
            application.university,
            majorLabel(application.major),
            departmentLabel(application.department),
            genderLabel(application.gender),
            new Date(application.submitted_at).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
            application.status,
            ...questions.map((question) =>
                answerLabel(question.id, answers.get(question.id)),
            ),
        ];
    });
    return `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
}

function genderLabel(gender: Application["gender"]) {
    return {
        male: "Nam",
        female: "Nữ",
        other: "Khác",
        prefer_not_to_say: "Không muốn trả lời",
    }[gender];
}

export function displayAnswer(questionId: string, answer: Answer | undefined) {
    return answerLabel(questionId, answer) || "—";
}
