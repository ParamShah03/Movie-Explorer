// src/components/SearchBar.tsx
"use client";

export default function SearchBar({
  value,
  onChange,
  hint
}: {
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="row">
        <input
          className="input"
          placeholder="Search movies by title… (e.g., Inception)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search movies"
        />
      </div>
      {hint ? <div className="muted" style={{ marginTop: 8, fontSize: 12.5 }}>{hint}</div> : null}
    </div>
  );
}
