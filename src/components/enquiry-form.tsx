"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  enquiryEmailHref,
  enquirySchema,
  enquiryText,
  type Enquiry,
  type EnquirySource,
} from "@/lib/enquiry";

type Defaults = { interest?: string; message?: string };
type Status = { kind: "ok" | "error" | "draft"; message: string };
const fields = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    auto: "name",
    required: true,
  },
  {
    name: "company",
    label: "Company name",
    type: "text",
    auto: "organization",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    auto: "email",
    required: true,
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    auto: "tel",
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
  },
  {
    name: "interest",
    label: "Product interest",
    type: "text",
  },
  {
    name: "location",
    label: "Project location",
    type: "text",
  },
  {
    name: "quantity",
    label: "Estimated quantity",
    type: "text",
    inputMode: "numeric",
  },
] as const;

export default function EnquiryForm({
  online,
  email,
  whatsappNumber,
  defaults,
  home = false,
  source = home ? "home" : "contact",
}: {
  online: boolean;
  email: string;
  whatsappNumber: string;
  defaults?: Defaults;
  home?: boolean;
  source?: EnquirySource;
}) {
  const formId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      subject: "",
      interest: defaults?.interest ?? "",
      projectType: "",
      location: "",
      quantity: "",
      message: defaults?.message ?? "",
      website: "",
    },
  });
  const [status, setStatus] = useState<Status | null>(null);
  const [draft, setDraft] = useState("");
  const attempt = useRef<{ body: string; id: string } | null>(null);
  async function submit(values: Enquiry) {
    if (home && (!values.subject || values.subject.length < 2 || !values.phone)) {
      setStatus({ kind: "error", message: "Enter a valid phone number and subject." });
      return;
    }
    setDraft(enquiryText(values));
    if (!online) {
      setStatus({
        kind: "draft",
        message: "Your enquiry draft is ready. Choose email or WhatsApp to review and send it.",
      });
      return;
    }
    setStatus(null);
    const body = JSON.stringify(values);
    if (body !== attempt.current?.body)
      attempt.current = { body, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, home, source, requestId: attempt.current.id }),
      });
      const result = await response.json();
      setStatus({
        kind: response.ok && result.ok ? "ok" : "error",
        message: result.message || "The enquiry could not be sent.",
      });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Online submission is temporarily unavailable. You can send your draft by email or WhatsApp.",
      });
    }
  }

  return (
    <form
      className={home ? "enquiry-form homepage-enquiry-form" : "enquiry-form"}
      aria-labelledby="enquiry-title"
      onSubmit={(event) => {
        void handleSubmit(submit, () => {
          setStatus(null);
          setDraft("");
        })(event);
      }}
      noValidate={!home}
    >
      <p className="form-note full">Fields marked with * are required.</p>
      {fields.filter((field) => home ? !["interest", "location", "quantity"].includes(field.name) : field.name !== "subject").map((field) => {
        const id = `${formId}-${field.name}`;
        const error = errors[field.name];
        const required = "required" in field || (home && (field.name === "phone" || field.name === "subject"));
        return (
          <div className={`enquiry-field${home && field.name === "subject" ? " full" : ""}`} key={field.name}>
            <label className={home ? undefined : "sr-only"} htmlFor={id}>
              {field.label}{home && required && <span aria-hidden="true"> *</span>}
            </label>
            <input
              id={id}
              type={field.type}
              autoComplete={"auto" in field ? field.auto : undefined}
              inputMode={"inputMode" in field ? field.inputMode : undefined}
              placeholder={home ? ({ name: "Enter your full name", company: "Your company (optional)", email: "you@example.com", phone: "+91 00000 00000", subject: "How can we help?" } as Record<string, string>)[field.name] : required ? `${field.label} *` : field.label}
              aria-invalid={Boolean(error)}
              required={required}
              aria-describedby={error ? `${id}-error` : undefined}
              {...register(field.name)}
            />
            {error && (
              <small className="field-error" id={`${id}-error`}>
                {error.message}
              </small>
            )}
          </div>
        );
      })}
      {!home && <div className="enquiry-field">
        <label className="sr-only" htmlFor={`${formId}-project-type`}>
          Project type
        </label>
        <select id={`${formId}-project-type`} {...register("projectType")}>
          <option value="">Project type</option>
          {[
            "Residential",
            "Commercial",
            "Hospitality",
            "Retail",
            "Industrial",
            "Outdoor",
            "Other",
          ].map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>}
      <div className="enquiry-field full">
        <label className={home ? undefined : "sr-only"} htmlFor={`${formId}-message`}>
          Message{home && <span aria-hidden="true"> *</span>}
        </label>
        <p className="sr-only" id={`${formId}-message-hint`}>
          Include the lighting you need, the space, and your timeline.
        </p>
        <textarea
          id={`${formId}-message`}
          rows={5}
          placeholder={home ? "Tell us about your lighting requirements…" : "Message *"}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message
              ? `${formId}-message-error ${formId}-message-hint`
              : `${formId}-message-hint`
          }
          {...register("message")}
        />
        {errors.message && (
          <small id={`${formId}-message-error`} className="field-error">
            {errors.message.message}
          </small>
        )}
      </div>
      <label className="form-trap" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </label>
      <p className="form-note full">
        {online
          ? "We’ll use these details to respond to your enquiry."
          : "Review your draft before sending it by email or WhatsApp."}
      </p>
      <button
        className="button button-primary full"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Submitting…"
          : online
            ? source === "quote" ? "Send Quote Request" : "Send Enquiry"
            : "Prepare enquiry draft"}{" "}
        <Send size={16} aria-hidden="true" />
      </button>
      <div className="full" aria-live="polite">
        {status && <p className="form-result" data-kind={status.kind}>{status.message}</p>}
      </div>
      {draft && status && status.kind !== "ok" && (
        <div className="full flex flex-wrap gap-3">
          <a
            className="button button-outline"
            href={enquiryEmailHref(email, draft)}
          >
            Open email app <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a
            className="button button-outline"
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(draft)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open WhatsApp <MessageCircle size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </form>
  );
}
