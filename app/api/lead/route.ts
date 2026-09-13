import { NextResponse } from "next/server";

interface LeadPayload {
  name?: string;
  phone?: string;
  service?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;
  const name = payload.name?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const service = payload.service?.trim() ?? "";

  const phoneDigits = phone.replace(/\D/g, "");
  if (!name || !service || !phone.startsWith("+7") || phoneDigits.length !== 11) {
    return NextResponse.json({ success: false, error: "Некорректные данные" }, { status: 400 });
  }

  console.log("[lead] Заглушка отправки в Битрикс24", {
    name,
    phone: `${phone.slice(0, 2)}***${phone.slice(-2)}`,
    service,
  });

  return NextResponse.json({ success: true });
}
