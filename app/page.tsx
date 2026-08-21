import { departments, majors, questions, settings, getApplicationWindowStatus } from "@/lib/config";
import { getMissionPillars } from "@/lib/missions";
import { FloatingNavbar } from "@/components/landing/floating-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { MissionSection } from "@/components/landing/mission-section";
import { DepartmentsSection } from "@/components/landing/departments-section";
import { RecruitmentForm } from "@/components/landing/recruitment-form";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/json-ld";

export const dynamic = "force-dynamic";

export default function Home() {
    const windowStatus = getApplicationWindowStatus();
    const missionPillars = getMissionPillars();

    return (
        <div className="min-h-screen flex flex-col bg-[#00092B] text-zinc-100 selection:bg-blue-500 selection:text-white">
            <JsonLd />
            {/* Floating Top Navbar */}
            <FloatingNavbar />

            {/* Main Content Sections */}
            <main className="flex-1">
                {/* 1. Hero Section with Overlaid Cover */}
                <HeroSection
                    isOpen={windowStatus.isOpen}
                    openAt={windowStatus.openAt}
                    closeAt={windowStatus.closeAt}
                />

                {/* 2. About Section */}
                <AboutSection />

                {/* 3. Mission Showcase */}
                <MissionSection pillars={missionPillars} />

                {/* 4. Departments (4 Google Colored Groups) */}
                <DepartmentsSection departments={departments} />

                {/* 5. Recruitment Form */}
                <RecruitmentForm
                    departments={departments}
                    majors={majors}
                    questions={questions}
                    isOpen={windowStatus.isOpen}
                    reason={windowStatus.reason}
                    openAt={windowStatus.openAt}
                    closeAt={windowStatus.closeAt}
                    fallbackGoogleFormUrl={settings.fallbackGoogleFormUrl}
                    messengerGroupUrl={settings.messengerGroupUrl}
                />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
