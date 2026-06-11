"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const fieldClassName =
  "w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 sm:text-lg";

const labelClassName =
  "text-sm font-medium uppercase tracking-widest text-zinc-500 sm:text-base";

export function ContactForm() {
  const t = useTranslations("contact");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fullSubject = `${t("subjectPrefix")}${subject.trim()}`;
    const body = `${t("messageFrom")}: ${email.trim()}\n\n${message.trim()}`;
    const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex flex-col gap-6 rounded-2xl border border-white/10 bg-slate-950/80 p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
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
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClassName}
            placeholder={t("emailPlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-subject" className={labelClassName}>
            {t("subjectLabel")}
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={fieldClassName}
            placeholder={t("subjectPlaceholder")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className={labelClassName}>
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(fieldClassName, "resize-y min-h-[9rem]")}
          placeholder={t("messagePlaceholder")}
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-zinc-950 transition hover:bg-sky-400 sm:px-7 sm:text-lg"
        >
          {t("cta")}
        </button>
      </div>
    </form>
  );
}
