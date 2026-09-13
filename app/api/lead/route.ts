import { NextResponse } from "next/server";

interface LeadPayload {
  name?: string;
  phone?: string;
  service?: string;
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ success: false, error: "Некорректный JSON" }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const service = payload.service?.trim() ?? "";

  const phoneDigits = phone.replace(/\D/g, "");
  if (!name || !service || !phone.startsWith("+7") || phoneDigits.length !== 11) {
    return NextResponse.json({ success: false, error: "Некорректные данные" }, { status: 400 });
  }

  console.log("[lead] Заглушка отправки в Битрикс24", {
    service,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
