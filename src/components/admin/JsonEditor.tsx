"use client";

import { Plus, Trash2 } from "lucide-react";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const LONG_TEXT_KEYS = [
  "description",
  "bio",
  "history",
  "message",
  "ieeeContext",
  "mission",
  "vision",
  "aboutSnippet",
  "excerpt",
];

function labelFor(key: string) {
  const spaced = key.replace(/([A-Z])/g, " $1");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function emptyLike(value: JsonValue): JsonValue {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, emptyLike(v)]));
  }
  return "";
}

function withNewId(value: JsonValue): JsonValue {
  if (value && typeof value === "object" && !Array.isArray(value) && "id" in value) {
    return { ...value, id: crypto.randomUUID() };
  }
  return value;
}

export function JsonField({
  value,
  onChange,
  fieldKey,
}: {
  value: JsonValue;
  onChange: (v: JsonValue) => void;
  fieldKey?: string;
}) {
  if (Array.isArray(value)) {
    return (
      <ArrayField value={value} onChange={onChange} fieldKey={fieldKey} />
    );
  }

  if (value && typeof value === "object") {
    return <ObjectField value={value} onChange={onChange} />;
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-white">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-deep accent-ieee-blue"
        />
        {fieldKey ? labelFor(fieldKey) : "Enabled"}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-white/15 bg-deep px-3 py-2 text-white outline-none focus:border-ieee-blue-light"
      />
    );
  }

  const isLong =
    (fieldKey && LONG_TEXT_KEYS.some((k) => fieldKey.toLowerCase().includes(k.toLowerCase()))) ||
    (typeof value === "string" && value.length > 100);

  if (isLong) {
    return (
      <textarea
        value={value ?? ""}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-deep px-3 py-2 text-white outline-none focus:border-ieee-blue-light resize-y"
      />
    );
  }

  return (
    <input
      type="text"
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-white/15 bg-deep px-3 py-2 text-white outline-none focus:border-ieee-blue-light"
    />
  );
}

function ObjectField({
  value,
  onChange,
}: {
  value: { [key: string]: JsonValue };
  onChange: (v: { [key: string]: JsonValue }) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-white/10 p-4">
      {Object.entries(value).map(([key, val]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-body mb-1.5">{labelFor(key)}</label>
          <JsonField
            value={val}
            fieldKey={key}
            onChange={(next) => onChange({ ...value, [key]: next })}
          />
        </div>
      ))}
    </div>
  );
}

function ArrayField({
  value,
  onChange,
  fieldKey,
}: {
  value: JsonValue[];
  onChange: (v: JsonValue[]) => void;
  fieldKey?: string;
}) {
  const isPrimitiveArray = value.every((v) => typeof v === "string" || typeof v === "number");

  if (isPrimitiveArray) {
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={String(item)}
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 rounded-lg border border-white/15 bg-deep px-3 py-2 text-white outline-none focus:border-ieee-blue-light"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
               className="shrink-0 rounded-lg border border-white/10 p-2 text-body hover:text-ieee-red hover:border-ieee-red/40"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="flex items-center gap-1.5 text-sm text-ieee-blue-light hover:text-white transition-colors"
        >
          <Plus size={14} /> Add {fieldKey ? labelFor(fieldKey).replace(/s$/, "") : "item"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {value.map((item, i) => (
        <div key={i} className="relative rounded-xl border border-white/15 bg-surface/40 p-4">
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
             className="absolute top-3 right-3 rounded-lg border border-white/10 p-1.5 text-body hover:text-ieee-red hover:border-ieee-red/40"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
          <JsonField
            value={item}
            onChange={(next) => {
              const nextArr = [...value];
              nextArr[i] = next;
              onChange(nextArr);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const template = value[0] ?? {};
          onChange([...value, withNewId(emptyLike(template))]);
        }}
        disabled={value.length === 0}
        className="flex items-center gap-1.5 text-sm text-ieee-blue-light hover:text-white transition-colors disabled:opacity-40"
      >
        <Plus size={14} /> Add {fieldKey ? labelFor(fieldKey).replace(/s$/, "") : "item"}
      </button>
    </div>
  );
}
