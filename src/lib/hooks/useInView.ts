// src/lib/hooks/useInView.ts
"use client";
import { useEffect, useState, useRef } from 'react';

type UseInViewOptions = {
  threshold?: number;
  rootMargin?: string;
};

export function useInView(options: UseInViewOptions = {}) {
  const [isIntersecting, setIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return [elementRef, isIntersecting] as const;
}