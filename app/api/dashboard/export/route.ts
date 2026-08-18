import { NextResponse } from "next/server";
import { applicationsToCsv } from "@/lib/export";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Application } from "@/types/application";

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("applications").select("*").order("submitted_at", { ascending: false });
  if (error) {
    console.error("Failed to export applications", error);
    return NextResponse.json({ error: "Không thể xuất dữ liệu" }, { status: 500 });
  }

  return new NextResponse(applicationsToCsv((data ?? []) as Application[]), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="gdgoc-ptit-gen5-applications.csv"',
      "Cache-Control": "no-store",
    },
  });
}
