import { cn } from "@/lib/utils";

/**
 * Marks copy that stands in for information only the academy can supply.
 *
 * The brief forbids inventing history, credentials, schedules or claims, and
 * asks for placeholders to be clearly marked. Rather than hiding that, the
 * marker is designed: a soil-coloured rule, a small label, and the note itself
 * set in a quieter voice. It reads as an editorial annotation, which is what
 * it is.
 */
export function PendingCopy({
  children,
  className,
  tone = "light",
  label = "Awaiting content",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
  label?: string;
}) {
  // The admin clears a pending note once the real copy is in; render nothing.
  if (children === null || children === undefined || children === "") return null;

  return (
    <div
      className={cn(
        "border-l pl-5 sm:pl-6",
        tone === "light" ? "border-soil/55" : "border-soil/40",
        className,
      )}
    >
      <p
        className={cn(
          "eyebrow mb-2.5",
          tone === "light" ? "text-soil" : "text-soil/80",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "measure text-[0.9375rem] leading-relaxed italic",
          tone === "light" ? "text-muted" : "text-bone/50",
        )}
      >
        {children}
      </p>
    </div>
  );
}
