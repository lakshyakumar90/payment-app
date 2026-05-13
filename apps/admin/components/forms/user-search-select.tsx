"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { searchUsersAdmin, type AdminUserOption } from "../../lib/api/users-admin-api";
import { getApiErrorMessage } from "../../lib/api/error";

type UserSearchSelectProps = {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

function labelForUser(u: AdminUserOption) {
  if (u.name && u.email) return `${u.name} (${u.email})`;
  if (u.email) return u.email;
  return u.id;
}

export function UserSearchSelect({
  value,
  onChange,
  disabled,
  placeholder = "Select a user…",
}: UserSearchSelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isUserTypingRef = useRef(false);
  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState<AdminUserOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedOption = useMemo(
    () => options.find((o) => o.id === value),
    [options, value],
  );

  // Fetch default list when opening (query empty).
  useEffect(() => {
    if (!isOpen || disabled) return;
    if (query.trim().length >= 2) return;

    void (async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const results = await searchUsersAdmin("", 10);
        setOptions(results);
        setActiveIndex(0);
      } catch (e) {
        setErrorMessage(getApiErrorMessage(e));
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isOpen, disabled, query]);

  // Debounced search.
  useEffect(() => {
    if (disabled) return;
    const q = query.trim();

    if (q.length < 2) {
      setErrorMessage(null);
      return;
    }

    const t = window.setTimeout(() => {
      void (async () => {
        try {
          setIsLoading(true);
          setErrorMessage(null);
          const results = await searchUsersAdmin(q, 10);
          setOptions(results);
          setActiveIndex(0);
        } catch (e) {
          setErrorMessage(getApiErrorMessage(e));
          setOptions([]);
        } finally {
          setIsLoading(false);
        }
      })();
    }, 300);

    return () => window.clearTimeout(t);
  }, [query, disabled]);

  // Close on outside click.
  useEffect(() => {
    function onDocMouseDown(ev: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      if (ev.target instanceof Node && !el.contains(ev.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => {
          if (disabled) return;

          if (e.key === "Escape") {
            setIsOpen(false);
            return;
          }
          if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "Enter") {
              setIsOpen(true);
            }
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, Math.max(0, options.length - 1)));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          }
          if (e.key === "Enter") {
            e.preventDefault();
            const opt = options[activeIndex];
            if (opt) {
              isUserTypingRef.current = false;
              onChange(opt.id);
              setIsOpen(false);
            }
          }
        }}
      >
        <span className={value ? "truncate text-neutral-900" : "truncate text-neutral-500"}>
          {value
            ? selectedOption
              ? labelForUser(selectedOption)
              : value
            : placeholder}
        </span>
        <span className="text-neutral-400">▾</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 p-2">
            <input
              autoFocus
              type="text"
              value={query}
              placeholder="Search users…"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              onChange={(e) => {
                const next = e.target.value;
                setQuery(next);
                // Clear selected id when searching, so submit can't use stale user.
                if (next.trim() !== "") {
                  isUserTypingRef.current = true;
                  onChange("");
                }
              }}
            />
            <p className="mt-1 text-xs text-neutral-500">Type 2+ characters to filter.</p>
          </div>

          {isLoading && (
            <div className="px-3 py-2 text-sm text-neutral-500">Searching…</div>
          )}

          {!isLoading && errorMessage && (
            <div className="px-3 py-2 text-sm text-red-600">{errorMessage}</div>
          )}

          {!isLoading && options.length === 0 && !errorMessage && (
            <div className="px-3 py-2 text-sm text-neutral-500">No users found.</div>
          )}

          {!isLoading && options.length > 0 && (
            <ul role="listbox" aria-label="User search results">
              {options.map((opt, idx) => {
                const active = idx === activeIndex;
                const isSelected = opt.id === value;
                return (
                  <li
                    key={opt.id}
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      "cursor-pointer px-3 py-2 text-sm",
                      active ? "bg-neutral-100" : "hover:bg-neutral-50",
                      isSelected ? "font-medium" : "font-normal",
                    ].join(" ")}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent input blur
                      isUserTypingRef.current = false;
                      onChange(opt.id);
                      setIsOpen(false);
                      setQuery("");
                    }}
                  >
                    <div className="truncate">{labelForUser(opt)}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

