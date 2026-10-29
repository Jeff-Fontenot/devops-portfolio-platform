"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Eases mouse-wheel and trackpad scrolling to a gradual stop instead of an
// abrupt one. Touch keeps the device's own momentum (syncTouch is off by
// default), and Lenis drops smoothing for visitors who prefer reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      // Lower is floatier; 0.1 is Lenis's default glide.
      lerp: 0.1,
      // Horizontal scrollers (the GitHub calendar, code blocks) keep native
      // scrolling when the gesture is theirs to handle.
      allowNestedScroll: true,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
