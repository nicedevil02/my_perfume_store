"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface GenderFilterProps {
  selectedGender?: string;
}

export default function GenderFilter({ selectedGender }: GenderFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const options = ["مردانه", "زنانه", "یونیسکس"];

  const toggle = (gender: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (selectedGender === gender) params.delete("gender");
    else params.set("gender", gender);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium mb-2">جنسیت</h4>
      {options.map((g) => (
        <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="rounded"
            checked={selectedGender === g}
            onChange={() => toggle(g)}
          />
          <span>{g}</span>
        </label>
      ))}
    </div>
  );
}
