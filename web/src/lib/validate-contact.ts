export type ContactFormPayload = {
  email: string;
  subject: string;
  message: string;
  locale?: string;
  /** Campo oculto antispam; debe ir vacío. */
  company?: string;
};

export type ContactFormFieldErrors = Partial<
  Record<"email" | "subject" | "message", string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  payload: ContactFormPayload
): ContactFormFieldErrors {
  const errors: ContactFormFieldErrors = {};
  const email = payload.email?.trim() ?? "";
  const subject = payload.subject?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!email) {
    errors.email = "required";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "invalid";
  }

  if (!subject) {
    errors.subject = "required";
  } else if (subject.length > 200) {
    errors.subject = "tooLong";
  }

  if (!message) {
    errors.message = "required";
  } else if (message.length < 10) {
    errors.message = "tooShort";
  } else if (message.length > 5000) {
    errors.message = "tooLong";
  }

  return errors;
}

export function isContactFormValid(errors: ContactFormFieldErrors) {
  return Object.keys(errors).length === 0;
}
