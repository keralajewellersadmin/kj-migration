"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";
import styles from "../../app/(public)/products/products.module.css";

export default function CategoryFilter({
  categories,
}: {
  categories: Array<{ name: string; slug: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    router.push(pathname, { scroll: false });
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    })),
  ];

  const sortOptions = [
    { value: "", label: "Sort By" },
    { value: "asc", label: "Name (A to Z)" },
    { value: "desc", label: "Name (Z to A)" },
  ];

  return (
    <div className={styles.filterWrapper}>
      <CustomSelect
        options={categoryOptions}
        value={currentCategory}
        onChange={(val) => updateParam("category", val)}
      />

      <CustomSelect
        options={sortOptions}
        value={currentSort}
        onChange={(val) => updateParam("sort", val)}
      />

      <button className={styles.resetBtn} onClick={handleReset} type="button">
        Reset
      </button>
    </div>
  );
}
