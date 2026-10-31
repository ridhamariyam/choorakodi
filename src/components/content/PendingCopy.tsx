import { cn } from "@/lib/utils";

/**
 * Marks copy that stands in for information only the academy can supply.
 *
 * These notes are instructions to the content owner, so visitors never see
 * them. Set NEXT_PUBLIC_SHOW_PENDING=1 on a preview build to review them in
 * place; CONTENT_TODO.md holds the same list.
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
  if (process.env.NEXT_PUBLIC_SHOW_PENDING !== "1") return null;
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
          tone === "light" ? "text-soil-ink" : "text-soil-ink",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "measure text-[0.9375rem] leading-relaxed italic",
          tone === "light" ? "text-muted" : "text-bone/62",
        )}
      >
        {children}
      </p>
    </div>
  );
}
