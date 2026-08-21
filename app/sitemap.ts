import type { MetadataRoute } from "next";
import { settings } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: settings.site.url,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${settings.site.url}/job-description`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];
}
