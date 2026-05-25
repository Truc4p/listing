import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, roomInterest } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, phone, message, roomInterest });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please try again later." },
      { status: 500 }
    );
  }
}
