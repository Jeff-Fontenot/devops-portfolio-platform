"use client";

import dynamic from "next/dynamic";
import { certifications } from "./certifications";

const SwiperBadges = dynamic(() => import("./SwiperBadges"), {
  ssr: false,
  loading: () => (
    <div className="h-[375px] w-full max-w-6xl animate-pulse rounded-2xl bg-white/[0.04]" />
  ),
});

export default function Certifications() {
  return (
    <section className="pt-8 pb-14">
      <div className="text-center">
        <div className="flex justify-center">
          <SwiperBadges items={certifications} />
        </div>
      </div>
    </section>
  );
}
