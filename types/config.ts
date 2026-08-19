import { z } from "zod";

export const optionSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1),
});

const baseQuestionSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    required: z.boolean(),
    order: z.number().int().nonnegative(),
    departments: z.array(z.string().min(1)).optional(),
});

export const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
    type: z.literal("multiple_choice"),
    multiple: z.boolean(),
    options: z.array(optionSchema).min(1),
});

export const essayQuestionSchema = baseQuestionSchema
    .extend({
        type: z.literal("essay"),
        minLength: z.number().int().nonnegative().optional(),
        maxLength: z.number().int().positive().optional(),
    })
    .refine(
        (question) =>
            !question.minLength ||
            !question.maxLength ||
            question.minLength <= question.maxLength,
        { message: "minLength must be less than or equal to maxLength" },
    );

export const questionSchema = z.discriminatedUnion("type", [
    multipleChoiceQuestionSchema,
    essayQuestionSchema,
]);

export const questionsSchema = z
    .array(questionSchema)
    .superRefine((questions, ctx) => {
        const ids = new Set<string>();
        for (const question of questions) {
            if (ids.has(question.id)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Duplicate question id: ${question.id}`,
                });
            }
            ids.add(question.id);
        }
    });

export const siteSchema = z.object({
    url: z.string().url(),
    name: z.string().min(1),
    fullName: z.string().min(1),
    description: z.string().min(1),
    ogDescription: z.string().min(1),
    ogImage: z.string().min(1),
    locale: z.string().min(1),
    themeColor: z.string().min(1),
    keywords: z.array(z.string().min(1)),
    socialLinks: z.array(z.string().url()).optional(),
});

export const settingsSchema = z
    .object({
        applicationOpenAt: z.string().datetime({ offset: true }),
        applicationCloseAt: z.string().datetime({ offset: true }),
        fallbackGoogleFormUrl: z.string().url().optional().or(z.literal("")),
        site: siteSchema,
    })
    .refine(
        (settings) =>
            new Date(settings.applicationOpenAt) <
            new Date(settings.applicationCloseAt),
        {
            message: "applicationOpenAt must be before applicationCloseAt",
        },
    );

export type Option = z.infer<typeof optionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type MultipleChoiceQuestion = z.infer<
    typeof multipleChoiceQuestionSchema
>;
export type EssayQuestion = z.infer<typeof essayQuestionSchema>;
export type Site = z.infer<typeof siteSchema>;
export type Settings = z.infer<typeof settingsSchema>;
