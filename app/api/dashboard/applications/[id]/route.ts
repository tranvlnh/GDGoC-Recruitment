import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const statusSchema = z.object({ status: z.enum(["pending", "approved", "rejected"]) });

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Status không hợp lệ" }, { status: 422 });

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("applications")
    .update({ status: parsed.data.status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Failed to update application", error);
    return NextResponse.json({ error: "Không thể cập nhật trạng thái" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });
  return NextResponse.json({ data });
}
