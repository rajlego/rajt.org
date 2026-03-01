import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAccessRequestNotification(
  email: string,
  name?: string
) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ADMIN_EMAIL!,
    subject: `New access request: ${email}`,
    html: `
      <p><strong>${escapeHtml(name || "Someone")}</strong> (${escapeHtml(email)}) requested access to your writing.</p>
      <p><a href="https://rajt.org/admin">Review in admin dashboard</a></p>
    `,
  });
}

export async function sendApprovalEmail(email: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "You've been approved — rajt.org",
    html: `
      <p>Your access request has been approved.</p>
      <p><a href="https://rajt.org/login">Log in to read</a></p>
    `,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
