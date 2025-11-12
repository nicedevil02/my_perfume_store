"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ScentFilterProps {
  selectedScents: string[];
}

export default function ScentFilter({ selectedScents }: ScentFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scents = ["گلی", "چوبی", "مرکباتی", "شرقی", "تند"];

  const toggle = (scent: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    const current = new Set(selectedScents || []);
    if (current.has(scent)) current.delete(scent);
    else current.add(scent);

    if (current.size > 0) params.set("scent", Array.from(current).join(","));
    else params.delete("scent");

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-2 mt-4">
      <h4 className="font-medium mb-2">رایحه</h4>
      {scents.map((s) => (
        <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="rounded"
            checked={(selectedScents || []).includes(s)}
            onChange={() => toggle(s)}
          />
          <span>{s}</span>
        </label>
      ))}
    </div>
  );
}
