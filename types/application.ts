export const applicationStatuses = ["pending", "approved", "rejected"] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

export type Answer = {
    question_id: string;
    value: string | string[];
};

export type Application = {
    id: string;
    submitted_at: string;
    status: ApplicationStatus;
    answers: Answer[];
    major: string;
    full_name: string;
    email: string;
    phone: string;
    facebook_url: string;
    student_year: number;
    student_id: string;
    date_of_birth: string;
    university: string;
    department: string;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
};

export type PaginatedApplications = {
    data: Application[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};
