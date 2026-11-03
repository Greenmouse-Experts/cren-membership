import type { ReactNode } from "react";

interface HeroContentProps {
  title: ReactNode;
  subtitle: ReactNode;
  action?: ReactNode;
}

export default function HeroContent({ title, subtitle, action }: HeroContentProps) {
  return (
    <div className="max-w-[760px] text-white">
      <h1 className="text-balance text-[clamp(2.8rem,5.8vw,5.15rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
        {title}
      </h1>
      <p className="mt-7 max-w-[720px] text-pretty text-[clamp(1rem,1.5vw,1.3rem)] leading-[1.6] text-white/90">
        {subtitle}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
