import type { ReactNode } from "react";

type EmergencyFormInputProps = {
  error?: string;
  label: ReactNode;
  name: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  required?: boolean;
  value: string;
};

const EmergencyFormInput = ({
  error,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  value,
}: EmergencyFormInputProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-emerald-900">
        {label}
        {required && " *"}
      </span>
      <input
        aria-invalid={Boolean(error)}
        className={`h-12 w-full rounded-md border bg-white px-4 text-sm text-[#1D2A44] outline-none transition placeholder:text-slate-500 focus:border-red-300 focus:ring-2 focus:ring-red-100 ${
          error ? "border-red-300" : "border-slate-300"
        }`}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </label>
  );
};

export default EmergencyFormInput;
