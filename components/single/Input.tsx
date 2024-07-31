import React, { ChangeEventHandler } from "react";

interface InputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
};

export default Input;