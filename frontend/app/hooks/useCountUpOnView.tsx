import { useEffect, useState, RefObject } from "react";

export function useCountUpOnView(
  ref: RefObject<HTMLDivElement | null>,
  end: number,
  duration: number = 500,
  startWhen: boolean = true
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startWhen) return;
    if (!ref.current) return;

    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        let start = 0;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);

        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, end, duration, startWhen]);

  return count;
}
