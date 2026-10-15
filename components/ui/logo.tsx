import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const logoSizes = {
  sm: {
    frame: "h-[30px] w-11",
    imageSize: 70,
    imageLeft: -13,
    imageTop: -16,
    text: "text-[17px]",
    gap: "gap-1.5",
  },
  md: {
    frame: "h-[42px] w-[72px]",
    imageSize: 98,
    imageLeft: -18,
    imageTop: -22,
    text: "text-[22px]",
    gap: "gap-2",
  },
  lg: {
    frame: "h-12 w-[84px]",
    imageSize: 114,
    imageLeft: -21,
    imageTop: -25,
    text: "text-2xl sm:text-3xl",
    gap: "gap-2.5",
  },
} as const;

export default function Logo({
  variant = "dark",
  className = "",
  size = "md",
  href = "/",
}: LogoProps) {
  const isLight = variant === "light";
  const logoSize = logoSizes[size];

  return (
    <Link
      href={href}
      className={`group inline-flex select-none items-center ${logoSize.gap} transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="NovaMart home"
    >
      <span className={`relative block shrink-0 overflow-hidden rounded-md bg-white ${logoSize.frame}`} aria-hidden="true">
        <Image
          src="/images/logo/update-logo.png"
          alt=""
          width={logoSize.imageSize}
          height={logoSize.imageSize}
          sizes="(max-width: 640px) 70px, 114px"
          className="absolute max-w-none"
          style={{
            left: logoSize.imageLeft,
            top: logoSize.imageTop,
          }}
        />
      </span>
      <span className={`${logoSize.text} inline-flex items-baseline font-extrabold leading-none tracking-[-0.055em]`}>
        <span className={isLight ? "text-white" : "text-[#0751b8]"}>Nova</span>
        <span className="text-[#f47721]">Mart</span>
      </span>
    </Link>
  );
}
