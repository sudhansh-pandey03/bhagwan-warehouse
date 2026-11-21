"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { CircleAlert } from "lucide-react";

type FloatingFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> & {
  label: string;
  placeholder: string;
  icon: ReactNode;
  error?: string;
  optional?: boolean;
  ref?: Ref<HTMLInputElement>;
};

/** Glass input with a leading icon and a label that floats up on focus or when filled. */
export function FloatingField({ label, placeholder, icon, error, optional, id, ref, ...input }: FloatingFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;
  return <div className="sp-field" data-invalid={error ? "true" : undefined}>
    <div className="sp-control">
      <span className="sp-field-icon" aria-hidden="true">{icon}</span>
      <input ref={ref} id={fieldId} className="sp-input" placeholder={placeholder} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} {...input} />
      <label htmlFor={fieldId} className="sp-label">{label}{optional && <span className="sp-optional"> (optional)</span>}</label>
    </div>
    {error && <p id={errorId} className="sp-error"><CircleAlert size={14} aria-hidden="true" />{error}</p>}
  </div>;
}
