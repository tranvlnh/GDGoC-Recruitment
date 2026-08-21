import { NextResponse } from "next/server";
import { getMissionPillars } from "@/lib/missions";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const pillars = getMissionPillars();
        return NextResponse.json(pillars);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch missions" }, { status: 500 });
    }
}
