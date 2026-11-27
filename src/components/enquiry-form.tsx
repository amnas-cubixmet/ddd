"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { catalogueCategories } from "@/lib/catalogue";
import {
  enquirySchema,
  enquiryText,
  type Enquiry,
} from "@/lib/enquiry";

type Defaults = { interest?: string; message?: string };
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
  whatsappNumber,
  defaults,
  home = false,
}: {
  whatsappNumber: string;
  defaults?: Defaults;
  home?: boolean;
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
  const [status, setStatus] = useState<string | null>(null);
  function submit(values: Enquiry) {
    if (home && (!values.subject || values.subject.length < 2 || !values.phone)) {
      setStatus("Enter a valid phone number and subject.");
      return;
    }
    setStatus(null);
    const message = enquiryText(values);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.location.assign(url);
  }

  return (
    <form
      className={home ? "enquiry-form homepage-enquiry-form" : "enquiry-form"}
      aria-labelledby="enquiry-title"
      onSubmit={(event) => {
        void handleSubmit(submit, () => {
          setStatus(null);
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
            {field.name === "interest" ? (
              <select
                id={id}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                {...register("interest")}
              >
                <option value="">Product interest</option>
                {defaults?.interest && !catalogueCategories.some((category) => category.name === defaults.interest) && defaults.interest !== "Other" && (
                  <option value={defaults.interest}>{defaults.interest}</option>
                )}
                {catalogueCategories.map((category) => (
                  <option key={category.slug} value={category.name}>{category.name}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            ) : (
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
            )}
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
        Your details will be included in a WhatsApp message. Review and send it in WhatsApp.
      </p>
      <button
        className="button button-primary full"
        type="submit"
        disabled={isSubmitting}
      >
        Send via WhatsApp <MessageCircle size={18} aria-hidden="true" />
      </button>
      <div className="full" aria-live="polite">
        {status && <p className="form-result" data-kind="error">{status}</p>}
      </div>
    </form>
  );
}
