import { z } from "zod";

export const optionSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1),
});

export const departmentColorPresetSchema = z.enum([
    "blue",
    "red",
    "amber",
    "green",
    "purple",
    "indigo",
    "cyan",
    "rose",
    "slate",
]);
export type DepartmentColorPreset = z.infer<typeof departmentColorPresetSchema>;

export const departmentSchema = z
    .object({
        id: z.string().min(1),
        name: z.string().min(1),
        label: z.string().optional(),
        englishName: z.string().default(""),
        tag: z.string().default(""),
        desc: z.string().default(""),
        themeColor: z.string().default("#4285F4"),
        colorPreset: departmentColorPresetSchema.default("blue"),
        svgImage: z.string().default("/logo.svg"),
        svgAlt: z.string().default("Department Mascot"),
        icon: z.string().default("users"),
        roles: z.array(z.string()).default([]),
        skills: z.array(z.string()).default([]),
    })
    .transform((dept) => ({
        ...dept,
        label: dept.label || dept.name,
    }));

export type Department = z.infer<typeof departmentSchema>;

const baseQuestionSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    required: z.boolean(),
    order: z.number().int().nonnegative().optional(),
    departments: z.array(z.string().min(1)).optional(),
    minYear: z.number().int().positive().optional(),
    category: z.string().optional(),
    dependsOn: z
        .object({
            questionId: z.string().min(1),
            value: z.union([z.string(), z.array(z.string())]),
        })
        .optional(),
});

export const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
    type: z.literal("multiple_choice"),
    multiple: z.boolean(),
    options: z.array(optionSchema).min(1),
    allowOther: z.boolean().optional(),
    otherLabel: z.string().optional(),
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
        messengerGroupUrl: z.string().url().optional().or(z.literal("")),
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
