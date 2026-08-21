import { NextRequest, NextResponse } from "next/server";
import { departments, majors } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { applicationStatuses } from "@/types/application";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const status = params.get("status");
  const major = params.get("major");
  const department = params.get("department");
  const search = params.get("search")?.trim();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(params.get("pageSize")) || DEFAULT_PAGE_SIZE));

  if (status && !applicationStatuses.includes(status as (typeof applicationStatuses)[number])) {
    return NextResponse.json({ error: "Status không hợp lệ" }, { status: 400 });
  }
  let matchingMajor: (typeof majors)[number] | undefined;
  if (major) {
    matchingMajor = majors.find((item) => item.id === major || item.label === major);
    if (!matchingMajor) {
      return NextResponse.json({ error: "Ngành không hợp lệ" }, { status: 400 });
    }
  }

  if (department && !departments.some((item) => item.id === department)) {
    return NextResponse.json({ error: "Ban chuyên môn không hợp lệ" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase.from("applications").select("*", { count: "exact" });
  if (status) query = query.eq("status", status);
  if (matchingMajor) {
    query = query.in("major", Array.from(new Set([matchingMajor.id, matchingMajor.label])));
  }
  if (department) query = query.eq("department", department);
  if (search) {
    const sanitized = search.replace(/["\\%_,()]/g, "").trim();
    if (sanitized) {
      query = query.or(`full_name.ilike."%${sanitized}%",email.ilike."%${sanitized}%"`);
    }
  }

  const [
    { data, error, count },
    totalCountRes,
    pendingCountRes,
    approvedCountRes,
    rejectedCountRes,
  ] = await Promise.all([
    query
      .order("submitted_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "rejected"),
  ]);

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
    stats: {
      total: totalCountRes.count ?? 0,
      pending: pendingCountRes.count ?? 0,
      approved: approvedCountRes.count ?? 0,
      rejected: rejectedCountRes.count ?? 0,
    },
  });
}
