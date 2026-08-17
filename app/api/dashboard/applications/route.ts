import { NextRequest, NextResponse } from "next/server";
import { majors } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { applicationStatuses } from "@/types/application";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const status = params.get("status");
  const major = params.get("major");
  const search = params.get("search")?.trim();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(params.get("pageSize")) || DEFAULT_PAGE_SIZE));

  if (status && !applicationStatuses.includes(status as (typeof applicationStatuses)[number])) {
    return NextResponse.json({ error: "Status không hợp lệ" }, { status: 400 });
  }
  if (major && !majors.some((item) => item.id === major)) {
    return NextResponse.json({ error: "Ngành không hợp lệ" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase.from("applications").select("*", { count: "exact" });
  if (status) query = query.eq("status", status);
  if (major) query = query.eq("major", major);
  if (search) {
    const escaped = search.replace(/[%_,()]/g, "");
    query = query.or(`full_name.ilike.%${escaped}%,email.ilike.%${escaped}%`);
  }

  const { data, error, count } = await query
    .order("submitted_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error("Failed to list applications", error);
    return NextResponse.json({ error: "Không thể tải danh sách đơn" }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    data,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
