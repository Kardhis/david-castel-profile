import nodemailer from "nodemailer";

import { siteConfig } from "@/lib/site-config";
import type { ContactFormPayload } from "@/lib/validate-contact";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSmtpConfig() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  return {
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT?.trim() || 587),
    user,
    pass,
  };
}

export async function sendContactEmail(payload: ContactFormPayload) {
  const smtp = getSmtpConfig();

  // #region agent log
  fetch("http://127.0.0.1:7887/ingest/b93a1584-996c-4f49-be4f-1fc32e960287", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "e78924",
    },
    body: JSON.stringify({
      sessionId: "e78924",
      hypothesisId: "A,D",
      location: "send-contact-email.ts:config",
      message: "SMTP config check",
      data: {
        hasSmtp: Boolean(smtp),
        host: smtp?.host ?? null,
        port: smtp?.port ?? null,
        userSet: Boolean(process.env.SMTP_USER?.trim()),
        passSet: Boolean(process.env.SMTP_PASS?.trim()),
        contactTo: process.env.CONTACT_TO?.trim() || siteConfig.email,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!smtp) {
    return {
      ok: false as const,
      code: "not_configured" as const,
    };
  }

  const visitorEmail = payload.email.trim();
  const subject = payload.subject.trim();
  const message = payload.message.trim();
  const locale = payload.locale?.trim() || "es";
  const fullSubject = `[Portfolio] ${subject}`;
  const to = process.env.CONTACT_TO?.trim() || siteConfig.email;
  const fromName =
    process.env.SMTP_FROM_NAME?.trim() || `${siteConfig.name} Portfolio`;

  const textBody = [
    "Nuevo mensaje desde el formulario de contacto.",
    "",
    `Idioma: ${locale}`,
    `Correo del visitante: ${visitorEmail}`,
    `Asunto: ${subject}`,
    "",
    message,
  ].join("\n");

  const htmlBody = `
    <h2>Nuevo mensaje desde el portfolio</h2>
    <p><strong>Idioma:</strong> ${escapeHtml(locale)}</p>
    <p><strong>Correo del visitante:</strong> <a href="mailto:${escapeHtml(visitorEmail)}">${escapeHtml(visitorEmail)}</a></p>
    <p><strong>Asunto:</strong> ${escapeHtml(subject)}</p>
    <hr />
    <pre style="font-family: sans-serif; white-space: pre-wrap;">${escapeHtml(message)}</pre>
  `.trim();

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: `${fromName} <${smtp.user}>`,
      to,
      replyTo: visitorEmail,
      subject: fullSubject,
      text: textBody,
      html: htmlBody,
    });

    // #region agent log
    fetch("http://127.0.0.1:7887/ingest/b93a1584-996c-4f49-be4f-1fc32e960287", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "e78924",
      },
      body: JSON.stringify({
        sessionId: "e78924",
        hypothesisId: "B,D",
        location: "send-contact-email.ts:success",
        message: "SMTP sendMail succeeded",
        data: { to, fromUser: smtp.user },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return { ok: true as const };
  } catch (error) {
    const err = error as { name?: string; message?: string; code?: string };
    console.error("[contact] SMTP error:", error);

    // #region agent log
    fetch("http://127.0.0.1:7887/ingest/b93a1584-996c-4f49-be4f-1fc32e960287", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "e78924",
      },
      body: JSON.stringify({
        sessionId: "e78924",
        hypothesisId: "B",
        location: "send-contact-email.ts:error",
        message: "SMTP sendMail failed",
        data: {
          errorName: err?.name ?? "unknown",
          errorCode: err?.code ?? null,
          errorMessage: err?.message?.slice(0, 200) ?? "unknown",
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return {
      ok: false as const,
      code: "send_failed" as const,
    };
  }
}
