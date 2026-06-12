"use client";

import { type FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { submitContactForm } from "@/lib/api/contact";
import { cn } from "@/lib/utils";

const fieldClassName =
  "w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 sm:text-lg";

const labelClassName =
  "text-sm font-medium uppercase tracking-widest text-zinc-500 sm:text-base";

type FormStatus = "idle" | "loading" | "success" | "error";

type FieldName = "email" | "subject" | "message";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>(
    {}
  );
  const [formError, setFormError] = useState<string | null>(null);

  function getFieldError(field: FieldName) {
    const code = fieldErrors[field];
    if (!code) return null;
    return t(`validation.${field}.${code}` as "validation.email.required");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFormError(null);
    setFieldErrors({});

    const result = await submitContactForm({
      email,
      subject,
      message,
      locale,
      company,
    });

    if (result.ok) {
      setStatus("success");
      setEmail("");
      setSubject("");
      setMessage("");
      return;
    }

    setStatus("error");

    if (result.error === "validation" && result.fields) {
      const nextErrors: Partial<Record<FieldName, string>> = {};
      for (const field of ["email", "subject", "message"] as const) {
        const code = result.fields[field];
        if (code) nextErrors[field] = code;
      }
      setFieldErrors(nextErrors);
      setFormError(t("errorValidation"));
      return;
    }

    if (result.error === "network") {
      setFormError(t("errorNetwork"));
      return;
    }

    if (result.error === "not_configured") {
      setFormError(t("errorNotConfigured"));
      return;
    }

    setFormError(t("errorGeneric"));
  }

  const isLoading = status === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex flex-col gap-6 rounded-2xl border border-white/10 bg-slate-950/80 p-5 sm:p-6 md:p-8"
      noValidate
    >
      <div className="sr-only" aria-hidden>
        <label htmlFor="contact-company">{t("companyLabel")}</label>
        <input
          id="contact-company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      {status === "success" ? (
        <p
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-base text-emerald-200 sm:text-lg"
        >
          {t("successMessage")}
        </p>
      ) : null}

      {formError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-base text-red-200 sm:text-lg"
        >
          {formError}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex flex-col gap-2">
          <label htmlFor="contact-email" className={labelClassName}>
            {t("emailLabel")}
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={cn(
              fieldClassName,
              getFieldError("email") &&
                "border-red-500/50 focus:border-red-400/50 focus:ring-red-400/20"
            )}
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(getFieldError("email"))}
            aria-describedby={
              getFieldError("email") ? "contact-email-error" : undefined
            }
            disabled={isLoading}
          />
          {getFieldError("email") ? (
            <p id="contact-email-error" className="text-sm text-red-300">
              {getFieldError("email")}
            </p>
          ) : null}
        </div>
        <div className="flex flex flex-col gap-2">
          <label htmlFor="contact-subject" className={labelClassName}>
            {t("subjectLabel")}
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className={cn(
              fieldClassName,
              getFieldError("subject") &&
                "border-red-500/50 focus:border-red-400/50 focus:ring-red-400/20"
            )}
            placeholder={t("subjectPlaceholder")}
            aria-invalid={Boolean(getFieldError("subject"))}
            aria-describedby={
              getFieldError("subject") ? "contact-subject-error" : undefined
            }
            disabled={isLoading}
          />
          {getFieldError("subject") ? (
            <p id="contact-subject-error" className="text-sm text-red-300">
              {getFieldError("subject")}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex flex-col gap-2">
        <label htmlFor="contact-message" className={labelClassName}>
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={cn(
            fieldClassName,
            "min-h-[9rem] resize-y",
            getFieldError("message") &&
              "border-red-500/50 focus:border-red-400/50 focus:ring-red-400/20"
          )}
          placeholder={t("messagePlaceholder")}
          aria-invalid={Boolean(getFieldError("message"))}
          aria-describedby={
            getFieldError("message") ? "contact-message-error" : undefined
          }
          disabled={isLoading}
        />
        {getFieldError("message") ? (
          <p id="contact-message-error" className="text-sm text-red-300">
            {getFieldError("message")}
          </p>
        ) : null}
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-zinc-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60 sm:px-7 sm:text-lg"
        >
          {isLoading ? t("sending") : t("cta")}
        </button>
      </div>
    </form>
  );
}
