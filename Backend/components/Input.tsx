import React from "react";

interface InputProps {
  value: string | undefined | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  onKeyDown,
  disabled = false,
}) => {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full text-white text-sm bg-zinc-800 py-2.5 px-4 rounded-xl border border-zinc-600 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500 transition-all duration-150 outline-none placeholder-zinc-400 disabled:opacity-50 ${className}`}
    />
  );
};
