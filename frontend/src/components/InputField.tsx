interface InputFieldProps {
  label: string;
  value?: string;
  placeholder: string;
  onChange?: (val: string) => void;
}

const InputField = ({
  label,
  value,
  placeholder,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="flex items-center gap-10 mb-5">
      <p className="text-lg w-[120px]">{label}</p>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 text-lg border py-1 px-2 rounded-lg"
      />
    </div>
  );
};

export default InputField;
