import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/email/send-contact-email";
import {
  isContactFormValid,
  validateContactForm,
  type ContactFormPayload,
} from "@/lib/validate-contact";

export async function POST(request: Request) {
  let payload: ContactFormPayload;

  try {
    payload = (await request.json()) as ContactFormPayload;
  } catch {
    return NextResponse.json(
      { error: "invalid_body", message: "Invalid request body." },
      { status: 400 }
    );
  }

  // #region agent log
  fetch("http://127.0.0.1:7887/ingest/b93a1584-996c-4f49-be4f-1fc32e960287", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "e78924",
    },
    body: JSON.stringify({
      sessionId: "e78924",
      hypothesisId: "C",
      location: "api/contact/route.ts:POST",
      message: "contact API hit",
      data: {
        hasCompany: Boolean(payload.company?.trim()),
        locale: payload.locale ?? null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (payload.company?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const fieldErrors = validateContactForm(payload);
  if (!isContactFormValid(fieldErrors)) {
    return NextResponse.json(
      { error: "validation", fields: fieldErrors },
      { status: 400 }
    );
  }

  const result = await sendContactEmail(payload);

  // #region agent log
  fetch("http://127.0.0.1:7887/ingest/b93a1584-996c-4f49-be4f-1fc32e960287", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "e78924",
    },
    body: JSON.stringify({
      sessionId: "e78924",
      hypothesisId: "A,B",
      location: "api/contact/route.ts:result",
      message: "sendContactEmail result",
      data: { ok: result.ok, code: result.ok ? null : result.code },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!result.ok) {
    if (result.code === "not_configured") {
      return NextResponse.json(
        { error: "not_configured", message: "Email service is not configured." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "send_failed", message: "Could not send the email." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
