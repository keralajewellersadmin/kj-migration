"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function CustomSelect({
  options,
  value,
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);
  const label = selected ? selected.label : (options[0]?.label ?? "");

  return (
    <div className={styles.customSelect} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.triggerText}>{label}</span>
        <span className={styles.chevron} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.option} ${opt.value === value ? styles.optionActive : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
