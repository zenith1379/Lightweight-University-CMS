import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx("h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#249ac6]/25", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx("min-h-24 rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#249ac6]/25", className)} {...props} />;
}
