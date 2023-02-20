import { useId } from "react";

type InputProps = {
  type?: string;
  label?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
};

export const InputFallback: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="w-full animate-pulse">
      {label ? (
        <label className="block animate-none text-sm  font-medium text-gray-700">{label}</label>
      ) : (
        <div className="h-5 w-1/3 rounded bg-slate-200"></div>
      )}
      <div className="mt-1 h-[38px]  rounded-md bg-slate-200"></div>
    </div>
  );
};

export const Input: React.FC<InputProps> = (props) => {
  const { label = props.name, name, type = "text", ...rest } = props;
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={`${label}-${id}`} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          id={`${label}-${id}`}
          type={type}
          name={name}
          className="block w-full p-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...rest}
        />
      </div>
    </div>
  );
};
