import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Builds a Nodemailer transporter from environment variables (SMTP URL or host/port/user/pass).
 * How: `createTransport` accepts a connection URL `smtps://user:pass@host:465` or an options object;
 * returns a reusable sender; call `.verify()` optionally to test credentials before sending.
 */
export function createMailTransporter(): Transporter {
  const url = process.env.SMTP_URL;
  if (url) {
    return nodemailer.createTransport(url);
  }

  const host = process.env.SMTP_HOST ?? "localhost";
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

/**
 * Sends one email using the provided transporter.
 * How: `sendMail` accepts `from`, `to`, `subject`, `text`/`html`, attachments, etc.;
 * resolves with `messageId` on success; throws if SMTP rejects the message.
 */
export async function sendEmail(
  transporter: Transporter,
  mail: SendMailInput & { from: string }
): Promise<string> {
  const info = await transporter.sendMail({
    from: mail.from,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
  return info.messageId;
}

/**
 * Dry-run helper: if `SMTP_URL` / `SMTP_HOST` are unset, skips real SMTP and logs the payload instead.
 * How: Lets you run the app without credentials; set env vars to enable real delivery.
 */
export async function sendEmailOrLog(
  mail: SendMailInput & { from: string }
): Promise<{ ok: boolean; messageId?: string; skipped?: boolean; reason?: string }> {
  const hasSmtp = Boolean(process.env.SMTP_URL || process.env.SMTP_HOST);

  if (!hasSmtp) {
    console.log("[mailer] SMTP not configured — would send:", {
      to: mail.to,
      subject: mail.subject,
      preview: mail.text.slice(0, 120),
    });
    return { ok: true, skipped: true, reason: "No SMTP_URL / SMTP_HOST" };
  }

  const transporter = createMailTransporter();
  const messageId = await sendEmail(transporter, mail);
  return { ok: true, messageId };
}
