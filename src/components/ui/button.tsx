import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#2f3192] px-3 text-sm font-bold text-white hover:bg-[#249ac6] disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
