import { NextResponse } from "next/server";

interface LeadPayload {
  name?: string;
  phone?: string;
  service?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  console.log("[lead] Заглушка отправки в Битрикс24", {
    name: payload.name,
    phone: payload.phone,
    service: payload.service,
  });

  return NextResponse.json({ success: true });
}
