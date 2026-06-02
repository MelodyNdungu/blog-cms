interface LogoProps {
  /** Use "light" on dark backgrounds, "dark" on light backgrounds */
  variant?: "light" | "dark";
  className?: string;
}

export default function Logo({ variant = "light", className = "" }: LogoProps) {
  const isDark = variant === "dark";
  const textPrimary = isDark ? "text-slate-900" : "text-white";
  const textAccent = isDark ? "text-indigo-700" : "text-indigo-300";
  const badgeBg = isDark ? "bg-indigo-700" : "bg-indigo-500";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon badge */}
      <div className={`w-8 h-8 rounded-lg ${badgeBg} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4.5 h-4.5 w-[18px] h-[18px]"
          aria-hidden="true"
        >
          {/* Pencil-on-document (Heroicons pencilSquare) */}
          <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931z" />
          <path d="M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </div>

      {/* Wordmark */}
      <span className={`text-[1.1rem] leading-none font-light tracking-tight ${textPrimary}`}>
        Blog<span className={`font-bold ${textAccent}`}>CMS</span>
      </span>
    </div>
  );
}
