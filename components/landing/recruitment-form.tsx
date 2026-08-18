"use client";

import { useState, useEffect, useRef, FormEvent, useId } from "react";
import type { Option, Question } from "@/types/config";
import {
    CheckCircleIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    CodeIcon,
    PaletteIcon,
    MegaphoneIcon,
    UsersIcon,
    FacebookIcon,
} from "./google-icons";

type RecruitmentFormProps = {
    departments: Option[];
    majors: Option[];
    questions: Question[];
    isOpen: boolean;
    reason: "not_opened" | "closed" | null;
    openAt: Date;
    closeAt: Date;
    fallbackGoogleFormUrl?: string;
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
};

const departmentMeta: Record<
    string,
    {
        name: string;
        short: string;
        tag: string;
        activeBorder: string;
        activeBg: string;
        activeText: string;
        iconBg: string;
        icon: typeof CodeIcon;
    }
> = {
    tech: {
        name: "Ban Chuyên Môn",
        short: "Technical",
        tag: "Engineering & AI",
        activeBorder: "border-[#4285F4]",
        activeBg: "bg-blue-50/70",
        activeText: "text-[#4285F4]",
        iconBg: "bg-[#4285F4]",
        icon: CodeIcon,
    },
    design: {
        name: "Ban Thiết Kế",
        short: "Design",
        tag: "UI/UX & Visual Art",
        activeBorder: "border-[#EA4335]",
        activeBg: "bg-red-50/70",
        activeText: "text-[#EA4335]",
        iconBg: "bg-[#EA4335]",
        icon: PaletteIcon,
    },
    pr: {
        name: "Ban Truyền Thông",
        short: "PR",
        tag: "Media & Branding",
        activeBorder: "border-[#FBBC05]",
        activeBg: "bg-amber-50/70",
        activeText: "text-[#B06000]",
        iconBg: "bg-[#F29900]",
        icon: MegaphoneIcon,
    },
    "hr-lg": {
        name: "Ban Nhân Sự & Hậu Cần",
        short: "HR-LG",
        tag: "People & Operations",
        activeBorder: "border-[#34A853]",
        activeBg: "bg-emerald-50/70",
        activeText: "text-[#34A853]",
        iconBg: "bg-[#34A853]",
        icon: UsersIcon,
    },
};

export function RecruitmentForm({
    departments,
    majors,
    questions,
    isOpen,
    reason,
    openAt,
    closeAt,
    fallbackGoogleFormUrl,
}: RecruitmentFormProps) {
    const defaultUniversity = "Học viện Công nghệ Bưu chính Viễn thông";
    const formId = useId();

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
        setForm((prev) => ({
            ...prev,
            answers: {
                ...prev.answers,
                [questionId]: value,
            },
        }));
        if (errors[`answers.${questionId}`]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[`answers.${questionId}`];
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

        if (!form.student_id.trim()) newErrors.student_id = "Vui lòng nhập mã số sinh viên (ví dụ: B23DCCN001)";
        if (!form.date_of_birth) newErrors.date_of_birth = "Vui lòng chọn ngày sinh";
        if (!form.university.trim()) newErrors.university = "Vui lòng nhập tên trường";
        if (!form.department) newErrors.department = "Vui lòng chọn ban chuyên môn ứng tuyển";
        if (!form.major || !form.major.trim()) newErrors.major = "Vui lòng nhập hoặc chọn ngành học";

        // Dynamic Questions validation
        questions.forEach((q) => {
            const val = form.answers[q.id];
            const isEmpty =
                val === undefined ||
                val === null ||
                (typeof val === "string" && val.trim() === "") ||
                (Array.isArray(val) && val.length === 0);

            if (q.required && isEmpty) {
                newErrors[`answers.${q.id}`] = "Vui lòng hoàn thành câu hỏi này";
                return;
            }

            if (isEmpty) return;

            if (q.type === "essay" && typeof val === "string") {
                const len = val.trim().length;
                if (q.minLength && len < q.minLength) {
                    newErrors[`answers.${q.id}`] = `Câu trả lời cần tối thiểu ${q.minLength} ký tự (hiện có ${len})`;
                }
                if (q.maxLength && len > q.maxLength) {
                    newErrors[`answers.${q.id}`] = `Câu trả lời vượt quá tối đa ${q.maxLength} ký tự`;
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

        setSubmitting(true);

        try {
            const answersArray = questions.map((q) => ({
                question_id: q.id,
                value: form.answers[q.id] ?? (q.type === "multiple_choice" && q.multiple ? [] : ""),
            }));

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
            };

            const res = await fetch("/api/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                return;
            }

            // Success!
            setSubmitResult({
                success: true,
                applicationId: data.data?.id,
                message: "Đơn ứng tuyển của bạn đã được gửi thành công đến GDGoC PTIT!",
            });
        } catch (err) {
            console.error("Submission failed:", err);
            setSubmitResult({
                success: false,
                message: "Đã xảy ra sự cố kết nối. Vui lòng thử lại sau.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="apply" className="py-20 sm:py-28 bg-gradient-to-b from-white via-zinc-50 to-white relative scroll-mt-20">
            {/* Background accent */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/30 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
                {/* Section Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#4285F4] uppercase tracking-wider">
                        Đăng ký ứng tuyển • Recruitment Form
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        Gia nhập đại gia đình GDGoC PTIT Gen 5
                    </h2>
                    <p className="text-base text-zinc-600 max-w-xl mx-auto font-normal">
                        Hãy điền đầy đủ và chính xác thông tin dưới đây để ban điều hành có thể kết nối và trao đổi với bạn sớm nhất.
                    </p>
                </div>

                {!isOpen ? (
                    /* Closed or Not Open Window Notice */
                    <div className="rounded-3xl p-8 sm:p-12 bg-white border border-zinc-200 shadow-xl text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold">
                            ⏳
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-zinc-900">
                                {reason === "not_opened" ? "Đơn ứng tuyển chưa mở" : "Đơn ứng tuyển đã đóng"}
                            </h3>
                            <p className="text-sm text-zinc-600 max-w-md mx-auto">
                                {reason === "not_opened"
                                    ? `Cổng đăng ký sẽ chính thức mở vào ngày ${openAt.toLocaleDateString("vi-VN")}. Hãy theo dõi fanpage GDGoC PTIT để không bỏ lỡ!`
                                    : `Thời hạn nhận đơn ứng tuyển Gen 5 đã kết thúc vào ngày ${closeAt.toLocaleDateString("vi-VN")}. Cảm ơn bạn đã quan tâm đến GDGoC PTIT!`}
                            </p>
                        </div>
                        <div className="pt-2">
                            <a
                                href="https://facebook.com/gdgoc.ptit"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4285F4] text-white font-semibold text-sm hover:bg-[#3367D6] transition-colors"
                            >
                                <FacebookIcon className="w-4 h-4" />
                                <span>Theo dõi Fanpage GDGoC PTIT</span>
                            </a>
                        </div>
                    </div>
                ) : submitResult?.success ? (
                    /* Enhanced Success Screen with Recruitment Roadmap */
                    <div className="rounded-3xl p-8 sm:p-12 bg-white border border-emerald-200 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                                <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                                Nộp đơn ứng tuyển thành công!
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 max-w-lg mx-auto">
                                Chúc mừng bạn đã hoàn thành đơn ứng tuyển vào GDGoC PTIT Gen 5. Ban điều hành đã tiếp nhận hồ sơ của bạn.
                            </p>
                        </div>

                        {/* Recruitment Process Roadmap */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider text-center sm:text-left">
                                🚀 Các bước tiếp theo trong quy trình tuyển dụng:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#4285F4]">
                                        <span className="w-5 h-5 rounded-full bg-[#4285F4] text-white flex items-center justify-center text-[10px]">1</span>
                                        <span>Vòng 1: Xét hồ sơ</span>
                                    </div>
                                    <p className="text-xs text-zinc-600">
                                        Ban chủ nhiệm sẽ đánh giá chi tiết đơn đăng ký và câu trả lời chuyên sâu.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#B06000]">
                                        <span className="w-5 h-5 rounded-full bg-[#FBBC05] text-white flex items-center justify-center text-[10px]">2</span>
                                        <span>Vòng 2: Phỏng vấn</span>
                                    </div>
                                    <p className="text-xs text-zinc-600">
                                        Trao đổi trực tiếp, kiểm tra kỹ năng và độ phù hợp văn hóa CLB.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#34A853]">
                                        <span className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center text-[10px]">3</span>
                                        <span>Vòng 3: Onboarding</span>
                                    </div>
                                    <p className="text-xs text-zinc-600">
                                        Công bố danh sách trúng tuyển và tham gia buổi gặp mặt thành viên Gen 5.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://facebook.com/gdgoc.ptit"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-sm shadow-md transition-all"
                            >
                                <FacebookIcon className="w-4 h-4" />
                                <span>Theo dõi kết quả tại Fanpage</span>
                            </a>
                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitResult(null);
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
                                    });
                                }}
                                className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-sm transition-colors text-center"
                            >
                                Gửi đơn ứng tuyển khác
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Recruitment Form */
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 shadow-2xl shadow-zinc-900/5 p-4 sm:p-8 md:p-10 space-y-8 sm:space-y-10"
                    >
                        {submitResult && !submitResult.success && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⚠️</span>
                                    <span>{submitResult.message}</span>
                                </div>
                                {fallbackGoogleFormUrl && (
                                    <div className="pt-2 border-t border-red-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <span className="text-red-800">
                                            Nếu sự cố vẫn tiếp diễn, bạn có thể nộp qua Google Form dự phòng:
                                        </span>
                                        <a
                                            href={fallbackGoogleFormUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-bold underline text-[#4285F4] hover:text-blue-800 inline-flex items-center gap-1"
                                        >
                                            <span>Mở Google Form dự phòng ↗</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PART 1: Personal Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#4285F4] flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900">
                                        Thông tin cá nhân
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Thông tin liên hệ cơ bản để ban điều hành trao đổi với bạn.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div className="space-y-1.5" id={`${formId}-full_name`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Họ và tên <span className="text-red-500">*</span>
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
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.full_name ? "border-red-500 bg-red-50/20" : "border-zinc-200 focus:border-blue-500"
                                            }`}
                                    />
                                    {errors.full_name && <p className="text-xs text-red-600 font-medium">{errors.full_name}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5" id={`${formId}-email`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Email (Gmail / PTIT Mail) <span className="text-red-500">*</span>
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
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.email ? "border-red-500 bg-red-50/20" : "border-zinc-200 focus:border-blue-500"
                                            }`}
                                    />
                                    {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5" id={`${formId}-phone`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Số điện thoại <span className="text-red-500">*</span>
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
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.phone ? "border-red-500 bg-red-50/20" : "border-zinc-200 focus:border-blue-500"
                                            }`}
                                    />
                                    {errors.phone && <p className="text-xs text-red-600 font-medium">{errors.phone}</p>}
                                </div>

                                {/* Facebook URL */}
                                <div className="space-y-1.5" id={`${formId}-facebook_url`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Link Facebook cá nhân <span className="text-red-500">*</span>
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
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.facebook_url ? "border-red-500 bg-red-50/20" : "border-zinc-200 focus:border-blue-500"
                                            }`}
                                    />
                                    {errors.facebook_url && <p className="text-xs text-red-600 font-medium">{errors.facebook_url}</p>}
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-1.5" id={`${formId}-date_of_birth`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Ngày sinh <span className="text-red-500">*</span>
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
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.date_of_birth ? "border-red-500 bg-red-50/20" : "border-zinc-200 focus:border-blue-500"
                                            }`}
                                    />
                                    {errors.date_of_birth && <p className="text-xs text-red-600 font-medium">{errors.date_of_birth}</p>}
                                </div>

                                {/* Gender */}
                                <div className="space-y-1.5" id={`${formId}-gender`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Giới tính <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.gender}
                                        onChange={(e) => setForm({ ...form, gender: e.target.value as FormState["gender"] })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                    >
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                        <option value="prefer_not_to_say">Không muốn tiết lộ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* PART 2: Academic Info & Department Selection */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 text-[#EA4335] flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900">
                                        Thông tin học tập & Ban ứng tuyển
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Lựa chọn ban chuyên môn phù hợp nhất với định hướng của bạn.
                                    </p>
                                </div>
                            </div>

                            {/* Department Interactive Visual Radio Cards */}
                            <div className="space-y-2.5" id={`${formId}-department`}>
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                    Chọn Ban chuyên môn ứng tuyển <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Ban chuyên môn">
                                    {departments.map((dept) => {
                                        const meta = departmentMeta[dept.id] || {
                                            name: dept.label,
                                            short: dept.id,
                                            tag: "Department",
                                            activeBorder: "border-[#4285F4]",
                                            activeBg: "bg-blue-50/70",
                                            activeText: "text-[#4285F4]",
                                            iconBg: "bg-[#4285F4]",
                                            icon: CodeIcon,
                                        };
                                        const IconComp = meta.icon;
                                        const isSelected = form.department === dept.id;

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
                                                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${isSelected
                                                    ? `${meta.activeBorder} ${meta.activeBg} shadow-sm border-2`
                                                    : "border-zinc-200/90 bg-white hover:bg-zinc-50/80 hover:border-zinc-300"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl ${meta.iconBg} text-white flex items-center justify-center shadow-xs shrink-0`}>
                                                        <IconComp className="w-4.5 h-4.5" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-bold leading-tight ${isSelected ? meta.activeText : "text-zinc-900"}`}>
                                                            {dept.label}
                                                        </p>
                                                        <span className="text-[11px] text-zinc-500 font-medium">
                                                            {meta.tag}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected
                                                        ? `${meta.iconBg} border-transparent text-white`
                                                        : "border-zinc-300 bg-white"
                                                        }`}
                                                >
                                                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.department && <p className="text-xs text-red-600 font-medium">{errors.department}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                {/* University */}
                                <div className="space-y-1.5 sm:col-span-2" id={`${formId}-university`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Trường <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.university}
                                        onChange={(e) => setForm({ ...form, university: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    {errors.university && <p className="text-xs text-red-600 font-medium">{errors.university}</p>}
                                </div>

                                {/* Student ID */}
                                <div className="space-y-1.5" id={`${formId}-student_id`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Mã sinh viên <span className="text-red-500">*</span>
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
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm uppercase transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.student_id ? "border-red-500 bg-red-50/20" : "border-zinc-200 focus:border-blue-500"
                                            }`}
                                    />
                                    {errors.student_id && <p className="text-xs text-red-600 font-medium">{errors.student_id}</p>}
                                </div>

                                {/* Student Year */}
                                <div className="space-y-1.5" id={`${formId}-student_year`}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Sinh viên năm <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.student_year}
                                        onChange={(e) => setForm({ ...form, student_year: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                    >
                                        <option value="1">Năm 1</option>
                                        <option value="2">Năm 2</option>
                                        <option value="3">Năm 3</option>
                                        <option value="4">Năm 4</option>
                                        <option value="5">Năm 5 / Khác</option>
                                    </select>
                                </div>

                                {/* Major Input with Autocomplete Suggestions */}
                                <div className="space-y-1.5 sm:col-span-2 relative" id={`${formId}-major`} ref={majorContainerRef}>
                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                        Ngành học <span className="text-red-500">*</span>
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
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white ${errors.major ? "border-red-500 bg-red-50/20" : "border-zinc-200 focus:border-blue-500"
                                                } ${form.major ? "pr-10" : ""}`}
                                        />

                                        {form.major && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setForm((prev) => ({ ...prev, major: "" }));
                                                    setIsMajorOpen(false);
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 rounded-full transition-colors cursor-pointer"
                                                aria-label="Xóa nội dung"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Clean Suggestions List (Only pops up when user types and matching items exist) */}
                                    {isMajorOpen && form.major.trim().length > 0 && filteredMajors.length > 0 && (
                                        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-zinc-200/90 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-zinc-100 animate-in fade-in-50 zoom-in-98 duration-150">
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
                                                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-blue-50/70 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/90 font-bold text-[#4285F4]" : "text-zinc-800"
                                                            }`}
                                                    >
                                                        <span className="leading-snug">{m.label}</span>
                                                        {isSelected && <span className="text-[#4285F4] font-bold text-xs shrink-0 ml-2">✓</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {errors.major && <p className="text-xs text-red-600 font-medium leading-relaxed">{errors.major}</p>}
                                </div>
                            </div>
                        </div>

                        {/* PART 3: Dynamic Questions with Live Dynamic Character Counters */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-[#FBBC05] flex items-center justify-center font-bold text-sm">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900">
                                        Câu hỏi chuyên sâu & Động lực
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Hãy chia sẻ chân thành để câu lạc bộ hiểu rõ hơn về bạn.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {questions.map((q) => {
                                    const errorKey = `answers.${q.id}`;
                                    const hasError = !!errors[errorKey];

                                    if (q.type === "essay") {
                                        const currentText = (form.answers[q.id] as string) || "";
                                        const currentLen = currentText.trim().length;
                                        const minReq = q.minLength ?? 0;
                                        const maxReq = q.maxLength ?? 1000;
                                        const isMet = currentLen >= minReq;
                                        const isExceeded = currentLen > maxReq;

                                        return (
                                            <div key={q.id} className="space-y-2" id={`${formId}-${errorKey}`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider leading-snug">
                                                        {q.label} {q.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    <span
                                                        className={`self-start sm:self-auto shrink-0 text-[11px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full border whitespace-nowrap transition-colors ${isExceeded
                                                            ? "bg-red-50 text-red-700 border-red-200 font-bold"
                                                            : isMet
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                                                                : "bg-zinc-100 text-zinc-600 border-zinc-200"
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
                                                    className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${hasError ? "border-red-500 bg-red-50/20" : "border-zinc-200 focus:border-blue-500"
                                                        }`}
                                                />

                                                {hasError ? (
                                                    <p className="text-xs text-red-600 font-medium leading-relaxed">{errors[errorKey]}</p>
                                                ) : currentLen > 0 && minReq > 0 && !isMet ? (
                                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                                        ⚠️ Cần thêm {minReq - currentLen} ký tự nữa để đạt chuẩn ({minReq} ký tự).
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
                                                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider leading-snug">
                                                        {q.label} {q.required && <span className="text-red-500">*</span>}{" "}
                                                        <span className="text-[11px] font-normal lowercase text-zinc-500">(chọn một hoặc nhiều)</span>
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
                                                                        ? "border-[#4285F4] bg-blue-50/70 text-[#4285F4] shadow-xs font-semibold"
                                                                        : "border-zinc-200 bg-white hover:bg-zinc-50/80 text-zinc-700"
                                                                        }`}
                                                                >
                                                                    <span className={`text-xs sm:text-sm leading-snug break-words ${checked ? "text-[#4285F4] font-semibold" : "text-zinc-800 font-medium"}`}>
                                                                        {opt.label}
                                                                    </span>
                                                                    <span
                                                                        className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center text-xs shrink-0 transition-colors ${checked ? "bg-[#4285F4] border-[#4285F4] text-white" : "border-zinc-300 bg-white"
                                                                            }`}
                                                                    >
                                                                        {checked && "✓"}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {hasError && <p className="text-xs text-red-600 font-medium leading-relaxed">{errors[errorKey]}</p>}
                                                </div>
                                            );
                                        }

                                        // Single Choice
                                        const selectedValue = (form.answers[q.id] as string) || "";
                                        return (
                                            <div key={q.id} className="space-y-2.5" id={`${formId}-${errorKey}`}>
                                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider leading-snug">
                                                    {q.label} {q.required && <span className="text-red-500">*</span>}
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3" role="radiogroup">
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
                                                                    ? "border-[#34A853] bg-emerald-50/70 text-[#34A853] shadow-xs font-semibold"
                                                                    : "border-zinc-200 bg-white hover:bg-zinc-50/80 text-zinc-700"
                                                                    }`}
                                                            >
                                                                <span className={`text-xs sm:text-sm leading-snug break-words ${checked ? "text-[#34A853] font-semibold" : "text-zinc-800 font-medium"}`}>
                                                                    {opt.label}
                                                                </span>
                                                                <span
                                                                    className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${checked ? "border-[#34A853] bg-[#34A853]" : "border-zinc-300 bg-white"
                                                                        }`}
                                                                >
                                                                    {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {hasError && <p className="text-xs text-red-600 font-medium leading-relaxed">{errors[errorKey]}</p>}
                                            </div>
                                        );
                                    }

                                    return null;
                                })}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                                <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Thông tin của bạn được bảo mật tuyệt đối theo chính sách GDGoC.</span>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
                )}

                {/* Dedicated Fallback Google Form Banner */}
                {fallbackGoogleFormUrl && (
                    <div className="rounded-2xl p-5 bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#4285F4] flex items-center justify-center font-bold text-lg shrink-0">
                                📋
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-zinc-900">
                                    Nộp qua Google Form dự phòng
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Nếu bạn gặp sự cố kỹ thuật trên website, hãy sử dụng biểu mẫu Google Form chính thức.
                                </p>
                            </div>
                        </div>

                        <a
                            href={fallbackGoogleFormUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-50 border border-blue-200 text-[#4285F4] font-semibold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all shrink-0"
                        >
                            <span>Mở Google Form dự phòng</span>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
