import { settings } from "@/lib/config";

const { site } = settings;

export function JsonLd() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        alternateName: site.fullName,
        url: site.url,
        logo: `${site.url}/logo.svg`,
        description: site.description,
        sameAs: site.socialLinks ?? [],
        memberOf: {
            "@type": "Organization",
            name: "Google Developer Groups",
            url: "https://developers.google.com/community/gdg",
        },
        event: {
            "@type": "Event",
            name: `Tuyển Thành Viên Gen 5 - ${site.name}`,
            description: site.ogDescription,
            startDate: settings.applicationOpenAt,
            endDate: settings.applicationCloseAt,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
                "https://schema.org/OnlineEventAttendanceMode",
            location: {
                "@type": "VirtualLocation",
                url: site.url,
            },
            organizer: {
                "@type": "Organization",
                name: site.name,
                url: site.url,
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
