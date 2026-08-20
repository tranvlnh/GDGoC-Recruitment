import { z } from "zod";
import { departments, getQuestionsForDepartment } from "@/lib/config";
import type { Answer } from "@/types/application";

const applicationBaseSchema = z.object({
    full_name: z.string().trim().min(1).max(150),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(8).max(30),
    facebook_url: z.string().trim().url().max(2048),
    student_year: z.coerce.number().int().min(1).max(7),
    student_id: z.string().trim().min(1).max(50),
    date_of_birth: z.string().date(),
    university: z.string().trim().min(1).max(200),
    department: z.string().min(1),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
    major: z.string().min(1),
    answers: z.array(
        z.object({
            question_id: z.string().min(1),
            value: z.union([z.string(), z.array(z.string())]),
        }),
    ),
});

export type ApplicationSubmission = z.infer<typeof applicationBaseSchema>;

export function validateApplicationSubmission(
    input: unknown,
): ApplicationSubmission {
    const parsed = applicationBaseSchema.parse(input);
    if (!parsed.major || !parsed.major.trim()) {
        throw new z.ZodError([
            { code: "custom", path: ["major"], message: "Vui lòng nhập ngành học" },
        ]);
    }
    if (
        !departments.some((department) => department.id === parsed.department)
    ) {
        throw new z.ZodError([
            {
                code: "custom",
                path: ["department"],
                message: "Ban chuyên môn không hợp lệ",
            },
        ]);
    }

    const applicableQuestions = getQuestionsForDepartment(parsed.department);

    const answerMap = new Map(
        parsed.answers.map((answer) => [answer.question_id, answer.value]),
    );
    if (answerMap.size !== parsed.answers.length) {
        throw new z.ZodError([
            {
                code: "custom",
                path: ["answers"],
                message: "Câu trả lời bị trùng lặp",
            },
        ]);
    }
    for (const answer of parsed.answers) {
        if (!applicableQuestions.some((question) => question.id === answer.question_id)) {
            throw new z.ZodError([
                {
                    code: "custom",
                    path: ["answers"],
                    message: `Câu hỏi không hợp lệ: ${answer.question_id}`,
                },
            ]);
        }
    }

    for (const question of applicableQuestions) {
        const value = answerMap.get(question.id);
        const isEmpty =
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim() === "") ||
            (Array.isArray(value) && value.length === 0);
        if (question.required && isEmpty) {
            throw new z.ZodError([
                {
                    code: "custom",
                    path: ["answers", question.id],
                    message: `Vui lòng trả lời: ${question.label}`,
                },
            ]);
        }
        if (isEmpty) continue;

        if (question.type === "essay") {
            if (typeof value !== "string")
                throw new z.ZodError([
                    {
                        code: "custom",
                        path: ["answers", question.id],
                        message: "Câu tự luận phải là chuỗi",
                    },
                ]);
            const text = value.trim();
            if (question.minLength && text.length < question.minLength)
                throw new z.ZodError([
                    {
                        code: "custom",
                        path: ["answers", question.id],
                        message: `Câu trả lời cần ít nhất ${question.minLength} ký tự`,
                    },
                ]);
            if (question.maxLength && text.length > question.maxLength)
                throw new z.ZodError([
                    {
                        code: "custom",
                        path: ["answers", question.id],
                        message: `Câu trả lời tối đa ${question.maxLength} ký tự`,
                    },
                ]);
        } else {
            const selected = Array.isArray(value) ? value : [value];
            if (!question.multiple && selected.length !== 1)
                throw new z.ZodError([
                    {
                        code: "custom",
                        path: ["answers", question.id],
                        message: "Chỉ được chọn một đáp án",
                    },
                ]);

            const allowOther = question.allowOther === true;
            for (const id of selected) {
                const isKnownOption = question.options.some((option) => option.id === id);
                const isOtherValue = allowOther && id.startsWith("other:");

                if (!isKnownOption && !isOtherValue) {
                    throw new z.ZodError([
                        {
                            code: "custom",
                            path: ["answers", question.id],
                            message: "Có lựa chọn không hợp lệ",
                        },
                    ]);
                }

                // Validate that "other" text is not empty
                if (isOtherValue) {
                    const otherText = id.slice("other:".length).trim();
                    if (!otherText) {
                        throw new z.ZodError([
                            {
                                code: "custom",
                                path: ["answers", question.id],
                                message: "Vui lòng nhập nội dung cho lựa chọn \"Khác\"",
                            },
                        ]);
                    }
                }
            }
        }
    }

    return { ...parsed, answers: parsed.answers as Answer[] };
}
