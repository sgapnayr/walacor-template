import React, { ChangeEventHandler } from "react";

interface InputProps {
  name?: string;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: string;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  className,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    />
  );
};

export default Input;
