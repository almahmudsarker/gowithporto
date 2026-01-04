import { cn } from "@/utils/cn";

export default function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/80 backdrop-blur shadow-sm border border-black/5 p-6 transition hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
