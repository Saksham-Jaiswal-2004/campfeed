import { useEffect, useRef } from "react";

export default function InfiniteScrollTrigger({ onLoadMore }) {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [onLoadMore]);

  return <div ref={ref} className="h-10" />;
}