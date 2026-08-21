import fs from "fs";
import path from "path";
import { PlanetPillar, BASE_PLANET_PILLARS, DEFAULT_PLANET_PILLARS } from "@/types/missions";

export { BASE_PLANET_PILLARS, DEFAULT_PLANET_PILLARS };
export type { PlanetPillar };

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"]);

export function getMissionImages(folderName: string): string[] {
    try {
        const dirPath = path.join(process.cwd(), "public", "missions", folderName);
        if (!fs.existsSync(dirPath)) {
            return [];
        }
        const files = fs.readdirSync(dirPath);
        return files
            .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
            .map((file) => `/missions/${folderName}/${file}`);
    } catch (error) {
        console.error(`Error reading mission images for folder '${folderName}':`, error);
        return [];
    }
}

export function getMissionPillars(): PlanetPillar[] {
    return BASE_PLANET_PILLARS.map((pillar) => ({
        ...pillar,
        images: getMissionImages(pillar.id),
    }));
}
