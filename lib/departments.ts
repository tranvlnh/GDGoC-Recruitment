import React from "react";
import type { Department, DepartmentColorPreset } from "@/types/config";
import {
    CodeIcon,
    PaletteIcon,
    MegaphoneIcon,
    UsersIcon,
    SparklesIcon,
    RocketIcon,
    TargetIcon,
    ShieldCheckIcon,
} from "@/components/landing/google-icons";

export interface DepartmentTheme {
    themeColor: string;
    accentBorder: string;
    accentBadge: string;
    accentText: string;
    hoverShadow: string;
    buttonClass: string;
    activeBorder: string;
    activeBg: string;
    activeText: string;
    iconBg: string;
    badgeClass: string;
}

export const DEPARTMENT_THEMES: Record<DepartmentColorPreset, DepartmentTheme> = {
    blue: {
        themeColor: "#4285F4",
        accentBorder: "border-blue-200/80 hover:border-blue-500",
        accentBadge: "bg-blue-50 text-[#1a73e8] border-blue-200",
        accentText: "text-[#1a73e8]",
        hoverShadow: "hover:shadow-lg hover:shadow-blue-500/10",
        buttonClass: "bg-blue-50 text-[#1a73e8] hover:bg-[#4285F4] hover:text-white border border-blue-200/80",
        activeBorder: "border-[#4285F4]",
        activeBg: "bg-blue-50/70",
        activeText: "text-[#4285F4]",
        iconBg: "bg-[#4285F4]",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    red: {
        themeColor: "#EA4335",
        accentBorder: "border-red-200/80 hover:border-red-500",
        accentBadge: "bg-red-50 text-[#d93025] border-red-200",
        accentText: "text-[#d93025]",
        hoverShadow: "hover:shadow-lg hover:shadow-red-500/10",
        buttonClass: "bg-red-50 text-[#d93025] hover:bg-[#EA4335] hover:text-white border border-red-200/80",
        activeBorder: "border-[#EA4335]",
        activeBg: "bg-red-50/70",
        activeText: "text-[#EA4335]",
        iconBg: "bg-[#EA4335]",
        badgeClass: "bg-red-50 text-red-700 border-red-200/80",
    },
    amber: {
        themeColor: "#F29900",
        accentBorder: "border-amber-200/80 hover:border-amber-500",
        accentBadge: "bg-amber-50 text-[#b06000] border-amber-200",
        accentText: "text-[#b06000]",
        hoverShadow: "hover:shadow-lg hover:shadow-amber-500/10",
        buttonClass: "bg-amber-50 text-[#b06000] hover:bg-[#F29900] hover:text-white border border-amber-200/80",
        activeBorder: "border-[#FBBC05]",
        activeBg: "bg-amber-50/70",
        activeText: "text-[#b06000]",
        iconBg: "bg-[#F29900]",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
    green: {
        themeColor: "#34A853",
        accentBorder: "border-emerald-200/80 hover:border-emerald-500",
        accentBadge: "bg-emerald-50 text-[#188038] border-emerald-200",
        accentText: "text-[#188038]",
        hoverShadow: "hover:shadow-lg hover:shadow-emerald-500/10",
        buttonClass: "bg-emerald-50 text-[#188038] hover:bg-[#34A853] hover:text-white border border-emerald-200/80",
        activeBorder: "border-[#34A853]",
        activeBg: "bg-emerald-50/70",
        activeText: "text-[#188038]",
        iconBg: "bg-[#34A853]",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    purple: {
        themeColor: "#A142F4",
        accentBorder: "border-purple-200/80 hover:border-purple-500",
        accentBadge: "bg-purple-50 text-purple-700 border-purple-200",
        accentText: "text-purple-700",
        hoverShadow: "hover:shadow-lg hover:shadow-purple-500/10",
        buttonClass: "bg-purple-50 text-purple-700 hover:bg-[#A142F4] hover:text-white border border-purple-200/80",
        activeBorder: "border-[#A142F4]",
        activeBg: "bg-purple-50/70",
        activeText: "text-purple-700",
        iconBg: "bg-[#A142F4]",
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200/80",
    },
    indigo: {
        themeColor: "#4F46E5",
        accentBorder: "border-indigo-200/80 hover:border-indigo-500",
        accentBadge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        accentText: "text-indigo-700",
        hoverShadow: "hover:shadow-lg hover:shadow-indigo-500/10",
        buttonClass: "bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200/80",
        activeBorder: "border-indigo-600",
        activeBg: "bg-indigo-50/70",
        activeText: "text-indigo-700",
        iconBg: "bg-indigo-600",
        badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    },
    cyan: {
        themeColor: "#0891B2",
        accentBorder: "border-cyan-200/80 hover:border-cyan-500",
        accentBadge: "bg-cyan-50 text-cyan-700 border-cyan-200",
        accentText: "text-cyan-700",
        hoverShadow: "hover:shadow-lg hover:shadow-cyan-500/10",
        buttonClass: "bg-cyan-50 text-cyan-700 hover:bg-cyan-600 hover:text-white border border-cyan-200/80",
        activeBorder: "border-cyan-600",
        activeBg: "bg-cyan-50/70",
        activeText: "text-cyan-700",
        iconBg: "bg-cyan-600",
        badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
    },
    rose: {
        themeColor: "#E11D48",
        accentBorder: "border-rose-200/80 hover:border-rose-500",
        accentBadge: "bg-rose-50 text-rose-700 border-rose-200",
        accentText: "text-rose-700",
        hoverShadow: "hover:shadow-lg hover:shadow-rose-500/10",
        buttonClass: "bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200/80",
        activeBorder: "border-rose-600",
        activeBg: "bg-rose-50/70",
        activeText: "text-rose-700",
        iconBg: "bg-rose-600",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
    },
    slate: {
        themeColor: "#64748B",
        accentBorder: "border-slate-200 hover:border-slate-400",
        accentBadge: "bg-slate-50 text-slate-700 border-slate-200",
        accentText: "text-slate-700",
        hoverShadow: "hover:shadow-lg hover:shadow-slate-500/10",
        buttonClass: "bg-slate-50 text-slate-700 hover:bg-slate-600 hover:text-white border border-slate-200",
        activeBorder: "border-slate-600",
        activeBg: "bg-slate-50/70",
        activeText: "text-slate-700",
        iconBg: "bg-slate-600",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    },
};

const departmentIdToPresetFallback: Record<string, DepartmentColorPreset> = {
    tech: "blue",
    design: "red",
    pr: "amber",
    "hr-lg": "green",
};

export function getDepartmentTheme(deptOrPreset?: Department | DepartmentColorPreset | string): DepartmentTheme {
    if (!deptOrPreset) return DEPARTMENT_THEMES.blue;

    if (typeof deptOrPreset === "object" && "colorPreset" in deptOrPreset) {
        return DEPARTMENT_THEMES[deptOrPreset.colorPreset] || DEPARTMENT_THEMES.blue;
    }

    if (typeof deptOrPreset === "string") {
        if (deptOrPreset in DEPARTMENT_THEMES) {
            return DEPARTMENT_THEMES[deptOrPreset as DepartmentColorPreset];
        }
        if (deptOrPreset in departmentIdToPresetFallback) {
            return DEPARTMENT_THEMES[departmentIdToPresetFallback[deptOrPreset]];
        }
    }

    return DEPARTMENT_THEMES.slate;
}

export function getDepartmentIcon(iconName?: string): React.ComponentType<{ className?: string }> {
    switch (iconName?.toLowerCase()) {
        case "code":
            return CodeIcon;
        case "palette":
        case "design":
            return PaletteIcon;
        case "megaphone":
        case "marketing":
        case "pr":
            return MegaphoneIcon;
        case "users":
        case "hr":
        case "team":
            return UsersIcon;
        case "sparkles":
            return SparklesIcon;
        case "rocket":
            return RocketIcon;
        case "target":
            return TargetIcon;
        case "shield":
            return ShieldCheckIcon;
        default:
            return UsersIcon;
    }
}
