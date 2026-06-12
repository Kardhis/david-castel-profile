import { withBasePath } from "@/lib/site-config";
import type { ContactFormPayload } from "@/lib/validate-contact";

export type SubmitContactResult =
  | { ok: true }
  | {
      ok: false;
      error: "validation" | "network" | "not_configured" | "send_failed" | "unknown";
      fields?: Partial<Record<"email" | "subject" | "message", string>>;
    };

export async function submitContactForm(
  payload: ContactFormPayload
): Promise<SubmitContactResult> {
  try {
    const response = await fetch(withBasePath("/api/contact"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      ok?: boolean;
      error?: string;
      fields?: Partial<Record<"email" | "subject" | "message", string>>;
    };

    // #region agent log
    fetch("http://127.0.0.1:7887/ingest/b93a1584-996c-4f49-be4f-1fc32e960287", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "e78924",
      },
      body: JSON.stringify({
        sessionId: "e78924",
        hypothesisId: "C,E",
        location: "api/contact.ts:response",
        message: "client fetch response",
        data: {
          url: withBasePath("/api/contact"),
          status: response.status,
          ok: data.ok ?? null,
          error: data.error ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (response.ok && data.ok) {
      return { ok: true };
    }

    if (data.error === "validation" && data.fields) {
      return { ok: false, error: "validation", fields: data.fields };
    }

    if (data.error === "not_configured") {
      return { ok: false, error: "not_configured" };
    }

    if (data.error === "send_failed") {
      return { ok: false, error: "send_failed" };
    }

    return { ok: false, error: "unknown" };
  } catch {
    return { ok: false, error: "network" };
  }
}
