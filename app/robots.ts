import type { MetadataRoute } from "next";
import { settings } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard/", "/api/"],
            },
        ],
        sitemap: `${settings.site.url}/sitemap.xml`,
    };
}
