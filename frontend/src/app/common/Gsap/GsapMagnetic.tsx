import gsap from "gsap";
import { useEffect, useRef, type ReactElement, isValidElement, type HTMLAttributes } from "react";

interface GsapMagneticProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement;
}

export default function GsapMagnetic({ children, ...rest }: GsapMagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const xTo = gsap.quickTo(ref.current, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(ref.current, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    const mouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { width, height, top, left } = ref.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x);
      yTo(y);
    };

    const mouseLeave = () => {
      xTo(1);
      yTo(1);
    };

    const el = ref.current;
    el.addEventListener("mousemove", mouseMove);
    el.addEventListener("mouseleave", mouseLeave);

    return () => {
      el.removeEventListener("mousemove", mouseMove);
      el.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  if (!isValidElement(children)) return null;

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
