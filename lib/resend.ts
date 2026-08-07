import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  return _resend;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
  roomInterest?: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  const ownerEmail = process.env.OWNER_EMAIL || "owner@example.com";

  const { error } = await getResend().emails.send({
    from: "AN Apartments <noreply@thanhha.com>",
    to: ownerEmail,
    replyTo: data.email,
    subject: `New message from ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a6f;">New message from website</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Name:</td><td style="padding: 8px;">${data.name}</td></tr>
          <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${data.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${data.phone}</td></tr>
          ${data.roomInterest ? `<tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: bold;">Interested in:</td><td style="padding: 8px;">${data.roomInterest}</td></tr>` : ""}
          <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px;">${data.message.replace(/\n/g, "<br>")}</td></tr>
        </table>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 12px;">This email was sent from the contact form at AN Apartments.</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
}
