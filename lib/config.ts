import rawDepartments from "@/config/departments.json";
import rawMajors from "@/config/majors.json";
import rawQuestions from "@/config/questions.json";
import rawSettings from "@/config/settings.json";
import { optionSchema, questionsSchema, settingsSchema } from "@/types/config";

export const questions = questionsSchema
    .parse(rawQuestions)
    .sort((a, b) => a.order - b.order);

export const commonQuestions = questions.filter((q) => !q.departments || q.departments.length === 0);

export function getQuestionsForDepartment(departmentId: string) {
    return questions
        .filter((q) => !q.departments || q.departments.length === 0 || q.departments.includes(departmentId))
        .sort((a, b) => a.order - b.order);
}

export function getDepartmentSpecificQuestions(departmentId: string) {
    return questions
        .filter((q) => q.departments && q.departments.length > 0 && q.departments.includes(departmentId))
        .sort((a, b) => a.order - b.order);
}
export const majors = optionSchema.array().parse(rawMajors);
export const departments = optionSchema.array().parse(rawDepartments);
export const settings = settingsSchema.parse(rawSettings);

export function getApplicationWindowStatus(now = new Date()) {
    const openAt = new Date(settings.applicationOpenAt);
    const closeAt = new Date(settings.applicationCloseAt);

    if (now < openAt)
        return {
            isOpen: false,
            reason: "not_opened" as const,
            openAt,
            closeAt,
        };
    if (now > closeAt)
        return { isOpen: false, reason: "closed" as const, openAt, closeAt };
    return { isOpen: true, reason: null, openAt, closeAt };
}

export function majorLabel(majorId: string) {
    return (
        majors.find(
            (major) => major.id === majorId || major.label === majorId,
        )?.label ?? majorId
    );
}

export function departmentLabel(departmentId: string) {
    return (
        departments.find((department) => department.id === departmentId)
            ?.label ?? departmentId
    );
}
