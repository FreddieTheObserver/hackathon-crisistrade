type EmergencySearchInputProps = {
  placeholder: string;
};

const EmergencySearchInput = ({ placeholder }: EmergencySearchInputProps) => {
  return (
    <input
      className="h-12 w-full rounded-md border border-slate-200 bg-white px-5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-red-300 focus:ring-2 focus:ring-red-100"
      placeholder={placeholder}
      type="search"
    />
  );
};

export default EmergencySearchInput;
