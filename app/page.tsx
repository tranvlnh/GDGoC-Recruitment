import { departments, majors, questions, settings, getApplicationWindowStatus } from "@/lib/config";
import { FloatingNavbar } from "@/components/landing/floating-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { AboutActivitiesSection } from "@/components/landing/about-activities-section";
import { MissionGoalsSection } from "@/components/landing/mission-goals-section";
import { DepartmentsSection } from "@/components/landing/departments-section";
import { RecruitmentForm } from "@/components/landing/recruitment-form";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/json-ld";

export const dynamic = "force-dynamic";

export default function Home() {
    const windowStatus = getApplicationWindowStatus();

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-zinc-900 selection:bg-blue-100 selection:text-blue-900">
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

                {/* 2. About & Activities Showcase */}
                <AboutActivitiesSection />

                {/* 3. Mission & Strategic Goals */}
                <MissionGoalsSection />

                {/* 4. Departments (4 Google Colored Groups) */}
                <DepartmentsSection />

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
                />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
