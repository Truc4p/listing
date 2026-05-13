import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, roomInterest } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Địa chỉ email không hợp lệ." },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, phone, message, roomInterest });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json(
      { error: "Gửi thất bại. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
