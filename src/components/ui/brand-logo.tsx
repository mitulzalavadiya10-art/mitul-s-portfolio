
interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

export function BrandLogo({
  className = "",
  showWordmark = true,
  size = "md",
  inverted = false,
}: BrandLogoProps) {
  const badgeSizes = {
    sm: "w-8 h-8 rounded-lg text-xs",
    md: "w-10 h-10 rounded-xl text-sm",
    lg: "w-12 h-12 rounded-2xl text-base",
  };

  const titleSizes = {
    sm: "text-base tracking-wider",
    md: "text-lg tracking-wider",
    lg: "text-xl tracking-wider",
  };

  const subSizes = {
    sm: "text-[8px] tracking-[0.22em]",
    md: "text-[9px] tracking-[0.26em]",
    lg: "text-[10px] tracking-[0.3em]",
  };

  const badgeBg = inverted ? "bg-black text-white" : "bg-white text-black";
  const textColor = inverted ? "text-black" : "text-white";
  const subColor = inverted ? "text-zinc-600" : "text-zinc-400";

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Geometric Monogram Badge */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${badgeSizes[size]} ${badgeBg} shadow-md transition-all duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 32 32"
          className="w-[62%] h-[62%]"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 24V8H11.5L16 16.5L20.5 8H25V24H21V13.5L16.8 20H15.2L11 13.5V24H7Z" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col justify-center leading-none text-left">
          <span
            className={`font-headings font-extrabold ${titleSizes[size]} ${textColor} transition-colors duration-200`}
          >
            MITUL
          </span>
          <span
            className={`font-sans font-bold ${subSizes[size]} ${subColor} uppercase mt-1`}
          >
            ZALAVADIYA
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
