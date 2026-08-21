"use client";

import { useState, useEffect, useRef, useMemo, useCallback, FormEvent, useId } from "react";
import Image from "next/image";
import Script from "next/script";
import type { Option, Question, Department } from "@/types/config";
import { getDepartmentTheme } from "@/lib/departments";
import { isQuestionApplicable } from "@/lib/config";
import {
    CheckCircleIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    FacebookIcon,
    MessengerIcon,
} from "./google-icons";

type RecruitmentFormProps = {
    departments: (Department | Option)[];
    majors: Option[];
    questions: Question[];
    isOpen: boolean;
    reason: "not_opened" | "closed" | null;
    openAt: Date;
    closeAt: Date;
    fallbackGoogleFormUrl?: string;
    messengerGroupUrl?: string;
};

type FormState = {
    full_name: string;
    email: string;
    phone: string;
    facebook_url: string;
    student_year: string;
    student_id: string;
    date_of_birth: string;
    university: string;
    department: string;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
    major: string;
    answers: Record<string, string | string[]>;
    otherTexts: Record<string, string>;
};

const STORAGE_KEY = "gdgoc_recruitment_form_draft";
const SUBMITTED_KEY = "gdgoc_recruitment_form_submitted";
const TURNSTILE_SCRIPT_ID = "gdgoc-turnstile-script";

type TurnstileRenderOptions = {
    sitekey: string;
    callback?: (token: string) => void;
    "expired-callback"?: () => void;
    "error-callback"?: () => void;
    theme?: "light" | "dark";
};

type TurnstileApi = {
    render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
    reset: (widgetId?: string) => void;
};

declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

export function RecruitmentForm({
    departments,
    majors,
    questions,
    isOpen,
    reason,
    openAt,
    closeAt,
    fallbackGoogleFormUrl,
    messengerGroupUrl,
}: RecruitmentFormProps) {
    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
    const captchaEnabled = Boolean(turnstileSiteKey);
    const defaultUniversity = "Học viện Công nghệ Bưu chính Viễn thông";
    const formId = useId();
    const [isDraftRestored, setIsDraftRestored] = useState(false);

    const buildDefaultAnswers = (qs: Question[]) => {
        const initial: Record<string, string | string[]> = {};
        qs.forEach((q) => {
            if (q.type === "multiple_choice") {
                initial[q.id] = q.multiple ? [] : "";
            } else {
                initial[q.id] = "";
            }
        });
        return initial;
    };

    const buildDefaultOtherTexts = (qs: Question[]) => {
        const initial: Record<string, string> = {};
        qs.forEach((q) => {
            if (q.type === "multiple_choice" && q.allowOther) {
                initial[q.id] = "";
            }
        });
        return initial;
    };

    const [form, setForm] = useState<FormState>({
        full_name: "",
        email: "",
        phone: "",
        facebook_url: "",
        student_year: "1",
        student_id: "",
        date_of_birth: "",
        university: defaultUniversity,
        department: departments[0]?.id ?? "tech",
        gender: "prefer_not_to_say",
        major: "",
        answers: buildDefaultAnswers(questions),
        otherTexts: buildDefaultOtherTexts(questions),
    });

    const [isMajorOpen, setIsMajorOpen] = useState(false);
    const majorContainerRef = useRef<HTMLDivElement>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        applicationId?: string;
        message?: string;
    } | null>(null);
    const [captchaToken, setCaptchaToken] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const [isTurnstileReady, setIsTurnstileReady] = useState(false);
    const turnstileContainerRef = useRef<HTMLDivElement>(null);
    const turnstileWidgetIdRef = useRef<string | null>(null);

    // When department or student year changes, reset non-applicable answers
    const prevDeptRef = useRef(form.department);
    const prevYearRef = useRef(form.student_year);

    // Restore draft and submitted state from localStorage on initial client mount
    useEffect(() => {
        try {
            // Check if user previously submitted successfully
            const savedSubmission = localStorage.getItem(SUBMITTED_KEY);
            if (savedSubmission) {
                const parsedSub = JSON.parse(savedSubmission);
                if (parsedSub && parsedSub.success) {
                    setSubmitResult(parsedSub);
                }
            }

            const savedDraft = localStorage.getItem(STORAGE_KEY);
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft);
                if (parsed && typeof parsed === "object") {
                    const restoredAnswers = {
                        ...buildDefaultAnswers(questions),
                        ...(parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {}),
                    };
                    const restoredOtherTexts = {
                        ...buildDefaultOtherTexts(questions),
                        ...(parsed.otherTexts && typeof parsed.otherTexts === "object" ? parsed.otherTexts : {}),
                    };

                    const restoredDept =
                        parsed.department && departments.some((d) => d.id === parsed.department)
                            ? parsed.department
                            : departments[0]?.id ?? "tech";

                    prevDeptRef.current = restoredDept;
                    if (parsed.student_year) {
                        prevYearRef.current = parsed.student_year;
                    }

                    setForm((prev) => ({
                        ...prev,
                        full_name: typeof parsed.full_name === "string" ? parsed.full_name : prev.full_name,
                        email: typeof parsed.email === "string" ? parsed.email : prev.email,
                        phone: typeof parsed.phone === "string" ? parsed.phone : prev.phone,
                        facebook_url: typeof parsed.facebook_url === "string" ? parsed.facebook_url : prev.facebook_url,
                        student_year: typeof parsed.student_year === "string" ? parsed.student_year : prev.student_year,
                        student_id: typeof parsed.student_id === "string" ? parsed.student_id : prev.student_id,
                        date_of_birth: typeof parsed.date_of_birth === "string" ? parsed.date_of_birth : prev.date_of_birth,
                        university: typeof parsed.university === "string" ? parsed.university : prev.university,
                        department: restoredDept,
                        gender: parsed.gender ?? prev.gender,
                        major: typeof parsed.major === "string" ? parsed.major : prev.major,
                        answers: restoredAnswers,
                        otherTexts: restoredOtherTexts,
                    }));
                }
            }
        } catch (e) {
            console.warn("Could not restore recruitment form draft or submission from localStorage:", e);
        } finally {
            setIsDraftRestored(true);
        }
    }, [departments, questions]);

    // Save draft to localStorage whenever form changes (after draft is restored and if not currently in submitted view)
    useEffect(() => {
        if (!isDraftRestored || submitResult?.success) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        } catch (e) {
            console.warn("Could not save recruitment form draft to localStorage:", e);
        }
    }, [form, isDraftRestored, submitResult?.success]);

    useEffect(() => {
        if (!captchaEnabled || !isTurnstileReady || !turnstileContainerRef.current || !window.turnstile || turnstileWidgetIdRef.current) {
            return;
        }

        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: turnstileSiteKey,
            callback: (token) => {
                setCaptchaToken(token);
                setCaptchaError("");
            },
            "expired-callback": () => {
                setCaptchaToken("");
                setCaptchaError("Mã xác thực đã hết hạn. Vui lòng xác thực lại.");
            },
            "error-callback": () => {
                setCaptchaToken("");
                setCaptchaError("Không thể xác thực captcha. Vui lòng thử lại.");
            },
            theme: "dark",
        });
    }, [captchaEnabled, isTurnstileReady, turnstileSiteKey]);

    const studentYearNum = parseInt(form.student_year, 10) || 1;
    const isSubTechLeadEligible = form.department === "tech" && studentYearNum >= 2;

    // Split questions into common, regular department-specific, and sub-tech lead
    const commonQuestions = useMemo(
        () =>
            questions.filter(
                (q) =>
                    (!q.departments || q.departments.length === 0) &&
                    isQuestionApplicable(q, {
                        departmentId: form.department,
                        studentYear: studentYearNum,
                        answers: form.answers,
                    }),
            ),
        [questions, form.department, studentYearNum, form.answers],
    );

    const regularDeptQuestions = useMemo(
        () =>
            questions.filter(
                (q) =>
                    q.departments &&
                    q.departments.length > 0 &&
                    q.departments.includes(form.department) &&
                    q.category !== "sub_tech_lead_web" &&
                    isQuestionApplicable(q, {
                        departmentId: form.department,
                        studentYear: studentYearNum,
                        answers: form.answers,
                    }),
            ),
        [questions, form.department, studentYearNum, form.answers],
    );

    const subTechLeadQuestions = useMemo(
        () =>
            questions.filter(
                (q) =>
                    q.category === "sub_tech_lead_web" &&
                    isQuestionApplicable(q, {
                        departmentId: form.department,
                        studentYear: studentYearNum,
                        answers: form.answers,
                    }),
            ),
        [questions, form.department, studentYearNum, form.answers],
    );

    const activeQuestions = useMemo(
        () => [
            ...commonQuestions,
            ...regularDeptQuestions,
            ...subTechLeadQuestions,
        ],
        [commonQuestions, regularDeptQuestions, subTechLeadQuestions],
    );

    useEffect(() => {
        const deptChanged = prevDeptRef.current !== form.department;
        const yearChanged = prevYearRef.current !== form.student_year;

        if (deptChanged || yearChanged) {
            prevDeptRef.current = form.department;
            prevYearRef.current = form.student_year;

            setForm((prev) => {
                const newAnswers = { ...prev.answers };
                const currentYear = parseInt(prev.student_year, 10) || 1;

                // Ensure department-specific questions have default answers
                const newDeptQs = questions.filter(
                    (q) =>
                        q.departments &&
                        q.departments.length > 0 &&
                        q.departments.includes(prev.department),
                );
                for (const q of newDeptQs) {
                    if (newAnswers[q.id] === undefined) {
                        newAnswers[q.id] =
                            q.type === "multiple_choice" && q.multiple ? [] : "";
                    }
                }

                // If no longer eligible for sub-tech lead, reset sub-tech lead answers
                if (prev.department !== "tech" || currentYear < 2) {
                    const subTechIds = [
                        "tech_sublead_web_interest",
                        "tech_sublead_web_exp",
                        "tech_sublead_web_leadership",
                        "tech_sublead_web_vision",
                        "tech_sublead_web_portfolio",
                    ];
                    for (const id of subTechIds) {
                        if (newAnswers[id]) {
                            newAnswers[id] = "";
                        }
                    }
                }

                return { ...prev, answers: newAnswers };
            });

            // Clear errors for non-applicable questions
            setErrors((prev) => {
                const cleaned = { ...prev };
                const currentYear = parseInt(form.student_year, 10) || 1;

                if (deptChanged) {
                    for (const key of Object.keys(cleaned)) {
                        if (key.startsWith("answers.")) {
                            const qId = key.replace("answers.", "");
                            const q = questions.find((question) => question.id === qId);
                            if (q?.departments && q.departments.length > 0) {
                                delete cleaned[key];
                            }
                        }
                    }
                }

                if (form.department !== "tech" || currentYear < 2) {
                    for (const key of Object.keys(cleaned)) {
                        if (key.includes("tech_sublead_web")) {
                            delete cleaned[key];
                        }
                    }
                }

                return cleaned;
            });
        }
    }, [form.department, form.student_year, questions]);

    // Close major dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                majorContainerRef.current &&
                !majorContainerRef.current.contains(event.target as Node)
            ) {
                setIsMajorOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const normalizeSearchText = (str: string) =>
        str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const filteredMajors = majors.filter((m) => {
        if (!form.major) return true;
        const query = normalizeSearchText(form.major);
        return (
            normalizeSearchText(m.label).includes(query) ||
            normalizeSearchText(m.id).includes(query)
        );
    });

    // Listen to custom selection event from DepartmentsSection
    useEffect(() => {
        const handleDeptEvent = (e: Event) => {
            const customEvent = e as CustomEvent<string>;
            if (customEvent.detail) {
                setForm((prev) => ({ ...prev, department: customEvent.detail }));
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next.department;
                    return next;
                });
            }
        };

        window.addEventListener("gdgoc-select-department", handleDeptEvent);
        return () => window.removeEventListener("gdgoc-select-department", handleDeptEvent);
    }, []);

    const normalizeFacebookUrl = (url: string): string => {
        const trimmed = url.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed;
        }
        return `https://${trimmed}`;
    };

    const handleAnswerChange = (questionId: string, value: string | string[]) => {
        setForm((prev) => {
            const nextAnswers = {
                ...prev.answers,
                [questionId]: value,
            };
            if (questionId === "tech_sublead_web_interest" && value === "no") {
                const subLeadDetailKeys = [
                    "tech_sublead_web_exp",
                    "tech_sublead_web_leadership",
                    "tech_sublead_web_vision",
                    "tech_sublead_web_portfolio",
                ];
                for (const k of subLeadDetailKeys) {
                    if (nextAnswers[k]) nextAnswers[k] = "";
                }
            }
            return {
                ...prev,
                answers: nextAnswers,
            };
        });

        if (errors[`answers.${questionId}`]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[`answers.${questionId}`];
                return next;
            });
        }

        if (questionId === "tech_sublead_web_interest" && value === "no") {
            setErrors((prev) => {
                const next = { ...prev };
                delete next["answers.tech_sublead_web_exp"];
                delete next["answers.tech_sublead_web_leadership"];
                delete next["answers.tech_sublead_web_vision"];
                delete next["answers.tech_sublead_web_portfolio"];
                return next;
            });
        }
    };

    const handleCheckboxToggle = (questionId: string, optionId: string) => {
        const current = (form.answers[questionId] as string[]) || [];
        const updated = current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId];
        handleAnswerChange(questionId, updated);
        // Clear other text when "other" is deselected
        if (optionId === "__other__" && current.includes(optionId)) {
            setForm((prev) => ({
                ...prev,
                otherTexts: { ...prev.otherTexts, [questionId]: "" },
            }));
        }
    };

    const handleOtherTextChange = (questionId: string, text: string) => {
        setForm((prev) => ({
            ...prev,
            otherTexts: { ...prev.otherTexts, [questionId]: text },
        }));
        if (errors[`answers.${questionId}`]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[`answers.${questionId}`];
                return next;
            });
        }
    };

    const validateClient = (): { valid: boolean; errors: Record<string, string> } => {
        const newErrors: Record<string, string> = {};

        if (!form.full_name.trim()) newErrors.full_name = "Vui lòng nhập họ và tên";
        if (!form.email.trim() || !form.email.includes("@")) {
            newErrors.email = "Vui lòng nhập địa chỉ email hợp lệ (ví dụ: student@gmail.com)";
        }
        if (!form.phone.trim() || form.phone.trim().length < 8) {
            newErrors.phone = "Vui lòng nhập số điện thoại hợp lệ (ít nhất 8 số)";
        }

        const normalizedFb = normalizeFacebookUrl(form.facebook_url);
        if (!normalizedFb || (!normalizedFb.includes("facebook.com") && !normalizedFb.includes("fb.com") && !normalizedFb.includes("fb.me"))) {
            newErrors.facebook_url = "Vui lòng nhập link Facebook cá nhân (ví dụ: facebook.com/username)";
        }

        if (!form.student_id.trim()) newErrors.student_id = "Vui lòng nhập mã sinh viên";
        if (!form.date_of_birth) newErrors.date_of_birth = "Vui lòng chọn ngày sinh";
        if (!form.university.trim()) newErrors.university = "Vui lòng nhập tên trường";
        if (!form.department) newErrors.department = "Vui lòng chọn ban ứng tuyển";
        if (!form.major.trim()) newErrors.major = "Vui lòng nhập hoặc chọn ngành học";

        // Validate active questions
        activeQuestions.forEach((q) => {
            const answer = form.answers[q.id];
            const otherText = form.otherTexts[q.id]?.trim();

            if (q.type === "essay") {
                const text = typeof answer === "string" ? answer.trim() : "";
                if (q.required && !text) {
                    newErrors[`answers.${q.id}`] = "Vui lòng trả lời câu hỏi này";
                } else if (text) {
                    if (q.minLength && text.length < q.minLength) {
                        newErrors[`answers.${q.id}`] = `Câu trả lời cần tối thiểu ${q.minLength} ký tự (hiện có ${text.length})`;
                    } else if (q.maxLength && text.length > q.maxLength) {
                        newErrors[`answers.${q.id}`] = `Câu trả lời không được vượt quá ${q.maxLength} ký tự (hiện có ${text.length})`;
                    }
                }
            } else if (q.type === "multiple_choice") {
                if (q.multiple) {
                    const arr = Array.isArray(answer) ? answer : [];
                    if (q.required && arr.length === 0) {
                        newErrors[`answers.${q.id}`] = "Vui lòng chọn ít nhất một phương án";
                    } else if (q.allowOther && arr.includes("__other__") && !otherText) {
                        newErrors[`answers.${q.id}`] = "Vui lòng nhập nội dung cho lựa chọn khác";
                    }
                } else {
                    const val = typeof answer === "string" ? answer : "";
                    if (q.required && !val) {
                        newErrors[`answers.${q.id}`] = "Vui lòng chọn một phương án";
                    } else if (q.allowOther && val === "__other__" && !otherText) {
                        newErrors[`answers.${q.id}`] = "Vui lòng nhập nội dung cho lựa chọn khác";
                    }
                }
            }
        });

        return {
            valid: Object.keys(newErrors).length === 0,
            errors: newErrors,
        };
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitResult(null);
        setCaptchaError("");

        const validation = validateClient();
        if (!validation.valid) {
            setErrors(validation.errors);
            // Smoothly scroll to the FIRST error field and set focus
            const firstErrorKey = Object.keys(validation.errors)[0];
            if (firstErrorKey) {
                const elem = document.getElementById(`${formId}-${firstErrorKey}`);
                if (elem) {
                    elem.scrollIntoView({ behavior: "smooth", block: "center" });
                    const focusable = elem.querySelector("input, select, textarea, button") as HTMLElement | null;
                    focusable?.focus();
                }
            }
            return;
        }

        if (captchaEnabled && !captchaToken) {
            setCaptchaError("Vui lòng hoàn tất captcha trước khi gửi đơn.");
            return;
        }

        setSubmitting(true);

        try {
            const answersArray = activeQuestions.map((q) => {
                let value = form.answers[q.id] ?? (q.type === "multiple_choice" && q.multiple ? [] : "");

                // Replace __other__ with actual typed text
                if (q.type === "multiple_choice" && q.allowOther) {
                    const otherText = form.otherTexts[q.id]?.trim() || "";
                    if (q.multiple && Array.isArray(value)) {
                        value = value.map((v: string) => v === "__other__" ? `other:${otherText}` : v);
                    } else if (value === "__other__") {
                        value = `other:${otherText}`;
                    }
                } else if (q.type === "essay" && typeof value === "string") {
                    value = value.trim();
                }

                return { question_id: q.id, value };
            });

            const payload = {
                full_name: form.full_name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                facebook_url: normalizeFacebookUrl(form.facebook_url),
                student_year: parseInt(form.student_year, 10),
                student_id: form.student_id.trim().toUpperCase(),
                date_of_birth: form.date_of_birth,
                university: form.university.trim(),
                department: form.department,
                gender: form.gender,
                major: form.major,
                answers: answersArray,
                captcha_token: captchaToken,
            };

            const idempotencyKey =
                typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

            const res = await fetch("/api/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Idempotency-Key": idempotencyKey,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.details && Array.isArray(data.details)) {
                    const serverErrors: Record<string, string> = {};
                    data.details.forEach((issue: { path: (string | number)[]; message: string }) => {
                        const pathKey = issue.path.join(".");
                        serverErrors[pathKey] = issue.message;
                    });
                    setErrors(serverErrors);
                }
                setSubmitResult({
                    success: false,
                    message: data.error || "Không thể gửi đơn ứng tuyển. Vui lòng kiểm tra lại thông tin.",
                });
                if (captchaEnabled && window.turnstile && turnstileWidgetIdRef.current) {
                    setCaptchaToken("");
                    window.turnstile.reset(turnstileWidgetIdRef.current);
                }
                return;
            }

            // Success! Save submission state to localStorage so user still sees it upon revisit
            const successPayload = {
                success: true,
                applicationId: data.data?.id,
                message: "Cảm ơn bạn đã nộp đơn ứng tuyển vào GDG on Campus: PTIT! Đơn ứng tuyển của bạn đã được gửi thành công.",
                submittedAt: new Date().toISOString(),
            };

            try {
                localStorage.setItem(SUBMITTED_KEY, JSON.stringify(successPayload));
            } catch (e) {
                console.warn("Could not save submitted state to localStorage:", e);
            }

            setSubmitResult(successPayload);
        } catch (err) {
            console.error("Submission failed:", err);
            setSubmitResult({
                success: false,
                message: "Đã xảy ra sự cố kết nối. Vui lòng thử lại sau.",
            });
            if (captchaEnabled && window.turnstile && turnstileWidgetIdRef.current) {
                setCaptchaToken("");
                window.turnstile.reset(turnstileWidgetIdRef.current);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getDepartmentCardStyle = (deptId: string, isSelected: boolean) => {
        if (!isSelected) {
            return "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-zinc-200";
        }
        switch (deptId) {
            case "tech":
                return "border-[#4285F4] bg-gradient-to-r from-[#4285F4]/25 to-[#4285F4]/10 text-white shadow-[0_0_25px_rgba(66,133,244,0.35)]";
            case "design":
                return "border-[#EA4335] bg-gradient-to-r from-[#EA4335]/25 to-[#EA4335]/10 text-white shadow-[0_0_25px_rgba(234,67,53,0.35)]";
            case "pr":
                return "border-[#FBBC05] bg-gradient-to-r from-[#FBBC05]/25 to-[#FBBC05]/10 text-white shadow-[0_0_25px_rgba(251,188,5,0.35)]";
            case "hr-lg":
                return "border-[#34A853] bg-gradient-to-r from-[#34A853]/25 to-[#34A853]/10 text-white shadow-[0_0_25px_rgba(52,168,83,0.35)]";
            default:
                return "border-[#4285F4] bg-[#4285F4]/20 text-white shadow-[0_0_25px_rgba(66,133,244,0.35)]";
        }
    };

    const getDepartmentRadioDotStyle = (deptId: string, isSelected: boolean) => {
        if (!isSelected) {
            return "border-white/30 bg-white/5";
        }
        switch (deptId) {
            case "tech":
                return "border-transparent bg-[#4285F4] text-white";
            case "design":
                return "border-transparent bg-[#EA4335] text-white";
            case "pr":
                return "border-transparent bg-[#FBBC05] text-zinc-950";
            case "hr-lg":
                return "border-transparent bg-[#34A853] text-white";
            default:
                return "border-transparent bg-[#4285F4] text-white";
        }
    };

    const renderQuestionField = (q: Question) => {
        const errorKey = `answers.${q.id}`;
        const hasError = !!errors[errorKey];

        if (q.type === "essay") {
            const currentText = (form.answers[q.id] as string) || "";
            const currentLen = currentText.trim().length;
            const minReq = q.minLength ?? 0;
            const maxReq = q.maxLength ?? 1000;
            const isMet = currentLen >= minReq;
            const isExceeded = currentLen > maxReq;
            const isUnderMin = currentLen > 0 && minReq > 0 && !isMet;

            return (
                <div key={q.id} className="space-y-2" id={`${formId}-${errorKey}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                        <label className="block text-sm font-semibold text-zinc-200 leading-snug">
                            {q.label} {q.required && <span className="text-[#EA4335]">*</span>}
                        </label>
                        <span
                            className={`self-start sm:self-auto shrink-0 text-[11px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full border whitespace-nowrap transition-colors ${isExceeded || isUnderMin || (hasError && !isMet)
                                ? "bg-red-500/20 text-red-400 border-red-500/40 font-bold shadow-[0_0_10px_rgba(234,67,53,0.25)]"
                                : isMet && currentLen > 0
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-bold shadow-[0_0_10px_rgba(52,168,83,0.25)]"
                                    : "bg-white/10 text-zinc-400 border-white/15"
                                }`}
                        >
                            {currentLen} / {maxReq} ký tự
                        </span>
                    </div>

                    <textarea
                        rows={4}
                        placeholder="Nhập câu trả lời của bạn..."
                        value={currentText}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 bg-white/[0.06] hover:bg-white/[0.09] text-white placeholder:text-zinc-500 ${hasError || isUnderMin || isExceeded
                            ? "border-red-500/80 bg-red-950/20 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/15 focus:border-[#4285F4]"
                            }`}
                    />

                    {hasError ? (
                        <p className="text-xs text-red-400 font-semibold leading-relaxed flex items-center gap-1.5 pt-0.5">
                            <span className="text-sm leading-none">⚠️</span>
                            <span>{errors[errorKey]}</span>
                        </p>
                    ) : isUnderMin ? (
                        <p className="text-xs text-red-400 font-semibold leading-relaxed flex items-center gap-1.5 pt-0.5">
                            <span className="text-sm leading-none">⚠️</span>
                            <span>Cần viết ít nhất {minReq} ký tự (hiện có {currentLen} ký tự).</span>
                        </p>
                    ) : null}
                </div>
            );
        }

        if (q.type === "multiple_choice") {
            if (q.multiple) {
                const selectedArray = (form.answers[q.id] as string[]) || [];
                return (
                    <div key={q.id} className="space-y-2.5" id={`${formId}-${errorKey}`}>
                        <label className="block text-sm font-semibold text-zinc-200 leading-snug">
                            {q.label} {q.required && <span className="text-[#EA4335]">*</span>}{" "}
                            <span className="text-[11px] font-normal lowercase text-zinc-400">
                                (chọn một hoặc nhiều)
                            </span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                            {q.options.map((opt) => {
                                const checked = selectedArray.includes(opt.id);
                                return (
                                    <button
                                        type="button"
                                        role="checkbox"
                                        aria-checked={checked}
                                        key={opt.id}
                                        onClick={() => handleCheckboxToggle(q.id, opt.id)}
                                        className={`p-3 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${checked
                                            ? "border-[#4285F4] bg-[#4285F4]/20 text-white shadow-[0_0_18px_rgba(66,133,244,0.25)] font-semibold"
                                            : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-zinc-200"
                                            }`}
                                    >
                                        <span
                                            className={`text-xs sm:text-sm leading-snug break-words ${checked
                                                ? "text-white font-semibold"
                                                : "text-zinc-200 font-medium"
                                                }`}
                                        >
                                            {opt.label}
                                        </span>
                                        <span
                                            className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center text-xs shrink-0 transition-colors ${checked
                                                ? "bg-[#4285F4] border-[#4285F4] text-white"
                                                : "border-white/30 bg-white/5"
                                                }`}
                                        >
                                            {checked && "✓"}
                                        </span>
                                    </button>
                                );
                            })}
                            {q.allowOther && (() => {
                                const otherChecked = selectedArray.includes("__other__");
                                return (
                                    <button
                                        type="button"
                                        role="checkbox"
                                        aria-checked={otherChecked}
                                        onClick={() => handleCheckboxToggle(q.id, "__other__")}
                                        className={`p-3 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${q.options.length % 2 === 0 ? "sm:col-span-2" : ""
                                            } ${otherChecked
                                                ? "border-[#4285F4] bg-[#4285F4]/20 text-white shadow-[0_0_18px_rgba(66,133,244,0.25)] font-semibold"
                                                : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-zinc-200"
                                            }`}
                                    >
                                        <span
                                            className={`text-xs sm:text-sm leading-snug ${otherChecked
                                                ? "text-white font-semibold"
                                                : "text-zinc-200 font-medium"
                                                }`}
                                        >
                                            {q.otherLabel || "Khác (vui lòng ghi rõ)"}
                                        </span>
                                        <span
                                            className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center text-xs shrink-0 transition-colors ${otherChecked
                                                ? "bg-[#4285F4] border-[#4285F4] text-white"
                                                : "border-white/30 bg-white/5"
                                                }`}
                                        >
                                            {otherChecked && "✓"}
                                        </span>
                                    </button>
                                );
                            })()}
                        </div>
                        {q.allowOther && selectedArray.includes("__other__") && (
                            <input
                                type="text"
                                placeholder="Nhập lựa chọn khác của bạn..."
                                value={form.otherTexts[q.id] || ""}
                                onChange={(e) => handleOtherTextChange(q.id, e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#4285F4]/50 bg-[#4285F4]/10 text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] placeholder:text-zinc-400"
                                autoFocus
                            />
                        )}
                        {hasError && (
                            <p className="text-xs text-red-400 font-semibold leading-relaxed flex items-center gap-1.5 pt-0.5">
                                <span className="text-sm leading-none">⚠️</span>
                                <span>{errors[errorKey]}</span>
                            </p>
                        )}
                    </div>
                );
            }

            // Single Choice
            const selectedValue = (form.answers[q.id] as string) || "";
            return (
                <div key={q.id} className="space-y-2.5" id={`${formId}-${errorKey}`}>
                    <label className="block text-sm font-semibold text-zinc-200 leading-snug">
                        {q.label} {q.required && <span className="text-[#EA4335]">*</span>}
                    </label>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3"
                        role="radiogroup"
                    >
                        {q.options.map((opt) => {
                            const checked = selectedValue === opt.id;
                            return (
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={checked}
                                    key={opt.id}
                                    onClick={() => handleAnswerChange(q.id, opt.id)}
                                    className={`p-3 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${checked
                                        ? "border-[#4285F4] bg-[#4285F4]/20 text-white shadow-[0_0_18px_rgba(66,133,244,0.25)] font-semibold"
                                        : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-zinc-200"
                                        }`}
                                >
                                    <span
                                        className={`text-xs sm:text-sm leading-snug break-words ${checked
                                            ? "text-white font-semibold"
                                            : "text-zinc-200 font-medium"
                                            }`}
                                    >
                                        {opt.label}
                                    </span>
                                    <span
                                        className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${checked
                                            ? "border-[#4285F4] bg-[#4285F4]"
                                            : "border-white/30 bg-white/5"
                                            }`}
                                    >
                                        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </span>
                                </button>
                            );
                        })}
                        {q.allowOther && (() => {
                            const otherChecked = selectedValue === "__other__";
                            return (
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={otherChecked}
                                    onClick={() => {
                                        handleAnswerChange(q.id, "__other__");
                                    }}
                                    className={`p-3 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${q.options.length % 2 === 0 ? "sm:col-span-2" : ""
                                        } ${otherChecked
                                            ? "border-[#4285F4] bg-[#4285F4]/20 text-white shadow-[0_0_18px_rgba(66,133,244,0.25)] font-semibold"
                                            : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-zinc-200"
                                        }`}
                                >
                                    <span
                                        className={`text-xs sm:text-sm leading-snug ${otherChecked
                                            ? "text-white font-semibold"
                                            : "text-zinc-200 font-medium"
                                            }`}
                                    >
                                        {q.otherLabel || "Khác (vui lòng ghi rõ)"}
                                    </span>
                                    <span
                                        className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${otherChecked
                                            ? "border-[#4285F4] bg-[#4285F4]"
                                            : "border-white/30 bg-white/5"
                                            }`}
                                    >
                                        {otherChecked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </span>
                                </button>
                            );
                        })()}
                    </div>
                    {q.allowOther && selectedValue === "__other__" && (
                        <input
                            type="text"
                            placeholder="Nhập lựa chọn khác của bạn..."
                            value={form.otherTexts[q.id] || ""}
                            onChange={(e) => handleOtherTextChange(q.id, e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#4285F4]/50 bg-[#4285F4]/10 text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] placeholder:text-zinc-400"
                            autoFocus
                        />
                    )}
                    {hasError && (
                        <p className="text-xs text-red-400 font-semibold leading-relaxed flex items-center gap-1.5 pt-0.5">
                            <span className="text-sm leading-none">⚠️</span>
                            <span>{errors[errorKey]}</span>
                        </p>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <section id="apply" className="py-20 sm:py-28 bg-[#00092B] relative scroll-mt-20 overflow-hidden">
            {/* Seamless Cosmic Background matching Hero, About and Mission */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <Image
                    src="/blank.svg"
                    alt="Apply Background"
                    fill
                    unoptimized
                    className="object-cover object-center w-full h-full"
                    aria-hidden="true"
                />

                {/* Stardust Layers */}
                <div className="absolute inset-0 opacity-45 mix-blend-screen">
                    <Image
                        src="/dust1.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                </div>
                <div className="absolute inset-0 opacity-35 mix-blend-screen scale-110">
                    <Image
                        src="/dust2.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-cover object-center"
                        aria-hidden="true"
                    />
                </div>

                {/* Decorative Planet Accents */}
                {/* 1. Top-Left Planet (Planet 1 - Solar Amber Glow) */}
                <div className="absolute top-6 sm:top-12 -left-10 sm:-left-6 md:left-4 lg:left-12 xl:left-20 w-28 sm:w-36 md:w-48 aspect-square opacity-70 md:opacity-80 pointer-events-none animate-float drop-shadow-[0_0_35px_rgba(251,188,5,0.35)]">
                    <Image
                        src="/planet1.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* 2. Top-Right Planet (Planet 6 - Google Red / Magenta Celestial Body) */}
                <div className="absolute top-10 sm:top-16 -right-8 sm:right-2 md:right-8 lg:right-16 xl:right-24 w-24 sm:w-32 md:w-44 aspect-square opacity-65 md:opacity-75 pointer-events-none animate-planet-breathe drop-shadow-[0_0_30px_rgba(234,67,53,0.35)]">
                    <Image
                        src="/planet6.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* 3. Mid-Left Planet (Planet 5 - Google Green Emerald Planet) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 -left-12 sm:-left-8 md:left-2 lg:left-8 w-20 sm:w-28 md:w-36 aspect-square opacity-60 md:opacity-70 pointer-events-none animate-float drop-shadow-[0_0_30px_rgba(52,168,83,0.3)]"
                    style={{ animationDelay: "2s" }}
                >
                    <Image
                        src="/planet5.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* 4. Mid-Right Small Planet (Planet 3 / Cyan Moon) */}
                <div
                    className="absolute top-[60%] -right-6 sm:right-4 md:right-12 w-16 sm:w-24 aspect-square opacity-55 md:opacity-65 pointer-events-none animate-planet-breathe drop-shadow-[0_0_20px_rgba(66,133,244,0.3)]"
                    style={{ animationDelay: "1.5s" }}
                >
                    <Image
                        src="/planet3.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* 5. Bottom-Right Ring Planet (Planet 4 - Google Blue Saturn Planet) */}
                <div
                    className="absolute -bottom-10 sm:-bottom-16 -right-10 sm:-right-4 md:right-6 lg:right-14 xl:right-20 w-40 sm:w-56 md:w-72 aspect-square opacity-75 md:opacity-85 pointer-events-none animate-float drop-shadow-[0_0_40px_rgba(66,133,244,0.35)]"
                    style={{ animationDelay: "1s" }}
                >
                    <Image
                        src="/planet4.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* 6. Bottom-Left Minor Planet (Planet 2) */}
                <div
                    className="absolute -bottom-6 left-6 sm:left-16 md:left-24 w-16 sm:w-24 aspect-square opacity-50 md:opacity-60 pointer-events-none animate-planet-breathe drop-shadow-[0_0_20px_rgba(251,188,5,0.25)]"
                    style={{ animationDelay: "2.5s" }}
                >
                    <Image
                        src="/planet2.svg"
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* Sparkling 4-Point Stars Array */}
                <div className="absolute top-10 left-10 sm:left-24 w-4 sm:w-6 aspect-[136/205] opacity-60 pointer-events-none animate-pulse">
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute top-20 right-12 sm:right-32 w-5 sm:w-7 aspect-[136/205] opacity-70 pointer-events-none animate-pulse" style={{ animationDelay: "700ms" }}>
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute top-1/3 left-6 sm:left-16 w-3.5 sm:w-5 aspect-[136/205] opacity-50 pointer-events-none animate-pulse" style={{ animationDelay: "1.4s" }}>
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute top-1/2 right-8 sm:right-20 w-4.5 sm:w-6 aspect-[136/205] opacity-65 pointer-events-none animate-pulse" style={{ animationDelay: "2.1s" }}>
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute bottom-1/3 left-12 sm:left-28 w-4 sm:w-5 aspect-[136/205] opacity-55 pointer-events-none animate-pulse" style={{ animationDelay: "900ms" }}>
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute bottom-20 right-10 sm:right-28 w-5 sm:w-7 aspect-[136/205] opacity-65 pointer-events-none animate-pulse" style={{ animationDelay: "1.8s" }}>
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>
                <div className="absolute bottom-8 left-1/4 w-3.5 sm:w-4.5 aspect-[136/205] opacity-40 pointer-events-none animate-pulse" style={{ animationDelay: "2.6s" }}>
                    <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                </div>

                {/* Ambient Soft Google Color Glows */}
                <div className="absolute top-1/4 left-1/5 -translate-y-1/2 w-96 h-96 bg-[#4285F4]/15 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-1/5 -translate-y-1/2 w-96 h-96 bg-[#EA4335]/15 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#34A853]/15 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#FBBC05]/15 rounded-full blur-3xl" />

                {/* Continuous vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/35" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
                {/* Section Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs font-bold text-white tracking-wider backdrop-blur-md shadow-xs">
                        <span>Đăng ký ứng tuyển</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                        Gia nhập đại gia đình <span className="text-[#4285F4] drop-shadow-[0_2px_12px_rgba(66,133,244,0.5)]">GDG on Campus: PTIT</span>
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto font-normal leading-relaxed pt-1">
                        Hãy điền đầy đủ và chính xác thông tin dưới đây để ban điều hành có thể kết nối và trao đổi với bạn sớm nhất.
                    </p>
                </div>

                {!isOpen ? (
                    /* Closed or Not Open Window Notice */
                    <div className="relative rounded-3xl p-8 sm:p-12 bg-white/[0.04] border border-white/15 backdrop-blur-xl shadow-2xl text-center space-y-6 overflow-hidden">
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto text-2xl font-bold shadow-[0_0_25px_rgba(251,188,5,0.3)]">
                            ⏳
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                                {reason === "not_opened" ? "Đơn ứng tuyển chưa mở" : "Đơn ứng tuyển đã đóng"}
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-300 max-w-md mx-auto leading-relaxed">
                                {reason === "not_opened"
                                    ? `Cổng đăng ký sẽ chính thức mở vào ngày ${openAt.toLocaleDateString("vi-VN")}. Hãy theo dõi fanpage GDG on Campus: PTIT để không bỏ lỡ!`
                                    : `Thời hạn nhận đơn ứng tuyển Gen 5 đã kết thúc vào ngày ${closeAt.toLocaleDateString("vi-VN")}. Cảm ơn bạn đã quan tâm đến GDG on Campus: PTIT!`}
                            </p>
                        </div>
                        <div className="pt-2">
                            <a
                                href="https://facebook.com/gdsc.ptit"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                            >
                                <FacebookIcon className="w-4 h-4" />
                                <span>Theo dõi Fanpage GDG on Campus: PTIT</span>
                            </a>
                        </div>
                    </div>
                ) : submitResult?.success ? (
                    /* Enhanced Success Screen with Recruitment Roadmap */
                    <div className="relative rounded-3xl p-8 sm:p-12 bg-white/[0.04] border border-emerald-500/40 backdrop-blur-xl shadow-[0_0_60px_rgba(52,168,83,0.15)] space-y-8 animate-in zoom-in-95 duration-300 overflow-hidden">
                        {/* Decorative subtle stars in success card */}
                        <div className="absolute top-6 left-8 w-4 h-6 opacity-60 pointer-events-none animate-pulse">
                            <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                        </div>
                        <div className="absolute top-8 right-10 w-5 h-7 opacity-70 pointer-events-none animate-pulse" style={{ animationDelay: "1s" }}>
                            <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                        </div>
                        <div className="absolute bottom-6 right-12 w-3.5 h-5 opacity-40 pointer-events-none animate-pulse" style={{ animationDelay: "1.8s" }}>
                            <Image src="/Star 1.svg" alt="" fill unoptimized className="object-contain" aria-hidden="true" />
                        </div>

                        <div className="text-center space-y-3 relative z-10">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,168,83,0.35)]">
                                <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                                Nộp đơn ứng tuyển thành công!
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-300 max-w-lg mx-auto leading-relaxed">
                                Cảm ơn bạn đã nộp đơn ứng tuyển vào GDG on Campus: PTIT Gen 5. Ban điều hành đã tiếp nhận hồ sơ của bạn.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
                            {messengerGroupUrl && (
                                <a
                                    href={messengerGroupUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#0084FF] via-[#00A2FF] to-[#0078FF] hover:from-[#0074e0] hover:to-[#0068db] text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                                >
                                    <MessengerIcon className="w-4 h-4 shrink-0" />
                                    <span>Tham gia Group Messenger</span>
                                </a>
                            )}
                            <a
                                href="https://facebook.com/gdsc.ptit"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                            >
                                <FacebookIcon className="w-4 h-4 shrink-0" />
                                <span>Theo dõi kết quả tại Fanpage</span>
                            </a>
                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitResult(null);
                                    try {
                                        localStorage.removeItem(STORAGE_KEY);
                                        localStorage.removeItem(SUBMITTED_KEY);
                                    } catch (e) {
                                        console.warn("Could not clear draft and submission from localStorage:", e);
                                    }
                                    setForm({
                                        full_name: "",
                                        email: "",
                                        phone: "",
                                        facebook_url: "",
                                        student_year: "1",
                                        student_id: "",
                                        date_of_birth: "",
                                        university: defaultUniversity,
                                        department: departments[0]?.id ?? "tech",
                                        gender: "prefer_not_to_say",
                                        major: "",
                                        answers: buildDefaultAnswers(questions),
                                        otherTexts: buildDefaultOtherTexts(questions),
                                    });
                                }}
                                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-all text-center cursor-pointer"
                            >
                                Gửi đơn ứng tuyển khác
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Recruitment Form with Cosmic Dark Glassmorphism */
                    <>
                        {captchaEnabled && (
                            <Script
                                id={TURNSTILE_SCRIPT_ID}
                                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                                strategy="afterInteractive"
                                onLoad={() => setIsTurnstileReady(true)}
                            />
                        )}
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="relative rounded-2xl sm:rounded-3xl bg-white/[0.04] hover:bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-5 sm:p-8 md:p-10 space-y-8 sm:space-y-10 transition-all duration-300 overflow-hidden"
                        >

                        {submitResult && !submitResult.success && (
                            <div className="p-4 sm:p-5 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-sm font-medium space-y-3 shadow-lg shadow-red-950/40 animate-in fade-in-50 duration-200">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⚠️</span>
                                    <span className="font-semibold">{submitResult.message}</span>
                                </div>
                                {fallbackGoogleFormUrl && (
                                    <div className="pt-3 border-t border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <span className="text-red-300">
                                            Nếu sự cố vẫn tiếp diễn, bạn có thể nộp qua Google Form dự phòng:
                                        </span>
                                        <a
                                            href={fallbackGoogleFormUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-bold underline text-[#4285F4] hover:text-blue-300 inline-flex items-center gap-1 shrink-0"
                                        >
                                            <span>Mở Google Form dự phòng ↗</span>
                                        </a>
                                    </div>
                                )}

                            </div>
                        )}

                        {/* PART 1: Personal Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                <div className="w-8 h-8 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/40 text-[#4285F4] flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(66,133,244,0.3)]">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">
                                        Thông tin cá nhân
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        Thông tin liên hệ cơ bản để ban điều hành trao đổi với bạn.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div className="space-y-1.5" id={`${formId}-full_name`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Họ và tên <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        value={form.full_name}
                                        onChange={(e) => {
                                            setForm({ ...form, full_name: e.target.value });
                                            if (errors.full_name) {
                                                setErrors((prev) => {
                                                    const n = { ...prev };
                                                    delete n.full_name;
                                                    return n;
                                                });
                                            }
                                        }}
                                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 bg-white/[0.06] hover:bg-white/[0.09] text-white placeholder:text-zinc-500 ${errors.full_name
                                            ? "border-red-500/80 bg-red-950/20 focus:border-red-400 focus:ring-red-400/20"
                                            : "border-white/15 focus:border-[#4285F4]"
                                            }`}
                                    />
                                    {errors.full_name && (
                                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                                            <span className="text-sm leading-none">⚠️</span>
                                            <span>{errors.full_name}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5" id={`${formId}-email`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Email <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        value={form.email}
                                        onChange={(e) => {
                                            setForm({ ...form, email: e.target.value });
                                            if (errors.email) {
                                                setErrors((prev) => {
                                                    const n = { ...prev };
                                                    delete n.email;
                                                    return n;
                                                });
                                            }
                                        }}
                                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 bg-white/[0.06] hover:bg-white/[0.09] text-white placeholder:text-zinc-500 ${errors.email
                                            ? "border-red-500/80 bg-red-950/20 focus:border-red-400 focus:ring-red-400/20"
                                            : "border-white/15 focus:border-[#4285F4]"
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                                            <span className="text-sm leading-none">⚠️</span>
                                            <span>{errors.email}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5" id={`${formId}-phone`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Số điện thoại <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="0987654321"
                                        value={form.phone}
                                        onChange={(e) => {
                                            setForm({ ...form, phone: e.target.value });
                                            if (errors.phone) {
                                                setErrors((prev) => {
                                                    const n = { ...prev };
                                                    delete n.phone;
                                                    return n;
                                                });
                                            }
                                        }}
                                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 bg-white/[0.06] hover:bg-white/[0.09] text-white placeholder:text-zinc-500 ${errors.phone
                                            ? "border-red-500/80 bg-red-950/20 focus:border-red-400 focus:ring-red-400/20"
                                            : "border-white/15 focus:border-[#4285F4]"
                                            }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                                            <span className="text-sm leading-none">⚠️</span>
                                            <span>{errors.phone}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Facebook URL */}
                                <div className="space-y-1.5" id={`${formId}-facebook_url`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Link Facebook cá nhân <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="facebook.com/username"
                                        value={form.facebook_url}
                                        onChange={(e) => {
                                            setForm({ ...form, facebook_url: e.target.value });
                                            if (errors.facebook_url) {
                                                setErrors((prev) => {
                                                    const n = { ...prev };
                                                    delete n.facebook_url;
                                                    return n;
                                                });
                                            }
                                        }}
                                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 bg-white/[0.06] hover:bg-white/[0.09] text-white placeholder:text-zinc-500 ${errors.facebook_url
                                            ? "border-red-500/80 bg-red-950/20 focus:border-red-400 focus:ring-red-400/20"
                                            : "border-white/15 focus:border-[#4285F4]"
                                            }`}
                                    />
                                    {errors.facebook_url && (
                                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                                            <span className="text-sm leading-none">⚠️</span>
                                            <span>{errors.facebook_url}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-1.5" id={`${formId}-date_of_birth`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Ngày sinh <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={form.date_of_birth}
                                        onChange={(e) => {
                                            setForm({ ...form, date_of_birth: e.target.value });
                                            if (errors.date_of_birth) {
                                                setErrors((prev) => {
                                                    const n = { ...prev };
                                                    delete n.date_of_birth;
                                                    return n;
                                                });
                                            }
                                        }}
                                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 bg-white/[0.06] hover:bg-white/[0.09] text-white [color-scheme:dark] ${errors.date_of_birth
                                            ? "border-red-500/80 bg-red-950/20 focus:border-red-400 focus:ring-red-400/20"
                                            : "border-white/15 focus:border-[#4285F4]"
                                            }`}
                                    />
                                    {errors.date_of_birth && (
                                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                                            <span className="text-sm leading-none">⚠️</span>
                                            <span>{errors.date_of_birth}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div className="space-y-1.5" id={`${formId}-gender`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Giới tính <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <select
                                        value={form.gender}
                                        onChange={(e) => setForm({ ...form, gender: e.target.value as FormState["gender"] })}
                                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] bg-white/[0.06] hover:bg-white/[0.09] text-white [color-scheme:dark]"
                                    >
                                        <option value="male" className="bg-[#00092B] text-white">Nam</option>
                                        <option value="female" className="bg-[#00092B] text-white">Nữ</option>
                                        <option value="other" className="bg-[#00092B] text-white">Khác</option>
                                        <option value="prefer_not_to_say" className="bg-[#00092B] text-white">Không muốn tiết lộ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* PART 2: Academic Info & Department Selection */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                <div className="w-8 h-8 rounded-full bg-[#EA4335]/20 border border-[#EA4335]/40 text-[#EA4335] flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(234,67,53,0.3)]">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">
                                        Thông tin học tập & Ban ứng tuyển
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        Lựa chọn ban chuyên môn phù hợp nhất với định hướng của bạn.
                                    </p>
                                </div>
                            </div>

                            {/* Department Interactive Visual Radio Cards */}
                            <div className="space-y-2.5" id={`${formId}-department`}>
                                <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                    Chọn Ban chuyên môn ứng tuyển <span className="text-[#EA4335]">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Ban chuyên môn">
                                    {departments.map((dept) => {
                                        const isDeptObj = "name" in dept;
                                        const isSelected = form.department === dept.id;
                                        const deptTitle = isDeptObj ? (dept as Department).name : dept.label;
                                        const deptTag = isDeptObj ? (dept as Department).tag : "";
                                        const deptMascot = (isDeptObj && (dept as Department).svgImage)
                                            ? (dept as Department).svgImage
                                            : dept.id === "tech"
                                                ? "/tech.svg"
                                                : dept.id === "design"
                                                    ? "/design.svg"
                                                    : dept.id === "pr"
                                                        ? "/pr.svg"
                                                        : dept.id === "hr-lg"
                                                            ? "/hr.svg"
                                                            : "/logo.svg";

                                        return (
                                            <button
                                                type="button"
                                                role="radio"
                                                aria-checked={isSelected}
                                                key={dept.id}
                                                onClick={() => {
                                                    setForm({ ...form, department: dept.id });
                                                    if (errors.department) {
                                                        setErrors((prev) => {
                                                            const n = { ...prev };
                                                            delete n.department;
                                                            return n;
                                                        });
                                                    }
                                                }}
                                                className={`group p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${getDepartmentCardStyle(dept.id, isSelected)}`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                                                        <Image
                                                            src={deptMascot}
                                                            alt={deptTitle}
                                                            width={56}
                                                            height={56}
                                                            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold leading-tight text-white">
                                                            {deptTitle}
                                                        </p>
                                                        {deptTag && (
                                                            <span className="text-[11px] text-zinc-400 font-medium">
                                                                {deptTag}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <span
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${getDepartmentRadioDotStyle(dept.id, isSelected)}`}
                                                >
                                                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.department && (
                                    <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                                        <span className="text-sm leading-none">⚠️</span>
                                        <span>{errors.department}</span>
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                {/* University */}
                                <div className="space-y-1.5 sm:col-span-2" id={`${formId}-university`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Trường <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.university}
                                        onChange={(e) => setForm({ ...form, university: e.target.value })}
                                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] bg-white/[0.06] hover:bg-white/[0.09] text-white placeholder:text-zinc-500"
                                    />
                                    {errors.university && (
                                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                                            <span className="text-sm leading-none">⚠️</span>
                                            <span>{errors.university}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Student ID */}
                                <div className="space-y-1.5" id={`${formId}-student_id`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Mã sinh viên <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="B23DCCN000"
                                        value={form.student_id}
                                        onChange={(e) => {
                                            setForm({ ...form, student_id: e.target.value.toUpperCase() });
                                            if (errors.student_id) {
                                                setErrors((prev) => {
                                                    const n = { ...prev };
                                                    delete n.student_id;
                                                    return n;
                                                });
                                            }
                                        }}
                                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm uppercase transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 bg-white/[0.06] hover:bg-white/[0.09] text-white placeholder:text-zinc-500 ${errors.student_id
                                            ? "border-red-500/80 bg-red-950/20 focus:border-red-400 focus:ring-red-400/20"
                                            : "border-white/15 focus:border-[#4285F4]"
                                            }`}
                                    />
                                    {errors.student_id && (
                                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                                            <span className="text-sm leading-none">⚠️</span>
                                            <span>{errors.student_id}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Student Year */}
                                <div className="space-y-1.5" id={`${formId}-student_year`}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Sinh viên năm <span className="text-[#EA4335]">*</span>
                                    </label>
                                    <select
                                        value={form.student_year}
                                        onChange={(e) => setForm({ ...form, student_year: e.target.value })}
                                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] bg-white/[0.06] hover:bg-white/[0.09] text-white [color-scheme:dark]"
                                    >
                                        <option value="1" className="bg-[#00092B] text-white">Năm 1</option>
                                        <option value="2" className="bg-[#00092B] text-white">Năm 2</option>
                                        <option value="3" className="bg-[#00092B] text-white">Năm 3</option>
                                        <option value="4" className="bg-[#00092B] text-white">Năm 4</option>
                                        <option value="5" className="bg-[#00092B] text-white">Năm 5 / Khác</option>
                                    </select>
                                </div>

                                {/* Major Input with Autocomplete Suggestions */}
                                <div className="space-y-1.5 sm:col-span-2 relative" id={`${formId}-major`} ref={majorContainerRef}>
                                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300">
                                        Ngành học <span className="text-[#EA4335]">*</span>
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Ngành đang theo học (VD: Công nghệ thông tin, Thiết kế đồ họa, Marketing...)"
                                            value={form.major}
                                            onFocus={() => {
                                                if (form.major.trim().length > 0) setIsMajorOpen(true);
                                            }}
                                            onChange={(e) => {
                                                setForm((prev) => ({ ...prev, major: e.target.value }));
                                                setIsMajorOpen(true);
                                                if (errors.major) {
                                                    setErrors((prev) => {
                                                        const n = { ...prev };
                                                        delete n.major;
                                                        return n;
                                                    });
                                                }
                                            }}
                                            className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 bg-white/[0.06] hover:bg-white/[0.09] text-white placeholder:text-zinc-500 ${errors.major
                                                ? "border-red-500/80 bg-red-950/20 focus:border-red-400 focus:ring-red-400/20"
                                                : "border-white/15 focus:border-[#4285F4]"
                                                } ${form.major ? "pr-10" : ""}`}
                                        />

                                        {form.major && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setForm((prev) => ({ ...prev, major: "" }));
                                                    setIsMajorOpen(false);
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white rounded-full transition-colors cursor-pointer"
                                                aria-label="Xóa nội dung"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Suggestions List */}
                                    {isMajorOpen && form.major.trim().length > 0 && filteredMajors.length > 0 && (
                                        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#00092B]/95 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-56 overflow-y-auto divide-y divide-white/10 animate-in fade-in-50 zoom-in-98 duration-150">
                                            {filteredMajors.map((m) => {
                                                const isSelected = form.major.trim().toLowerCase() === m.label.toLowerCase();
                                                return (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setForm((prev) => ({ ...prev, major: m.label }));
                                                            setIsMajorOpen(false);
                                                            if (errors.major) {
                                                                setErrors((prev) => {
                                                                    const n = { ...prev };
                                                                    delete n.major;
                                                                    return n;
                                                                });
                                                            }
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-[#4285F4]/20 transition-colors cursor-pointer ${isSelected ? "bg-[#4285F4]/30 font-bold text-[#4285F4]" : "text-zinc-200"
                                                            }`}
                                                    >
                                                        <span className="leading-snug">{m.label}</span>
                                                        {isSelected && <span className="text-[#4285F4] font-bold text-xs shrink-0 ml-2">✓</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {errors.major && (
                                        <p className="text-xs text-red-400 font-semibold leading-relaxed flex items-center gap-1.5 pt-0.5">
                                            <span className="text-sm leading-none">⚠️</span>
                                            <span>{errors.major}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* PART 3: Dynamic Questions with Live Dynamic Character Counters */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                <div className="w-8 h-8 rounded-full bg-[#FBBC05]/20 border border-[#FBBC05]/40 text-[#FBBC05] flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(251,188,5,0.3)]">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">
                                        Câu hỏi ứng tuyển
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        Hãy chia sẻ chân thành để câu lạc bộ hiểu rõ hơn về bạn.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {commonQuestions.length > 0 && (
                                    <div className="space-y-6">
                                        {commonQuestions.map((q) => renderQuestionField(q))}
                                    </div>
                                )}

                                {regularDeptQuestions.length > 0 && (
                                    <div className={`space-y-6 ${commonQuestions.length > 0 ? "pt-6 border-t border-white/10" : ""}`}>
                                        {regularDeptQuestions.map((q) => renderQuestionField(q))}
                                    </div>
                                )}

                                {/* Sub-Tech Lead (Web) Special Recruitment Feature */}
                                {isSubTechLeadEligible && subTechLeadQuestions.length > 0 && (
                                    <div
                                        id={`${formId}-sub-tech-lead-section`}
                                        className="rounded-2xl sm:rounded-3xl border border-[#4285F4]/40 bg-gradient-to-br from-[#4285F4]/15 via-white/[0.03] to-[#4285F4]/5 p-5 sm:p-7 space-y-6 shadow-[0_0_30px_rgba(66,133,244,0.15)] relative overflow-hidden backdrop-blur-md transition-all duration-300 animate-in fade-in-50"
                                    >
                                        {/* Subtle background glow */}
                                        <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

                                        {/* Header */}
                                        <div className="space-y-2 pb-4 border-b border-blue-400/20 relative z-10">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/40 text-[#4285F4] text-[11px] font-bold tracking-wider">
                                                <span>✨ Vị trí đặc biệt</span>
                                            </div>
                                            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                                Ứng tuyển Sub-Tech Lead (Web)
                                            </h4>
                                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                                                GDG on Campus: PTIT mở cơ hội tuyển chọn <strong>Sub-Tech Lead mảng Web</strong> dành cho sinh viên có năng lực chuyên môn tốt, đam mê xây dựng sản phẩm và mong muốn dẫn dắt, định hướng kỹ thuật cho các dự án & thành viên trong CLB.
                                            </p>
                                        </div>

                                        {/* Sub-Tech Lead Questions */}
                                        <div className="space-y-6 relative z-10">
                                            {subTechLeadQuestions.map((q) => renderQuestionField(q))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submission Error Alert with Fallback Google Form */}
                        {submitResult && !submitResult.success && (
                            <div className="p-4 sm:p-5 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-sm font-medium space-y-3 shadow-lg shadow-red-950/40 animate-in fade-in-50 duration-200">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⚠️</span>
                                    <span className="font-semibold">{submitResult.message}</span>
                                </div>
                                {fallbackGoogleFormUrl && (
                                    <div className="pt-3 border-t border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <span className="text-red-300">
                                            Nếu sự cố vẫn tiếp diễn, bạn có thể nộp qua Google Form dự phòng:
                                        </span>
                                        <a
                                            href={fallbackGoogleFormUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-bold underline text-[#4285F4] hover:text-blue-300 inline-flex items-center gap-1 shrink-0"
                                        >
                                            <span>Mở Google Form dự phòng ↗</span>
                                        </a>
                                    </div>
                                )}

                                {captchaEnabled && (
                                    <div className="space-y-2">
                                        <div ref={turnstileContainerRef} className="min-h-[65px]" />
                                        {captchaError && (
                                            <p className="text-xs text-red-400 font-semibold leading-relaxed flex items-center gap-1.5">
                                                <span className="text-sm leading-none">⚠️</span>
                                                <span>{captchaError}</span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                                <ShieldCheckIcon className="w-4 h-4 text-[#34A853] shrink-0" />
                                <span>Thông tin của bạn được bảo mật tuyệt đối theo chính sách GDG on Campus.</span>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-[#4285F4] via-[#3b78e7] to-[#1a73e8] hover:from-[#3367D6] hover:to-[#174ea6] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(66,133,244,0.45)] hover:shadow-[0_0_35px_rgba(66,133,244,0.65)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Đang gửi đơn ứng tuyển...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Gửi đơn ứng tuyển</span>
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                        </form>
                    </>
                )}
            </div>
        </section>
    );
}
