import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — animates a number from 0 to `end` once when the ref enters viewport.
 * @param {object} opts
 * @param {number}  opts.end       - Target number
 * @param {number}  [opts.duration=1200] - ms
 * @param {number}  [opts.decimals=0]    - Decimal places in output
 * @param {string}  [opts.suffix=""]     - Appended after number e.g. "+"
 * @returns {{ ref: React.Ref, value: string }}
 */
export function useCountUp({ end, duration = 1200, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(() => formatNum(0, decimals, suffix));
  const started = useRef(false);

  useEffect(() => {
    // Respect reduced-motion preference — show final value immediately
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(formatNum(end, decimals, suffix));
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutQuart(progress);
          setValue(formatNum(eased * end, decimals, suffix));

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration, decimals, suffix]);

  return { ref, value };
}

// ── helpers ────────────────────────────────────────────────────
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function formatNum(n, decimals, suffix) {
  return n.toFixed(decimals) + suffix;
}
