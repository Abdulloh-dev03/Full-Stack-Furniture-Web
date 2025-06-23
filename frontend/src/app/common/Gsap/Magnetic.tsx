import React, { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: ReactElement;
}

export default function Magnetic({ children }: MagneticProps) {
  const magneticRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = magneticRef.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, 'x', {
      duration: 1,
      ease: 'elastic.out(0.5, 0.3)',
    });

    const yTo = gsap.quickTo(element, 'y', {
      duration: 1,
      ease: 'elastic.out(0.5, 0.3)',
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = element.getBoundingClientRect();
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);

      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return React.cloneElement(children, {
    ref: magneticRef,
  } as React.HTMLAttributes<HTMLDivElement>);
}
