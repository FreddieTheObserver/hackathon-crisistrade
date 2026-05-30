type EmergencySearchInputProps = {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

const EmergencySearchInput = ({ onChange, placeholder, value }: EmergencySearchInputProps) => {
  return (
    <input
      className="h-12 w-full rounded-md border border-slate-200 bg-white px-5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-red-300 focus:ring-2 focus:ring-red-100"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type="search"
      value={value}
    />
  );
};

export default EmergencySearchInput;
